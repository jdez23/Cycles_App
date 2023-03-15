from django.urls import path
from django.conf.urls import url, include

from .views import *

from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register('user', UserViewSet, basename='user_view')
router.register('following', FollowingView)

urlpatterns = [
    url('', include(router.urls)),
    path('login/', obtain_auth_token, name='login'),
    path('user-following/', UsersFollowing.as_view())
]
