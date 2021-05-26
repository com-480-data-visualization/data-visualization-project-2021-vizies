
class Main {

    // Population data 
    // https://appsso.eurostat.ec.europa.eu/nui/submitViewTableAction.do

    mapObject;
    plotObject;

    ParseEnergyData(d) {
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

    ParsePopulationData(d) {
        return {Year: parseInt(d.year),
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
        this.startDate = startDate;
        this.endDate = endDate;

        const data = this.currentData.filter(row => { 
            return row.Date.getTime() >= startDate.getTime() && row.Date.getTime() < endDate.getTime()
        });
        this.mapObject.updateMap(data);
        this.plotObject.updatePlot(data);
    }
    AddCountry(country) {
        this.plotObject.updatePlotAddCountry(country);
    }
    RemoveCountry(country){
        this.plotObject.updatePlotRemoveCountry(country);
    }

    SwitchToCapita() {
        if (this.currentData == this.energy_consumption_capita) {
            this.currentData = this.energy_consumption;
            this.capitaButton.style.backgroundColor = 'transparent'
        } 
        else {
            this.currentData = this.energy_consumption_capita;
            this.capitaButton.style.backgroundColor = '#28AFB0'
        }
        this.UpdateData(this.startDate, this.endDate)
    }

    constructor() {
        const main = this;

        /* ===== CONSTANST ===== */
        const CONSUMPTION_DATA_PATH = 'data/energy_consumption.csv';
        const POPULATION_DATA_PATH = 'data/populations.csv';
        const MAP_DATA_PATH = 'data/europe_map.json';
        const MAP_ID = 'map';
        const GRAPH_ID = 'graph';
        const TIMELINE_ID = 'timeline';

        const energy_consumption_promise = d3.csv(CONSUMPTION_DATA_PATH, this.ParseEnergyData);
        const population_promise = d3.csv(POPULATION_DATA_PATH, this.ParsePopulationData);
        const map_promise = d3.json(MAP_DATA_PATH)

        this.capitaButton = document.getElementById("capita_button")
        this.capitaButton.onclick = function() { main.SwitchToCapita(); };

        Promise.all([energy_consumption_promise, population_promise, map_promise]).then((results) => {
            this.energy_consumption = results[0];
            this.population = results[1];
            this.energy_consumption_capita = this.energy_consumption.map(row => { 
                return capitalMap(row, this.population.filter(d => d.Year == this.energy_consumption[0].Date.getFullYear())[0]);
            });
            let europe_map_data = results[2];

            let dates = this.energy_consumption.map(d => d.Date);
            this.startDate = d3.min(dates);
            this.endDate = d3.max(dates);
            this.currentData = this.energy_consumption;

            this.mapObject = new MapPlot(MAP_ID, this.energy_consumption, europe_map_data, this);
            this.plotObject = new PeriodicPlot(GRAPH_ID, this.energy_consumption);
            new Timeline(TIMELINE_ID, this.energy_consumption, this);
        })

        function capitalMap(row, population) {
            return {Date: row.Date,
                    AT: row.AT / population.AT,
                    BE: row.BE / population.BE,
                    CH: row.CH / population.CH,
                    DE: row.DE / population.DE,
                    DK: row.DK / population.DK,
                    ES: row.ES / population.ES,
                    FR: row.FR / population.FR,
                    GB: row.AT / population.GB,
                    IE: row.IE / population.IE,
                    IT: row.IT / population.IT,
                    LU: row.LU / population.LU,
                    NL: row.NL / population.NL,
                    NO: row.NO / population.NO,
                    PT: row.PT / population.PT,
                    SE: row.SE / population.SE
            };   
        }
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
