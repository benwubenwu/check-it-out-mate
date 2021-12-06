// let formatDate = d3.timeFormat("%Y");
// let parseYear = d3.timeParse("%Y");
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class CountryVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;
        this.colors = [
            '814cb7',
            'e3e8b0',
            'b4db54',
            '04bfda',
            'b5ccff',
            'd3ce17',
            '3fef3a',
            'd81989',
            '9cab54',
            'fdd771',
            'd3ce17',
            '3fef3a',
            'd81989',
            '9cab54',
            '1cb504',
            '9de408',
            '18993d',
            '814cb7',
            '958960',
            '3e0fcb',
            '90aca8',
            '53c89a',
            '0cbce2',
            'f9bc52',
            '07c667',
            'f39362',
            '43edeb',
            'e3e8b0',
            '37c34b',
            'f03bb3',
            '951053',
            'f83bcd',
            '3ab1bf',
            'aac714',
            'dda2e0',
            '331936',
            '9ebc5e',
            'b74033',
            '67fde4',
            'c61b61',
            '8f74b9',
            '2370d6',
            '6f9e1b',
            '358c55',
            'b73f2a',
            '00029a',
            'e3d6a4',
            'e33e85',
            '91ee2f',
            '001628',
            '6ea597',
            '68a738',
            '481c0f',
            '1e8baf',
            '21971d',
            '4ae10a',
            'c13a18',
            '6e28ff',
            'd0e78d',
            'ce8ab4',
            '1b3490',
            '49efa5',
            '3e8abb',
            '03bf3b',
            '4ee230',
            '71f20e',
            'e4f2ae',
            '3289e4',
            'a9dcff',
            '603440',
            '6a24e9',
            '1a6d64',
            '941752',
            '198f49',
            'c5b782',
            '8e4f2f',
            '6e0e28',
            '8ebd09',
            '91d520',
            'bf7197',
            'd5a790',
            '8c91cf',
            '528463',
            '20a4c1',
            '750f64',
            '0bd173',
            '34d51d',
            '0580e5',
            '15eb6c',
            'f6b6b3',
            'bb9862',
            '52cbc3',
            '557ae9',
            'f87ef1',
            'a23056',
            'cf4d48',
            '88aacf',
            '676a85',
            'b8cf55',
            '1b53f9',
            'cae4de',
            '689fda',
            '32461d',
            'd21732',
            'b98e8c',
            '546916',
            '264090',
            'e6c017',
            'dc4fa7',
            '09b245',
            '434509',
            '933511',
            '805a83',
            '15d27d',
            '630755',
            '404b05',
            '8d6fcb',
            '8214cf',
            'ff7f3e',
            '41f092',
            '8d3e0a',
            'cace05',
            '0cce20',
            '452bfb',
            'd5c03c',
            '62a96f',
            'e44a53',
            '64fa3e',
            'e44a24',
            'a5374f',
            'e6afac',
            '628029',
            'daa27b',
            'fa8364',
            '0fb128',
            'f1ba9a',
            'b70d82',
            'f8888e',
            'fb2acc',
            '03d14f',
            'fa1e5b',
            '9f8c23',
            'c4abc1',
            'dec2e6',
            'a4fd4c',
            'dafb04',
            'f378e4',
            '2f6df4',
            'fc8d30',
            '56cee5',
            '02ee50',
            'b40930',
            'd9f084',
            'd0a6ff',
            '65fe79',
            'c48210',
            '6ff70d',
            '191584',
            '88520f',
            '65faf3',
            'f561d2',
            '46f5da',
            'c325ba',
            '19e40b',
            '028741',
            'bbc12d',
            '3277bd',
            '78b82b',
            'affe7c',
            'cbfaf6',
            'b97841',
            'b9ffd7',
            'ebaf13',
            '677be2',
            '516ef2',
            'aac8cb',
            '0e70b0',
            '676ab7',
            'e8d7b9',
            '6c47cf',
            'ba4214',
            '915140',
            'c49200',
            'f4594a',
            '1c5916',
            '540bf5',
            'beefe5',
            '93ff3c',
            'bfeeff',
            '10dd95',
            'b8efcc',
            '9f2793',
            'c54269'
        ]
        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;
        // SVG drawing area
        let margin = {top: 40, right: 40, bottom: 60, left: 60};

        vis.width = 600 - margin.left - margin.right,
            vis.height = 500 - margin.top - margin.bottom;

        vis.svg = d3.select("#chart-area-2").append("svg")
            .attr("width", vis.width + margin.left + margin.right)
            .attr("height", vis.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        vis.masterGroup = vis.svg.append('g')

        vis.x = d3.scaleTime()
        vis.x = d3.scaleTime()
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xaxis = vis.svg.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(0, " + vis.height + ")")

        vis.yaxis = vis.svg.append("g")
            .attr("class", "y_axis")

        vis.svg.append("text")
            .attr("x", -38)
            .attr("y", -12)
            .text("Top 7 Performing Countries")
            .attr("style", "font-size: 14px; fill: #b7b7b6; font-weight: bold;");
        
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
    }

    showEditionLine(d) {
        console.log(d)
        document.getElementById("title").innerHTML = "Country: " + d[0];
        const val = d3.max(d[1], d => d.rating);
        document.getElementById('winner').innerText = "Average rating: " + val.toFixed(2);
        document.getElementById('year').innerText = "Year: " + '2017';
    }

    showEdition(d) {
        console.log(d)
        document.getElementById("title").innerHTML = "Country: " + d.country;
        document.getElementById('winner').innerText = "Average rating: " + d.rating.toFixed(2);
        document.getElementById('year').innerText = "Year: " + d.year.getFullYear();
    }

    handleMouseOver(line, d) {
        d3.select(line).attr("stroke-width", "3px");

        d3.selectAll(".line:not(#" + line.id + ")").classed('unselected', true);
        d3.select(line).classed("unselected", false)
        // console.log(line)
        this.showEditionLine(d)
    }

    handleMouseOut(d, i) {
        d3.select(this).attr("stroke-width", 1.5);
        d3.selectAll(".line:not(#" + this.id + ")").classed('unselected', false);
    }

    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;
        let new_data = vis.data
        let filtered_data = vis.data
        console.log(vis.data)

        const values = range.noUiSlider.get()

        console.log(values[0])
        console.log(values[1])

        if (values != undefined) {
            filtered_data = vis.data.filter(d => d.year >= parseYear(parseInt(values[0])) && d.year <= parseYear(parseInt(values[1])))
            console.log(filtered_data)
            console.log('filtered data')
        }
        if (vis.data == undefined) {
            return null
        }

        console.log('done')
        console.log(filtered_data)

        filtered_data = filtered_data.sort((a, b) => a.rating > b.rating)
        let country = [...new Set(filtered_data.map(d => d.country))]
        let topten = country.slice(0, 10)

        filtered_data = filtered_data.filter(d => topten.includes(d.country))
        let grouped_data = d3.group(filtered_data, d => d.country)

        const color_dict = {}
        for (let i = 0; i < 10; i++) {
            console.log(topten[i])
            color_dict[topten[i]] = i;
        }

        console.log(color_dict)

        document.getElementById('start').innerText = parseInt(values[0])

        document.getElementById('end').innerText = parseInt(values[1])
        vis.masterGroup.selectAll("lines").remove();

        vis.y.domain([d3.min(filtered_data, d => d.rating), d3.max(filtered_data, d => d.rating)]);
        vis.x.domain([d3.min(filtered_data, d => d.year), d3.max(filtered_data, d => d.year)]);

        // updating axis 
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

        vis.lineGraph = vis.masterGroup.selectAll(".line")
            .data(grouped_data);

        vis.lineGraph.enter()
            .append("path")
            .attr("class", "line")
            .attr("id", (d, i) => "line" + i)
            .on("mouseover", function (e, d) {
                vis.handleMouseOver(this, d)
            })
            .on("mouseout", vis.handleMouseOut)
            .merge(vis.lineGraph)
            .transition()
            .duration(800)
            .attr("d", d => {
                return d3.line()
                    .curve(d3.curveMonotoneX)
                    .x(d => vis.x(d.year))
                    .y(d => vis.y(d.rating))
                    (d[1])
            })
            .attr("stroke", (d) => {
                console.log(d[0])
                console.log(color_dict[d[0]]);
                return `#${vis.colors[color_dict[d[0]]]}`
            })
            .attr('fill', 'none')


        vis.lineGraph.exit().remove();

        const div = d3.select("#chart-area").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const circles = vis.masterGroup.selectAll("circle").data(filtered_data)
        circles.enter().append('circle')
            .data(filtered_data)
            .attr("fill", (d) => `#b7b7b6`)
            .attr('opacity', '0.5')
            .merge(circles)
            .on("click", (e, d) => vis.showEdition(d))
            .transition()
            .duration(800)
            .attr("cx", d => vis.x(d.year))
            .attr("cy", d => vis.y(d.rating))
            .attr("r", 5)

        circles.on("mouseover", function (d) {
            div.style("opacity", 1)
            div.html(d.country)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })

        circles.exit().remove()

        const xAxis = d3.axisBottom().tickFormat(d3.timeFormat("%Y"))
            .scale(vis.x)
        const yAxis = d3.axisLeft()
            .scale(vis.y)

        vis.yaxis.transition().duration(800).call(yAxis)
        vis.xaxis.transition().duration(800).call(xAxis)
    }
}