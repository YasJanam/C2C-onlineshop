
from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import *
from product.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = CartItem
        fields = ['id','product','quantity']

    def update(self, instance, validated_data):
        new_quantity = validated_data.pop('quantity')
        #instance.quantity = validated_data.get('quantity',instance.quantity)
        stock = instance.product.stock
        if new_quantity <= stock:
            instance.quantity = new_quantity
        else:
            raise serializers.ValidationError("تعداد محصول انتخابی بیش از تعداد موجود است")
        
        if new_quantity <= 0:
            raise serializers.ValidationError("بیش از نمیتوان تعداد را کاهش داد")
        instance.save()
        return instance



class UserCartItemSerializer(serializers.ModelSerializer):
    #cart = CartSerializer(read_only=True)
    #cart_id = serializers.IntegerField(source='cart.id', write_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True) # source='product.id',
    class Meta:
        model = CartItem
        fields = ['id','product','product_id','quantity'] # ,'cart_id'

    def create(self, validated_data):
        #cart_id = validated_data.pop('cart')['id']
        user = self.context['request'].user
        #product_id = validated_data.pop('product')['id']
        product_id = validated_data.pop('product_id')
        product = Product.objects.get(id=product_id)
        cart = Cart.objects.get(user=user)

        if product.product_owner == user:
            raise serializers.ValidationError("محصول خودتان را نمیتوانید به سبد خرید اضافه کنید")
        
        if product.stock <= 0:
            raise serializers.ValidationError("موجودی محصول صفر است")

        if CartItem.objects.filter(cart=cart,product=product).exists():
            raise serializers.ValidationError("قبلا به سبد خرید اضافه شده")
        
        validated_data['cart'] = cart
        validated_data['product'] = product
        return super().create(validated_data)
    
    
    def update(self, instance, validated_data):
        new_quantity = validated_data.pop('quantity')
        #instance.quantity = validated_data.get('quantity',instance.quantity)
        stock = instance.product.stock - instance.product.buyed_num
        if new_quantity <= stock:
            instance.quantity = new_quantity
        else:
            raise serializers.ValidationError("تعداد محصول انتخابی بیش از تعداد موجود است")
        
        if new_quantity <= 0:
            raise serializers.ValidationError("بیش از نمیتوان تعداد را کاهش داد")
        instance.save()
        return instance




class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only =True)
    items = UserCartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['user','total_price','updated_at','items']




class OrderItemSerializer(serializers.ModelSerializer):
    #order_id = serializers.IntegerField(source='order.id',write_only=True)
    #product_owner = UserSerializer(read_only = True)
    product = ProductSerializer(read_only=True)
    #product_id = serializers.IntegerField(source='product.id',write_only=True)
    class Meta:
        model = OrderItem
        fields = ['id','product','quantity','price',]



class OrderSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    #buyer_id = serializers.IntegerField(source='buyer.id',write_only=True)
    items = OrderItemSerializer(many=True,read_only=True)
    created_at = serializers.DateTimeField(format="%d/%m/%y %H:%M")
    class Meta:
        model = Order
        fields = ['id','buyer','total_price','created_at','items']  #'authority'



