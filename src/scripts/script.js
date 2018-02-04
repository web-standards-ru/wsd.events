// More speakers
(function(document){

	var more = document.getElementById('more');

	if (more) {
		more.addEventListener('click', function() {
			var speakers = more.parentNode.querySelectorAll('.speakers__speaker--hidden');
			var group = 20;

			if (speakers.length) {
				for (var i = 0, l = Math.min(speakers.length, group); i < l; i++) {
					var speaker = speakers[i];
					var picture = speaker.querySelector('.speakers__picture');

					if (picture.dataset.src) {
						picture.src =  picture.dataset.src;
					}

					if (picture.dataset.srcset) {
						picture.srcset =  picture.dataset.srcset;
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

// Maps

function getMapData() {
	var map = document.getElementById('map');
	var src = map.firstChild.src.split('?')[1].split('&');
	var data = {
		map: map
	};

	for (var i = 0; i < src.length; i++) {
		var item = src[i].split('=');
		data[item[0]] = item[1];
	}

	return data;
}

function yandexMap() {
	var data = getMapData();

	data.ll = data.ll.split(',');
	data.latitude = parseFloat(data.ll[0]);
	data.longitude = parseFloat(data.ll[1]);
	data.zoom = parseFloat(data.z);

	var coordinates = [
		data.longitude,
		data.latitude
	];

	var map = new ymaps.Map('map', {
		center: coordinates,
		zoom: data.zoom
	});

	map.behaviors.disable('scrollZoom');
	map.geoObjects.add(
		new ymaps.Placemark(coordinates, {}, {
		iconLayout: 'default#image',
		iconImageHref: '/images/icon.svg',
		iconImageSize: [80, 87],
		iconImageOffset: [-40, -95]
	}));

	data.map.classList.add('map--yandex');
	data.map.removeChild(data.map.firstChild);
}

function googleMap() {
	var data = getMapData();

	data.center = data.center.split(',');
	data.latitude = parseFloat(data.center[0]);
	data.longitude = parseFloat(data.center[1]);
	data.scale = parseFloat(data.scale);
	data.zoom = parseFloat(data.zoom);

	var coordinates = {
		lat: data.latitude,
		lng: data.longitude
	};

	var map = new google.maps.Map(data.map, {
		zoom: data.zoom,
		center: coordinates
	});

	var marker = new google.maps.Marker({
		position: coordinates,
		icon: {
			url: '/images/icon.svg',
			size: new google.maps.Size(80, 87),
			scaledSize: new google.maps.Size(80, 87),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(40, 87)
		},
		map: map
	});

	data.map.classList.add('map--google');
}

// Iframe lazy loading

(function(document){
	setupVideoPreload();

	function setupVideoPreload() {
		var videoElements = document.querySelectorAll('.video');

		for (var i = 0; i < videoElements.length; i++) {
			preloadVideo(videoElements[i]);
		}
	}

	function preloadVideo(videoElement) {
		var playButton = videoElement.querySelector('.video__button');
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
		var urlRegExp = /https:\/\/img\.youtube\.com\/vi\/([a-zA-Z0-9_-]+)\/mqdefault\.jpg/i;
		var url = coverElement.src;
		var match = url.match(urlRegExp);

		return match[1];
	}

	function makeIframe(videoId) {
		var iframe = document.createElement('iframe');

		iframe.setAttribute('frameborder', '0');
		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('src',  generateIframeUrl(videoId));
		iframe.classList.add('video__media');

		return iframe;
	}

	function generateIframeUrl(videoId) {
		var query = '?rel=0&showinfo=0&autoplay=1';

		return 'https://www.youtube.com/embed/' + videoId + query;
	}
})(document);



// Toggle events
(function(document){

	var calendar = document.querySelector('.calendar');

	if(calendar){
		var events = calendar.querySelectorAll('.calendar__item');
		var eventsDisabled = calendar.querySelectorAll('.calendar__item--hidden');

		var button = document.querySelector('#toggle-events');
		var limit = events.length - eventsDisabled.length;
		var isOpen = false;

		if(events.length <= limit) {
			button.style.display = 'block';
		} else {
			button.innerText = 'Показать больше событий';
			hideElements(events);

			button.addEventListener('click', function() {
				if(isOpen){
					hideElements(events);
					location.hash = '#calendar';
					isOpen = false;
					button.innerText = 'Показать больше событий';
				} else {
					showElements(events);
					removeHash();
					isOpen = true;
					button.innerText = 'Скрыть часть событий';
				}
			});
		}
	}


	function hideElements(elements) {
		elements.forEach(function (element, i) {
			if(i >= limit){
				element.classList.add('calendar__item--hidden');
			}
		});
	}

	function showElements(elements) {
		elements.forEach(function (element, i) {
			element.classList.remove('calendar__item--hidden');
			if(i === limit){
				element.querySelector('a').focus();
			}
		});
	}

	function removeHash () {
		history.pushState('', document.title, window.location.pathname + window.location.search);
	}

})(document);
