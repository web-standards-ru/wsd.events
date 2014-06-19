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

		var map = $(this);

		if (!map) return;

		var query = map.find('img').attr('src').split('?')[1].split('&'),
			mapData = {},
			ymap;

		for (var i = 0, l = query.length, prop; i < l; i++ ) {
			prop = query[i].split('=');
			mapData[prop[0]] = prop[1];
		}

		ymaps.ready(function () {

			map.empty();

			ymap = new ymaps.Map('map', {
				center: [
					mapData.ll.split(',')[1],
					mapData.ll.split(',')[0]
				],
				zoom: mapData.z,
				controls: ['zoomControl', 'rulerControl']
			});

			marker = new ymaps.Placemark([
				mapData.pt.split(',')[1],
				mapData.pt.split(',')[0]
			], {}, {
				iconLayout: 'default#image',
				iconImageHref:"/i/map-logo.png",
				iconImageSize:[93, 83],
				iconImageOffset:[-24, -83],
				iconShadow:true,
				iconShadowImageHref:"/i/map-shadow.png",
				iconShadowImageSize:[93, 83],
				iconShadowImageOffset:[-24, -83]
			});

			ymap.geoObjects.add(marker);

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
