
from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include
from .apis import *

router = DefaultRouter()

router.register(r'carts', CartViewSet, basename='carts')
router.register(r'cartitems-user',UserCartItemViewSet,basename='cartitems-user')
router.register(r'cartitems-admin',CartItemViewSet, basename='cartitems-admin')

router.register(r'orders',OrderViewSet,basename='orders')
router.register(r'orders-user',UserOrderViewSet,basename='orders-user')



urlpatterns = [
    
    path('',include(router.urls)),

    #path('payment/start/<int:order_id>',StartPaymentAPIView.as_view()),
    #path('payment/verify/',VerifyPaymentAPIView.as_view()),

    path('cart/<int:user_id>/',UserCartAPIView.as_view()),
    path('cartitems/<int:user_id>/',UserCartItemsAPIView.as_view()),

    path('orders-admin/<int:user_id>/',UserOrderAPIView.as_view()),
    path('user-orderitems/<int:product_id>/',OrderItemsByProductIdAPIView.as_view()),
    #path('orderitems/<int:order_id>/',OrderItemsByOrderId.as_view()),

]

#urlpatterns = router.urls