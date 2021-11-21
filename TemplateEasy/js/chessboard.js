
/*
 * Chess Board - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _boardLayout	    -- Matrix for the chess board layout
 */
let pieceSources = {
    'Black-Bishop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/1920px-Chess_bdt45.svg.png',
    'Black-King': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/1920px-Chess_kdt45.svg.png',
    'Black-Knight': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/1920px-Chess_ndt45.svg.png',
    'Black-Pawn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/1920px-Chess_pdt45.svg.png',
    'Black-Rook': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/1920px-Chess_rdt45.svg.png',
    'Black-Queen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/1920px-Chess_qdt45.svg.png',
    'White-Bishop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/1920px-Chess_blt45.svg.png',
    'White-King': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/1920px-Chess_klt45.svg.png',
    'White-Knight': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/1920px-Chess_nlt45.svg.png',
    'White-Pawn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/1920px-Chess_plt45.svg.png',
    'White-Queen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/1920px-Chess_qlt45.svg.png',
    'White-Rook': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/1920px-Chess_rlt45.svg.png'
};


class Chessboard {

    constructor(_parentElement,_boardLayout, _pieceInfo, _opening) {
        this.parentElement = _parentElement;
        this.boardLayout = _boardLayout;
        this.pieceInfo = _pieceInfo;
        this.opening = _opening
        //this.eventHandler = _eventHandler;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 60, right: 60, bottom: 60, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


       // Set the #rows/#cols of a NxN board
        vis.N = vis.boardLayout.length;
        // Defining X-axis labels (used in axes and in rectangle ids)
        vis.Xlabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        // Defining Y-axis labels (used in rectangle ids)
        vis.Ylabels = d3.range(vis.N,0,-1)
        // Scales and axes
        vis.x = d3.scaleLinear()
            .domain([0, vis.N])
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .domain([0, vis.N])
            .range([vis.height, 0]);

        vis.xAxis1 = d3.axisBottom()
            .scale(vis.x)
            .tickSize(0)
            .tickPadding(10)
            .tickFormat((d,i) => vis.Xlabels[i]);

        vis.yAxis1 = d3.axisLeft()
            .scale(vis.y)
            .tickSize(0)
            .tickPadding(10)
            .tickValues(d3.range(1,vis.N+1));

        vis.xAxis2 = d3.axisTop()
            .scale(vis.x)
            .tickSize(0)
            .tickPadding(10)
            .tickFormat((d,i) => vis.Xlabels[i]);

        vis.yAxis2 = d3.axisRight()
            .scale(vis.y)
            .tickSize(0)
            .tickPadding(10)
            .tickValues(d3.range(1,vis.N+1));

        // Initializing axes svg
        vis.svg.append("g")
            .attr("class", "x-axis1 axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis1);

        vis.svg.append("g")
            .attr("class", "x-axis2 axis")
            //.attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis2);

        vis.svg.append("g")
            .attr("class", "y-axis1 axis")
            .call(vis.yAxis1);

        vis.svg.append("g")
            .attr("class", "y-axis2 axis")
            .attr('transform', "translate("+ vis.width + ",0)")
            .call(vis.yAxis2);

        // Centering the X axis labels
        d3.select(".x-axis1").selectAll("text").attr('transform', 'translate(' + vis.width/16+ ',0 )')
        d3.select(".x-axis2").selectAll("text").attr('transform', 'translate(' + vis.width/16+ ',0 )')
        // Centering the Y axis labels
        d3.select(".y-axis1").selectAll("text").attr('transform', 'translate(0,' + vis.width/16+ ')')
        d3.select(".y-axis2").selectAll("text").attr('transform', 'translate(0,' + vis.width/16+ ')')

        // Creating the rectangular cell for the chess board
        // Joining the data for the cells
        vis.cells = vis.svg.selectAll('.cell-row').data(vis.boardLayout)
        vis.cells.exit().remove()
        // Using the data to create cells
        vis.cells.enter()
            .append('g')
            .attr('class','cell-row')

        // Row count to organize each rects id
        let rowCount = 0;
        let count = 0 ;
        // joining cells with row data
        vis.cells2 = d3.selectAll('.cell-row').selectAll('.cell').data(d=>d)

        vis.cells2.enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('id', (d,i)=> {
                let current_row = rowCount;
                if ((i+1)%vis.N == 0){

                    rowCount+=1;
                }
                return vis.Xlabels[i].toLowerCase() +"" + vis.Ylabels[current_row]
            })
            .attr('fill', (d)=> d==0?'white': '#800000')
            .attr('stroke', 'white')
            .attr('x', function(d,i){
                 return i*vis.width/8
            })
            .attr('y', (d,i) =>{
                let y_pos = count*vis.height/8
                if ((i+1)%vis.N == 0){
                    count+=1;
                }
                // Defining y positions this way so each piece can access each cell's y position
                return y_pos
            })
            .attr('width', vis.width/8)
            .attr('height',vis.height/8)

        // Translating the height of each row
        // d3.selectAll('.cell-row')
        //     .attr('transform', (d,i) => {
        //         return 'translate(0,'+ i*vis.height/8+")"
        //     })

        // Appending chess piece images
        vis.imageGroup = vis.svg.append('g').attr('class', 'pieces-group')


        // Looping through each piece
        vis.pieceInfo.forEach(piece => {
            // Looping through the starting positions. Each starting position represents a unique piece
            piece.StartingPositions.forEach( (el,i) => {
                    let cell = document.getElementById(el);
                    vis.imageGroup.append('svg:image')
                        .attr("xlink:href", pieceSources[piece.Name])
                        .attr("x", cell.getAttribute('x'))
                        .attr("y", cell.getAttribute('y'))
                        .attr("width", vis.width / 8)
                        .attr("height", vis.height / 8)
                        .attr('id', piece.Name + i)
                        .attr('class', 'chessPiece '+ piece.Name)
                }
            )

        })

        // Append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieceTooltip')



        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }



    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;
        vis.displayData = {}
        console.log(vis.pieceInfo)
        vis.pieceInfo.forEach(piece =>{
            let pieceInfo = {
                'Movement': piece.Movement,
                'Capture': piece.Capture
            }
            vis.displayData[piece.Name] = pieceInfo

        })
        console.log(vis.displayData)
        //this.displayData = this.data;
        //console.log("here in wrangle data")
        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */

    updateVis() {
        let vis = this;
        //console.log("here in update data")

        // Activate hover tooltip on mouse over and deactivate on mouse out
        vis.imageGroup.selectAll('.chessPiece')
            .on('mouseover', function(event, d){
                // Get the pieces name which is stored as one of its classes
                let pieceName = event.target.classList[1];

                // Create the tooltip
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="border: thin solid grey; width: 400px; border-radius: 5px; background: lightgrey; padding: 20px">
                         <h3>${pieceName}<h3>
                         <h5>Movement: ${vis.displayData[pieceName].Movement} <h5>
                         <h5>Capture: ${vis.displayData[pieceName].Capture} <h5>
                     </div>`
                    );
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", 'white')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });



        // Call brush component here
        // *** TO-DO ***
        // vis.brushGroup.attr("clip-path", "url(#clip)").call(vis.brush)
        //
        // vis.brushGroup.call(vis.zoom)
        //     .on("mousedown.zoom", null)
        //     .on("touchstart.zoom", null);


        // Call the area function and update the path
        // D3 uses each data point and passes it to the area function.
        // The area function translates the data into positions on the path in the SVG.
        // vis.timePath
        //     .datum(vis.displayData)
        //     .attr("d", vis.area)
        //     .attr("clip-path", "url(#clip)");


        // Call axis functions with the new domain
        // vis.svg.select(".y-axis").call(vis.yAxis);
        // vis.svg.select(".x-axis").call(vis.xAxis);


    }
    // Create function to update the selected time period
    // onSelectionChange(selectionStart, selectionEnd){
    //     d3.select("#time-period-min").property('value', dateFormatter(selectionStart));
    //     d3.select("#time-period-max").property('value', dateFormatter(selectionEnd));
    //
    // }
}


    // loop through the chessboard

    //console.log(cells)
    // for (let i = 0; i <cells.length; i++)
    // {
    //     if (cells[i].id == piece.StartingPositions)
    //     console.log(cells[i])
    // }


