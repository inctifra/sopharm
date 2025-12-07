from django.db import models
from django.urls import reverse
from django.utils.text import slugify

import uuid


UPLOAD_TYPE_CHOICES = [
    ('report', 'Report'),
    ('assignment', 'Assignment'),
    ('exam', 'Exam'),
    ('cart', 'Cart'),
]

ACADEMIC_LEVEL_CHOICES = [
    ('1st', '1st Year'),
    ('2nd', '2nd Year'),
    ('3rd', '3rd Year'),
    ('4th', '4th Year'),
    ('5th', '5th Year'),
]

class ResourceUpload(models.Model):
    title = models.CharField(max_length=100)
    student_name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=255, unique=True)
    academic_level = models.CharField(max_length=10, choices=ACADEMIC_LEVEL_CHOICES)
    semester = models.IntegerField(choices=((1, "One"),(2, "Two"),(3, "Three")), default=1)
    unit_name = models.CharField(max_length=100)
    unit_code = models.CharField(max_length=50)
    upload_type = models.CharField(max_length=20, choices=UPLOAD_TYPE_CHOICES)
    upload_time = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-upload_time"]
    def __str__(self):
        return f"{self.title} - ({self.student_name})"
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title} {self.unit_name}")[:50]
            unique_id = uuid.uuid4().hex[:8]
            self.slug = f"{base_slug}-{unique_id}"
        super().save(*args, **kwargs)
    def get_absolute_url(self):
        return reverse("core:resource_detail_view", kwargs={"resource_pk": self.pk, "resource_slug": self.slug})
    
    def get_files(self):
        return ResourceUploadFile.objects.filter(resource=self)


class ResourceUploadFile(models.Model):
    resource = models.ForeignKey(ResourceUpload, on_delete=models.CASCADE, related_name="resource")
    file = models.FileField(upload_to='resources/%Y/%m/%d/')
    def __str__(self):
        return f"{self.resource.title} - {self.file.name}"
    def delete(self, *args, **kwargs):
        self.file.delete()
        return super().delete(*args, **kwargs)
    
    