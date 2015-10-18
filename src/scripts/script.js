(function(window, document){

	// More

	var more = document.getElementById('more');

	if (more) {
		more.addEventListener('click', function () {
			var hidden = this.parentNode.querySelectorAll('.speakers__list--hidden');
			if (hidden) {
				var pictures = hidden[0].querySelectorAll('.speakers__picture');
				for (var i = 0, j = pictures.length; i < j; i++) {
					pictures[i].src = pictures[i].dataset.src;
				}
				hidden[0].classList.remove('speakers__list--hidden');
				if (!hidden[1]) {
					this.parentNode.removeChild(this);
				}
			}
		});
	}

	// Map

	var map = document.getElementById('map');

	if (map) {
		var latitude = map.dataset.latitude,
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
				iconImageHref: '/images/logo.svg',
				iconImageSize: [80, 87],
				iconImageOffset: [-40, -95]
			}));
		});
	}

})(window, document);
