from django.apps import AppConfig


class ShopConfig(AppConfig):
    default_auto_feild = 'django.db.models.BigAutoField'
    name = 'shop'

    def ready(self):
        import shop.signals
