# from django.conf.urls import include, url
from django.urls import include, path


from .views import *

from rest_framework.routers import DefaultRouter

from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny

router = DefaultRouter()
router.register('user', UserViewSet, basename='user_view')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', authentication_classes([])
         (permission_classes([AllowAny])(CreateUser)).as_view(), name='register'),
    path('login/', authentication_classes([])
         (permission_classes([AllowAny])(Login)).as_view(), name='login'),
    path('following/', FollowingView.as_view()),
    path('user-following/', UsersFollowing.as_view()),
    path('user-followers/', UsersFollowers.as_view()),
    path('subscription/', authentication_classes([])
         (permission_classes([AllowAny])(SubscriptionView)).as_view(), name='subscription')
]
