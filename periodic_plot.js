
class PeriodicPlot {

    constructor(svg_element_id, energy_consumption, start=energy_consumption[0].Date, end=energy_consumption[8500].Date) {


		/////////////////////////////////////////////////////////
		/////////////// The Radar Chart Function ////////////////
		/// mthh - 2017 /////////////////////////////////////////
		// Inspired by the code of alangrafu and Nadieh Bremer //
		// (VisualCinnamon.com) and modified for d3 v4 //////////
		/////////////////////////////////////////////////////////

		const max = Math.max;
		const sin = Math.sin;
		const cos = Math.cos;
		const HALF_PI = Math.PI / 2;

		this.energy_consumption = energy_consumption

		//this.start =energy_consumption[0].Date;
		//this.end =energy_consumption[100].Date

		const RadarChart = function RadarChart(parent_selector, data, options) {
			//Wraps SVG text - Taken from http://bl.ocks.org/mbostock/7555321
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
			 color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
			 format: '.2%',
			 unit: '',
			 legend: false
			};

			//Put all of the options into a variable called cfg
			if('undefined' !== typeof options){
			  for(var i in options){
				if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
			  }//for i
			}//if

			//If the supplied maxValue is smaller than the actual one, replace by the max in the data
			// var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
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
			////////// Glow filter for some extra pizzazz ///////////
			/////////////////////////////////////////////////////////

			//Filter for the outside glow
			let filter = g.append('defs').append('filter').attr('id','glow'),
				feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
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
				.angle((d,i) => i * angleSlice);

			if(cfg.roundStrokes) {
				radarLine.curve(d3.curveCardinalClosed)
			}

			//Create a wrapper for the blobs
			const blobWrapper = g.selectAll(".radarWrapper")
				.data(data)
				.enter().append("g")
				.attr("class", "radarWrapper");

			//Append the backgrounds
			/*blobWrapper
				.append("path")
				.attr("class", "radarArea")
				.attr("d", d => radarLine(d.axes))
				.style("fill", (d,i) => cfg.color(i))
				.style("fill-opacity", cfg.opacityArea)
				.on('mouseover', function(d, i) {
					//Dim all blobs
					parent.selectAll(".radarArea")
						.transition().duration(200)
						.style("fill-opacity", 0.1);
					//Bring back the hovered over blob
					d3.select(this)
						.transition().duration(200)
						.style("fill-opacity", 0.7);
				})
				.on('mouseout', () => {
					//Bring back all blobs
					parent.selectAll(".radarArea")
						.transition().duration(200)
						.style("fill-opacity", cfg.opacityArea);
				});*/

			//Create the outlines
			blobWrapper.append("path")
				.attr("class", "radarStroke")
				.attr("d", function(d,i) { return radarLine(d.axes); })
				.style("stroke-width", cfg.strokeWidth + "px")
				.style("stroke", (d,i) => cfg.color(i))
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
				.style("fill", (d) => cfg.color(d.id))
				.style("fill-opacity", 0.8);

			/////////////////////////////////////////////////////////
			//////// Append invisible circles for tooltip ///////////
			/////////////////////////////////////////////////////////

			//Wrapper for the invisible circles on top
			const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
				.data(data)
				.enter().append("g")
				.attr("class", "radarCircleWrapper");

			//Append a set of invisible circles on top for the mouseover pop-up
			blobCircleWrapper.selectAll(".radarInvisibleCircle")
				.data(d => d.axes)
				.enter().append("circle")
				.attr("class", "radarInvisibleCircle")
				.attr("r", cfg.dotRadius * 1.5)
				.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice*i - HALF_PI))
				.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice*i - HALF_PI))
				.style("fill", "none")
				.style("pointer-events", "all")
				.on("mouseover", function(d,i) {
					tooltip
						.attr('x', this.cx.baseVal.value - 10)
						.attr('y', this.cy.baseVal.value - 10)
						.transition()
						.style('display', 'block')
						.text(Format(d.value) + cfg.unit);
				})
				.on("mouseout", function(){
					tooltip.transition()
						.style('display', 'none').text('');
				});

			const tooltip = g.append("text")
				.attr("class", "tooltip")
				.attr('x', 0)
				.attr('y', 0)
				.style("font-size", "12px")
				.style('display', 'none')
				.attr("text-anchor", "middle")
				.attr("dy", "0.35em");

			if (cfg.legend !== false && typeof cfg.legend === "object") {
				let legendZone = svg.append('g');
				let names = data.map(el => el.name);
				if (cfg.legend.title) {
					let title = legendZone.append("text")
						.attr("class", "title")
						.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
						.attr("x", cfg.w - 70)
						.attr("y", 10)
						.attr("font-size", "12px")
						.attr("fill", "#404040")
						.text(cfg.legend.title);
				}
				let legend = legendZone.append("g")
					.attr("class", "legend")
					.attr("height", 100)
					.attr("width", 200)
					.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
				// Create rectangles markers
				legend.selectAll('rect')
				  .data(names)
				  .enter()
				  .append("rect")
				  .attr("x", cfg.w - 65)
				  .attr("y", (d,i) => i * 20)
				  .attr("width", 10)
				  .attr("height", 10)
				  .style("fill", (d,i) => cfg.color(i));
				// Create labels
				legend.selectAll('text')
				  .data(names)
				  .enter()
				  .append("text")
				  .attr("x", cfg.w - 52)
				  .attr("y", (d,i) => i * 20 + 9)
				  .attr("font-size", "11px")
				  .attr("fill", "#737373")
				  .text(d => d);
			}
			return svg;
		}//RadarChart


			//////////////////////////////////////////////////////////////
			//////////////////////// Set-Up //////////////////////////////
			//////////////////////////////////////////////////////////////

			var margin = { top: 100, right: 100, bottom: 100, left: 100 },
				width = Math.min(700, window.innerWidth) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

			//////////////////////////////////////////////////////////////
			////////////////////////// Data and Data Fetching //////////////////////////////
			//////////////////////////////////////////////////////////////



			var data = [
				{ name: "France",
					 axes:[
						{axis:"January",value:0},
						{axis:"February",value:0.28},
						{axis:"March",value:0.29},
						{axis:"April",value:0.17},
						{axis:"May",value:0.22},
						{axis:"June",value:0.02},
						{axis:"Jully",value:0.21},
						{axis:"August",value:0.50},
						{axis:"September",value:0.22},
						{axis:"October",value:0.28},
						{axis:"November",value:0.29},
						{axis:"December",value:0.17},
					]			
				} ,
				{ name: "Germany",
					axes: [
						{axis:"January",value:0.32},
						{axis:"February",value:0.18},
						{axis:"March",value:0.54},
						{axis:"April",value:0.12},
						{axis:"May",value:0.22},
						{axis:"June",value:0.91},
						{axis:"Jully",value:0.05},
						{axis:"August",value:0.3},
						{axis:"September",value:0.56},
						{axis:"October",value:0.29},
						{axis:"November",value:0.39},
						{axis:"December",value:0.17},	
					]
				} ,
				{ name: "Sweden",
					axes : [
						{axis:"January",value:0.42},
						{axis:"February",value:0.8},
						{axis:"March",value:0.21},
						{axis:"April",value:0.17},
						{axis:"May",value:0.32},
						{axis:"June",value:0.12},
						{axis:"Jully",value:0.21},
						{axis:"August",value:0.38},
						{axis:"September",value:0.22},
						{axis:"October",value:0.38},
						{axis:"November",value:0.29},
						{axis:"December",value:0.09},	
					]
				}
			];

//#################### This is Jacob's code #############
//#################### #################### #############
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
			}

			function country_name_transform(country_name){
				const country_dic = {
					"France": "FR",
					"Sweden": "SE",
					"Germany": "DE"
				}
				return country_dic[country_name]
			}

			function modify_single_dictionary(country_name, current_row){//this works!
				//inputds a dictionary withe the keys name and axis, outputs the one transformed
				return per_month => {//each per_month is a dictionary with keys axis and value, with axis being the month in String
					if(month_transform(per_month.axis)==current_row.Date.getMonth()){
						return {axis: per_month.axis, value: per_month.value + current_row[country_name_transform(country_name)]};
					}
					else{
						return per_month;
					}
				}
			}
					


			//console.log(energy_consumption[0]);
			//console.log("almost");
			//console.log(energy_consumption[0]["FR"]);
			//console.log(data[0].axes.map(modify_single_dictionary("France", energy_consumption[0])));




			function reducer(accumulator, current_row){
				//row is a row of energy_consumption, accumulator has the format desired for the radiar viz.
				//this calls modify_single_dictionary
				//accumulator is a list of dictionaries
				return accumulator.map(country_dic => { 
					const new_dic = {};
					new_dic["name"] = country_dic.name;
					new_dic["axes"] = country_dic.axes.map(modify_single_dictionary(country_dic.name, current_row));
					return new_dic
				  })
			}


			function get_data(energy_consumption, country_list, start, end, time_scale){
				let initial_value = country_list.map(country => {
					const new_country = {};
					new_country["name"] = country;
					new_country["axes"] =  [{axis:"January", value:0},
										{axis:"February",value:0},
										{axis:"March",value:0},
										{axis:"April",value:0},
										{axis:"May",value:0},
										{axis:"June",value:0},
										{axis:"Jully",value:0},
										{axis:"August",value:0},
										{axis:"September",value:0},
										{axis:"October",value:0},
										{axis:"November",value:0},
										{axis:"December",value:0},	
									];
					return new_country
				});


				return energy_consumption.filter(row => { //filter the time
					return row.Date.getTime() >= start.getTime() && row.Date.getTime()<end.getTime()})
				    .reduce(reducer, initial_value) //sums up over all of the months
			}


			this.get_data = get_data;
			this.RadarChart =RadarChart;







			//////////////////////////////////////////////////////////////
			////// First example /////////////////////////////////////////
      ///// (not so much options) //////////////////////////////////
			//////////////////////////////////////////////////////////////
			var radarChartOptions = {
			  w: 290,
			  h: 350,
			  margin: margin,
			  levels: 5,
			  roundStrokes: true,
				color: d3.scaleOrdinal().range(["#26AF32", "#762712"]),
				format: '.0f'
			};
			this.radarChartOptions = radarChartOptions;


			// Draw the chart, get a reference the created svg element :
			data = get_data(energy_consumption, ["France", "Sweden", "Germany"], start, end, "Month")
			let svg_radar1 = RadarChart(".graph", data, radarChartOptions);


	}//constructor


		updatePlot(startDate, endDate) {
			console.log("Inside Plot with startDate: " + startDate + " and endDate: " + endDate)

			const data = this.get_data(this.energy_consumption, ["France", "Sweden", "Germany"], startDate, endDate, "Month")
			let svg_radar1 = this.RadarChart(".graph", data, this.radarChartOptions);


		  }
	}
