from django.urls import path
from . import views

app_name = 'shortener'
urlpatterns = [
    path('', views.home, name='home'),
    path('create/', views.create_short_url, name='create_short_url'),
    path('check-password/<str:short_url>/', views.check_password, name='check_password'),
    path('<str:short_url>/', views.redirect_to_original, name='redirect_to_original'),
    path('modify/<int:pk>', views.modify_request, name='modify_request'),
]
