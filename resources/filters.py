import django_filters
from django.db.models import Q
from .models import ResourceUpload

class ResourceUploadFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='multi_search', label="Search")

    class Meta:
        model = ResourceUpload
        fields = []

    def multi_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(student_name__icontains=value) |
            Q(unit_name__icontains=value) |
            Q(unit_code__icontains=value)
        )
