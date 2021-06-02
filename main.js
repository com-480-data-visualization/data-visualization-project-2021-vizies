/* ===== CONSTANTS ===== */
// Data paths
const CONSUMPTION_DATA_PATH = 'data/energy_consumption.csv';
const POPULATION_DATA_PATH = 'data/populations.csv';
const GDP_DATA_PATH = "data/GDPs.csv";
const GREENHOUSEGAZ_DATA_PATH = 'data/green_house_gaz_for_nrj.csv';
const MAP_DATA_PATH = 'data/europe_map.json';

// HTML ID:s
const MAP_ID = 'map';
const GRAPH_ID = 'graph';
const TIMELINE_ID = 'timeline';
const CAPITA_BUTTON_ID = 'capita_button';
const GDP_BUTTON_ID = 'GDP_button';
const GREEN_BUTTON_ID = 'green_house_gaz_button';

// Button colors
const UN_SELECTED_COLOR = 'transparent';
const SELECTED_COLOR = '#98DFEA';
const HOVER_COLOR = '#ADFCF9';

/*
* Main class that creates all smaller classes and handles communication between clases.
*/
class Main {
    // Population data 
    // https://appsso.eurostat.ec.europa.eu/nui/submitViewTableAction.do

    // Parses used for all csv files.
    ParseData(d) {
        return {Date : new Date(d.DATE),
                Year: parseInt(d.year),
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

    // Given a start and end date update the data and send the new data to the map and plot.
    UpdateData(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;

        const data = this.currentData.filter(row => { 
            return row.Date.getTime() >= startDate.getTime() && row.Date.getTime() < endDate.getTime()
        });
        this.mapObject.updateMap(data);
        this.plotObject.updatePlot(data);
    }

    // Function called when selected a country on the map
    SelectCountry(country) {
        this.plotObject.updatePlotAddCountry(country);
    }

    // Called when de selecting country on the map.
    DeselectCountry(country){
        this.plotObject.updatePlotRemoveCountry(country);
    }

    // Called to update the timescale on the plot.
    UpdateTimeScale(time_scale) {
        this.plotObject.updatePlotTimeScale(time_scale)
    }

    // Called when pressing one of the normalization buttons. 
    // Sets correct colors on buttons and updating the displayed data.
    ClickNormalizeButton(normalizeButton) {
        if (normalizeButton.isSelected()) {
            this.UnSelectAllNormalizeButtons();
            this.currentData = this.energy_consumption;
        }
        else {
            this.UnSelectAllNormalizeButtons();
            normalizeButton.select();
            this.currentData = normalizeButton.getData();
        }
        this.UpdateData(this.startDate, this.endDate);
    }

    // Deselects all normalization buttons, resetting their color.
    UnSelectAllNormalizeButtons() {
        this.capitaButton.deSelect();
        this.gdpButton.deSelect();
        this.greenButton.deSelect();
    }

    // Called when one of the plot time scale buttons is pressed, selects correct button and updates time scale.
    ClickPlotTimeScaleButton(timeScaleButton) {
        this.monthButton.deSelect();
        this.dayButton.deSelect();
        this.hoursButton.deSelect();
        timeScaleButton.select();

        this.UpdateTimeScale(timeScaleButton.getScaling());
    }

    constructor() {
        const main = this;

        // Promises for all data
        const energy_consumption_promise = d3.csv(CONSUMPTION_DATA_PATH, this.ParseData);
        const population_promise = d3.csv(POPULATION_DATA_PATH, this.ParseData);
        const GDP_promise = d3.csv(GDP_DATA_PATH, this.ParseData);
        const greeHourseGaze_promise = d3.csv(GREENHOUSEGAZ_DATA_PATH, this.ParseData);
        const map_promise = d3.json(MAP_DATA_PATH)

        // Setup circular plot time scale buttons.
        this.monthButton = new TimeScaleButton(main, document.getElementById('month_button'), 'Month')
        this.dayButton = new TimeScaleButton(main, document.getElementById('day_button'), 'Day')
        this.hoursButton = new TimeScaleButton(main, document.getElementById('hours_button'), 'Hours')

        // After promise.
        Promise.all([energy_consumption_promise, population_promise, GDP_promise, greeHourseGaze_promise, map_promise]).then((results) => {
            this.energy_consumption = results[0];

            // Setup energy per capita
            const energy_consumption_capita = normalizeData(this.energy_consumption, results[1]);
            this.capitaButton = new NormalizeButton(this, energy_consumption_capita, document.getElementById(CAPITA_BUTTON_ID));

            // Setup energy per GDP
            const energy_consumption_GDP = normalizeData(this.energy_consumption, results[2]);
            this.gdpButton = new NormalizeButton(this, energy_consumption_GDP, document.getElementById(GDP_BUTTON_ID));

            // Setup energy based on green house gaz
            const energy_consumption_green_house_gaz = normalizeData(this.energy_consumption, results[3]);
            this.greenButton = new NormalizeButton(this, energy_consumption_green_house_gaz, document.getElementById(GREEN_BUTTON_ID));

            let europe_map_data = results[4];

            // Set the dates.
            let dates = this.energy_consumption.map(d => d.Date);
            this.startDate = d3.min(dates);
            this.endDate = d3.max(dates);
            this.currentData = this.energy_consumption;

            // Create all plots and timeline.
            this.mapObject = new MapPlot(MAP_ID, this.energy_consumption, europe_map_data, this);
            this.plotObject = new PeriodicPlot(GRAPH_ID, this.energy_consumption);
            main.ClickPlotTimeScaleButton(this.monthButton);
            new Timeline(TIMELINE_ID, this.energy_consumption, this);
        })

        // Normalize given data based on a given normalize data, if value is missing use the latest.
        function normalizeData(dataToNormalize, normalizeData) {
            return dataToNormalize.map(row => {
                let normalizer = normalizeData.filter(d => d.Year == row.Date.getFullYear())[0];
                if (normalizer == null) {
                    normalizer = normalizeData[normalizeData.length -1];
                }
                return mapNormalizer(row, normalizer);
            });
        }

        // Mapper used to normalize the energy consumption data based on a given normalizer
        function mapNormalizer(row, normalizer) {
            return {Date: row.Date,
                    AT: row.AT / normalizer.AT,
                    BE: row.BE / normalizer.BE,
                    CH: row.CH / normalizer.CH,
                    DE: row.DE / normalizer.DE,
                    DK: row.DK / normalizer.DK,
                    ES: row.ES / normalizer.ES,
                    FR: row.FR / normalizer.FR,
                    GB: row.AT / normalizer.GB,
                    IE: row.IE / normalizer.IE,
                    IT: row.IT / normalizer.IT,
                    LU: row.LU / normalizer.LU,
                    NL: row.NL / normalizer.NL,
                    NO: row.NO / normalizer.NO,
                    PT: row.PT / normalizer.PT,
                    SE: row.SE / normalizer.SE
            };   
        }
    }
}

/*
* Class for nomralization buttons, hold the actual button and the normalization data.
*/
class NormalizeButton {
    // To check if button is selected.
    isSelected() {
        return this.selected;
    }

    // Select button
    select() {
        this.selected = true;
        this.button.style.backgroundColor = SELECTED_COLOR;
    }

    // Deselect button
    deSelect() {
        this.selected = false;
        this.button.style.backgroundColor = UN_SELECTED_COLOR;
    }

    // Gets the normalization data for this button.
    getData() {
        return this.data;
    }

    constructor(main, data, button) {
        const self = this;
        this.data = data;
        this.button = button;
        this.selected = false;

        this.button.onclick = function() { main.ClickNormalizeButton(self); };
        this.button.onmouseover = function() { this.style.backgroundColor = HOVER_COLOR; };
        this.button.onmouseout = function() { this.style.backgroundColor = self.selected ? SELECTED_COLOR : UN_SELECTED_COLOR; };
    }
}

/*
* Class for time scale buttons, holds the scale that should be changed to when pressed.
*/
class TimeScaleButton {
    // Get the scaling this button represents.
    getScaling() {
        return this.scaling;
    }
    
    // Select button
    select() {
        this.selected = true;
        this.button.style.backgroundColor = SELECTED_COLOR;
    }

    // Deselect button
    deSelect() {
        this.selected = false;
        this.button.style.backgroundColor = UN_SELECTED_COLOR;
    }

    constructor(main, button, scaling) {
        const self = this;
        this.button = button;
        this.selected = false;
        this.scaling = scaling;

        this.button.onclick = function() { main.ClickPlotTimeScaleButton(self); };
        this.button.onmouseover = function() { this.style.backgroundColor = HOVER_COLOR; };
        this.button.onmouseout = function() { this.style.backgroundColor = self.selected ? SELECTED_COLOR : UN_SELECTED_COLOR; };
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
