from django.urls import path
from .views import *

urlpatterns = [
    path('fcmToken/', fcmTokenView.as_view()),
    path('message/', NotificationView.as_view())
]
