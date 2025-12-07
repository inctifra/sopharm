/**
* JKUAT SCHOOL OF PHARMACY WEBSITE MAIN JAVASCRIPT FILE
*/

import $ from 'jquery';
import GLightbox from 'glightbox';
import PureCounter from '@srexi/purecounterjs';

$(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    var $body = $('body');
    var $header = $('#header');

    if (
      !$header.hasClass('scroll-up-sticky') &&
      !$header.hasClass('sticky-top') &&
      !$header.hasClass('fixed-top')
    ) return;

    ($(window).scrollTop() > 100)
      ? $body.addClass('scrolled')
      : $body.removeClass('scrolled');
  }

  $(document).on('scroll', toggleScrolled);
  $(window).on('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  var $mobileNavToggleBtn = $('.mobile-nav-toggle');

  function mobileNavToggle() {
    $('body').toggleClass('mobile-nav-active');
    $mobileNavToggleBtn.toggleClass('bi-list bi-x');
  }

  if ($mobileNavToggleBtn.length) {
    $mobileNavToggleBtn.on('click', mobileNavToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  $('#navmenu a').on('click', function () {
    if ($('body').hasClass('mobile-nav-active')) {
      mobileNavToggle();
    }
  });

  /**
   * Toggle mobile nav dropdowns
   */
  $('.navmenu .toggle-dropdown').on('click', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass('active');
    $(this).parent().next().toggleClass('dropdown-active');
    e.stopImmediatePropagation();
  });

  /**
   * Preloader
   */
  var $preloader = $('#preloader');
  if ($preloader.length) {
    $(window).on('load', function () {
      $preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  var $scrollTop = $('.scroll-top');

  function toggleScrollTop() {
    if ($(window).scrollTop() > 100) {
      $scrollTop.addClass('active');
    } else {
      $scrollTop.removeClass('active');
    }
  }

  $scrollTop.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 400);
  });

  $(window).on('load', toggleScrollTop);
  $(document).on('scroll', toggleScrollTop);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initiate GLightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });
});
