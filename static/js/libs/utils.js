import { Modal } from "bootstrap";
import $ from "jquery";

$(function () {
  resourceUpload();
});

const resourceUpload = () => {
  const btn = $("a.resourceUploadModalBtn");
  const container = $("#resourceUploadModal");
  if (!container.get(0)) return;
  const modal = new Modal(container.get(0), {
    backdrop: "static",
    keyboard: false,
  });
  btn.on("click", function (event) {
    event.preventDefault();
    console.log("Hello")
    modal.show();
  });
};
