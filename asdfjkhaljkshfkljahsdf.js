/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class BrushVis {

    constructor(_parentElement, _data, _eventHandler) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;
        this.eventHandler = _eventHandler;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;
        // SVG drawing area
        let margin = {top: 40, right: 250, bottom: 60, left: 60};

        vis.width = 1400 - margin.left - margin.right,
                vis.height = 250 - margin.top - margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + margin.left + margin.right)
            .attr("height", vis.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // SVG clipping path
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);



        vis.minYear = d3.min(vis.data, d => d.ranking_date);
        vis.maxYear = d3.max(vis.data, d => d.ranking_date);

        vis.svg.append("g")
            .attr("class", "brush-y-axis")
            .call(d3.axisLeft(vis.y));
        vis.svg.append("g")
            .attr("class", "brush-x-axis")
            .attr("transform", "translate(0, " + vis.height + ")")
            .call(d3.axisBottom(vis.x));

        vis.svg.append("text")
            .attr("class", "brush-x-label")
            .attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 45) + ")")
            .attr("text-anchor", "middle")
            .text("Year")

        vis.svg.append("text")
            .attr("class", "brush-y-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.height / 2)
            .attr("y", -45)
            .attr("text-anchor", "middle");

        vis.displayData = d3.rollup(vis.data, v => d3.sum(v, i => i.games), d => d.ranking_date)

        vis.displayData = Array.from(vis.displayData, ([name, value]) => ({ name, value }));

        // Append a path for the area function, so that it is later behind the brush overlay
		vis.timePath = vis.svg.append("path")
            .attr("class", "area area-time")
            .attr("fill", "white");

        // Define the D3 path generator
        vis.area = d3.area()
            .curve(d3.curveStep)
            .x(function (d) {
                return vis.x(d.name);
            })
            .y0(vis.height)
            .y1(function (d) { return vis.y(d.value); });
        
        // Initialize brushing component
		// *** TO-DO ***
		vis.currentBrushRegion = null;
		vis.brush = d3.brushX()
			.extent([[0,0],[vis.width, vis.height]])
			.on("brush", function(event){
				// User just selected a specific region
				vis.currentBrushRegion = event.selection;
				vis.currentBrushRegion = vis.currentBrushRegion.map(vis.x.invert);
                console.log(vis.currentBrushRegion)
                // playerVis.onSelectionChange(vis.currentBrushRegion)
                vis.eventHandler.trigger("selectionChanged", vis.currentBrushRegion);
			});

        vis.x.domain([vis.minYear, vis.maxYear])

        vis.y.domain([0, d3.max(vis.displayData, d => d.value)])    
		// Append brush component here
		// *** TO-DO ***
		vis.brushGroup = vis.svg.append("g")
        	.attr("class", "brush-group");
        
        // disable mousedown and drag in zoom, when you activate zoom (by .call)
		// *** TO-DO ***

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        vis.brushGroup.call(vis.brush);
        // Update axes
        d3.select(".brush-y-axis")
            .transition()
            .duration(800)
            .call(d3.axisLeft(vis.y));

        d3.select(".brush-x-axis")
            .transition()
            .duration(800)
            .call(d3.axisBottom(vis.x));

        d3.select(".brush-x-label")
            .text("Year")

        d3.select(".brush-y-label")
            .text("Number of games");

        vis.timePath
			.datum(vis.displayData)
			.attr("d", vis.area)
			.attr("clip-path", "url(#clip)");
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