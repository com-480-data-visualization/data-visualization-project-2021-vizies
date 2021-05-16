
class MapPlot {

    constructor(svg_element_id, energy_consumption, europe_map_data) {

        var map = L.map(svg_element_id, {scrollWheelZoom: false,
          zoomControl: false, dragging:false, doubleClickZoom: false, zoomSnap:0.1}).setView([51, 9]).setZoom(4.3);

        // Draw full map
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);

        var countries = ["AT", "BE", "CH", "DE", "DK", "ES", "FR", "GB", "IE", "LT", "LU", "NL", "NO", "PT", "SE"];

        // control that shows state info on hover -> CSS clash!
        	var info = L.control();

        	info.onAdd = function (map) {
        		this._div = L.DomUtil.create('div', 'info');
        		this.update();
        		return this._div;
        	};

        	info.update = function (feat) {
        		this._div.innerHTML = '<h4>Energy consumption</h4>' +  (feat ?
        			'<b>' + feat.properties.NAME + '</b><br />' + energy_consumption[0][feat.properties.ISO2] + ' MWh '
        			: 'Hover over a state');
        	};

        	info.addTo(map);

        function getColor(d) {
          return d > 40000 ? '#900000' :
            d > 20000  ? '#AC2308' :
            d > 10000  ? '#C84610' :
            d > 5000  ? '#E56A19' :
            d > 2000   ? '#E98218' :
            d > 1000   ? '#ED9B18' :
            d > 500   ? '#F1B416' :
                        '#F1CD5C';
                      }

    // Function to associate energy consumption value with fill in
    function style_country(features) {
      return {
          fillColor: getColor(energy_consumption[0][features.properties.ISO2]),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '1',
          fillOpacity: 0.7
        };
      }

    // Function for interaction
    function highlightFeature(e) {
        var layer = e.target;
        info.update(layer.feature);

        layer.setStyle({
            weight: 2,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                      layer.bringToFront();
                  }
              }

      function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
            }

      function onEachFeature(feature, layer) {
      		layer.on({
      			mouseover: highlightFeature,
      			mouseout: resetHighlight
            //click: definefunction related to the plot!
      		});
        }

        // Draw map of countries with energy
        var geojson = L.geoJson(europe_map_data, {
            style: style_country,
            onEachFeature: onEachFeature
        }).addTo(map);

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 500, 1000, 2000, 5000, 10000, 20000, 40000],
          labels = [],
          from, to;

    // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
           from = grades[i];
			     to = grades[i + 1];
            labels.push(
        				'<i style="background:' + getColor(from + 1) + '"></i> ' +
        				from + (to ? '&ndash;' + to : '+'));
        		}

        		div.innerHTML = labels.join('</br>');
        		return div;
};

      legend.addTo(map);

        // Test some shit -> check console
        console.log(energy_consumption[0])

    }
}
