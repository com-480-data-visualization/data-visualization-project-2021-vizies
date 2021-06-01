
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

    // border style for when mouse off countries
    offStyle = {
        weight: 2,
        color: 'white',
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
        const color_func = {AT: "#FF0000",
                        BE: "#FF8000",
                        CH: "#FFFF00",
                        DE: "#33ff00",
                        DK: "#2243B6",
                        ES: "#5DADEC",
                        FR: "#9C51B6",
                        GB: "#A83731",
                        IE: "#AF6E4D",
                        IT: "#E936A7",
                        LU: "#00ffe1",
                        NL: "#ff0099",
                        NO: "#1d8000",
                        PT: "#694600",
                        SE: "#652c77"};

        // Draw full map
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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
            var layer = e.target;

            if (!(selectedCountries.includes(layer._leaflet_id))) {
                layer.setStyle(MapAttributes.offStyle);
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
                main.DeSelectCountry(layer.feature.properties.ISO2)
            }
            else {
                var color = color_func[layer.feature.properties.ISO2];
                var style = MapAttributes.selectedStyle;
                style.color = color;
                layer.setStyle(style);
                selectedCountries.push(layer._leaflet_id);
                main.SelectCountry(layer.feature.properties.ISO2);
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

        this.legend = L.control({position: 'bottomright'});

        this.legend.onAdd = function (map) {
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
        				'<i style="background:' + MapAttributes.getColorScale(from, minimum, maximum) + '"></i> ' +
        				from + (to ? '&ndash;' + to : '+'));
        }

            div.innerHTML = labels.join('</br>');
            return div;
        };

        this.legend.addTo(this.map);
    }

    getColorScale(d, min, max) {
        let linearScale = d3.scaleLinear()
                        .domain([min, (min+max)/2, max])
                        .range(['#ffed7e', '#f09c31', '#4c080f']);
        return linearScale(d)
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
            var energy_copy = JSON.parse(JSON.stringify(data_average));
            for(var z = 0; z <energy_copy.length; z++) {
                delete energy_copy[z]['Date'];
            }
            const minimum = Math.min(...Object.values(energy_copy));
            const maximum = Math.max(...Object.values(energy_copy));

            function country_style(feat) {
                    return { fillColor: MapAttributes.getColorScale(data_average[feat.properties.ISO2], minimum, maximum)};
            }
            this.geojson.setStyle(country_style);
            MapAttributes.updateLegend(energy_copy);
        }

        updateLegend(data) {
        const MapAttributes = this;
        const minimum = Math.min(...Object.values(data));
        const maximum = Math.max(...Object.values(data));

        MapAttributes.map.removeControl(MapAttributes.legend);

        MapAttributes.legend = L.control({position: 'bottomright'});

        MapAttributes.legend.onAdd = function (map) {
            const N = 10; // Number of squares
            grades = [];
            for (var j = 0; j <= N; j++) {
                // Logarithmic scale: grades.push(Math.round(minimum*((maximum/minimum)**(j/N))/100)*100);

                if (maximum > 10000){
                    // If the maximum value is very large, round values to hundreds
                    grades.push(Math.round((minimum+j*(maximum-minimum)/N)/100)*100)}
                else if (maximum > 1000){
                    // If the maximum value is medium, round values to tens
                    grades.push(Math.round((minimum+j*(maximum-minimum)/N)/10)*10)}
                else {
                    // If the maximum value is small, round values to 10e-5
                    grades.push(Math.round((minimum+j*(maximum-minimum)/N)*10000)/10000)}
            }

            var div = L.DomUtil.create('div', 'info legend'),
            grades,
            labels = [],
            from, to;

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];
                labels.push(
        				'<i style="background:' + MapAttributes.getColorScale(from, minimum, maximum) + '"></i> ' +
        				from + (to ? '&ndash;' + to : '+'));
            }

            div.innerHTML = labels.join('</br>');
            return div;
        };

        MapAttributes.legend.addTo(this.map);
        }
}
