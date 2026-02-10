
from rest_framework import serializers
from .models import *
from accounts.serializers import UserSerializer
from .services import product_service


class SimpleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=['id','name']



class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    parent = SimpleCategorySerializer(read_only=True)
    parent_id = serializers.IntegerField(write_only=True)
    #parent = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id','parent','parent_id','name','children']

    def get_children(self,obj):
        serializer = CategorySerializer(obj.children.all(),many=True)
        return serializer.data
    
    def create(self, validated_data):
        parent_id = validated_data.pop('parent_id')
        parent = Category.objects.get(id=parent_id)
        validated_data['parent'] = parent
        return super().create(validated_data)
    """
    def get_parent(self,obj):
        serializer = CategorySerializer(obj.parent)
        return serializer.data       
    """
    


class ProductCategorySerializer(serializers.ModelSerializer):
    #category_id = serializers.IntegerField(source=Category.id, write_only=True)
    category = CategorySerializer(read_only=True)
    #product_id = serializers.IntegerField(source=Product.id, write_only=True)

    class Meta:
          model = ProductCategory
          fields = ['id','category', #'category_id','product_id',
                    ]  
    """
    def create(self, validated_data):
        validated_data['category'] = Category.objects.get(id=validated_data.pop('category_id'))
        validated_data['product'] = Product.objects.get(id=validated_data.pop('product_id'))
        return super().create(validated_data)
    """



class ProductImageSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True
    )

    class Meta:
        model = ProductImage
        fields = ['product', 'image']





class ProductSerializer(serializers.ModelSerializer):
    product_owner = UserSerializer(read_only=True)
    #images = ProductImageSerializer(many=True,read_only=True)
    categories = ProductCategorySerializer(many=True,read_only=True)
    #created_at = serializers.DateTimeField(format="%d/%m/%y %H:%M")
    #updated_at = serializers.DateTimeField(format="%d/%m/%y %H:%M")
    class Meta:
        model = Product
        fields = ['id','product_owner','name', #'images',
                  'description','price','stock','is_active','created_at',
                  'updated_at', 'categories',
                  'buyed_num',
                  ]
        

class UserProductSerializer(serializers.ModelSerializer):
    product_owner = UserSerializer(read_only=True)
    #images = ProductImageSerializer(many=True,read_only=True)
    categories = ProductCategorySerializer(many=True,read_only=True)
    class Meta:
        model = Product
        fields = ['id','product_owner','name', #'images',
                  'description','price','stock','is_active','created_at',
                  'updated_at', 'categories',
                  'buyed_num',
                  ]
        
    def create(self, validated_data):
        validated_data['product_owner'] = self.context['request'].user
        return super().create(validated_data)

 




