document.documentElement.id = 'js';

$(function(){

	// Scroller

	$.fn.scroller = function() {
		$( this ).each(
			function(){
				var locationPath = filterPath( location.pathname ),
					thisPath = filterPath(this.pathname) || locationPath;
				if( locationPath == thisPath && ( location.hostname == this.hostname || !this.hostname ) && this.hash.replace( /#/,'' )) {
				var $target = $( this.hash ),
					target = this.hash;
				if ( target ) {
					var targetOffset = $target.offset();
					$( this ).click(
						function( event ) {
							event.preventDefault();
							var frame = ( $.browser.safari ) ? $( 'body' ) : $( 'html' );
						frame.animate(
							{ scrollTop:targetOffset.top },
							400,
							function() {
								location.hash = target;
							});
						}
					);
				}
			}
		});
		function filterPath( string ){
			return string.replace( /^\//, '' ).replace( /\/$/, '' );
		}
	}

	$('a[href^=#]').scroller();

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
		if(!map) return;
		var query = map.firstChild.src.split('&'),
			centerCoords = {}, markerCoords = {}, coords, zoomLevel;
		if (map != null) {
			for(var i=0, queryLength = query.length; i < queryLength; i++ ) {
				var current = query[i];
				if( current.indexOf('center')+1 ) {
					coords = current.split('=')[1].split(',');
					centerCoords.lat = coords[0];
					centerCoords.lng = coords[1];
				}
				if( current.indexOf('markers')+1 ) {
					coords = current.split('=')[1].split(',');
					markerCoords.lat = coords[0];
					markerCoords.lng = coords[1];
				}
				if( current.indexOf('zoom')+1 ) {
					zoomLevel = parseInt(current.split('=')[1]);
				}
			}
			var options = {
				zoom: zoomLevel,
				center: new google.maps.LatLng( centerCoords.lat, centerCoords.lng ),
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			var gmap = new google.maps.Map(
				map, options
			);
			var icon = new google.maps.MarkerImage(
				'/i/map-logo.png',
				new google.maps.Size( 93, 83 ),
				new google.maps.Point( 0, 0 ),
				new google.maps.Point( 24, 83 )
			);
			var shadow = new google.maps.MarkerImage(
				'/i/map-shadow.png',
				new google.maps.Size( 93, 83 ),
				new google.maps.Point( 0, 0 ),
				new google.maps.Point( 24, 83 )
			);
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng( markerCoords.lat, markerCoords.lng ),
				map: gmap,
				shadow: shadow,
				icon: icon
			});
		}
	}

	$('#map').map();

	window.onerror = function(){
		return true;
	}

});