"use strict";
(()=>{

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







    document.addEventListener("DOMContentLoaded", () => {

    // all buttons elements
    const playButton = document.getElementById("btnPlay");
    const scoresButton = document.getElementById("btnScores");

        let players = [ {player: "Ariel", score: 60},
                        {player: "Sol", score: 100},
                        {player: "Menny", score: 80},
                        {player: "ELi", score: 200}];


        localStorage.setItem("players", JSON.stringify(players));


    const leaderboardModal = new bootstrap.Modal('#scores-modal')
    const leaderboardModalContent = document.getElementsByClassName("modal-body")[0].children[0];

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


    })








    /*    document.getElementById("messageForm").addEventListener("submit", (event) => {
        event.preventDefault();

        // we validate the product:
        if (validateProduct(prod)) {
            // if the product is valid, we add it to the list of products:
            document.getElementById("errorMessages").innerHTML = "Product is saved!";
            // add the product to the list of products and update the HTML table
            addProduct(prod);
        } else
            // if the product is not valid, we display the errors:
            document.getElementById("errorMessages").innerHTML = convertErrorsToHtml(errorMessages);
    });

    // the sort button handler:
    document.getElementById("sortByReference").addEventListener("click", (event) => {
        sortProductsByReference();
    })*/

});

})();