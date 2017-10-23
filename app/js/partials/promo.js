var slides = document.getElementById("promoSlider").getElementsByTagName("li");
console.log(slides);
var currentSlide = 0;
var slideInterval = setInterval(nextSlide,10000);

function nextSlide() {
	slides[currentSlide].className = 'slide';
	currentSlide = (currentSlide+1)%slides.length;
	slides[currentSlide].className = 'c-promoSlider__item showing';
}