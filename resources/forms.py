from django import forms
from .models import ResourceUpload, UPLOAD_TYPE_CHOICES, ACADEMIC_LEVEL_CHOICES, ResourceUploadFile


class ResourceUploadForm(forms.ModelForm):
    class Meta:
        model = ResourceUpload
        fields = [
            "title",
            "student_name",
            "academic_level",
            "semester",
            "unit_name",
            "unit_code",
            "upload_type",
        ]
        help_texts = {
            "title": "The title of the assignment you are uploading",
            "student_name": "This is the name of the uploader",
            "academic_level": "The level of the uploaded resource (1st, 2nd etc)",
            "semester": "The resource semester (when it was taught)",
            "unit_name": "Name of the unit under which the resource belongs",
            "unit_code": "The unit code under which the resource belongs",
            "upload_type": "The type of the resource you are uploading"
        }


class ResourceUploadFileForm(forms.ModelForm):
    class Meta:
        model = ResourceUploadFile
        fields = ['file']

    def __init__(self, *args, **kwargs):
        self.parent_resource = kwargs.pop('resource', None)
        super().__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super().save(commit=False)
        if self.parent_resource:
            instance.resource = self.parent_resource
        if commit:
            instance.save()
        return instance