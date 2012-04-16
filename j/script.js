document.documentElement.id = 'js';

$(function(){

	// Tweets

	$.fn.tweets = function( q ) {
		var list = $( this ),
			url = 'http://search.twitter.com/search.json?q=%23' + q + '&rpp=20&callback=?';
		$.getJSON( url, function( data ) {
			$.each( data.results, function( i, item ) {
				var user = item.from_user,
					image = item.profile_image_url,
					text = item.text;
				text = text.replace(
					/(^|\s)(?:#([\d\w_]+)|@([\d\w_]{1,15}))|(https?:\/\/[^\s"]+[\d\w_\-\/])|([^\s:@"]+@[^\s:@"]*)/gi,
					function( all, space, hashtag, username, link, email ) {
						var res = '<a href="mailto:' + email + '">' + email + "</a>";
							hashtag && (res = space + '<a href="http://search.twitter.com/search?q=%23' + hashtag + '">#' + hashtag + "</a>");
							username && (res = space + '<a href="http://twitter.com/' + username + '">@' + username + "</a>");
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
	}

	$('#twitter ul').tweets('wstdays');

	// Map

	$.fn.map = function() {
		var map = document.getElementById( this.selector.substr( 1 ) );

		if(typeof map === 'undefined' || map === null) {
			return;
		}

		var query = map.firstChild.src.split('?')[1].split('&'),
			ymap = new YMaps.Map(map),
			mapData = {},
			centerCoords = {},
			marker = {
				coords: {},
				style: new YMaps.Style()
			};

		for (var i=0, prop, queryLength = query.length; i < queryLength; i++ ) {
			prop = query[i].split('=');
			mapData[prop[0]] = prop[1];
		}

		centerCoords = {
			lng: mapData.ll.split(',')[0],
			lat: mapData.ll.split(',')[1]
		};

		mapCenter = new YMaps.GeoPoint(centerCoords.lng, centerCoords.lat);
		
		marker.coords = {
			lng: mapData.pt.split(',')[0],
			lat: mapData.pt.split(',')[1]
		};
		
		marker.point = new YMaps.GeoPoint(marker.coords.lng, marker.coords.lat);

		marker.style.iconStyle = new YMaps.IconStyle();

		marker.style.iconStyle.href = '/i/map-logo.png';
		marker.style.iconStyle.size = new YMaps.Point(93, 83);
		marker.style.iconStyle.offset = new YMaps.Point(-24, -83);

		marker.style.iconStyle.shadow = new YMaps.IconShadowStyle();
		marker.style.iconStyle.shadow.href = "/i/map-shadow.png";
		marker.style.iconStyle.shadow.size = new YMaps.Point(93, 83);
		marker.style.iconStyle.shadow.offset = new YMaps.Point(-24, -83);

		marker.placemark = new YMaps.Placemark(marker.point, {style: marker.style});
		
		ymap.setCenter(mapCenter, mapData.z);

		ymap.addOverlay(marker.placemark);

		ymap.addControl(new YMaps.SmallZoom(),
			new YMaps.ControlPosition(YMaps.ControlPosition.TOP_LEFT,
				new YMaps.Point(8, 24)
				)
			);

		if (mapData.l === 'pmap') {
			YMaps.load("pmap", function(){
				ymap.setType(YMaps.MapType.PMAP);
			});
			
		}
	};

	$('#map').map();

	window.onerror = function(){
		return true;
	}

	// Donate

	$('a[href=#donate]').click(function(){
		$('#donate').toggleClass('target');
		return false;
	});

});