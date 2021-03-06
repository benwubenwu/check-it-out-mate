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
        let margin = {top: 40, right: 250, bottom: 60, left: 60};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - margin.left - margin.right,
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

        // vis.maxYear = new Date();
        // vis.maxYear.setFullYear(vis.minYear.getFullYear() + 2);


        vis.maxYear = d3.max(vis.data, d => d.ranking_date);


        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);
        // Create slider
        // Source: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
        // vis.slider
        //     .min(vis.minYear)
        //     .max(vis.maxYear)
        //     .width(300)
        //     // TODO: Fix formatting
        //     .tickFormat(formatDate)
        //     .default([vis.minYear, vis.maxYear])
        //     .fill('#2196f3')
        //     .on('onchange', val => {
        //         updateVisualization();
        //     });

        // var sliderArea = d3
        //     .select('#slider')
        //     .append('svg')
        //     .attr('width', 500)
        //     .attr('height', 100)
        //     .append('g')
        //     .attr('transform', 'translate(20, 20)');

        // sliderArea.call(vis.slider);

        // Axis title
        vis.svg.append("text")
            .attr("x", -38)
            .attr("y", -12)
            .text("Top 10 Chess Players")
            .attr("style", "font-size: 14px; fill: #b7b7b6; font-weight: bold;");

        vis.svg.append("g")
            .attr("class", "player-y-axis")
            .call(d3.axisLeft(vis.y));
        vis.svg.append("g")
            .attr("class", "player-x-axis")
            .attr("transform", "translate(0, " + vis.height + ")")
            .call(d3.axisBottom(vis.x).ticks(8));

        vis.svg.append("text")
            .attr("class", "x-label")
            .attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 45) + ")")
            .attr("text-anchor", "middle")
            .text("Year")
            .attr("style", "font-size: 10px; fill: #b7b7b6");

        vis.svg.append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.height / 2)
            .attr("y", -45)
            .attr("text-anchor", "middle")
            .attr("style", "font-size: 10px; fill: #b7b7b6");

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // Set minimum year and maximum year based on slider values
        // let arr = vis.slider.value();
        // vis.minYear = arr[0]
        // vis.maxYear = arr[1]

        vis.filteredData = vis.data.filter(d => d.ranking_date >= vis.minYear && d.ranking_date <= vis.maxYear);

        vis.displayData = d3.rollup(vis.filteredData, v => d3.mean(v, i => i.rating), d => d.name);

        vis.displayData = Array.from(vis.displayData, ([name, value]) => ({ name, value }));
        vis.displayData.sort((a, b) => b.value - a.value);
        vis.sum = 0
        vis.displayData.forEach(d => vis.sum += d.value);

        vis.displayData = vis.displayData.slice(0, 10).map(d => d.name)

        vis.filteredData = vis.filteredData.filter(d => vis.displayData.includes(d.name));


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
        d3.select(".player-y-axis")
            .transition()
            .duration(800)
            .call(d3.axisLeft(vis.y));

        d3.select(".player-x-axis")
            .transition()
            .duration(800)
            .call(d3.axisBottom(vis.x).ticks(8));

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
        const color = d3.scaleOrdinal()
            .domain([
                "Kasparov, Garry",
                "Kramnik, Vladimir",
                "Anand, Viswanathan",
                "Topalov, Veselin",
                "Aronian, Levon",
                "Nakamura, Hikaru",
                "Karjakin, Sergey",
                "Carlsen, Magnus",
                "Caruana, Fabiano",
                "Giri, Anish",
                "Grischuk, Alexander",
                "Morozevich, Alexander",
                "Adams, Michael",
                "Shirov, Alexei",
                "Leko, Peter",
                "Ivanchuk, Vassily",
                "Bareev, Evgeny",
                "Polgar, Judit",
                "Svidler, Peter",
                "Mamedyarov, Shakhriyar",
                "So, Wesley",
                "Vachier-Lagrave, Maxime",
            ])
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
            .attr("id", (d, i) => "line" + i)
            .merge(vis.lineGraph)
            .on("mouseover", vis.handleMouseOver)
            .on("mouseout", vis.handleMouseOut)
            .transition(transition)
            .attr("d", d => {
                return d3.line()
                    .curve(d3.curveMonotoneX)
                    .x(d => vis.x(d.ranking_date))
                    .y(d => vis.y(d.rating))
                    (d[1])
            })
            .attr("stroke", d => color(d[0]))
            .attr("stroke-width", 1.5)
            .attr("fill", "none");

        vis.lineGraph.exit().remove();

        vis.lineGraph
            .datum(sumstat)
            .attr("d", vis.lineGraph)
            // .attr("clip-path", "url(#clip)");

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
            .attr("y", (d, i) => i * 20 + 11)
            .text(d => d[0])
            .attr("style", "font-size: 14px; fill: #b7b7b6")

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

    handleMouseOver(event, d) {
        d3.select(this).attr("stroke-width", "3px");

        d3.selectAll(".line:not(#" + this.id + ")").classed('unselected', true);
        d3.select(this).classed("unselected", false);

        // // Show name, peak rating, nationality, rank, birthday
        // console.log(event, d[1])
        // d3.select("#player-name").text(d[0])
        // d3.select("#player-country").text(d[1][0].country)
        // d3.select("#player-birthdate").text(d[1][0].birth_year)
        // let games = vis.data.filter(d => d.name == d[0]);
        // let peakRating = d3.max(games, d => d.rating);

        // d3.select("#player-peak-rating").text(peakRating)
        // d3.select("#player-rank").text("Grandmaster")
    }

    handleMouseOut(d, i) {
        d3.select(this).attr("stroke-width", 1.5);
        d3.selectAll(".line:not(#" + this.id + ")").classed('unselected', false);
    }

    onSelectionChange(selectionStart, selectionEnd) {
        let vis = this;


        // Filter original unfiltered data depending on selected time period (brush)

        vis.minYear = selectionStart;
        vis.maxYear = selectionEnd;
        // vis.filteredData = vis.data.filter(function (d) {
        //     return d.time >= selectionStart && d.time <= selectionEnd;
        // });


        vis.wrangleData();
    }
}