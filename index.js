// AIzaSyB-YNpnzr-2SE-0RBYcCKuH7-poyZqbcrQ -----> API KEY GOOGLE MAPS

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -33.8688, lng: 151.2195 },
    zoom: 13,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      // HERE MAPS FUNCTIONS
      // 6KFwkE5ukvCWg-2LokkGZxBB10NiaOxsMqU41sMktmE ------> HERE API KEY

      /**
       * Calculates and displays the address details of 200 S Mathilda Ave, Sunnyvale, CA
       * based on a free-form text
       *
       *
       * A full list of available request parameters can be found in the Geocoder API documentation.
       * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-geocode.html
       *
       * @param   {H.service.Platform} platform    A stub class to access HERE services
       */
      console.log(place, "place maps")
      let street = ''
      place.address_components.forEach((direction_part) => {
        street += direction_part.long_name
      })
      console.log(street, "street")
      function geocode(platform) {
        var geocoder = platform.getSearchService(),
          geocodingParameters = {
            q: street
          };

        geocoder.geocode(
          geocodingParameters,
          onSuccess,
          onError
        );
      }

      /**
      * This function will be called once the Geocoder REST API provides a response
      * @param  {Object} result          A JSONP object representing the  location(s) found.
      *
      * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
      */
      function onSuccess(result) {
        var locations = result.items;
        /*
         * The styling of the geocoding response on the map is entirely under the developer's control.
         * A representitive styling can be found the full JS + HTML code of this example
         * in the functions below:
         */
        console.log(locations)
        addLocationsToMap(locations);
        // ... etc.
      }

      /**
      * This function will be called if a communication error occurs during the JSON-P request
      * @param  {Object} error  The error message received.
      */
      function onError(error) {
        alert('Can\'t reach the remote server');
      }

      /**
      * Boilerplate map initialization code starts below:
      */

      //Step 1: initialize communication with the platform
      // In your own code, replace variable window.apikey with your own apikey
      var platform = new H.service.Platform({
        apikey: '6KFwkE5ukvCWg-2LokkGZxBB10NiaOxsMqU41sMktmE'
      });
      var defaultLayers = platform.createDefaultLayers();

      //Step 2: initialize a map - this map is centered over California
      var map2 = new H.Map(document.getElementById('map2'),
        defaultLayers.vector.normal.map, {
        center: { lat: 37.376, lng: -122.034 },
        zoom: 15,
        pixelRatio: window.devicePixelRatio || 1
      });
      // add a resize listener to make sure that the map occupies the whole container
      window.addEventListener('resize', () => map2.getViewPort().resize());

      //Step 3: make the map interactive
      // MapEvents enables the event system
      // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
      var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map2));

      // Create the default UI components
      var ui = H.ui.UI.createDefault(map2, defaultLayers);

      // Hold a reference to any infobubble opened
      var bubble;

      /**
      * Opens/Closes a infobubble
      * @param  {H.geo.Point} position     The location on the map.
      * @param  {String} text              The contents of the infobubble.
      */
      function openBubble(position, text) {
        if (!bubble) {
          bubble = new H.ui.InfoBubble(
            position,
            { content: text });
          ui.addBubble(bubble);
        } else {
          bubble.setPosition(position);
          bubble.setContent(text);
          bubble.open();
        }
      }

      /**
      * Creates a series of H.map.Markers for each location found, and adds it to the map.
      * @param {Object[]} locations An array of locations as received from the
      *                             H.service.GeocodingService
      */
      function addLocationsToMap(locations) {
        var group = new H.map.Group(),
          position,
          i;

        // Add a marker for each location found
        for (i = 0; i < locations.length; i += 1) {
          let location = locations[i];
          marker = new H.map.Marker(location.position);
          marker.label = location.address.label;
          group.addObject(marker);
        }

        group.addEventListener('tap', function (evt) {
          map2.setCenter(evt.target.getGeometry());
          openBubble(
            evt.target.getGeometry(), evt.target.label);
        }, false);

        // Add the locations group to the map
        map2.addObject(group);
        map2.setCenter(group.getBoundingBox().getCenter());
      }

      // Now use the map as required...
      geocode(platform);
      map.fitBounds(bounds);

    });


  });

}