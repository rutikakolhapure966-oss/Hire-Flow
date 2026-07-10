from django.urls import path, include
from rest_framework.routers import DefaultRouter
from applications.views import ApplicationViewSet, SavedJobViewSet

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'saved-jobs', SavedJobViewSet, basename='saved_job')

urlpatterns = [
    path('', include(router.urls)),
]
