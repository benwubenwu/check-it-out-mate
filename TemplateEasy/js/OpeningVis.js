
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class OpeningVis {

    constructor(_parentElement, _data, _player_color) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;
        this.player_color = this._player_color

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
            .attr("class", "opening-x-axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "opening-y-axis");

        // Axis title
        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Most Popular Openings from Free Internet Chess Server (FICS) Games Database");

        vis.svg.append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
			.attr("x", -vis.height / 2)
			.attr("y", -50)
			.attr("text-anchor", "middle")
            .text("Percentage of Games Played");
        
        vis.minRating = d3.min(vis.data, d=>d.white_elo);
        vis.maxRating = d3.max(vis.data, d=>d.white_elo);

        vis.minDate = d3.min(vis.data, d => d.date);
        vis.maxDate = d3.max(vis.data, d => d.date);
        
        vis.slider = d3.sliderBottom();
        vis.slider
            .min(vis.minRating)
            .max(vis.maxRating)
            .width(200)
            .default([vis.minRating, vis.maxRating])
            .fill('#2196f3')
            .on('onchange', val => {
                vis.wrangleData();
            })
            .ticks(5);

        var sliderArea = d3
            .select('#opening-vis-slider')
            .append('svg')
            .attr('width', 300)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(20, 40)');

        sliderArea.append("text")
            .attr("transform", "translate(-15, -15)")
            .text("Rating (Elo)")

        sliderArea.call(vis.slider);

        vis.timeSlider = d3.sliderBottom();
        vis.timeSlider
            .min(vis.minDate)
            .max(vis.maxDate)
            .width(200)
            .default([vis.minDate, vis.maxDate])
            .fill('#2196f3')
            .on('onchange', val => {
                vis.wrangleData();
            })
            .ticks(5)
            .tickFormat(formatDate);

        var timeSliderArea = d3
            .select('#opening-vis-slider')
            .append('svg')
            .attr('width', 300)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(20, 40)');

        timeSliderArea.append("text")
            .attr("transform", "translate(-15, -15)")
            .text("Years")

        timeSliderArea.call(vis.timeSlider);
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
            vis.openingEcoToOpeningName[d.eco] = d.name;
        })

        let arr = vis.slider.value();
        vis.minRating = arr[0]
        vis.maxRating = arr[1]

        let timeArr = vis.timeSlider.value();
        vis.minDate = timeArr[0];
        vis.maxDate = timeArr[1];

        vis.displayData = vis.data.filter(d => d.white_elo >= vis.minRating && d.white_elo <= vis.maxRating);
        vis.displayData = vis.displayData.filter(d => d.date >= vis.minDate && d.date <= vis.maxDate);
        // vis.displayData = d3.rollup(vis.displayData, v => v.length, d => d.name)
        if (this.palyer_color == "white") {
            vis.displayData = d3.rollup(vis.displayData, v => v.length, d => d.moves.slice(0, 6));
        }
        else {
            vis.displayData = d3.rollup(vis.displayData, v => v.length, d => d.moves.slice(0, 9));
        }
        

        vis.displayData = Array.from(vis.displayData, ([name, value]) => ({ name, value }));
        vis.displayData.sort((a, b) => b.value - a.value);
        vis.sum = 0
        vis.displayData.forEach(d => vis.sum += d.value);

        vis.displayData = vis.displayData.slice(0, 5)
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
            .attr("fill", "#93bebf")
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
        vis.svg.select(".opening-y-axis").call(vis.yAxis);
        // TODO: adjust axis labels
        vis.svg.select(".opening-x-axis").call(vis.xAxis)
            .selectAll("text")
            .text(d => d)
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-45)"
            });
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