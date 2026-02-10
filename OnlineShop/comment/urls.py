

from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include
from .apis import *

router = DefaultRouter()


router.register(r'comments',CommentViewSet,basename='comments')
router.register(r'user-comments',UserCommentViewSet,basename='user-comments')

urlpatterns = [
    path('',include(router.urls)),

    path('product-comments/<int:product_id>/',ProductCommentsAPIView.as_view())
]