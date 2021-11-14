
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class OpeningVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 0, bottom: 200, left: 140 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // Scales and axes
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.2)

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(percentFormatter);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // Axis title
        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Most Popular Openings from Lichess.org");

        vis.svg.append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
			.attr("x", -vis.height / 2)
			.attr("y", -50)
			.attr("text-anchor", "middle")
            .text("Percentage of Games Played");
        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;
        vis.openingEcoToOpeningName = {};
        vis.data.forEach(d => {
            vis.openingEcoToOpeningName[d.opening_eco] = d.opening_name;
        })
        console.log(vis.openingEcoToOpeningName)
        vis.displayData = d3.rollup(vis.data, v => v.length, d => d.opening_eco)

        vis.displayData = Array.from(vis.displayData, ([name, value]) => ({ name, value }));
        vis.displayData.sort((a, b) => b.value - a.value);
        vis.sum = 0
        vis.displayData.forEach(d => vis.sum += d.value);

        vis.displayData = vis.displayData.slice(0, 15)

        
        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update domains
        // Click button to show moves, opening name, opening eco
        vis.y.domain([0, d3.max(vis.displayData, d => d.value) / vis.sum]);
        vis.x.domain(d3.map(vis.displayData, d => d.name))
        let bars = vis.svg.selectAll(".bar")
            .data(this.displayData);

        bars.enter().append("rect")
            .attr("class", "bar")

            .merge(bars)
            .transition()
            .attr("width", vis.x.bandwidth())
            .attr("height", function (d) {
                return vis.height - vis.y(d.value / vis.sum);
            })
            .attr("x", function (d) {
                return vis.x(d.name);
            })
            .attr("y", function (d) {
                return vis.y(d.value / vis.sum);
            })

        bars.exit().remove();

        // Call axis function with the new domain
        vis.svg.select(".y-axis").call(vis.yAxis);
        // TODO: adjust axis labels
        vis.svg.select(".x-axis").call(vis.xAxis)
            .selectAll("text")
            .text(d => vis.openingEcoToOpeningName[d])
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-45)"
            });

        // console.log(vis.metaData);
    }


    onSelectionChange(selectionStart, selectionEnd) {
        let vis = this;


        // Filter original unfiltered data depending on selected time period (brush)

        // *** TO-DO ***
        //vis.filteredData = ...

        vis.filteredData = vis.data.filter(function (d) {
            return d.time >= selectionStart && d.time <= selectionEnd;
        });


        vis.wrangleData();
    }
}