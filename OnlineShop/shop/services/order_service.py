
from shop.models import CartItem, Order, OrderItem
from django.db import transaction
from product.models import Product

def create_order_from_cart(user):
    cart_items = CartItem.objects.filter(cart__user=user)

    if not cart_items.exists():
        raise ValueError("cart is empty")
    
    with transaction.atomic():
        order = Order.objects.create(buyer=user)
        order_items = []

        for item in cart_items:

            order_items.append(
                OrderItem(
                    order = order,
                    quantity = item.quantity,
                    price = item.product.price,
                    product = item.product,
                )
            )

        OrderItem.objects.bulk_create(order_items)
        order.update_total_price()
        reduce_products_Stock(cartitems=cart_items)
        cart_items.delete()
        
    return order


def reduce_products_Stock(cartitems):
    newproducts = []
    for item in cartitems:
        product = item.product
        product.buyed_num += item.quantity
        newproducts.append(
            product
        )
    Product.objects.bulk_update(newproducts)