
from rest_framework import serializers
from product.serializers import ProductSerializer
from product.models import Product
from accounts.serializers import UserSerializer
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    created_at = serializers.DateTimeField(format="%d/%m/%y %H:%M")
    updated_at = serializers.DateTimeField(format="%d/%m/%y %H:%M")  
    class Meta:
        model = Comment
        fields = ['id','user','product','comment','star','is_deleted',
                  'updated_at','created_at',]



class UserCommentSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    created_at = serializers.DateTimeField(format="%d/%m/%y %H:%M",read_only=True)
    updated_at = serializers.DateTimeField(format="%d/%m/%y %H:%M",read_only=True)                                     
    class Meta:
        model = Comment
        fields = ['id','user','product','comment','star','is_deleted','product_id',
                  'updated_at','created_at',]

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        product_id = validated_data.pop('product_id')
        product = Product.objects.get(id=product_id)
        validated_data['product'] = product
        return super().create(validated_data)