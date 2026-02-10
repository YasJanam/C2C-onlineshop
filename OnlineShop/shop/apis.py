
#import requests
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from.services.order_service import create_order_from_cart
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

class UserCartAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request,user_id):
        cart = Cart.objects.get(user__id=user_id)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    

class UserCartItemsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request,user_id):
        cart = Cart.objects.get(user__id=user_id)
        items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(items,many=True)
        return Response(serializer.data)


class UserOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request,user_id):
        orders = Order.objects.filter(buyer__id=user_id).order_by('created_at')
        serializer = OrderSerializer(orders,many=True)
        return Response(serializer.data)


class OrderItemsByProductIdAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self,requst,product_id):
        product = Product.objects.get(id=product_id)
        user = self.request.user 
       
        user_orders = Order.objects.filter(buyer=user)
        orderitems = OrderItem.objects.filter(
            order__in = user_orders ,
            product = product
        ) 
        #data = OrderItemSerializer(orderitems,many=True) 

        if not orderitems.exists():
            return Response({'error':'ایتم مورد نظر یافت نشد'},status=status.HTTP_404_NOT_FOUND)
        data = OrderItemSerializer(orderitems,many=True) 
        return Response(data.data)

        
"""
class OrderItemsByOrderId(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self,request,order_id):
        #order = Order.objects.get(id=order_id)
        orderitems = OrderItem.objects.filter(order__id=order_id)

        if not orderitems.exists():
            return Response({'error':'ایتم مورد نظر یافت نشد'},status=status.HTTP_404_NOT_FOUND)
        data = OrderItemSerializer(orderitems,many=True) 
        return Response(data.data)
"""
  

    
    


     


# از فرانت صدا زده میشه
"""
وقتی کاربر روی دکمه خرید میزنه باید از این اندپوینت استفاده بشه
"""
"""
class StartPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self,requset):
        user = requset.user
        #order_id = requset.data.get('order_id')
        #order = Order.objects.get(id=order_id)
        order = create_order_from_cart(user)

        data ={
            "merchant_id":settings.ZARINPAL_MERCHANT_ID ,
            "amount": order.total_price,
            "callback_url": "https://localhost:8000/payment/verify",
            "description": f"پرداخت",
        }

        response = requests.post(
            "https://api.zarinpal.com/pg/v4/payment/request.json",
            json=data
        ).json()

        if response["data"]["code"] == 100:
            authority = response["data"]["authority"]
            order.authority = authority
            order.save()

            return redirect(f"https://api.zarinpal.com/pg/StartPay/{authority}")
        
        return "خطا در اتصال به درگاه"
    
# توسط زرین پال استفاده میشه
class VerifyPaymentAPIView(APIView):
    def get(self,request):
        authority = request.GET.get("Authority")
        status = request.GET.get("Status")

        order = Order.objects.get(authority=authority)
        if status == 'OK':
            data = {
                "merchant_id":settings.ZARINPAL_MERCHANT_ID,
                "amount":order.total_price,
                "authority": authority
            }

            response = requests.post(
                "https://api.zarinpal.com/pg/v4/payment/verify.json",
                json=data
            ).json()

            if response["data"]["code"] == 100:
                order.save()
                return "پرداخت موفق"
            
            return "پرداخت ناموفق"
"""



