
class MapPlot {

    constructor(svg_element_id, energy_consumption, europe_map_data, main) {
        const MapAttributes = this;
        this.energy_consumption = energy_consumption;
        this.europe_map_data = europe_map_data;

        this.map = L.map(svg_element_id, {scrollWheelZoom: false,
          zoomControl: false, dragging:false, doubleClickZoom: false, zoomSnap:0.1}).setView([51, 9]).setZoom(4.3);

        // Draw full map
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(this.map);

        // Unnecessary ?
        this.countries = ["AT", "BE", "CH", "DE", "DK", "ES", "FR", "GB", "IE", "LT", "LU", "NL", "NO", "PT", "SE"];

        this.info = L.control();

        this.info.onAdd = function (map) {
        	this._div = L.DomUtil.create('div', 'info');
        	this.update();
        	return this._div;
        };

        this.info.update = function (feat) {
        	this._div.innerHTML = '<h4>Energy consumption</h4>' +  (feat ?
        		'<b>' + feat.properties.NAME + '</b><br />' + energy_consumption[0][feat.properties.ISO2] + ' MWh '
        		: 'Hover over a state');
        };

        this.info.addTo(this.map);

        // Function to associate energy consumption value with fill in
        function style_country(features) {
            return {
            fillColor: MapAttributes.getColor(MapAttributes.energy_consumption[0][features.properties.ISO2]),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '1',
            fillOpacity: 0.9
            };
        }

        // Function for interaction
        function highlightFeature(e) {
            var layer = e.target;
            MapAttributes.info.update(layer.feature);
            if (storeLayerClicked === null || storeLayerClicked._leaflet_id !== e.target._leaflet_id){
                layer.setStyle({
                    weight: 2,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.9
                });}

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                      layer.bringToFront();
            }
        }

        // Function to highlight countries with mouse cursor
        function resetHighlight(e) {
            if (storeLayerClicked === null || storeLayerClicked._leaflet_id !== e.target._leaflet_id) {
            MapAttributes.geojson.resetStyle(e.target);
        }
            MapAttributes.info.update();
        }

        // Function to send the clicked countries
        function sendCountries(e){
            const layer = e.target;
            main.UpdateData2(e.target.feature.properties.ISO2);
            console.log(e.target.feature.properties.ISO2);

            if (storeLayerClicked !== null) {
                MapAttributes.geojson.resetStyle(layer) // Reset style
            }
            layer.setStyle({
                weight: 2,
                color: '#FF0000',
                dashArray: '',
                fillOpacity: 0.9
            });
            storeLayerClicked = layer;

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                      layer.bringToFront();
            }
        }

        // Main function for highlighting countries and clicking options
        var storeLayerClicked = null;
        function onEachFeature(feature, layer) {
      		layer.on({
                click: sendCountries,
      			mouseover: highlightFeature,
      			mouseout: resetHighlight,
      		});
        }

        // Draw map of countries with energy
        this.geojson = L.geoJson(this.europe_map_data, {
            style: style_country,
            onEachFeature: onEachFeature
        }).addTo(this.map);

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 800, 900, 1000, 2000, 3000, 4000, 5000,
              6000, 7000, 8000, 9000, 10000, 20000, 30000],
          labels = [],
          from, to;

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
            labels.push(
        				'<i style="background:' + MapAttributes.getColor(from + 1) + '"></i> ' +
        				from + (to ? '&ndash;' + to : '+'));
        }

            div.innerHTML = labels.join('</br>');
            return div;
        };

        legend.addTo(this.map);
        // Test some shit -> check console
        //console.log(energy_consumption[0])
    }

    getColor(d) {
          return d > 30000 ? '#340000' :
              d > 25000 ? '#400408' :
              d > 20000 ? '#4c080f' :
              d > 15000 ? '#590f13' :
              d > 10000 ? '#661516' :
              d > 9500  ? '#731c18' :
              d > 9000  ? '#80231a' :
              d > 8500  ? '#8d2b1c' :
              d > 8000  ? '#9a331d' :
              d > 7500  ? '#a73b1e' :
              d > 7000  ? '#b4441f' :
              d > 6500  ? '#c04d1e' :
              d > 6000  ? '#cd561d' :
              d > 5500  ? '#d9601c' :
              d > 5000  ? '#e56a19' :
              d > 4500  ? '#e7751c' :
              d > 4000  ? '#ea7f20' :
              d > 3500  ? '#ec8925' :
              d > 3000  ? '#ee922b' :
              d > 2500  ? '#f09c31' :
              d > 2000  ? '#f2a538' :
              d > 1500  ? '#f4af3f' :
              d > 1000  ? '#f5b847' :
              d > 950   ? '#f7c14f' :
              d > 900   ? '#f9ca58' :
              d > 850   ? '#fad361' :
              d > 800   ? '#fcdc6a' :
              d > 750   ? '#fde474' :
              d > 700   ? '#fee778' :
              d > 650   ? '#ffed7e' :
                  '#f9e1a2';
                      }

    updateMap(start, end) {
            const MapAttributes = this;

        // Get entries from start to end dates
            const data = MapAttributes.energy_consumption.filter(row => { //filter the time
                return row.Date.getTime() >= start.getTime() && row.Date.getTime() < end.getTime()
            });

          // Get months for each entry
            const data_month = data.map(x => ({...x, Month: new Date(x.Date).getMonth()}));

            const count = data_month.length

            const data_sum = data.reduce((acc, cur) => {
                for(var key of Object.keys(cur)){
                    acc[key] = acc[key] + cur[key] || cur[key];
                }
                return acc;
            }, {})

            const data_average = Object.keys(data_sum).reduce((acc, key) => {acc[key] = data_sum[key]/count; return acc; }, {})
            console.log(data_average)

            // For now, plots the first entry in [start, end]
            const data_test = MapAttributes.energy_consumption.filter(row => { //filter the time
                return row.Date.getTime() >= start.getTime() && row.Date.getTime() <= start.getTime()
            });

            function country_style(feat) {
                    return {
                        fillColor: MapAttributes.getColor(data_average[feat.properties.ISO2]),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '1',
                        fillOpacity: 0.9
                    }
            }
            this.geojson.setStyle(country_style);
        }
}
