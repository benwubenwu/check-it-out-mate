
/*
 * CountVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class BrushVis {

	constructor(_parentElement, _data, _eventHandler) {
		this.parentElement = _parentElement;
		this.data = _data;
		this.eventHandler = _eventHandler;

		this.initVis();
	}


	/*
	 * Initialize visualization (static content, e.g. SVG area or axes)
	 */

	initVis() {
		let vis = this;

		vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
			vis.height = 300 - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


		// SVG clipping path
		// ***TO-DO***
		vis.svg.append("defs")
			.append("clipPath")
			.attr("id", "clip")
			.append("rect")
				.attr("width", vis.width)
				.attr("height", vis.height);

		// Scales and axes
		vis.x = d3.scaleTime()
			.range([0, vis.width]);

		vis.y = d3.scaleLinear()
			.range([vis.height, 0]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y)
			.ticks(6);

		vis.displayData = d3.rollup(vis.data, v => d3.sum(v, i => i.games), d => d.ranking_date)
		vis.displayData = Array.from(vis.displayData, ([name, value]) => ({ name, value }));

		// Set domains
		let minMaxY = [0, d3.max(vis.displayData, d => d.value)];
		vis.y.domain(minMaxY);

		let minMaxX = d3.extent(vis.data.map(function (d) { return d.ranking_date; }));
		vis.x.domain(minMaxX);

		vis.svg.append("g")
			.attr("class", "brush-x-axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "brush-y-axis");

		// Axis title
		vis.svg.append("text")
			.attr("x", -40)
			.attr("y", -8)
			.text("Number of Top FIDE Games Played")
			.attr("style", "font-size: 14px; fill: #b7b7b6; font-weight: bold");

		// Time period labels
		// vis.svg.append("rect")
		// 	.attr("width", 80)
		// 	.attr("height", 20)
		// 	.attr("transform", "translate(5," + -15 + ")")
		// 	.attr("fill", "lightgray")

		// vis.svg.append("text")
		// 	.attr("id", "time-period-min")
		// 	.text(dateFormatter(d3.min(vis.data.map(function (d) { return d.ranking_date; }))))
		// 	.attr("transform", "translate(10," + 0 + ")");

		// vis.svg.append("text")
		// 	.text("-")
		// 	.attr("transform", "translate(87.5," + 0 + ")");
		
		// vis.svg.append("rect")
		// 	.attr("width", 80)
		// 	.attr("height", 20)
		// 	.attr("transform", "translate(95," + -15 + ")")
		// 	.attr("fill", "lightgray")
		// vis.svg.append("text")
		// 	.attr("id", "time-period-max")
		// 	.text(dateFormatter(d3.max(vis.data.map(function (d) { return d.ranking_date; }))))
		// 	.attr("transform", "translate(100," + 0 + ")");

		// Append a path for the area function, so that it is later behind the brush overlay
		vis.timePath = vis.svg.append("path")
			.attr("class", "area area-time")
			.attr("style", "fill: #6abedb; stroke: white; opacity: .8")
			.attr("stroke-width", "1.5");

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

				// 3. Trigger the event 'selectionChanged' of our event handler
				vis.eventHandler.trigger("selectionChanged", vis.currentBrushRegion);
			});

		// Append brush component here
		// *** TO-DO ***
		vis.brushGroup = vis.svg.append("g")
        	.attr("class", "brush");

		// Add zoom component
		// *** TO-DO ***
		// save original scale
		vis.xOrig = vis.x;
		// function that is being called when user zooms
		vis.zoomFunction = function(event) {
			let xScaleModified = event.transform.rescaleX(vis.xOrig);
			vis.x = xScaleModified;
			if(vis.currentBrushRegion) {
				vis.brushGroup.call(vis.brush.move, vis.currentBrushRegion.map(vis.x));
				vis.updateVis();
			}
		}
		vis.zoom = d3.zoom()
				.on("zoom", vis.zoomFunction)
				.scaleExtent([1,20]);

		// disable mousedown and drag in zoom, when you activate zoom (by .call)
		// *** TO-DO ***
		vis.brushGroup
			.call(vis.zoom)
			.on("mousedown.zoom", null)
			.on("touchstart.zoom", null);

		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}



	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;

		// this.displayData = this.data;

		// Update the visualization
		vis.updateVis();
	}



	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 * Function parameters only needed if different kinds of updates are needed
	 */

	updateVis() {
		let vis = this;

		// Call brush component here
		// *** TO-DO ***
		vis.brushGroup.call(vis.brush);


		// Call the area function and update the path
		// D3 uses each data point and passes it to the area function.
		// The area function translates the data into positions on the path in the SVG.
		vis.timePath
			.datum(vis.displayData)
			.attr("d", vis.area)
			.attr("clip-path", "url(#clip)");


		// Call axis functions with the new domain 
		vis.svg.select(".brush-x-axis").call(vis.xAxis);
		vis.svg.select(".brush-y-axis").call(vis.yAxis);

		// Apply clipping to the brush
		vis.brushGroup
			.datum(vis.displayData)
			.attr("d", vis.area)
			.attr("clip-path", "url(#clip)");
	}

	// Update displayed selected time period
	onSelectionChange(rangeStart, rangeEnd) {
		d3.select("#time-period-min").text(dateFormatter(rangeStart));
		d3.select("#time-period-max").text(dateFormatter(rangeEnd));

	}
}