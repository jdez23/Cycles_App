from .serializers import *
from .models import *
import os

from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.parsers import MultiPartParser, FormParser
from google.cloud import storage
from google.oauth2 import service_account


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
        credentials = service_account.Credentials.from_service_account_file(
            os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        )
        fb_id = request.META.get('HTTP_AUTHORIZATION')
        avi_pic = request.data.get('avi_pic')
        username = request.data.get('username')
        try:
            user = User.objects.get(username=username)
            return Response({'error': 'Username is already taken.'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:

            # Upload avi image to Cloud Storage
            client = storage.Client(credentials=credentials)
            bucket = client.get_bucket('all_imgs')
            blob = bucket.blob(avi_pic)
            blob.upload_from_string(avi_pic)

            # Save user in model database
            user = User.objects.create(
                firebase_id=fb_id, avi_pic=avi_pic, username=username)
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
                print(serializer.data)
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
            # follower = Follow.objects.filter(following_user=following_user).filter(user=user).delete()
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
    # parser_classes = [MultiPartParser, FormParser]
    # serializer_class = SubscriptionSerializer

    def post(self, request):
        email = request.data.get('email')
        print(email)
        save_email = Subscription.objects.create(email=email)
        save_email.save()

        return 'thank you'

    def delete(request):
        email = request.data.get('email')

        Subscription.objects.filter(email=email).delete()

        return Response(status=status.HTTP_200_OK)
