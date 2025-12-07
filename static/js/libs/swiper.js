import Swiper from "swiper";

let resourceSwiper = null;

export function initResourceSwiper() {
    if (resourceSwiper !== null) {
        resourceSwiper.destroy(true, true);
        resourceSwiper = null;
    }

    // Re-initialize
    resourceSwiper = new Swiper(".resource-swiper", {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        autoplay: true,
        breakpoints: {
            576: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
        },
    });
}
