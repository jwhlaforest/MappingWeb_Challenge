var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Marker size depending on magnitude
function markerSize(magnitude) {
  return magnitude * 5;
};

// marker colour depending on magnitude
function markerColour(magnitude) {
  switch (true) {
    case magnitude > 5.0:
      return "red";
      break;
    case magnitude >= 4.0:
      return "orange";
      break;
    case magnitude >= 3:
      return "yellow";
      break;
    case magnitude >= 2.0:
      return 'green';
      break;
  
    case magnitude >= 1.0:
      return 'blue';
      break; 
    case magnitude >= 0:
      return 'purple';
  };
};

// URL request
d3.json(URL, function(data) {
  markers(data.features);
  console.log(data);
})

// Marker creation
function markers(earthquakeData) {
  function onMarker(feature, layer) {
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Location: " + feature.properties.place + 
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColour(feature.properties.mag),
        color: "black",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 0.7
      });
    },
    onMarker: onMarker
  });

  createMap(earthquakes);
}

// Map creation
function createMap(earthquakes) {

  // Map layers
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // baseMap creation
  var baseMap = {
    Satellite: satellite,
    Dark: dark
  };

  // Overlay
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Map Satellite and Earthquakes
  var map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3,
    layers: [satellite, earthquakes]
  });

  // Layer control
  L.control.layers(baseMap, overlayMaps, {
    collapsed: false
  }).addTo(map);
};