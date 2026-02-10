
from rest_framework.views import APIView
from .services import product_service
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ProductCategorySerializer, ProductSerializer
from .models import ProductCategory , Product
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.filters import SearchFilter
from django.db.models import Q
from django.shortcuts import get_object_or_404


class AddProductCategoriesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self,request):
        category_ids = request.data.get('category_ids',[])
        product_id =  request.data.get('product_id')  
        categories = product_service.create_product_categories(product_id=product_id,
                                                                categoryId_list=category_ids)
        serializer = ProductCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
    def put(self,request):
        category_ids = request.data.get('category_ids',[])
        product_id =  request.data.get('product_id')  
        categories = product_service.update_product_categories(product_id=product_id,
                                                                categoryId_list=category_ids)
        serializer = ProductCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)    



# used by admin 
class UserProductsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]   

    def get(self,request,user_id):
        products = Product.objects.filter(product_owner__id=user_id)
        q = self.request.query_params.get('search')

        if q:
            q = q.replace('ي','ی').replace('ك','ک').replace('\u200c','').strip()
            products = products.filter(name__icontains=q) 
              
        serializer = ProductSerializer(products,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK) 



class CategoryProductsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self,request,cat_id):
        category_products = ProductCategory.objects.filter(
            category__id = cat_id 
        )

        products_list = []
        for category_product in category_products:
            products_list.append(category_product.product)
        products = list(set(products_list))

        serializer = ProductSerializer(products,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
 
    