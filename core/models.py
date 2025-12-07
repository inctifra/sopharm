from django.db import models

from django.utils.text import slugify
import uuid

class Announcement(models.Model):
    ANNOUNCEMENT_TYPE_CHOICES = [
        ('event', 'Event'),
        ('notice', 'Notice'),
        ('update', 'Update'),
        ('alert', 'Alert'),
    ]

    # Basic info
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    announcement_type = models.CharField(
        max_length=20, choices=ANNOUNCEMENT_TYPE_CHOICES, default='notice'
    )
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    # Optional images or media
    image = models.ImageField(upload_to='announcements/images/', blank=True, null=True)
    attachment = models.FileField(upload_to='announcements/files/', blank=True, null=True)

    # Event-specific fields
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    registration_link = models.URLField(blank=True, null=True)

    # Audience / Visibility
    is_public = models.BooleanField(default=True)  # Visible to all users
    target_roles = models.JSONField(
        blank=True, null=True,
        help_text="Optional list of roles this announcement is visible to (student, teacher, admin)"
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)  # For sliders / featured section

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)[:50]
            self.slug = f"{base_slug}-{uuid.uuid4().hex[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.announcement_type})"

