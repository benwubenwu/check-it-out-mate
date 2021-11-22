
/*
 * Chess Board - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _boardLayout	    -- Matrix for the chess board layout
 */
// let pieceSources = {
//     'Black-Bishop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/1920px-Chess_bdt45.svg.png',
//     'Black-King': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/1920px-Chess_kdt45.svg.png',
//     'Black-Knight': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/1920px-Chess_ndt45.svg.png',
//     'Black-Pawn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/1920px-Chess_pdt45.svg.png',
//     'Black-Rook': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/1920px-Chess_rdt45.svg.png',
//     'Black-Queen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/1920px-Chess_qdt45.svg.png',
//     'White-Bishop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/1920px-Chess_blt45.svg.png',
//     'White-King': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/1920px-Chess_klt45.svg.png',
//     'White-Knight': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/1920px-Chess_nlt45.svg.png',
//     'White-Pawn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/1920px-Chess_plt45.svg.png',
//     'White-Queen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/1920px-Chess_qlt45.svg.png',
//     'White-Rook': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/1920px-Chess_rlt45.svg.png'
// };


class OpeningMovesVis extends Chessboard {

    // constructor(_parentElement,_boardLayout, _pieceInfo, _opening) {
    //     this.parentElement = _parentElement;
    //     this.boardLayout = _boardLayout;
    //     this.pieceInfo = _pieceInfo;
    //     this.opening = _opening
    //     //this.eventHandler = _eventHandler;

    //     this.initVis();
    // }

    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */

    updateVis() {
        let vis = this;

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
    }
}


    // loop through the chessboard

    //console.log(cells)
    // for (let i = 0; i <cells.length; i++)
    // {
    //     if (cells[i].id == piece.StartingPositions)
    //     console.log(cells[i])
    // }


