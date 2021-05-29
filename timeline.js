
class Timeline {

    /* ===== Constants ===== */
    width = 200;
    height = 20;
    margin = {top: 5, bottom: 5, left: 10, right: 10}; 

    constructor(svg_element_id, energy_consumption, main) {
        /* ===== Constants ===== */        
        const brushPlacement = {top: 15, bottom: 17, left: 20, right: 200};
        const brushInterval = d3.timeMonth.every(1);

        const dates = energy_consumption.map(d => d.Date);
        const minDate = new Date(d3.min(dates).setDate(d3.min(dates).getDate() -1));
        const maxDate = new Date(d3.max(dates).setDate(d3.max(dates).getDate() -1)); 

        const svg = d3.select('div#'+svg_element_id)
                       .append('svg')
                       .attr("viewBox", [this.margin.left, this.margin.top, this.width-this.margin.right, this.height-this.margin.bottom]);

        const x = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .rangeRound([this.margin.left, this.width-this.margin.right]);

        const yearLabels = d3.axisTop(x)
                             .tickSize(0)
                             .ticks(d3.timeDay)
                             .tickFormat((d) => {
                                 if (d.getMonth() == 5 && d.getDate() == 18) {
                                    return d3.timeFormat("%Y")(d);
                                 }
                                 else {
                                     return null;
                                 }
                             });

        const yearLines = d3.axisBottom(x)
                            .tickSize(2)
                            .ticks(d3.timeYear)
                            .tickFormat((d) => {return null;})

        const monthLabels = d3.axisTop(x)
                              .tickSize(0)
                              .ticks(d3.timeMonth)
                              .tickFormat(d3.timeFormat("%b"));

        const brush = d3.brushX()
                        .extent([[brushPlacement.left, brushPlacement.top], [brushPlacement.right, brushPlacement.bottom]])
                        .on("start", brushed)
                        .on("brush", brushed)
                        .on("end", brushEnd);

        function brushed(event) {
            if (!event.sourceEvent) { return; } 
            if (!event.selection) {return; }
            const d0 = event.selection.map(x.invert);
            const d1 = d0.map(brushInterval.round);
        
            // If empty when rounded, use floor instead.
            if (d1[0] >= d1[1]) {
                d1[0] = brushInterval.floor(d0[0]);
                d1[1] = brushInterval.offset(d1[0]);
            }
        
            d3.select(this).call(brush.move, d1.map(x));
            placeHadles();

            // Send d1 to Map and Plot
        }

        function brushEnd(event) {
            if (!event.selection) {return; }

            const d0 = event.selection.map(x.invert);
            const d1 = d0.map(brushInterval.round);

            sendDates(d1);
        }

        function sendDates(d1) {
            const startDatePadding = -3;
            const endDatePadding = -3;
            const startDate = new Date(d1[0].setMonth(d1[0].getMonth() + startDatePadding));
            const endDate = new Date(d1[1].setMonth(d1[1].getMonth() + endDatePadding)-1);
            
            main.UpdateData(startDate, endDate);
        }

        function placeHadles() {
            d3.selectAll(".handle").attr("y", 15.5);
            var x = parseInt(d3.select(".handle--w").attr("x"));
            d3.select(".handle--w").attr("x", x+3);
        }

        this.drawYears(svg, yearLabels);
        this.drawYearsLine(svg, yearLines);
        this.drawMonths(svg, monthLabels);
        this.drawBrush(svg, brush).call(brush.move, [19, 199])
                                  .selectAll(".handle")
                                  .attr("rx", 0.5)
                                  .attr("ry", 0.5);
        placeHadles();
    }

    drawYears(svg, yearLabels) {
        return svg.append("g")
                  .classed("axis", true)
                  .classed("years", true)
                  .attr("transform", `translate(${this.margin.left},${this.height - this.margin.bottom})`)
                  .call(yearLabels);
    }

    drawYearsLine(svg, yearLine) {
        const lineLeftPadding = -1.5;
        const lineTopPadding = -2;
        return svg.append("g")
                  .classed("line", true)
                  .attr("transform", `translate(${this.margin.left + lineLeftPadding},${this.height - this.margin.bottom + lineTopPadding})`)
                  .call(yearLine);
    }

    drawMonths(svg, monthLabels) {
        const monthPadding = 5;
        return svg.append("g")
                  .classed("axis", true)
                  .classed("months", true)
                  .attr("transform", `translate(${this.margin.left},${this.height - this.margin.bottom + monthPadding})`)
                  .call(monthLabels);
    }

    drawBrush(svg, brush) {
        return svg.append("g")
                  .call(brush);
    }
}