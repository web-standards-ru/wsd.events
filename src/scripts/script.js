(function(document){

	// More

	var more = document.getElementById('more');

	if (more) {
		more.addEventListener('click', function() {
		    var speakers = more.parentNode.querySelectorAll('.speakers__speaker--hidden'),
			    group = 20;

		    if (speakers.length) {
		        for (var i = 0, l = Math.min(speakers.length, group); i < l; i++) {
		            var speaker = speakers[i],
		            	picture = speaker.querySelector('.speakers__picture'),
		            	data = picture.dataset.src;

		            if (data) {
		                picture.src = data;
		            }

		            speaker.classList.remove('speakers__speaker--hidden');
		        }

		        if (speakers.length <= group) {
		            more.parentNode.removeChild(more);
		        }
		    }
		});

	}

})(document);

// Map

function map() {
	var map = document.getElementById('map'),
		latitude = map.dataset.latitude,
		longitude = map.dataset.longitude,
		coordinates = [latitude, longitude],
		zoom = map.dataset.zoom;

	ymaps.ready(function () {
		var map = new ymaps.Map('map', {
			center: coordinates,
			zoom: zoom
		});

		map.behaviors.disable('scrollZoom');
		map.geoObjects.add(
			new ymaps.Placemark(coordinates, {}, {
			iconLayout: 'default#image',
			iconImageHref: '/images/icon.svg',
			iconImageSize: [80, 87],
			iconImageOffset: [-40, -95]
		}));
	});
}

// Iframe lazy loading

(function(document){

	addIframeLazyLoading();

	function addIframeLazyLoading() {
		var videoElements = document.querySelectorAll('.video');

		for (var i = 0; i < videoElements.length; i++) {
			var playButton = videoElements[i].querySelector('.video__icon');
			var videoWrapper = videoElements[i].querySelector('.video__wrapper');
			var iframeSrc = 'https://www.youtube.com/embed/' + videoElements[i].dataset.videoSrc +
			'?rel=0&showinfo=0&autoplay=1';

			addEventListener(playButton, videoWrapper, iframeSrc);
		}
	}

	function addEventListener(playButton, videoWrapper, iframeSrc) {
		playButton.addEventListener('click', function() {
			var iframe = document.createElement('iframe') ;

			iframe.setAttribute('frameborder', '0');
			iframe.setAttribute('allowfullscreen', '');
			iframe.setAttribute('src',  iframeSrc);
			iframe.classList.add('video__iframe');

			videoWrapper.innerHTML = '';
			videoWrapper.appendChild(iframe);
		});
	}
})(document);
