from .serializers import *

from rest_framework import viewsets, authentication, permissions

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from .models import User


class UserViewSet(viewsets.ModelViewSet):
    permission_class = [permissions.IsAuthenticated]
    authentication_class = [authentication.TokenAuthentication]
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user = self.request.user.id
        return User.objects.filter(id=user)


# Follow or Unfollow user
class FollowingView(viewsets.ModelViewSet):
    permission_class = [permissions.IsAuthenticated]
    authentication_class = [authentication.TokenAuthentication]
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer

    def __str__(self):
        return f"{self.request.username} follows {self.following_user_id.username}"


# Get current users followers
class UsersFollowing(APIView):
    authentication_class = [authentication.TokenAuthentication]
    permission_class = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Follow.objects.filter(user_id=user)
