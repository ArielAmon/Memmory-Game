"use strict";
(()=>{
    /**
     *
     * @param playersList
     * @returns {string}
     */
    function createTable (playersList) {
        console.log("In create", playersList)
        let playersTable = "<table class='table table-hover table-light table-striped-columns'>"+
            " <thead >" +
            "<tr>" +
            " <th> Rank </th> " +
            " <th> Player </th> " +
            " <th> Score </th> " +
            "</tr> " +
            "</thead>" +
            "<tbody > " ;

        playersList.forEach(player =>{
            playersTable += "" +
                "<tr  > " +
                "<td >" + (playersList.indexOf(player) + 1) + " </td> " +
                "<td >" + player.player + " </td> " +
                "<td >" + player.score + " </td> " +
                " </tr> "
        })
        playersTable += "</tbody> " + "</table> " ;
        return playersTable;
    }


    function checkSelection(firstSelection, rows, cols) {

        const errorMessage = "Number of cards (rows X columns) must be\n even, please correct your choice."
        console.log("in check",firstSelection,rows,cols)

            if( ( (rows * cols) % 2 ) !== 0 && (!document.contains( document.getElementById("errorMessage")))) {
                const para = document.createElement("p");
                para.id = "errorMessage"
                para.innerText = errorMessage;
                document.getElementById(`${firstSelection}`).appendChild(para);
                para.style.display = "block";
                para.style.color = `red`;
            }
            else{
                if(document.contains( document.getElementById("errorMessage")))
                    document.getElementById("errorMessage").remove();
            }
    }






    document.addEventListener("DOMContentLoaded", () => {

    // all buttons elements
    const playButton = document.getElementById("btnPlay");
    const scoresButton = document.getElementById("btnScores");
    const selectRows = document.getElementById("NumberOfRows");
    const selectCols = document.getElementById("NumberOfCols");

        let players = [ {player: "Ariel", score: 60},
                        {player: "Sol", score: 100},
                        {player: "Menny", score: 80},
                        {player: "ELi", score: 200}];


        localStorage.setItem("players", JSON.stringify(players));


    const leaderboardModal = new bootstrap.Modal('#scores-modal')
    const leaderboardModalContent = document.getElementsByClassName("modal-body")[0].children[0];

    let selectedFirst = "";
    let numOfRows , numOfCols;
    numOfRows = numOfCols = 0;


        scoresButton.addEventListener('click', ()=>{
            if (window.localStorage.length === 0){
                leaderboardModal.show();
                leaderboardModalContent.textContent = "No high scores yet !";
            }
            else{
                const leadPlayers = JSON.parse(localStorage.getItem('players'));
                console.log(leadPlayers);
                function sortPlayersByScore() {
                    return createTable(leadPlayers.slice(0,3).sort( (playerA, playerB) =>{return(playerA.score > playerB.score ? -1 : 1); }));
                }
                leaderboardModalContent.innerHTML = sortPlayersByScore();
                leaderboardModal.show();
            }
        });

        selectRows.addEventListener('change', (e) =>{
            if(selectedFirst === "" ) selectedFirst = "rows"

            numOfRows = Number(e.target.value) ;
            console.log(numOfRows,numOfCols )
            if (numOfRows !== 0 && numOfCols !== 0) {
                checkSelection(selectedFirst, numOfRows, numOfCols);
                selectedFirst = "";
                numOfRows = 0 ;
            }

        })

        selectCols.addEventListener('change', (e) =>{
            if (selectedFirst === "" ) selectedFirst = "cols"

            numOfCols = Number(e.target.value) ;
            console.log(numOfRows, numOfCols )
            if (numOfRows !== 0 && numOfCols !== 0) {
                checkSelection(selectedFirst, numOfRows, numOfCols);
                selectedFirst = "";
                numOfCols = 0 ;
            }

        })




});

})();