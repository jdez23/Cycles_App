from django.conf.urls import include, url
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('playlist', PlaylistViewSet)

urlpatterns = [
    url('', include(router.urls)),
    url('user-playlists/', MyPlaylists.as_view()),
    # url('following-playlists/', FollowingPlaylists.as_view()),
]
