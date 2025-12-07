import zipfile
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from io import BytesIO
from django.http import HttpRequest
from django.shortcuts import render

from resources.filters import ResourceUploadFilter
from resources.models import ResourceUpload


def search_resource_view(request: HttpRequest):
    queryset = ResourceUpload.objects.all()
    resource_filter = ResourceUploadFilter(request.GET, queryset=queryset)
    return render(
        request,
        "partials/search/resources.html",
        {
            "filter": resource_filter,
            "results": resource_filter.qs,
        },
    )


def download_resources_files(request, resource_pk, resource_slug):
    resource = get_object_or_404(ResourceUpload, pk=resource_pk, slug=resource_slug)
    files = resource.resource.all()
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w") as zip_file:
        for f in files:
            file_content = f.file.read()
            file_name = f.file.name.split("/")[-1]
            zip_file.writestr(file_name, file_content)
    response = HttpResponse(zip_buffer.getvalue(), content_type="application/zip")
    response["Content-Disposition"] = f'attachment; filename="{resource.title}.zip"'
    return response
