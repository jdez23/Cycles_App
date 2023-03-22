from django.urls import re_path
from .consumers import NotificationConsumer

# application = ProtocolTypeRouter({
#     "websocket": URLRouter([
#         path(r"ws/notification/$", NotificationConsumer.as_asgi()),
#     ]),
# })


websocket_urlpatterns = [
    re_path(r"ws/notif-socket/", NotificationConsumer.as_asgi())
]
