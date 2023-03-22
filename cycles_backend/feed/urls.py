from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('playlist', PlaylistViewSet, basename='playlist_view')

urlpatterns = [
    path('', include(router.urls)),
    path('my-playlists/', MyPlaylists.as_view()),
    path('user-playlists/', UserPlaylists.as_view()),
    path('playlist-details/', PlaylistDetails.as_view()),
    path('following-playlists/', FollowingPlaylists.as_view()),
    path('like-playlist/', LikesViewSet.as_view()),
    path('comments-playlist/', CommentView.as_view()),
    path('search/', SearchView.as_view(), name='search'),
]
