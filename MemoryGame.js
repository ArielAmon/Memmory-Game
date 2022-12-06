"use strict";
(()=>{
    /**
     *
     * @param playersList
     * @returns {string}
     */
    function createTable (playersList) {
        let playersTable = "<table class='table table-hover table-light table-striped-columns'>"+
            " <thead >" + "<tr>" + " <th> Rank </th> " + " <th> Player </th> " + " <th> Score </th> " + "</tr> " + "</thead>" + "<tbody > " ;
        playersList.forEach(player =>{
            playersTable += "" + "<tr  > " + "<td >" + (playersList.indexOf(player) + 1) + " </td> " + "<td >" + player.player + " </td> " + "<td >" + player.score + " </td> " + " </tr> "
        })
        playersTable += "</tbody> " + "</table> " ;
        return playersTable;
    }

    function getSetHtmlElements (){

        const leaderboardModal = new bootstrap.Modal('#scores-modal')
        const leaderboardModalContent = document.getElementsByClassName("modal-body")[0].children[0];


        const playNameInput = document.getElementById("playerName");
        const playButton = document.getElementById("btnPlay");
        const scoresButton = document.getElementById("btnScores");

        const selectRows = document.getElementById("NumberOfRows");
        const selectCols = document.getElementById("NumberOfCols");
        const selectDelay = document.getElementById("Delay");

        const NameDiv = document.getElementById("Name");
        const rowsDiv = document.getElementById("rows");
        const colsDiv = document.getElementById("cols");
        const formDiv = document.getElementById("preGame");

        const score = () =>{ return scoresButton; }
        const play = () =>{ return playButton; }
        const playerName = () =>{ return playNameInput; }

        const rows = () =>{ return selectRows; }
        const cols = () =>{ return selectCols; }
        const delay = () =>{ return selectDelay; }

        const rowsDivEelem = () =>{ return rowsDiv; }
        const colsDivEelem = () =>{ return colsDiv; }
        const nameDivEelem = () =>{ return NameDiv; }
        const formDivEelem = () =>{ return formDiv; }

        const leaderboard = () =>{ return leaderboardModal; }
        const leaderboardContent = () =>{ return leaderboardModalContent; }

        const createElement = (type, id, error, status, color ) =>{

            const elem = document.createElement(type);
            elem.id = id;
            elem.textContent = error;
            elem.style.display = status;
            elem.style.color = color;

            return elem;
        }


        return{
            getScoreButton : score,
            getPlayButton : play,
            getRowsSelect : rows,
            getColsSelect : cols,
            getDelaySelect : delay,
            getRowsDivElem : rowsDivEelem,
            getColsDivElem : colsDivEelem,
            getNameDivElem : nameDivEelem,
            getformDivElem : formDivEelem,
            getPlayerNameElem : playerName,
            getLeaderboardModal : leaderboard,
            getLeaderboardContent : leaderboardContent,

            setNewElement : createElement,

        }

    }

    function handleClickEvents (){

        const leaderboardTable = (modal, content) =>{
            if (window.localStorage.length === 0){
                modal.show();
                content.textContent = "No high scores yet !";
            }
            else{
                const leadPlayers = JSON.parse(localStorage.getItem('players'));
                console.log(leadPlayers);
                function sortPlayersByScore() {
                    let sorted = leadPlayers.sort( (playerA, playerB) =>{return(playerA.score > playerB.score ? -1 : 1); })
                    return createTable(sorted.slice(0,3));
                }
                content.innerHTML = sortPlayersByScore();
                modal.show();
            }
        }

        return {
            displayHighScore : leaderboardTable

        }
    }

    function validations (){

        const checkMatSize = (rows, cols) =>{
            return ((rows * cols) % 2) === 0;
        }

        const checkSizeParamters = (data) => {

            if (!checkMatSize(data.row, data.col) && !document.contains(document.getElementById("wrongMatSizeMessage"))){
                data.elemDiv.appendChild(data.addFunc("p","wrongMatSizeMessage",data.error,"block",`red`));
                data.elemPlay.setAttribute("disabled", "true")
            }
            else {
                if(document.contains(document.getElementById("wrongMatSizeMessage"))){
                    document.getElementById("wrongMatSizeMessage").remove();
                }
                data.elemPlay.removeAttribute("disabled")
            }
        }

        const checkName = (nameToCheck) =>{
            return (/^[A-Za-z0-9]+$/.test(nameToCheck) && (nameToCheck.length <= 12))

        }



        return{
            matSizeValidator : checkMatSize,
            validateGameBoardSize :checkSizeParamters,
            validateName : checkName

        }

    }

    function getData() {

        const errorMessages = [
            "Number of cards (rows X columns) must be\n even, please correct your choice.",
            "Name cannot contain special charcters, \n also be no more than 12 characters."
        ];

        let playerName = "";
        let boardRows, boardCols, gameDelay ;
        boardRows = boardCols = gameDelay = 0;
        let playersList = [];

        return{

            getPlayerName: ()=>{ return playerName;},
            getBoardRows: ()=>{ return boardRows;},
            getBoardCols: ()=>{ return boardCols;},
            getGameDelay: ()=>{ return gameDelay;},

            getError: (index)=>{ return errorMessages[index];},

            setPlayerName: (name)=>{ playerName = name;},
            setBoardRows: (rows)=>{ boardRows = rows;},
            setBoardCols: (cols)=>{ boardCols = cols;},
            setGameDelay: (delay)=>{ gameDelay = delay;},

            initGameStat: (name, rows, cols, delay)=>{
                playersList.append(name)
                playerName = name;
                 boardRows = rows;
                 boardCols = cols;
                 gameDelay = delay;
            },

        }
    }

    document.addEventListener("DOMContentLoaded", () => {

        const domElements = getSetHtmlElements();
        const handleButtonsClick = handleClickEvents();
        const validator = validations();
        const gameData = getData();


        let players = [ {player: "Ariel", score: 70},
                        {player: "Sol", score: 100},
                        {player: "Noam", score: 8000000},
                        {player: "ELi", score: 2500},
                        {player: "Miri", score: 5000}];


        localStorage.setItem("players", JSON.stringify(players));


        domElements.getScoreButton().addEventListener('click', ()=>{

            handleButtonsClick.displayHighScore(domElements.getLeaderboardModal(), domElements.getLeaderboardContent());
        });

        domElements.getRowsSelect().addEventListener('change',(e)=>{

            let checkedData = {
                row : e.target.value,
                col : domElements.getColsSelect().value,
                elemDiv : domElements.getRowsDivElem(),
                elemPlay : domElements.getPlayButton(),
                addFunc : domElements.setNewElement,
                error : gameData.getError(0),
            };

            validator.validateGameBoardSize(checkedData);

        });

        domElements.getColsSelect().addEventListener('change',(e)=>{

            let checkedData = {
                row : domElements.getRowsSelect().value,
                col : e.target.value,
                elemDiv : domElements.getColsDivElem(),
                elemPlay : domElements.getPlayButton(),
                addFunc : domElements.setNewElement,
                error : gameData.getError(0),
            };

            validator.validateGameBoardSize(checkedData);
        });

        domElements.getDelaySelect().addEventListener('change',(e)=>{
            gameData.setGameDelay(e.target.value);
        });

        domElements.getPlayButton().addEventListener('click',(e)=>{

            let name = domElements.getPlayerNameElem().value.trim();

            if(validator.validateName(name)){

                if (document.contains(document.getElementById("wrongName")))
                    document.getElementById("wrongName").remove()

                domElements.getformDivElem().style.display = 'none';

                //gameData.initGameStat()
                // run game
            }
            else{
               if (!document.contains(document.getElementById("wrongName")))
                    domElements.getNameDivElem().appendChild(domElements.setNewElement("p","wrongName",gameData.getError(1),"block",`red`))
            }



        });




});

})();