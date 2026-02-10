
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .apis import *

router = DefaultRouter()

router.register(r'products', ProductViewSet, basename='products')
router.register(r'user-products', UserProductViewSet, basename='user-products')
router.register(r'category', CatergoryViewSet, basename='category')
router.register(r'product-category',ProductCategoryViewSet,basename='product-category')

urlpatterns = [
    
    path('',include(router.urls)),

    path('products-categories/add/',AddProductCategoriesAPIView.as_view()), # ,name='add-categories'
    path('user/products/<int:user_id>/',UserProductsAPIView.as_view()),
    #path('user/products/<int:user_id>/<int:product_id>/',DeleteUserProductAPIView.as_view()),
    path('category/products/<int:cat_id>/',CategoryProductsAPIView.as_view()),

]
