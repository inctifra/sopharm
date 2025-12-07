from django.urls import path
from .views import search_resource_view, download_resources_files

app_name = "partials"


urlpatterns = [
    path("search/", search_resource_view, name="search_resources"),
    path(
        "<int:resource_pk>/<slug:resource_slug>/download/",
        download_resources_files,
        name="download_resource_files",
    ),
]
