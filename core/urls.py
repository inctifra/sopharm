from django.urls import path, include
from . import views


app_name = "core"

urlpatterns = [
    path(
        "resources/", views.LearningResourcesView.as_view(), name="learning_resources"
    ),
    path(
        "resources/upload/",
        views.LearningResourcesUploadView.as_view(),
        name="learning_resources_upload",
    ),
    path(
        "resources/<int:resource_pk>/<slug:resource_slug>/",
        views.LearningResourceDetailView.as_view(),
        name="resource_detail_view",
    ),
    path("resources/partials/", include("core.partials.urls", namespace="partials")),
]
