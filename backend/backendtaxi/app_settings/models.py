from django.db import models

class SiteSettings(models.Model):
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    price_minute = models.DecimalField(max_digits=10, decimal_places=2)
    price_km = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"SiteSettings(base_price={self.base_price}, price_minute={self.price_minute}, price_km={self.price_km})"