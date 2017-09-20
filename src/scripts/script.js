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
