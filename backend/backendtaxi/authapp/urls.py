from django.urls import path
from .views import (
    CreateUserAPIVIEW, RetrieveUserAPI, CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("", CreateUserAPIVIEW.as_view(), name="user-create"),
    path("<int:pk>/", RetrieveUserAPI.as_view(), name="view-user"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]