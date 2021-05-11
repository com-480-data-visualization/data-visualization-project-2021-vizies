
class MapPlot {

    constructor(svg_element_id, energy_consumption, europe_map_data) {

        var map = L.map(svg_element_id).setView([49.65, 4.922], 4);

        // Draw full map
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);

        // Draw map of countries with energy
        var geojson = L.geoJson(europe_map_data, {
            style: function(feature) {
                switch (feature.properties.FIPS) {
                    case 'SW' : return {color: "blue",
                                        fillColor: "#FF9933",
                                        weight: 2};
                    case 'AU' : return {color: "green",
                                        fillColor: "yellow",
                                        weight: 2};
                    case 'BE' : return {color: "yellow",
                                        weight: 0.5};
                    case 'PL' : return {color: "yellow",
                                        weight: 0.5};
                    default : return {color: "#FF9933",
                                    weight: 0.5};
                }
            }
        }).addTo(map);
    }
}