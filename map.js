const UN_SELECTED_BORDER_COLOR = 'white';
const HOVER_BORDER_COLOR = '#666';

/*
* Class containing drawing and functionality of the map. 
* Created by a leaflet map.
*/
class MapPlot {

    // Default style when unselected and unhovered
    defaultStyle = {
        weight: 2,
        opacity: 1,
        color: UN_SELECTED_BORDER_COLOR,
        dashArray: '1',
        fillOpacity: 0.9,
        };

    // Get max of the current data
    getMaxOfData() {
        return Math.max(this.data.AT, this.data.BE, this.data.CH, this.data.DE, this.data.DK,
                        this.data.ES, this.data.FR, this.data.GB, this.data.IE, this.data.IT,
                        this.data.LU, this.data.NL, this.data.NO, this.data.PT, this.data.SE);
    };

    // Get min of the current data
    getMinOfData() {
        return Math.min(this.data.AT, this.data.BE, this.data.CH, this.data.DE, this.data.DK,
                        this.data.ES, this.data.FR, this.data.GB, this.data.IE, this.data.IT,
                        this.data.LU, this.data.NL, this.data.NO, this.data.PT, this.data.SE);
    };

    // Update current data, min, max and color scale, given new data.
    updateData(data) {
        const count = data.length;
        const data_sum = data.reduce((acc, cur) => {
            for(var key of Object.keys(cur)){
                acc[key] = acc[key] + cur[key] || cur[key];
            }
            return acc;
        }, {})

        this.data = Object.keys(data_sum).reduce((acc, key) => {acc[key] = data_sum[key]/count; return acc; }, {});
        this.dataMax = this.getMaxOfData();
        this.dataMin = this.getMinOfData();
        this.colorScale.domain([this.dataMin, (this.dataMin + this.dataMax)/2, this.dataMax])
    };

    // Used for the information squares, gets rounded values based on the maximum of data.
    getRoundedValue(value) {
        if (this.dataMax > 10000){
            return Math.round(value/100)*100;
        }
        else if(this.dataMax > 1000){
            return Math.round(value/10)*10;
        }
        else {
            return Math.round(value*100000)/100000;
        }
    }

    // Add a new square in the right corner displaying what each color represents.
    addColorInfo() {
        const MapAttributes = this;
        const N = 10; // Number of squares

        MapAttributes.legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                                labels = [],
                                from, to;

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < N; i++) {
                from = MapAttributes.getRoundedValue(MapAttributes.dataMin + i*(MapAttributes.dataMax-MapAttributes.dataMin)/N);
                to = MapAttributes.getRoundedValue(MapAttributes.dataMin + (i+1)*(MapAttributes.dataMax-MapAttributes.dataMin)/N);
                labels.push('<i style="background:' + MapAttributes.colorScale(from) + '"></i> ' +
                            from + (to ? '&ndash;' + to : '+'));
            }

            div.innerHTML = labels.join('</br>');
            return div;
        };

        this.legend.addTo(this.map);
    };

    // Add a new square at the top right corner displaying the consumption of the highlighted country.
    addTopRightInfo() {
        const MapAttributes = this;
        MapAttributes.info.onAdd = function (map) {
        	this._div = L.DomUtil.create('div', 'info');
        	this.update();
        	return this._div;
        };

        MapAttributes.info.update = function (feat) {
        	this._div.innerHTML = '<h4>Energy consumption</h4>' +  (feat ?
        		'<b>' + feat.properties.NAME + '</b><br />' + 
                MapAttributes.getRoundedValue(MapAttributes.data[feat.properties.ISO2]) + ' MWh '
        		: 'Hover over a country');
        };

        MapAttributes.info.addTo(MapAttributes.map);
    }

    constructor(svg_element_id, energy_consumption, europe_map_data, main) {
        const MapAttributes = this;
        var selectedCountries = [];
        
        this.colorScale = d3.scaleLinear()
                            .domain([0, 1, 2])
                            .range(['#ffed7e', '#f09c31', '#4c080f']);
        this.updateData(energy_consumption);
        
        // Create leaflet map
        this.map = L.map(svg_element_id, { scrollWheelZoom: false,
                                           zoomControl: false,
                                           dragging:false,
                                           doubleClickZoom: false,
                                           zoomSnap:0.1
                                        }).setView([51, 9]).setZoom(4.3);
        
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

        this.legend = L.control({position: 'bottomright'});
        this.addColorInfo();

        this.info = L.control();
        this.addTopRightInfo();

        // Function to associate energy consumption value with fill in color
        function style_country(feat) {
            var style = MapAttributes.defaultStyle;
            style.fillColor = MapAttributes.colorScale(MapAttributes.data[feat.properties.ISO2]);
            return style;
        }

        // Function for mouseover interaction
        function highlightCountry(e) {
            var layer = e.target;
            MapAttributes.info.update(layer.feature);

            // Change the style with mouseover only if was not selected before by click action
            if (!(selectedCountries.includes(layer._leaflet_id))){
                layer.setStyle({color: HOVER_BORDER_COLOR});
            }
        }

        // Function to reset style countries when mouse off the country
        function unHighlightCountry(e) {
            var layer = e.target;

            if (!(selectedCountries.includes(layer._leaflet_id))) {
                layer.setStyle({color: UN_SELECTED_BORDER_COLOR});
            }
            MapAttributes.info.update();
        }

        // Function to send the clicked countries
        function selectCountry(e){
            const layer = e.target;

            if (selectedCountries.includes(layer._leaflet_id)) {
                layer.setStyle({color: HOVER_BORDER_COLOR});
                const index = selectedCountries.indexOf(layer._leaflet_id);
                if (index > -1) {
                    selectedCountries.splice(index, 1);
                };   
                main.DeselectCountry(layer.feature.properties.ISO2);
            }
            else {
                layer.setStyle({color: color_func[layer.feature.properties.ISO2]});
                selectedCountries.push(layer._leaflet_id);
                main.SelectCountry(layer.feature.properties.ISO2);
            }
        }

        // Main function for highlighting countries and clicking options
        function onEachFeature(feature, layer) {
      		layer.on({
                click: selectCountry,
      			mouseover: highlightCountry,
      			mouseout: unHighlightCountry,
      		});

            // Some browsers need the country to move forwards to display border.
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.on({
                    click: (e) => e.target.bringToFront(),
                    mouseover: (e) => e.target.bringToFront(),
                  });
            }
        }

        // Draw map of countries with color
        this.geojson = L.geoJson(europe_map_data, {
            style: style_country,
            onEachFeature: onEachFeature
        }).addTo(this.map);
    }

    // Called from the main function with the new data that should be displayed on map.
    updateMap(data) {
        this.updateData(data);

        this.geojson.setStyle((feat) =>{ return {fillColor: this.colorScale(this.data[feat.properties.ISO2])}; });

        this.map.removeControl(this.legend);
        this.addColorInfo();

        this.map.removeControl(this.info);
        this.addTopRightInfo();
    }
}
