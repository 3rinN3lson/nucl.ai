root = exports ? this # global

$ ->

  if $("section.venu").lenght == 0 then return

  geocoder = new google.maps.Geocoder()

  initialize = () ->
    mapCanvas = $('#venue-map-canvas')[0]
    if mapCanvas == null then return
    # has this things hardcoded here google geaocoder shows other building at the venue addressp

    geocoder.geocode { 'address': 'Juridicum, Schottenbastei 10-16, 1010 Wien, Austria' }, (results, status) ->
      console.log(results)
      lat = results[0].geometry.location.lat()
      lng = results[0].geometry.location.lng()
      latLng = new google.maps.LatLng results[0].geometry.location.lat(), results[0].geometry.location.lng()
      map = new google.maps.Map( mapCanvas, $.extend( root.config.mapOptions, { center: latLng } ) )
      marker = new google.maps.Marker( { position: latLng, map: map } )


  google.maps.event.addDomListener(window, 'load', initialize)