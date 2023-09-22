from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse

from .credentials import *
from .serializers import *
from .utils import *
from .models import *
import json
import requests

# Create your views here.

# (Post/Update) & Delete fcmToken
class fcmTokenView(APIView):
    serializer_class = fcmTokenSerializer
    queryset = fcmToken.objects.all()

    def post(self, request):
        try:
            user = self.request.user
            token = request.data.get('token')
            fcm_token = get_update_or_create_fcm_token(user, token)
            serializer = fcmTokenSerializer(fcm_token)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response({'error': 'An unexpected error occurred.'}, status=500)

    def delete(self, request):
        try:
            user = self.request.user
            try:
                token = fcmToken.objects.get(user=user)
                if token:
                    return Response(token.delete(), status=status.HTTP_200_OK)
            except fcmToken.DoesNotExist:
                return Response('no token', status=status.HTTP_200_OK)
        except:
            return Response({'error': 'An unexpected error occurred.'}, status=500)


# Get & Delete notifications
class NotificationView(APIView):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

    def post(self, request):
        try:
            user = self.request.user
            to_user = request.data.get('to_user')
            title = request.data.get('title')
            image = request.FILES.get('image')
            body = request.data.get('body')
            playlist_id = request.data.get('playlist_id')
            type = request.data.get('type')
            comment = request.data.get('comment')
            follow = request.data.get('follow')
            like = request.data.get('like')

            to_user = User.objects.get(id=to_user)

            if user.id != to_user.id:

                if type == 'follow':
                    print(follow)
                    follow = Follow.objects.get(id=follow)
                    notification = Notification(from_user=user, to_user=to_user, title=title,
                                                image='', body=body, type=type, follow=follow)
                    notification.save()

                elif type == 'like':
                    like = Like.objects.get(id=like)
                    notification = Notification(from_user=user, to_user=to_user, title=title,
                                                image=image.name, body=body, playlist_id=playlist_id, type=type, like=like)
                    notification.save()

                elif type == 'comment':
                    comment = Comment.objects.get(id=comment)
                    notification = Notification(from_user=user, to_user=to_user, title=title,
                                                image=image.name, body=body, playlist_id=playlist_id, type=type, comment=comment)

                    notification.save()

                try:
                    deviceToken = fcmToken.objects.get(user=to_user).token
                    url = "https://fcm.googleapis.com/fcm/send"

                    payload = json.dumps({
                        "data": {},
                        "notification": {
                            "title": title,
                            "body": body
                        },
                        "to": deviceToken
                    })
                    headers = {
                        'Authorization': 'key='+FCM_CREDENTIALS,
                        'Content-Type': 'application/json'
                    }

                    if deviceToken:
                        requests.request(
                            "POST", url, headers=headers, data=payload)

                    else:
                        None
                except fcmToken.DoesNotExist:
                    None

                return Response(status=status.HTTP_201_CREATED)
            return Response(status=200)
        except Exception as e:
            return JsonResponse(str(e), safe=False, status=500)

    def get(self, request):
        try:
            user = self.request.user
            notification = Notification.objects.filter(
                to_user=user)
            serializer = NotificationSerializer(notification, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'An unexpected error occurred.'}, status=500)

    def delete(self, request):
        try:
            notification_id = request.GET.get('id')
            notification = Notification.objects.get(id=notification_id)
            return Response(notification.delete(), status=status.HTTP_200_OK)
        except:
            return Response({'error': 'An unexpected error occurred.'}, status=500)
