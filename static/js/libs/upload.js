import Dropzone from "dropzone";
import { showToast } from "./toast";
import { Modal } from "bootstrap";

export class RobustStudentUploader {
  /**
   * RobustStudentUploader
   * ---------------------
   * A reusable Dropzone-based uploader for students to upload notes, assignments, reports, or exams,
   * including metadata such as student name, academic level, unit name, unit code, upload type, and timestamp.
   *
   * @class
   *
   * @param {string} selector - CSS selector for the Dropzone form element (e.g., "#studentUploadDropzone")
   * @param {string} uploadUrl - Backend URL to handle file uploads (e.g., "/upload/")
   * @param {Array<string>} metadataFields - Array of input/select element IDs whose values should be sent with the upload
   * @param {object} options - Optional Dropzone configuration overrides
   *
   * @example
   * // Initialize uploader when the document is ready
   * $(document).ready(function() {
   *   const uploader = new RobustStudentUploader(
   *     "#studentUploadDropzone",                     // Dropzone form selector
   *     "/upload/",                                   // Backend upload URL
   *     ["student_name", "academic_level", "unit_name", "unit_code", "upload_type"], // Metadata field IDs
   *     { maxFilesize: 25, parallelUploads: 3 }      // Optional Dropzone overrides
   *   );
   * });
   */
  constructor(selector, uploadUrl, metadataFields = [], options = {}) {
    if (!Dropzone) {
      console.error("Dropzone is not loaded.");
      return;
    }

    this.selector = selector;
    this.uploadUrl = uploadUrl;
    this.metadataFields = metadataFields;
    this.options = options;

    this.initDropzone();
  }

  initDropzone() {
    const defaultOptions = {
      url: this.uploadUrl,
      maxFilesize: 20, // MB
      acceptedFiles: ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png",
      addRemoveLinks: true,
      uploadMultiple: true,
      dictDefaultMessage: "Drag and drop files here or click to upload",
      autoProcessQueue: false,
      parallelUploads: 2,
      previewTemplate:
        document.querySelector("#dz-preview-template")?.innerHTML || undefined,
      init: function () {
        const dzInstance = this;
        dzInstance.classInstance = dzInstance.classInstance || this;
        if (dzInstance.classInstance && dzInstance.classInstance.bindEvents) {
          dzInstance.classInstance.bindEvents(dzInstance);
        }
      },
    };

    const finalOptions = $.extend(true, {}, defaultOptions, this.options);

    this.dropzoneInstance = new Dropzone(this.selector, finalOptions);
    this.dropzoneInstance.classInstance = this;
  }

  bindEvents(dropzone) {
    dropzone.on("addedfile", (file) => {
      if (!this.validateMetadata()) {
        dropzone.removeFile(file);
        alert("Please fill all required fields before uploading.");
      }
    });

    // Sending event: attach metadata
    dropzone.on("sending", (file, xhr, formData) => {
      this.metadataFields.forEach((id) => {
        const field = document.getElementById(id);
        if (field && field.value) {
          formData.append(field.name, field.value);
        }
      });
      formData.append("upload_time", new Date().toISOString());
    });

    dropzone.on("success", (file, response) =>
      this.showSuccess(file, response)
    );
    dropzone.on("error", (file, error) => this.showError(file, error));
    dropzone.on("removedfile", (file) => console.log(`Removed: ${file.name}`));
    const form = dropzone.element.closest("form");
    console.log(form);
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!this.validateMetadata()) {
          alert("Please fill all required fields before uploading.");
          return;
        }
        if (dropzone.getQueuedFiles().length === 0) {
          alert("Please select at least one file to upload.");
          return;
        }
        dropzone.processQueue();
      });
    }
  }

  validateMetadata() {
    return this.metadataFields.every((id) => {
      const field = document.getElementById(id);
      return field && field.value.trim() !== "";
    });
  }

  showSuccess(file, response) {
    console.log(`File "${file.name}" uploaded successfully.`);
  }

  showError(file, errorMessage) {
    console.error(`Error uploading "${file.name}": ${errorMessage}`);
  }
}

export function submitStudentUploadForm() {
  const form = document.getElementById("studentUploadForm");
  const dropzone = Dropzone.forElement("#studentUploadDropzone");

  if (!form || !dropzone) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const $btn = $("#studentUploadForm").find("button[type=submit]");

    const btnText = $btn.text();
    $btn.text("Uploading your resource...");
    $btn.prop("disabled", true);

    const requiredFields = form.querySelectorAll("[required]");
    for (const field of requiredFields) {
      if (!field.value.trim()) {
        showToast({
          message: "Please fill all required fields before uploading.",
          type: "error",
        });
        field.focus();
        return;
      }
    }

    if (dropzone.getQueuedFiles().length === 0) {
      showToast({
        message: "Please select at least one file to upload.",
        type: "error",
      });
      return;
    }

    // Clear previous events to prevent duplicates
    dropzone.off("sendingmultiple");
    dropzone.off("successmultiple");
    dropzone.off("errormultiple");

    dropzone.on("sendingmultiple", function (files, xhr, formData) {
      const formDataObj = new FormData(form);
      for (let pair of formDataObj.entries()) {
        formData.append(pair[0], pair[1]);
      }
      formData.append("upload_time", new Date().toISOString());
    });

    dropzone.on("successmultiple", function (files, response) {
      showToast({
        message: response.detail || "All files uploaded successfully",
        type: response.status || "success",
      });
      dropzone.removeAllFiles();
      form.reset();
      $btn.text(btnText);
      $btn.prop("disabled", false);
      const modal = Modal.getInstance(
        document.getElementById("resourceUploadModal")
      );
      if (modal) {
        setTimeout(() => {
          modal.hide();
        }, 4000);
      }
    });

    dropzone.on("errormultiple", function (files, errorMessage) {
      console.error("Upload error:", errorMessage);
      showToast({
        message: "Error. Check console for details.",
        type: "error",
      });
      $btn.text(btnText);
      $btn.prop("disabled", false);
    });

    dropzone.processQueue();
  });
}
