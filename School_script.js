//the base maps
var imageryTopo = L.tileLayer.wms('http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WmsServer?', {
  minZoom: '0',
  maxZoom: '13',
  layers: '0',
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer">USGS</a>'
});

var nationalMap = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WmsServer?", {
  minZoom : '0', 
  maxZoom : '13',	
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer">USGS</a>'
});
var usdaNAIP = L.esri.dynamicMapLayer({
	url: "https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer", 
	minZoom: '14', 
	maxZoom: '19',
	layers: 0, 
	attribution: ' Map tiles by <a href="https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer"> USDA</a>'
});
/*
var imagery = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WmsServer?", {
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer">USGS</a>'
});
*/
/*
 var imagery2 = L.esri.dynamicMapLayer({
    url: 'https://services.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/MapServer?',
    minZoom: '14',
	maxZoom: '19',
	attribution: 'Map tiles by <a href="https://services.nationalmap.gov/arcgis/services/USGSNAIPPlus/MapServer">USGS</a>' 
  });
  */

var national = L.layerGroup([imageryTopo,usdaNAIP]);
var usda = L.layerGroup([nationalMap, usdaNAIP]);

var needsChecked = 0;
var needsReviewed = 0;
var finshed = 0;

var featureLayer = new L.esri.clusteredFeatureLayer({
          chunkedLoading: true,
          url: "https://edits.nationalmap.gov/arcgis/rest/services/tnmc/tnmc_map_challenge/MapServer/0",
		  where: "ftype = '730' and state ='IL'",
          pointToLayer: function(feature, latlng) {
            if(feature.properties.editstatus === 0){ 
              return L.marker(latlng, {
                  icon: L.ExtraMarkers.icon({
                      icon: 'fa-exclamation fa-2x',
                      shape: 'square',
                      markerColor:'red',
                      prefix: 'fa'
                   }),
               });
            } else if (feature.properties.editstatus === 1){
              return L.marker(latlng, {
                  icon: L.ExtraMarkers.icon({
                      icon: 'fa-times fa-2x',
                      markerColor:'green-light',
                      shape: 'square',
                      prefix: 'fa'
                   }),
               });
            } else {
              return L.marker(latlng, {
                  icon: L.ExtraMarkers.icon({
                      icon: 'fa-check fa-2x',
                      shape: 'square',
                      markerColor:'yellow',
                      prefix: 'fa'
                   }),
               });
            }
          },
          onEachFeature: function(feature, layer){
            if(feature.properties.editstatus === 0){ 
              needsChecked++;
              $('#tobecheckedCounter').text(" (" + needsChecked + " points)");
            } else if (feature.properties.editstatus === 1){
              needsReviewed++;
              $('#tobepeerreviwedCounter').text(" (" + needsReviewed + " points)");
            } else {
              finshed++;
              $('#finishedCounter').text(" (" + finshed  + " points)")
            }
            layer.bindPopup(feature.properties.name + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          }
        });
					 
var southWest = L.latLng(36.518421, -94.681810),
  northEast = L.latLng(41.713250, -84.717663),
  bounds = L.latLngBounds(southWest, northEast);

/*
var map = L.map('map', {
  layers: [imageryTopo],
  'zoomControl': false,
  'minZoom': 0,
  'maxZoom': 13,
  'maxBounds': bounds
}).setView([40.63, -77.84], 7);

var basemap = L.map('basemap',{
	layers: [usdaNAIP],
	'zoomControl': false,
	'minZoom': 14, 
	'maxZoom':19, 
	'maxBounds': bounds
}) .setView([40.63, -77.84], 7);
*/

var map = L.map('map',{
	layers: [imageryTopo,usdaNAIP],
	'maxBounds': bounds 
}) .setView([40.63, -77.84], 7);

featureLayer.addTo(map);

//zoom custom position
/*
L.control.zoom({
  position: 'topright'
}).addTo(map);
*/ 
// custom zoom layer so as not to push past a certian level 

map.zoomControl.setPosition('bottomright')

var basemaps = {
  "The National Map Base Layer": nationalMap,
  "The Nationap Map + Aerial Imagery": imageryTopo,
  // "USDA NAIP": usdaNAIP,
 // "The National Map Imagery": imagery2 
};

L.control.layers(basemaps, null, {
  position: 'bottomleft'
}).addTo(map);

/*
  TODO: THIS STUFF BELOW NEEDS TO BE FIXED
*/

$("#finished").click(function(){
    if(map.hasLayer(finished)){
      map.removeLayer(finished)
      $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
      $(this).find("i").attr('class', 'fa fa-eye-slash');
    } else {
/*
      $.getJSON("./data/finished.json", function(data) {
        finished = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + '<hr> <a href="' + feature.properties.link + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          },
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
              icon: L.ExtraMarkers.icon({
                icon: 'fa-check fa-2x',
                shape: 'square',
                markerColor: 'green-light',
                prefix: 'fa'
              }),
            });
          }
        })
        map.addLayer(finished)

      });*/
//      $(this).removeAttr('style');
//      $(this).find('i').attr('class', 'fa fa-check');
    }
});
$("#tobechecked").click(function(){
    if(map.hasLayer(tobechecked)){
      map.removeLayer(tobechecked)
      $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
      $(this).find("i").attr('class', 'fa fa-eye-slash');
    } else {
/*
      $.getJSON("./data/tobechecked.json", function(data) {
        tobechecked = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + '<hr> <a href="' + feature.properties.link + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          },
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
              icon: L.ExtraMarkers.icon({
                icon: 'fa-exclamation fa-2x',
                shape: 'square',
                markerColor: 'red',
                prefix: 'fa'
              }),
            });
          }
        })
        map.addLayer(tobechecked)

      });*/
//      $(this).removeAttr('style');
//      $(this).find('i').attr('class', 'fa fa-exclamation');
    }
});
$("#tobepeerreviwed").click(function(){
    if(map.hasLayer(tobepeerreviwed)){
      map.removeLayer(tobepeerreviwed)
      $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
      $(this).find("i").attr('class', 'fa fa-eye-slash');
    } else {
/*
      $.getJSON("./data/tobepeerreviwed.json", function(data) {
        tobepeerreviwed = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + '<hr> <a href="' + feature.properties.link + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          },
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
              icon: L.ExtraMarkers.icon({
                icon: 'fa-times fa-2x',
                markerColor: 'yellow',
                shape: 'square',
                prefix: 'fa'
              }),
            });
          }
        })
        map.addLayer(tobepeerreviwed)

      });*/
//      $(this).removeAttr('style');
//      $(this).find('i').attr('class', 'fa fa-times');
    }
});

// map.addLayer(markers);

 $(".markers-legend").hover(function(){
   $(this).css('cursor', 'pointer');
   original = $(this).find("i").attr('class');
   $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
   $(this).find("i").attr('class', 'fa fa-eye-slash');
 }, function(){
   $(this).removeAttr('style');
   $(this).find('i').attr('class', original);
 })
