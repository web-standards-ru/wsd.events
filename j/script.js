document.documentElement.id = 'js';

$(function(){

	// Tweets

	$.fn.tweets = function( q ) {
		var list = $( this ),
			url;
		url = 'http://twitter.webstandardsdays.ru/?fields=user.screen_name,user.profile_image_url,text&callback=?';

		$.getJSON( url, function( data ) {
			$.each( data, function( i, item ) {
				var user = item.user.screen_name,
					image = item.user.profile_image_url,
					text = item.text;
				text = text.replace(
					/(^|\s)(?:#([\d\w_]+)|@([\d\w_]{1,15}))|(https?:\/\/[^\s"]+[\d\w_\-\/])|([^\s:@"]+@[^\s:@"]*)/gi,
					function( all, space, hashtag, username, link, email ) {
						var res = '<a href="mailto:' + email + '">' + email + "</a>";
							hashtag && (res = space + '<a href="https://twitter.com/search?q=%23' + hashtag + '">#' + hashtag + "</a>");
							username && (res = space + '<a href="https://twitter.com/' + username + '">@' + username + "</a>");
							link && (res = '<a href="' + encodeURI(decodeURI(link.replace(/<[^>]*>/g, ""))) + '">' + link + "</a>");
						return res;
					}
				);
				list.append(
					'<li><a href="http://twitter.com/' +
					user + '" title="' +
					user + '"><img src="' +
					image + '"></a>' +
					text + '</li>'
				);
			});
		});
	};

	$('#twitter ul').tweets('wstdays');

	// Map

	$.fn.yandexMap = function() {
		var map = document.getElementById( this.selector.substr( 1 ) );

		if(typeof map === 'undefined' || map === null) {
			return;
		}

		var query = map.firstChild.src.split('?')[1].split('&'),
			ymap,
			mapData = {},
			centerCoords = {},
			marker = {};

		for (var i=0, prop, queryLength = query.length; i < queryLength; i++ ) {
			prop = query[i].split('=');
			mapData[prop[0]] = prop[1];
		}

		centerCoords = {
			lng: mapData.ll.split(',')[0],
			lat: mapData.ll.split(',')[1]
		};

		marker.coords = {
			lng: mapData.pt.split(',')[0],
			lat: mapData.pt.split(',')[1]
		};

		marker.point = [marker.coords.lat, marker.coords.lng];

		marker.style = {
			iconImageHref:"/i/map-logo.png",
			iconImageSize:[93, 83],
			iconImageOffset:[-24, -83],
			iconShadow:true,
			iconShadowImageHref:"/i/map-shadow.png",
			iconShadowImageSize:[93, 83],
			iconShadowImageOffset:[-24, -83]
		};

		ymaps.ready(function () {
			map.removeChild(map.firstChild);
			ymap = new ymaps.Map(map, {
				center: [centerCoords.lat, centerCoords.lng],
				zoom: mapData.z,
				controls: ['zoomControl', 'rulerControl']
			});

			marker.placemark = new ymaps.Placemark(marker.point, {}, marker.style);

			ymap.geoObjects.add(marker.placemark);

			ymap.controls.add('smallZoomControl',
				{left: '8px', top: '24px'});

			if (mapData.l === 'pmap') {
				ymap.setType('yandex#publicMap');
			}
		});
	};

	$('#map').yandexMap();

	// Donate

	$('a[href=#donate]').click(function(){
		$('#donate').toggleClass('target');
		return false;
	});

});
