$(document).ready(function () {

  // The omnivore functions take three arguments:
  //
  // - a URL of the file to fetch
  // - options to the parser
  // - a custom layer
  //
  // And they return the custom layer, which is by default an L.geoJson layer.
  //
  // The second two arguments are each optional. In this case we're supplying
  // no arguments to the parser (null), but supplying a custom layer
  // with custom styles. These styles are the same as any styles you would
  // use with the default Leaflet API for L.geoJson, so read the documentation
  // at http://leafletjs.com/reference.html#geojson for the full details.
  var wilconCustomLayer = L.geoJson(null, {
      // http://leafletjs.com/reference.html#geojson-style
      style: function(feature) {
          return {
              color: '#DB1507',
              dashArray: [5, 5]
          };
      }
  });
  var wilconLayer = omnivore.kml('data/WilconProposedBuildout.kml', null, wilconCustomLayer);
  var wilcon = L.layerGroup([wilconLayer]);  
  
  var cityExistingFiberOptions = {
    // Filter out existing conduits without fiber
    filter: function(feature, layer) {
      if (feature.properties["TYPE"] !== 'Conduit') {
        switch(feature.properties["STATUS"]) {
          case 'Proposed': return false;
          case 'Existing': return true;
          default: return false;
        }
      }
      else {
        return false; 
      }
    },
    style: function(feature) {
      switch(feature.properties['STATUS']) {
        case 'Existing': return {
          color: "#17B9D9"
        };
      }
    }
  };
  var cityFiberExistingLayer = new L.Shapefile('data/FiberLines.zip', cityExistingFiberOptions);
  var cityFiberExisting = L.layerGroup([cityFiberExistingLayer]);
  
  var cityProposedFiberOptions = {
    // Filter out existing conduits without fiber
    filter: function(feature, layer) {
      if (feature.properties["TYPE"] !== 'Conduit') {
        switch(feature.properties["STATUS"]) {
          case 'Proposed': return true;
          case 'Existing': return false;
          default: return false;
        }        
      }
      else {
        return false; 
      }
    },
    style: function(feature) {
      switch(feature.properties['STATUS']) {
        case 'Proposed': return {
          dashArray: [10, 10],
          color: "#17B9D9"
        };
      }
    }
  };
  var cityFiberProposedLayer = new L.Shapefile('data/FiberLines.zip', cityProposedFiberOptions);
  var cityFiberProposed = L.layerGroup([cityFiberProposedLayer]);
  
  var trafficManagementInterconnectOptions = {
    // Filter out existing conduits without fiber
    filter: function(feature, layer) {
      switch(feature.properties["STATUS"]) {
        case 'Proposed': return false;
        case 'Existing': return false;
        default: return true;
      }
    },
    style: function(feature) {
      if(feature.properties['STATUS'] !== "Proposed" && feature.properties['STATUS'] !== "Existing") {
        return {
          color: "#136194"
        };
      }
    }
  };
  var trafficManagementInterconnectLayer = new L.Shapefile('data/FiberLines.zip', trafficManagementInterconnectOptions);
  var trafficManagementInterconnect = L.layerGroup([trafficManagementInterconnectLayer]);
  
  var map = L.map('map', {
      center: [33.782619, -118.167650],
      zoom: 14,
      layers: [cityFiberExisting, cityFiberProposed, trafficManagementInterconnectLayer, wilcon]
  });

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'alchave.nmon1a58',
      accessToken: 'pk.eyJ1IjoiYWxjaGF2ZSIsImEiOiJjaWZweTdpYXdhZ3k0aXVseHp5dXUzdGtiIn0.KVcPDuHs-dFveO_17vDnBQ'
  }).addTo(map);
  
  // Add custom layer control
  var overlayMaps = {
    "Existing Fiber": cityFiberExisting,
    "Proposed Fiber": cityFiberProposed,
    "Existing Fiber (Traffic Management Interconnect)": trafficManagementInterconnectLayer,
    "Proposed Fiber (Wilcon)": wilconLayer,
  };
  L.control.layers(null, overlayMaps).addTo(map);
  
});