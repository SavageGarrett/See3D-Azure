var slideIndex = 1;
showSlides(slideIndex);

// Increment slide
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Change Current Slide
function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Display a slide
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// Fixes a focus bug that breaks hover css
function unFocus(id) {
  document.getElementById(id).blur();
}
