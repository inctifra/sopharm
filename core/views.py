from django.http import HttpRequest
from django.views.generic import TemplateView, View, DetailView
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.clickjacking import xframe_options_exempt

from http import HTTPStatus
from resources.forms import ResourceUploadFileForm, ResourceUploadForm
from resources.models import ResourceUpload


class LearningResourcesView(TemplateView):
    template_name = "pages/learning/resources.html"
    resource_form = ResourceUploadForm
    model = ResourceUpload

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["resource_form"] = self.resource_form()
        context["resources"] = self.model.objects.all()[:3]
        return context


@method_decorator(csrf_exempt, name="dispatch")
class LearningResourcesUploadView(View):
    resource_form = ResourceUploadForm
    upload_form = ResourceUploadFileForm

    def post(self, request: HttpRequest, *args, **kwargs):
        # Save the main ResourceUpload instance
        res_form = self.resource_form(request.POST)
        if not res_form.is_valid():
            return JsonResponse(
                {"status": "error", "errors": res_form.errors},
                status=HTTPStatus.BAD_REQUEST,
            )
        instance = res_form.save()

        # Process all uploaded files (Dropzone or any multiple file input)
        files = [f for key, f in request.FILES.items() if key.startswith("file")]
        for f in files:
            upload_form = self.upload_form(files={"file": f}, resource=instance)
            if not upload_form.is_valid():
                return JsonResponse(
                    {"status": "error", "errors": upload_form.errors},
                    status=HTTPStatus.BAD_REQUEST,
                )
            upload_form.save()

        return JsonResponse(
            {"status": "success", "detail": "Resource uploaded successfully"},
            status=200,
        )


@method_decorator(xframe_options_exempt, name="dispatch")
class LearningResourceDetailView(DetailView):
    slug_url_kwarg = "resource_slug"
    pk_url_kwarg = "resource_pk"
    model = ResourceUpload
    template_name = "pages/learning/resource.html"
    context_object_name = "resource"
    