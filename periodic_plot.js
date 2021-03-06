
class PeriodicPlot {

    constructor(svg_element_id, energy_consumption) {

		const max = Math.max;
		const sin = Math.sin;
		const cos = Math.cos;
		const HALF_PI = Math.PI / 2;

		this.data = energy_consumption;
		this.country_list =[];
		this.empty_list = true;
		this.time_scale = "Month";



		const RadarChart = function RadarChart(parent_selector, data, options) {


			    /////////////////////////////////////////////////////////
		    	////////// Inspired from the Radar Chart FUnction////////
		    	/// Inspired by the code of alangrafu and Nadieh Bremer//
				/////////////////////////////////////////////////////////

			//Wraps SVG text
			const wrap = (text, width) => {
			  text.each(function() {
					var text = d3.select(this),
						words = text.text().split(/\s+/).reverse(),
						word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.4, // ems
						y = text.attr("y"),
						x = text.attr("x"),
						dy = parseFloat(text.attr("dy")),
						tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

					while (word = words.pop()) {
					  line.push(word);
					  tspan.text(line.join(" "));
					  if (tspan.node().getComputedTextLength() > width) {
							line.pop();
							tspan.text(line.join(" "));
							line = [word];
							tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					  }
					}
			  });
			}//wrap

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

			const cfg = {
			 w: 600,				//Width of the circle
			 h: 600,				//Height of the circle
			 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
			 levels: 3,				//How many levels or inner circles should there be drawn
			 maxValue: 0, 			//What is the value that the biggest circle will represent
			 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
			 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
			 opacityArea: 0.35, 	//The opacity of the area of the blob
			 dotRadius: 4, 			//The size of the colored circles of each blog
			 opacityCircles: 0.1, 	//The opacity of the circles of each blob
			 strokeWidth: 2, 		//The width of the stroke around each blob
			 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
			 color: color_func,	//Color function,
			 format: '.2%',
			 unit: 'MW', // Add MW per capita!!
			 legend: false // COuld display country names using this
			};

			//Put all of the options into a variable called cfg
			if('undefined' !== typeof options){
			  for(var i in options){
				if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
			  }//for i
			}//if

			//If the supplied maxValue is smaller than the actual one, replace by the max in the data
			let maxValue = 0;
			for (let j=0; j < data.length; j++) {
				for (let i = 0; i < data[j].axes.length; i++) {
					data[j].axes[i]['id'] = data[j].name;
					if (data[j].axes[i]['value'] > maxValue) {
						maxValue = data[j].axes[i]['value'];
					}
				}
			}
			maxValue = max(cfg.maxValue, maxValue);

			const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
				total = allAxis.length,					//The number of different axes
				radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
				Format = d3.format(cfg.format),			 	//Formatting
				angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

			//Scale for the radius
			const rScale = d3.scaleLinear()
				.range([0, radius])
				.domain([0, maxValue]);

			/////////////////////////////////////////////////////////
			//////////// Create the container SVG and g /////////////
			/////////////////////////////////////////////////////////
			document.getElementById("directions").style.display = "none";

			const parent = d3.select(parent_selector);

			//Remove whatever chart with the same id/class was present before
			parent.select("svg").remove();

			//Initiate the radar chart SVG
			let svg = parent.append("svg")
					.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
					.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
					.attr("class", "radar");

			//Append a g element
			let g = svg.append("g")
					.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

			/////////////////////////////////////////////////////////
			///////////////////// Glow filter ///////////////////////
			/////////////////////////////////////////////////////////

			//Filter for the outside glow
			let filter = g.append('defs').append('filter').attr('id','glow'),
				//feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
				feMerge = filter.append('feMerge'),
				feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
				feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

			/////////////////////////////////////////////////////////
			/////////////// Draw the Circular grid //////////////////
			/////////////////////////////////////////////////////////

			//Wrapper for the grid & axes
			let axisGrid = g.append("g").attr("class", "axisWrapper");

			//Draw the background circles
			axisGrid.selectAll(".levels")
			   .data(d3.range(1,(cfg.levels+1)).reverse())
			   .enter()
				.append("circle")
				.attr("class", "gridCircle")
				.attr("r", d => radius / cfg.levels * d)
				.style("fill", "#CDCDCD")
				.style("stroke", "#CDCDCD")
				.style("fill-opacity", cfg.opacityCircles)
				.style("filter" , "url(#glow)");

			//Text indicating at what % each level is
			axisGrid.selectAll(".axisLabel")
			   .data(d3.range(1,(cfg.levels+1)).reverse())
			   .enter().append("text")
			   .attr("class", "axisLabel")
			   .attr("x", 4)
			   .attr("y", d => -d * radius / cfg.levels)
			   .attr("dy", "0.4em")
			   .style("font-size", "10px")
			   .attr("fill", "#737373")
			   .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

			/////////////////////////////////////////////////////////
			//////////////////// Draw the axes //////////////////////
			/////////////////////////////////////////////////////////

			//Create the straight lines radiating outward from the center
			var axis = axisGrid.selectAll(".axis")
				.data(allAxis)
				.enter()
				.append("g")
				.attr("class", "axis");
			//Append the lines
			axis.append("line")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", (d, i) => rScale(maxValue *1.1) * cos(angleSlice * i - HALF_PI))
				.attr("y2", (d, i) => rScale(maxValue* 1.1) * sin(angleSlice * i - HALF_PI))
				.attr("class", "line")
				.style("stroke", "white")
				.style("stroke-width", "2px");

			//Append the labels at each axis
			axis.append("text")
				.attr("class", "legend")
				.style("font-size", "11px")
				.attr("text-anchor", "middle")
				.attr("dy", "0.35em")
				.attr("x", (d,i) => rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI))
				.attr("y", (d,i) => rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
				.text(d => d)
				.call(wrap, cfg.wrapWidth);

			/////////////////////////////////////////////////////////
			///////////// Draw the radar chart blobs ////////////////
			/////////////////////////////////////////////////////////

			//The radial line function
			const radarLine = d3.radialLine()
				.curve(d3.curveLinearClosed)
				.radius(d => rScale(d.value))
				.angle((d,i) => {return i * angleSlice});

			if(cfg.roundStrokes) {
				radarLine.curve(d3.curveCardinalClosed)
			}

			//Create a wrapper for the blobs
			const blobWrapper = g.selectAll(".radarWrapper")
				.data(data)
				.enter().append("g")
				.attr("class", "radarWrapper");

			//Create the outlines
			blobWrapper.append("path")
				.attr("class", "radarStroke")
				.attr("d", function(d,i) { return radarLine(d.axes); })
				.style("stroke-width", cfg.strokeWidth + "px")
				.style("stroke", (d,i) => color_func[d.name])
				.style("fill", "none")
				.style("filter" , "url(#glow)");

			//Append the circles
			blobWrapper.selectAll(".radarCircle")
				.data(d => d.axes)
				.enter()
				.append("circle")
				.attr("class", "radarCircle")
				.attr("r", cfg.dotRadius)
				.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
				.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
				.style("fill", (d) => color_func[d.id])
				.style("fill-opacity", 0.8);

			return svg;
		}//RadarChart

			//////////////////////////////////////////////////////////////
			////////////////////////// Data processing ///////////////////
			//////////////////////////////////////////////////////////////

			// Transforms the data in the desired format
			function get_data(energy_consumption_data, country_list, time_scale){
				let initial_value = {}
				if(this.time_scale === "Month"){
					initial_value = country_list.map(country => {
						return {name: country,
								axes: [{axis:"January", value:0, count:0},
											{axis:"February", value:0, count:0},
											{axis:"March", value:0, count:0},
											{axis:"April", value:0, count:0},
											{axis:"May", value:0, count:0},
											{axis:"June", value:0, count:0},
											{axis:"Jully", value:0, count:0},
											{axis:"August", value:0, count:0},
											{axis:"September", value:0, count:0},
											{axis:"October", value:0, count:0},
											{axis:"November", value:0, count:0},
											{axis:"December", value:0, count:0}]
								}//return
							})
					 }//if

				if (this.time_scale === "Day"){
					initial_value = country_list.map(country => {
						return {name:country,
								axes: [{axis:"Monday", value:0, count:0},
											{axis:"Tuesday", value:0, count:0},
											{axis:"Wednesday", value:0, count:0},
											{axis:"Thursday", value:0, count:0},
											{axis:"Friday", value:0, count:0},
											{axis:"Saturday", value:0, count:0},
											{axis:"Sunday", value:0, count:0}]
										}
					})
				}//if

				if (this.time_scale === "Hours"){
					initial_value = country_list.map(country => {
						return {name:country,
								axes: [{axis:"0", value:0, count:0},
											{axis:"1", value:0, count:0},
											{axis:"2", value:0, count:0},
											{axis:"3", value:0, count:0},
											{axis:"4", value:0, count:0},
											{axis:"5", value:0, count:0},
											{axis:"6", value:0, count:0},
											{axis:"7", value:0, count:0},
											{axis:"8", value:0, count:0},
											{axis:"9", value:0, count:0},
											{axis:"10", value:0, count:0},
											{axis:"11", value:0, count:0},
											{axis:"12", value:0, count:0},
											{axis:"13", value:0, count:0},
											{axis:"14", value:0, count:0},
											{axis:"15", value:0, count:0},
											{axis:"16", value:0, count:0},
											{axis:"17", value:0, count:0},
											{axis:"18", value:0, count:0},
											{axis:"19", value:0, count:0},
											{axis:"20", value:0, count:0},
											{axis:"21", value:0, count:0},
											{axis:"22", value:0, count:0},
											{axis:"23", value:0, count:0}]
										}
									})
				}//if

				return energy_consumption_data.reduce(reducer_maker(time_scale), initial_value) //sums up over all of the months
				    					 .map(average) //averages per hour
			}// getdata

			// helper function
			function month_transform(month_name){
				const month_dic = {"January" :0,
							"February" : 1,
							"March":2,
							"April":3,
							"May":4,
							"June":5,
							"Jully":6,
							"August":7,
							"September":8,
							"October":9,
							"November":10,
							"December":11,
							}
				return month_dic[month_name]
			}//month_transform

			// helper function
			function day_transform(month_name){
				const day_dic = {"Monday" :0,
							"Tuesday" : 1,
							"Wednesday":2,
							"Thursday":3,
							"Friday":4,
							"Saturday":5,
							"Sunday":6,
							}
				return day_dic[month_name]
			}//day_transform

			// returns the reducer function called in get_data:
			function reducer_maker(time_scale){
				return (accumulator, current_row) => { // accumulator is a list of dictionaries 
					return accumulator.map(country_dic => {
						return {name: country_dic.name, 
								axes: country_dic.axes.map(modify_single_dictionary(country_dic.name, current_row, time_scale))}
					})
				}
			}

			// Adds the current row value
			function modify_single_dictionary(country_name, current_row, time_scale){
				//inputs a dictionary with the key's name and axis, outputs the transformed one
				if(time_scale === "Month"){
						return per_month => {
							if(month_transform(per_month.axis)==current_row.Date.getMonth()){
								return {axis: per_month.axis, value: per_month.value + current_row[country_name], count: per_month.count+1};
							}//if
							else{
								return per_month;
							}//else
						}
					}//if
				if (time_scale === "Day"){
						return per_month => {
							if(day_transform(per_month.axis)==current_row.Date.getDay()){
								return {axis: per_month.axis, value: per_month.value + current_row[country_name], count: per_month.count+1};
							}//if
							else{
								return per_month;
							}//else
						}//fct
				}
				if (time_scale === "Hours"){
						return per_month => {
							if(parseInt(per_month.axis)==current_row.Date.getHours()){
								return {axis: per_month.axis, value: per_month.value + current_row[country_name], count: per_month.count+1};
							}//if
							else{
								return per_month;
							}//else
						}//fct
					}//if
			}//modify_single_dictionary

			function average(per_country){ // this gives the average per hour of each month
				 const new_country = {};
				 new_country["name"] = per_country.name;
				 new_country["axes"] = per_country.axes.map(per_month => {
				 	if (per_month.count == 0) {return {axis: per_month.axis, value: 0}}
				 	return {axis: per_month.axis, value: per_month.value/per_month.count}});
				 return new_country
			}//average


			//////////////////////////////////////////////////////////////
			//////////////////////// Set-Up //////////////////////////////
			//////////////////////////////////////////////////////////////

			var margin = { top: 100, right: 100, bottom: 100, left: 100 },
				width = Math.min(700, window.innerWidth) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

			var radarChartOptions = {
			  w: 350,
			  h: 370,
			  margin: margin,
			  levels: 5,
			  roundStrokes: true,
				color: d3.scaleOrdinal(d3.schemeCategory10),
				format: '.0f'
			};
			
			this.radarChartOptions = radarChartOptions;
			this.get_data = get_data;
			this.RadarChart = RadarChart;

	}//constructor

		// Called new data (new normalization, or time filter) is received to update the plot.
		updatePlot(newData) {
			if(this.country_list.length == 0) {
				this.data = newData;
				const data = this.get_data(this.data, this.country_list, this.time_scale);
			}
			else {
				this.data = newData;
				const data = this.get_data(this.data, this.country_list, this.time_scale);
				let svg_radar1 = this.RadarChart(".graph", data, this.radarChartOptions);
			}
		  }

		// Called when new country is clicked
		updatePlotAddCountry(country){
			this.country_list.push(country);
			const data = this.get_data(this.data, this.country_list, this.time_scale)
			this.RadarChart(".graph", data, this.radarChartOptions);
		}

		// Called when country is removed
		updatePlotRemoveCountry(country){
			this.country_list = this.country_list.filter(c => {
				return (c.localeCompare(country))});
			if (this.country_list.length == 0){
				d3.selectAll(".graph").selectAll("svg").remove()
				document.getElementById("directions").style.display = "block";
			}
			else {
				const data = this.get_data(this.data, this.country_list, this.time_scale)
				this.RadarChart(".graph", data, this.radarChartOptions);
			}
		}

		// Called when the time scale is udpate
		updatePlotTimeScale(time_scale){
			if(this.country_list.length == 0) {
				this.time_scale = time_scale;
				const data = this.get_data(this.data, this.country_list, this.time_scale)
			}
			else{
				this.time_scale = time_scale;
				const data = this.get_data(this.data, this.country_list, this.time_scale)
				this.RadarChart(".graph", data, this.radarChartOptions);
			}
		}
	}
