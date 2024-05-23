from django.urls import path
from .views import BookRideUser, RetrieveRideAPI, ListBookedRidesAPI

urlpatterns = [
    path('book/', BookRideUser.as_view(), name='book_ride'),
    path('retrieve/<int:pk>/', RetrieveRideAPI.as_view(), name='retrieve_ride'),
    path('list-booking/', ListBookedRidesAPI.as_view(), name='list_booked_rides'),
]