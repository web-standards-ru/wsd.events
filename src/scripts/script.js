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
	setupVideoPreload();

	function setupVideoPreload() {
		var videoElements = document.querySelectorAll('.video');

		videoElements.forEach(preloadVideo);
	}

	function preloadVideo(videoElement) {
		var playButton = videoElement.querySelector('.video__icon');
		var cover = videoElement.querySelector('.video__media');
		var videoId = parseCoverURL(cover);
		var videoWrapper = videoElement.querySelector('.video__wrapper');

		playButton.addEventListener('click', function() {
			var iframe = makeIframe(videoId);

			videoWrapper.innerHTML = '';
			videoWrapper.appendChild(iframe);
		});
	}

	function parseCoverURL(coverElement) {
		var urlRegExp = /https:\/\/img\.youtube\.com\/vi\/([a-z0-9_]+)\/mqdefault\.jpg/i;
		var url = coverElement.src;
		var match = url.match(re);

		return match[1];
	}

	function makeIframe(videoId) {
		var iframe = document.createElement('iframe');

		iframe.setAttribute('frameborder', '0');
		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('src',  generateIframeUrl(videoId));
		iframe.classList.add('video__iframe');

		return iframe;
	}

	function generateIframeUrl(videoId) {
		var query = '?rel=0&showinfo=0&autoplay=1';

		return 'https://www.youtube.com/embed/' + videoId + query;
	}
})(document);
