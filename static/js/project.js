import "bootstrap-icons/font/bootstrap-icons.css";
import "../sass/project.scss";
import "swiper/css";
import "dropzone/src/dropzone.scss";
import "./main";

import { Navigation, Autoplay } from "swiper/modules";
import Swiper from "swiper";
import { initResourceSwiper } from "./libs/swiper";

Swiper.use([Navigation, Autoplay]);

$(async function () {
  const [
    { attachTypingSpinner },
    { RobustStudentUploader, submitStudentUploadForm },
  ] = await Promise.all([
    import("./libs/search"),
    import("./libs/upload"),
    import("./libs/utils"),
  ]);

  attachTypingSpinner(".resources-search", ".spinner-indicator");
  const slider = document.querySelector(".testimonials-slider.swiper");
  const newsSlider = document.querySelector(".recent-news-swiper");

  if (slider) {
    new Swiper(slider, {
      slidesPerView: 1,
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5000,
      },
    });
  }

  if (newsSlider) {
    new Swiper(newsSlider, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: true,
      breakpoints: {
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
    });
  }

  if (document.querySelector(".featured-event-swiper")) {
    new Swiper(".featured-event-swiper", {
      slidesPerView: 1,
      spaceBetween: 5,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
    });
  }

  if (document.getElementById("studentUploadDropzone")) {
    const uploader = new RobustStudentUploader(
      "#studentUploadDropzone",
      "/resources/upload/",
      [
        "student_name",
        "academic_level",
        "unit_name",
        "unit_code",
        "upload_type",
      ]
    );
    submitStudentUploadForm();
  }

  $("div.event-item").each(function () {
    const item = $(this);
    item.on("click", function (event) {
      const url = $(this).data("url");
      if(!url)return;
      window.location.href = url;
    });
  });

  initResourceSwiper();
});
