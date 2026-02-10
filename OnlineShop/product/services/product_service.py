
from product.models import Product, ProductCategory, Category
from django.db import transaction


def create_product_categories(product_id,categoryId_list):
    category_list = []
    for id in categoryId_list:
        cat = Category.objects.get(id=id)
        category_list.append(cat)

    #products = Product.objects.get(product_owner=user)
    product = Product.objects.get(id=product_id)

    with transaction.atomic():
        product_categories = []
        for item in category_list:
            product_categories.append(
                ProductCategory(
                    product=product,
                    category=item
                )
            )
        ProductCategory.objects.bulk_create(product_categories)

    return product_categories




def update_product_categories(product_id,categoryId_list):
    category_list = []
    for id in categoryId_list:
        cat = Category.objects.get(id=id)
        category_list.append(cat)

    #products = Product.objects.get(product_owner=user)
    product = Product.objects.get(id=product_id)

    pre_product_categories = ProductCategory.objects.filter(product=product)
    pre_product_categories.delete()


    with transaction.atomic():
        product_categories = []
        for item in category_list:
            product_categories.append(
                ProductCategory(
                    product=product,
                    category=item
                )
            )
        ProductCategory.objects.bulk_create(product_categories)

    return product_categories