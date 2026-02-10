
from rest_framework.viewsets import ModelViewSet
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action 
from rest_framework.response import Response
from .services import product_service
from rest_framework import status
#from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from shop.models import CartItem
from django.db import transaction


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
 
    def get_queryset(self):
        qs =  Product.objects.select_related(
            'product_owner'
        ).prefetch_related(
            'images',
            'categories'
        ) 
        q = self.request.query_params.get('search')
        if q:
            # normalize 
            q = q.replace('ي','ی').replace('ك','ک').replace('\u200c','').strip()
            qs = qs.filter(name__icontains=q)       
        return qs

    http_method_names = ['get','delete']



class UserProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = UserProductSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        qs = ( 
        Product.objects.filter(product_owner = user)
        .select_related('product_owner')
        .prefetch_related('categories')  #'images',
        )
        q = self.request.query_params.get('search')
        if q:
            # normalize 
            q = q.replace('ي','ی').replace('ك','ک').replace('\u200c','').strip()
            qs = qs.filter(name__icontains=q)       
        return qs


    @action(detail=True,methods=['delete'],url_path='delete')
    def delete_product(self,request,pk=None):
        try:

            with transaction.atomic():
                product_ = self.get_object()  #Product.objects.get(id=pk)
                product_.is_active = False
                product_.save()
                cartitems = CartItem.objects.filter(product__id=product_.id)
                if cartitems.exists():
                    cartitems.delete()
                serializer = ProductSerializer(product_)
                return Response(serializer.data,status=status.HTTP_200_OK) 
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    """
    @action(detail=True,methods=['post'],url_path='addphoto')
    def add_image(self,request,pk=None):
        product_ = self.get_object()
        serializer = ProductImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product_)
            return Response(serializer.data)
        return Response(serializer.errors,status=400)
    """



class CatergoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends=[SearchFilter]
    filterset_fields = ['name']

    def get_queryset(self):
        qs = Category.objects.all()
        q = self.request.query_params.get('search')
        if q:
            # normalize 
            q = q.replace('ي','ی').replace('ك','ک').replace('\u200c','').strip()
            qs = qs.filter(name__icontains=q)
        return qs



class ProductCategoryViewSet(ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    
    """
    @action(detail=False,methods=['post'],url_path='create-categories') # url_path=f'{product_id}/categories'
    def create_product_categories(self,request):
        #data = request.data
        category_ids = request.data.get('category_ids')#data['category_ids']
        product_id =  request.data.get('product_id')  #data['product_id']
        categories = product_service.create_product_categories(product_id=product_id,
                                                               categoryId_list=category_ids)
        return Response({'categories':categories}, status=status.HTTP_200_OK)
    """

