(function(){

  "use strict";

  // Variables
  // =========================================================================================
  var $html = $('html'),
      $document = $(document),
      $window = $(window),
      i = 0;


  // Scripts initialize
  // ===================

  
  $window.on('load', function () {

    // =================================================================================
    // Preloader
    // =================================================================================
    var $preloader = $('#page-preloader');
    $preloader.delay(100).fadeOut('slow');

    // =================================================================================
    // WOW
    // =================================================================================
    new WOW().init();


    // =================================================================================
    // jQuery ajaxChimp
    // =================================================================================
    var chimpForm = $('.subscription-form');
    chimpForm.ajaxChimp({
      callback: function(){
        var panel = $('.js-result');
        setTimeout(function () {
          panel.removeClass("error").removeClass("success");
        }, 4500);
      },
      language: 'cm',
      url: '//adr.us14.list-manage.com/subscribe/post?u=474217a166648c3e7e0c53b55&amp;id=57bd6ccefc'
      //XXX.us13.list-manage.com/subscribe/post?u=YYY&amp;id=ZZZ
    });
    $.ajaxChimp.translations.cm = {
      'submit': 'Submitting...',
      0: 'We have sent you a confirmation email',
      1: 'Please enter a value',
      2: 'An email address must contain a single @',
      3: 'The domain portion of the email address is invalid (the portion after the @: )',
      4: 'The username portion of the email address is invalid (the portion before the @: )',
      5: 'This email address looks fake or invalid. Please enter a real email address'
    };

    // =================================================================================
    // Typed effect
    // =================================================================================
    $(".typed").typed({
      stringsElement: $(".typed-string"),
      typeSpeed: 50,
      backDelay: 1200,
      loop: true,
      cursorChar: "",
    });

    // =================================================================================
    // Responsive Nav
    // =================================================================================
    var responsiveNav = new Navigation({
      init: true,
      stuck: true,
      responsive: true,
      breakpoint: 992, // don't forget to change in css as well
    });

    // =================================================================================
    // Parallalx.js
    // =================================================================================
    var parallax = $('.parallax-bg');
    if (parallax.length > 0) {
      parallax.parallax();
    }

    // =================================================================================
    // UIToTop
    // =================================================================================
    $().UItoTop();
   

    // =================================================================================
    // ISOTOPE
    // =================================================================================
    var isotope = $('.iso');
    // debounce so filtering doesn't happen every millisecond
    function debounce( fn, threshold ) {
      if(isotope.length){
        var timeout;
        return function debounced() {
          if ( timeout ) {
            clearTimeout( timeout );
          }
          function delayed() {
            fn();
            timeout = null;
          }
          timeout = setTimeout( delayed, threshold || 100 );
        }
      }
    }
    if (isotope.length) {
      $( function() {
        var $grid = $('.grid').isotope({
          itemSelector: 'article'
        });
        // filter buttons
        $('.filters-button-group').on( 'click', 'button', function() {
          var filterValue = $( this ).attr('data-filter');
          $grid.isotope({ filter: filterValue });
          $window.trigger("resize");
        });
        $('.button-group').each( function( i, buttonGroup ) {
          var $buttonGroup = $( buttonGroup );
          $buttonGroup.on( 'click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
          });
        });
      });
      
      $window.on("load", function() {
        $('.iso .button-group button.is-checked').trigger("click");
      });
    }


    // =================================================================================
    // Color Switcher
    // =================================================================================
   
   


  });

})();