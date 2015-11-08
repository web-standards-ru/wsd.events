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

		        if (speakers.length < group) {
		            more.parentNode.removeChild(more);
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
				iconImageHref: '/images/logo-dark.svg',
				iconImageSize: [80, 87],
				iconImageOffset: [-40, -95]
			}));
		});
	}

})(document);
