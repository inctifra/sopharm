/**
 * Show a loading spinner while typing in an input
 * @param {string} inputSelector - jQuery selector for the input field
 * @param {string} spinnerSelector - jQuery selector for the spinner element
 * @param {number} typingDelay - delay in ms after user stops typing (optional, default 300)
 */

import { initResourceSwiper } from "./swiper";

export function attachTypingSpinner(
  inputSelector,
  spinnerSelector,
  responseSelector = ".featured-faculty-response",
  typingDelay = 300
) {
  const $input = $(inputSelector);
  const $spinner = $(spinnerSelector);
  const $response = $(responseSelector);
  if (!$input.get(0) && !$spinner.get(0)) return;

  let typingTimer;

  $input.on("input", function () {
    const url = $(this).data("url")
    const value = $(this).val().trim();
    clearFeaturedFaculty($response);
    processSearchFunctionality($response, $spinner, value, url);
  });

  $input.on("keyup", async function(event){
    event.preventDefault();
    const url = $(this).data("url")
    const value = $(this).val().trim();
    if (event.key === "Enter"){
      processSearchFunctionality($response, $spinner, value, url);
    }
  })
}

function processSearchFunctionality($response, $spinner, value, url) {
  const html = "<h1 class='text-center'>Start by typing something</h1>";
  clearFeaturedFaculty($response);
  if (value.length > 0) {
    doneSearchCall(url, $response, $spinner, value);
  } else {
    $spinner.removeClass("visible");
    showFeaturedFaculty($response, html);
  }
}

function clearFeaturedFaculty(response) {
  $(response).empty().hide();
}

function showFeaturedFaculty(response, html) {
  $(response).html(html).show();
}


function doneSearchCall(url, container, $spinner, query){
      const params = new URLSearchParams({
        title: query,
        student_name: query,
        unit_name: query,
        unit_code: query
    });
    const fullUrl = `${url}?${params.toString()}`;

  $.get(fullUrl).done(function(response){
    console.log(response)
    showFeaturedFaculty(container, response);
    initResourceSwiper();
  }).fail(function(error){
    console.log(error)
    showFeaturedFaculty(container, error)
  }).always(function(){
    $spinner.removeClass("visible");
  })
}