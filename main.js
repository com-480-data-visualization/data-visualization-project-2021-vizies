
class Main {

    mapObject;
    plotObject;

    ParseData(d) {
        return {Date : new Date(d.DATE),
                AT: parseInt(d.at),
                BE: parseInt(d.be),
                CH: parseInt(d.ch),
                DE: parseInt(d.de),
                DK: parseInt(d.dk),
                ES: parseInt(d.es),
                FR: parseInt(d.fr),
                GB: parseInt(d.gb),
                IE: parseInt(d.ie),
                IT: parseInt(d.it),
                LU: parseInt(d.lu),
                NL: parseInt(d.nl),
                NO: parseInt(d.no),
                PT: parseInt(d.pt),
                SE: parseInt(d.se)
        }
    }

    UpdateData(startDate, endDate) {
        this.mapObject.updateMap(startDate, endDate);
        //this.plotObject.updatePlot(startDate, endDate);
    }
    AddCountry(country) {
        //this.plotObject.updatePlot(country);
    }
    RemoveCountry(country){
        //this.plotObject.updatePlot(country);
    }

    constructor() {
        /* ===== CONSTANST ===== */
        const CONSUMPTION_DATA_PATH = 'data/energy_consumption.csv';
        const MAP_DATA_PATH = 'data/europe_map.json';
        const MAP_ID = 'map';
        const GRAPH_ID = 'graph';
        const TIMELINE_ID = 'timeline';

        const energy_consumption_promise = d3.csv(CONSUMPTION_DATA_PATH, this.ParseData);

        const map_promise = d3.json(MAP_DATA_PATH)

        Promise.all([energy_consumption_promise,map_promise]).then((results) => {
            let energy_consumption = results[0];
            let europe_map_data = results[1];

            this.mapObject = new MapPlot(MAP_ID, energy_consumption, europe_map_data, this);
            this.plotObject = new PeriodicPlot(GRAPH_ID, energy_consumption);
            new Timeline(TIMELINE_ID, energy_consumption, this);
        })
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
    new Main();
});
