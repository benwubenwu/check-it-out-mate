
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class PlayerVis {

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
        // SVG drawing area
        let margin = {top: 40, right: 150, bottom: 60, left: 60};

        vis.width = 600 - margin.left - margin.right,
                vis.height = 500 - margin.top - margin.bottom;

        vis.svg = d3.select("#chart-area").append("svg")
                .attr("width", vis.width + margin.left + margin.right)
                .attr("height", vis.height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        vis.x = d3.scaleTime()
            .range([0, vis.width]);
        
        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);
        
        vis.slider = d3.sliderBottom();

        vis.minYear = d3.min(vis.data, d => d.ranking_date);
        vis.maxYear = d3.max(vis.data, d => d.ranking_date);
        
        vis.svg.append("defs")
			.append("clipPath")
			.attr("id", "clip")
			.append("rect")
				.attr("width", vis.width)
				.attr("height", vis.height);
        // Create slider
		// Source: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
		vis.slider
            .min(vis.minYear)
            .max(vis.maxYear)
            .width(300)
            // TODO: Fix formatting
            .tickFormat(formatDate)
            .default([vis.minYear, vis.maxYear])
            .fill('#2196f3')
            .on('onchange', val => {
                updateVisualization();
            });

        var sliderArea = d3
            .select('#slider')
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(20, 20)');

        sliderArea.call(vis.slider);

        vis.svg.append("g")
			.attr("class", "y-axis")
			.call(d3.axisLeft(vis.y));
		vis.svg.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate(0, " + vis.height + ")")
			.call(d3.axisBottom(vis.x));
		
		vis.svg.append("text")
			.attr("class", "x-label")
			.attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 45) + ")")
			.attr("text-anchor", "middle")
			.text("Year")
	
		vis.svg.append("text")
			.attr("class", "y-label")
			.attr("transform", "rotate(-90)")
			.attr("x", -vis.height / 2)
			.attr("y", -45)
			.attr("text-anchor", "middle");

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // Set minimum year and maximum year based on slider values
        let arr = vis.slider.value();
        vis.minYear = arr[0]
        vis.maxYear = arr[1]
        let dates = vis.data.map(d => d.string_date);
        vis.filteredData = vis.data.filter(d => d.ranking_date >= vis.minYear && d.ranking_date <= vis.maxYear);
        vis.filteredData = vis.filteredData.filter(d => d.rank <= 3);


        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        vis.x.domain([vis.minYear, vis.maxYear])
        vis.y.domain([d3.min(vis.filteredData, d => d.rating), d3.max(vis.filteredData, d => d.rating)])

        // Update axes
        d3.select(".y-axis")
            .transition()
            .duration(800)
            .call(d3.axisLeft(vis.y));
    
        d3.select(".x-axis")
            .transition()
            .duration(800)
            .call(d3.axisBottom(vis.x));

        d3.select(".x-label")
            .text("Year")

        d3.select(".y-label")
            .text("Rating (ELO)");
        // Define custom transition
        let transition = d3.transition()
            .duration(800)
            .ease(d3.easeLinear);
        
        // https://www.d3-graph-gallery.com/graph/line_several_group.html
        var sumstat = d3.group(vis.filteredData, d => d.name);

        console.log(sumstat)
        const color = d3.scaleOrdinal()
            .range([ 
                    '#1f77b4',
                    '#aec7e8',
                    '#ff7f0e',
                    '#ffbb78',
                    '#2ca02c',
                    '#98df8a',
                    '#d62728',
                    '#ff9896',
                    '#9467bd',
                    '#c5b0d5',
                    '#8c564b',
                    '#c49c94',
                    '#e377c2',
                    '#f7b6d2',
                    '#7f7f7f',
                    '#c7c7c7',
                    '#bcbd22',
                    '#dbdb8d',
                    '#17becf',
                    '#9edae5',
                    '#393b79',
                    '#637939',
                    '#8c6d31',
                    '#843c39'
                ]);
        vis.lineGraph = vis.svg.selectAll(".line")
            .data(sumstat);
        
        vis.lineGraph.enter().append("g")
            .append("path")
            .attr("class", "line")
            .merge(vis.lineGraph)
            .transition(transition)
            .attr("d", d => {
                return d3.line()
                    .curve(d3.curveMonotoneX)
                    .x(d => vis.x(d.ranking_date))
                    .y(d => vis.y(d.rating))
                    (d[1])
            })
            .attr("stroke", d => color(d[0]))
            .attr("stroke-width", 2)
            .attr("fill", "none");

        vis.lineGraph.exit().remove();

        vis.lineGraph
			.datum(sumstat)
			.attr("d", vis.lineGraph)
			.attr("clip-path", "url(#clip)");

        vis.legend = vis.svg.selectAll(".legend")
            .data(sumstat);
        
        vis.legend.enter()
            .append("rect")
            .merge(vis.legend)
            .attr("class", "legend")
            .attr("width", 20)
            .attr("height", 10)
            .attr("x", vis.width + 20)
            .attr("y", (d, i) => i * 20)
            .attr("fill", d => color(d[0]))
            .append("text")
            .text(d => d[0])
        
        vis.legend.exit().remove();

        vis.legendLabels = vis.svg.selectAll(".legend-label")
            .data(sumstat);
        
        vis.legendLabels.enter()
            .append("text")
            .merge(vis.legendLabels)
            .attr("class", "legend-label")
            .attr("x", vis.width + 45)
            .attr("y", (d, i) => i * 20 + 7.5)
            .text(d => d[0])
        
        vis.legendLabels.exit().remove();
            // .attr("transform", (d, i) => "translate(" + 0 + "," + i * 20 + ")")
        // Create points on connected scatterplot
        // Source: https://www.d3-graph-gallery.com/graph/connectedscatter_basic.html
        // let dots = vis.svg.selectAll(".tooltip-circle")
        //     .data(vis.filteredData);

        // dots.enter().append("circle")
        //     .attr("class", "tooltip-circle")
        //     .on("click", function(event, d){
        //         showEdition(d);
        //     })
        //     .merge(dots)
        //     .transition(transition)
        //     .attr("cx", d => x(d.YEAR))
        //     .attr("cy", d => y(d[selectValue]))
        //     .attr("r", 5)
        //     .attr("fill", "#69b3a2");

        // dots.exit().remove();
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