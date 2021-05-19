
class MapPlot {

    constructor(svg_element_id, energy_consumption, europe_map_data) {
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

        // Unnecessary
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
            fillOpacity: 0.7
            };
        }

        // Function for interaction
        function highlightFeature(e) {
            var layer = e.target;
            MapAttributes.info.update(layer.feature);

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

        // Function to highlight countries with mouse cursor
        function resetHighlight(e) {
            MapAttributes.geojson.resetStyle(e.target);
            MapAttributes.info.update();
        }

        // Main function for highlighting countries and clicking options
        function onEachFeature(feature, layer) {
      		layer.on({
      			mouseover: highlightFeature,
      			mouseout: resetHighlight
            //click: definefunction related to the plot!
      		});
        }

        // Draw map of countries with energy
        this.geojson = L.geoJson(europe_map_data, {
            style: style_country,
            onEachFeature: onEachFeature
        }).addTo(this.map);

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
        				'<i style="background:' + MapAttributes.getColor(from + 1) + '"></i> ' +
        				from + (to ? '&ndash;' + to : '+'));
        }

            div.innerHTML = labels.join('</br>');
            return div;
        };

        legend.addTo(this.map);

        // Test some shit -> check console
        console.log(energy_consumption[0])
    }

    getColor(d) {
          return d > 40000 ? '#900000' :
            d > 20000  ? '#AC2308' :
            d > 10000  ? '#C84610' :
            d > 5000  ? '#E56A19' :
            d > 2000   ? '#E98218' :
            d > 1000   ? '#ED9B18' :
            d > 500   ? '#F1B416' :
                        '#F1CD5C';
                      }

    updateMap(start, end) {

        // Get entries from start to end dates
            const data = this.energy_consumption.filter(row => { //filter the time
                return row.Date.getTime() >= start.getTime() && row.Date.getTime() < end.getTime()
            });

          // Get months for each entry
            const data_month = data.map(x => ({...x, month: new Date(x.Date).getMonth()}));

            let data_average = [];
            // Computes the sum for each month
            const data_month_sum = data_month.reduce((acc, cur) => {
                acc[cur.day] = acc[cur.day] + cur.value || cur.value; // increment or initialize to cur.value
                return acc;
            }, {});

            // For now, plots the first entry in [start, end]
            const data_test = this.energy_consumption.filter(row => { //filter the time
                return row.Date.getTime() >= start.getTime() && row.Date.getTime() <= start.getTime()
            });
            console.log(data_test)
            this.geojson.setStyle( {fillColor: this.getColor(data_test[0][this.europe_map_data.features.properties.ISO2]),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '1',
                fillOpacity: 0.7});
        }
}
