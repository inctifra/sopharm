from django.contrib import admin
from .models import ResourceUpload, ResourceUploadFile

class ResourceUploadFileInline(admin.TabularInline):
    model = ResourceUploadFile
    extra = 1
    readonly_fields = ('file_preview',)

    def file_preview(self, obj):
        if obj.file:
            return f"<a href='{obj.file.url}' target='_blank'>{obj.file.name}</a>"
        return "-"
    file_preview.allow_tags = True
    file_preview.short_description = "File Preview"

@admin.register(ResourceUpload)
class ResourceUploadAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'student_name',
        'academic_level',
        'semester',
        'unit_name',
        'unit_code',
        'upload_type',
        'upload_time',
    )
    list_filter = ('academic_level', 'semester', 'upload_type', 'upload_time')
    search_fields = ('title', 'student_name', 'unit_name', 'unit_code')
    prepopulated_fields = {"slug": ("title", "unit_name")}
    readonly_fields = ('upload_time',)
    ordering = ('-upload_time',)
    inlines = [ResourceUploadFileInline]

    fieldsets = (
        (None, {
            'fields': ('title', 'student_name', 'slug', 'academic_level', 'semester', 'upload_type')
        }),
        ('Unit Info', {
            'fields': ('unit_name', 'unit_code')
        }),
        ('Timestamps', {
            'fields': ('upload_time',)
        }),
    )


@admin.register(ResourceUploadFile)
class ResourceUploadFileAdmin(admin.ModelAdmin):
    list_display = ('resource', 'file', 'file_size')
    search_fields = ('resource__title', 'file')
    readonly_fields = ('file_size',)

    def file_size(self, obj):
        if obj.file:
            return f"{obj.file.size / 1024:.2f} KB"
        return "-"
    file_size.short_description = "Size"
