
class MapPlot {

    // Default style when unselected and unhovered
    defaultStyle = {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9,
        };

    // border style for when mouse hover over country
    hoverStyle = {
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9
    }

    // style for selected country
    selectedStyle = {
        weight: 2,
        dashArray: '',
        fillOpacity: 0.9
    }

    constructor(svg_element_id, energy_consumption, europe_map_data, main) {
        const MapAttributes = this;
        this.energy_consumption = energy_consumption;
        this.europe_map_data = europe_map_data;

        this.map = L.map(svg_element_id, {scrollWheelZoom: false,
            zoomControl: false, dragging:false, doubleClickZoom: false, zoomSnap:0.1}).setView([51, 9]).setZoom(4.3);

        var selectedCountries = [];
        const color_func = {AT: "#1f77b4",
                        BE: "#ff7f0e",
                        CH: "#2ca02c",
                        DE: "#d62728",
                        DK: "#9467bd",
                        ES: "#8c564b",
                        FR: "#e377c2",
                        GB: "#7f7f7f",
                        IE: "#bcbd22",
                        IT: "#17becf",
                        LU: "#1f77b4",
                        NL: "#ff7f0e",
                        NO: "#2ca02c",
                        PT: "#d62728",
                        SE: "#9467bd"};

        // Draw full map
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(this.map);

        this.countries = ["AT", "BE", "CH", "DE", "DK", "ES", "FR", "GB", "IE", "LT", "LU", "NL", "NO", "PT", "SE"];

        this.info = L.control();

        this.info.onAdd = function (map) {
        	this._div = L.DomUtil.create('div', 'info');
        	this.update();
        	return this._div;
        };


        // Copy energy_consumption to remove dates and get true maximum value
        var energy_copy = JSON.parse(JSON.stringify(energy_consumption));
        delete energy_copy[0]['Date'];

        // Get the minimum and maximum values
        const minimum = Math.min(...Object.values(energy_copy[0]));
        const maximum = Math.max(...Object.values(energy_copy[0]));

        this.info.update = function (feat) {
        	this._div.innerHTML = '<h4>Energy consumption</h4>' +  (feat ?
        		'<b>' + feat.properties.NAME + '</b><br />' + MapAttributes.energy_consumption[0][feat.properties.ISO2] + ' MWh '
        		: 'Hover over a state');
        };

        this.info.addTo(this.map);


        // Function to associate energy consumption value with fill in color
        function style_country(features) {
            var style = MapAttributes.defaultStyle;
            style.fillColor = MapAttributes.getColorScale(MapAttributes.energy_consumption[0][features.properties.ISO2],
                minimum, maximum);
            return style;
        }

        // Function for mouseover interaction
        function highlightFeature(e) {
            var layer = e.target;
            MapAttributes.info.update(layer.feature);

            // Change the style with mouseover only if was not selected before by click action
            if (!(selectedCountries.includes(layer._leaflet_id))){
                layer.setStyle(MapAttributes.hoverStyle);
            }
        }

        // Function to reset style countries when mouse off the country
        function resetHighlight(e) {
            if (!(selectedCountries.includes(e.target._leaflet_id))) {
                MapAttributes.geojson.resetStyle(e.target);
            }
            MapAttributes.info.update();
        }

        // Function to send the clicked countries
        function sendCountries(e){
            const layer = e.target;

            if (selectedCountries.includes(layer._leaflet_id)) {
                MapAttributes.geojson.resetStyle(layer)
                const index = selectedCountries.indexOf(layer._leaflet_id);
                if (index > -1) {
                    selectedCountries.splice(index, 1);
                };   
                main.RemoveCountry(layer.feature.properties.ISO2)
            }
            else {
                var color = color_func[layer.feature.properties.ISO2];
                var style = MapAttributes.selectedStyle;
                style.color = color;
                layer.setStyle(style);
                selectedCountries.push(layer._leaflet_id);
                main.AddCountry(layer.feature.properties.ISO2, color);
            }
        }

        function bringLayerFront(e) {
            e.target.bringToFront();
        }

        // Main function for highlighting countries and clicking options
        function onEachFeature(feature, layer) {
      		layer.on({
                click: sendCountries,
      			mouseover: highlightFeature,
      			mouseout: resetHighlight,
      		});

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.on({
                    click: bringLayerFront,
                    mouseover: bringLayerFront,
                  });
            }
        }

        // Draw map of countries with energy
        this.geojson = L.geoJson(this.europe_map_data, {
            style: style_country,
            onEachFeature: onEachFeature
        }).addTo(this.map);

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {
            const N = 10; // Number of squares
            grades = [];
            for (var j = 0; j <= N; j++) {
                // Logarithmic scale: grades.push(Math.round(minimum*((maximum/minimum)**(j/N))/100)*100);
                grades.push(Math.round((minimum+j*(maximum-minimum)/N)/100)*100)
            };

        var div = L.DomUtil.create('div', 'info legend'),
          grades,
          labels = [],
          from, to;

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
            labels.push(
        				'<i style="background:' + MapAttributes.getColorScale(from + 1, minimum, maximum) + '"></i> ' +
        				from + (to ? '&ndash;' + to : '+'));
        }

            div.innerHTML = labels.join('</br>');
            return div;
        };

        legend.addTo(this.map);
    }

    getColorScale(d, min, max) {
        // Minimum value, (min+max)/2, maximum value
        let linearScale = d3.scaleLinear()
                        .domain([min, (min+max)/2, max])
                        .range(['#ffed7e', '#f09c31', '#4c080f']);
        return linearScale(d)
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

    updateMap(data) {
            const MapAttributes = this;

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

            // Get minimum and maximum values for color scale
            const minimum = Math.min(...Object.values(data_average));
            const maximum = Math.max(...Object.values(data_average));
            

            function country_style(feat) {
                    return { fillColor: MapAttributes.getColorScale(data_average[feat.properties.ISO2], minimum, maximum)};
            }
            this.geojson.setStyle(country_style);
        }
}
