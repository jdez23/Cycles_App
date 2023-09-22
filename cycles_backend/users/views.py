from .serializers import *
from .models import *

from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.serializer_class(data=request.data,
                                               context={'request': request})
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
            })
        except:
            return Response({'error': 'An unexpected error occurred.'}, status=500)


class CreateUser(APIView):
    queryset = User.objects.all()

    def post(self, request):
        fb_id = request.data.get('token')
        avi_pic = request.FILES.get('avi_pic')
        username = request.data.get('username')
        credentials = service_account.Credentials.from_service_account_file(
            settings.GCS_CREDENTIALS
        )
        try:
            # Check if username already exists in the user database
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username is already taken.'}, status=status.HTTP_400_BAD_REQUEST)

            allowed_characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-.'

            if any(char not in allowed_characters for char in username):
                return Response({'error': 'Invalid characters in username.'}, status=status.HTTP_400_BAD_REQUEST)

            # Get the image URL from Google Cloud Storage
            client = storage.Client(credentials=credentials)
            bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
            blob = bucket.blob(f"media/avi_images/{avi_pic.name}")
            blob.upload_from_file(avi_pic)

            # Create and save the new user
            user = User.objects.create(
                firebase_id=fb_id, avi_pic=avi_pic.name, username=username)
            user.save()

            serializer = UserRegisterSerializer(user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except:
            return Response({'error': 'An unexpected error occurred.'}, status=500)


class Login(APIView):
    queryset = User.objects.all()

    def get(self, request):
        fb_id = self.request.GET.get('token')
        try:
            user = User.objects.get(firebase_id=fb_id)
            if user:
                serializer = UserLoginSerializer(user)
                return Response({'data': serializer.data})
            else:
                return Response(status=404)
        except User.DoesNotExist:
            return Response({'data': 'None'})
        except:
            return Response(status=500)


class UserViewSet(viewsets.ModelViewSet):
    permission_class = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def update(self, request, *args, **kwargs):
        # Get data
        user = self.request.user.id
        old_avi_pic = User.objects.get(id=user).avi_pic
        old_header_pic = User.objects.get(id=user).header_pic
        header_pic = request.FILES.get('header_pic')
        avi_pic = request.FILES.get('avi_pic')
        name = request.data.get('name')
        username = request.data.get('username')
        location = request.data.get('location')
        bio = request.data.get('bio')
        spotify_url = request.data.get('spotify_url')
        credentials = service_account.Credentials.from_service_account_file(
            os.environ.get('GCS_CREDENTIALS')
        )
        try:
            # Get and delete old avi and header images from Google Cloud Storage
            client = storage.Client(credentials=credentials)
            bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))

            try:
                old_avi_blob = bucket.blob(
                    f"media/avi_images/{old_avi_pic}")
                if old_avi_blob:
                    old_avi_blob.delete()
            except:
                None

            try:
                old_header_blob = bucket.blob(
                    f"media/header_images/{old_header_pic}")
                if old_header_blob:
                    old_header_blob.delete()
            except:
                None

            # Add images to bucket
            if avi_pic:
                avi_blob = bucket.blob(f"media/avi_images/{avi_pic.name}")
                avi_blob.upload_from_file(avi_pic)

            if header_pic:
                header_blob = bucket.blob(
                    f"media/header_images/{header_pic.name}")
                header_blob.upload_from_file(header_pic)

            # Update user model
            _user = User.objects.get(id=user)

            _user.avi_pic = avi_pic
            _user.header_pic = header_pic
            _user.name = name
            _user.username = username
            _user.location = location
            _user.bio = bio
            _user.spotify_url = spotify_url

            _user.save(update_fields=['avi_pic',
                                      'header_pic', 'name', 'username', 'location', 'bio', 'spotify_url'])

            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request):
        user = self.request.user
        avi_pic = User.objects.get(id=user).avi_pic
        header_pic = User.objects.get(id=user).header_pic
        credentials = service_account.Credentials.from_service_account_file(
            os.environ.get('GCS_CREDENTIALS')
        )
        try:
            # Get the image URL from Google Cloud Storage
            client = storage.Client(credentials=credentials)
            bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))

            avi_blob = bucket.blob(f"media/avi_images/{avi_pic}")
            avi_blob.delete()

            header_blob = bucket.blob(f"media/header_images/{header_pic}")
            header_blob.delete()

            User.objects.get(id=user).delete()

            return Response(status=status.HTTP_200_OK)

        except:
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Follow or Unfollow user
class FollowingView(APIView):
    permission_class = [permissions.IsAuthenticated]
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer

    def post(self, request):
        user = request.data.get('user')
        following_user = request.data.get('following_user')
        user = User.objects.get(id=user)
        following_user = User.objects.get(id=following_user)

        try:
            follow = Follow.objects.create(
                user=user, following_user=following_user)
            follow.save()

            serializer = FollowSerializer(follow)

            def __str__(self):
                return f"{self.request.username} follows {self.following_user_id.username}"

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.GET.get('user')
        following_user = request.GET.get('following_user')
        try:
            followers = Follow.objects.filter(following_user=following_user)
            user = followers.get(user=user).delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Get the users following
class UsersFollowing(generics.ListAPIView):
    permission_class = [permissions.IsAuthenticated]
    serializer_class = FollowingSerializer

    def get_queryset(self):
        try:
            user = self.request.GET.get('user_id')
            obj = Follow.objects.filter(user=user)
            if obj:
                return obj
            return []
        except:
            return Response({'error': 'An unexpected error occurred.'}, status=500)


# Get the users followers
class UsersFollowers(generics.ListAPIView):
    permission_class = [permissions.IsAuthenticated]
    serializer_class = FollowerSerializer

    def get_queryset(self):
        try:
            user = self.request.GET.get('user_id')
            obj = Follow.objects.filter(following_user=user)
            if obj:
                return obj
            return []
        except:
            return Response({'error': 'An unexpected error occurred.'}, status=500)


# POST & DELETE Subscription
class SubscriptionView(APIView):
    queryset = Subscription.objects.all()

    def post(self, request):
        email = request.data.get('email')
        print(email)
        save_email = Subscription.objects.create(email=email)
        save_email.save()

        if request.method == 'OPTIONS':
            response = JsonResponse({'message': 'Preflight request received'})
        else:
            response = JsonResponse({'message': 'Thank you!'})

        response['Access-Control-Allow-Methods'] = 'POST'
        response['Access-Control-Allow-Headers'] = 'Content-Type'

        return Response(response)

    def delete(request):
        email = request.data.get('email')

        Subscription.objects.filter(email=email).delete()

        return Response(status=status.HTTP_200_OK)
        