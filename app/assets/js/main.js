$('.slick-carousel').slick({
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  nextArrow: false,
  prevArrow: false,
  variableWidth: true,
  centerMode: false,
  variableWidth: true,
  responsive: [{
    breakpoint: 992,
    settings: {
      slidesToShow: 2
    }
  }, {
    breakpoint: 768,
    settings: {
      slidesToShow: 1
    }
  }]
});