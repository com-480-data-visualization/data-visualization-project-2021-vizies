
function test_plot(){
    console.log('TEST1')

   var map = L.map('map').setView([49.65, 4.922], 4);

   // Draw full map
   L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    console.log(EuropeStatesData)

    // Draw map of countries with energy
    var geojson = L.geoJson(EuropeStatesData, {
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
    }).addTo(map).on('click', onClick);;


    function onClick() {
        console.log("Click")
    }
}


function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
    test_plot();
	//plot_object = new MapPlot('map-plot');
	// plot object is global, you can inspect it in the dev-console
});
