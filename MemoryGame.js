"use strict";
(()=>{


    document.addEventListener("DOMContentLoaded", () => {

    // all buttons elements
    const playButton = document.getElementById("btnPlay");
    const settingsButton = document.getElementById("btnSettings");
    const scoresButton = document.getElementById("btnScores");

    const setting = document.getElementById("settings");
    const leaderboardModal = new bootstrap.Modal('#scores-modal')
    const leaderboardModalContent = document.getElementsByClassName("modal-body")[0].children[0];


    settingsButton.addEventListener('click' , ()=>{
        if (setting.style.display === "none") {
            setting.style.display = "block";
        } else {
            setting.style.display = "none";
        }
    });

    scoresButton.addEventListener('click', ()=>{
        if (window.localStorage.length === 0){
            leaderboardModal.show();
            leaderboardModalContent.textContent = "No high scores yet !"
        }
        // else{
        //     leaderboardModalContent.textContent = window.localStorage.
        // }


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