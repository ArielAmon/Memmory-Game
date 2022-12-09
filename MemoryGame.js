"use strict";
(()=>{

    //-----------------------------------------------------------------------------------

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

        const rowsDivElem = () =>{ return rowsDiv; }
        const colsDivElem = () =>{ return colsDiv; }
        const nameDivElem = () =>{ return NameDiv; }
        const formDivElem = () =>{ return formDiv; }

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
            getRowsDivElem : rowsDivElem,
            getColsDivElem : colsDivElem,
            getNameDivElem : nameDivElem,
            getFormDivElem : formDivElem,
            getPlayerNameElem : playerName,
            getLeaderboardModal : leaderboard,
            getLeaderboardContent : leaderboardContent,

            setNewElement : createElement,

        }

    }

//-----------------------------------------------------------------------------------

    function handleClickEvents (){

        //private function
        function createTable (playersList) {
            let playersTable = "<table class='table table-hover table-light table-striped-columns'>"+
                " <thead >" + "<tr>" + " <th> Rank </th> " + " <th> Player </th> " + " <th> Score </th> " + "</tr> " + "</thead>" + "<tbody > " ;
            playersList.forEach(player =>{
                playersTable += "" + "<tr  > " + "<td >" + (playersList.indexOf(player) + 1) + " </td> " + "<td >" + player.player + " </td> " + "<td >" + player.score + " </td> " + " </tr> "
            })
            playersTable += "</tbody> " + "</table> " ;
            return playersTable;
        }

        //private function
        function pickRandom (array, items)  {
            const clonedArray = [...array];
            const randomPicks = [];

            for (let index = 0; index < items; index++) {
                const randomIndex = Math.floor(Math.random() * clonedArray.length);

                randomPicks.push(clonedArray[randomIndex]);
                clonedArray.splice(randomIndex, 1);
            }

            return randomPicks;
        }

        //private function
        function shuffle (array) {
            const clonedArray = [...array];

            for (let index = clonedArray.length - 1; index > 0; index--) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                const original = clonedArray[index];

                clonedArray[index] = clonedArray[randomIndex];
                clonedArray[randomIndex] = original;
            }

            return clonedArray;
        }



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

        const startGame = (images, rows, cols) => {
            const picks = pickRandom(images, (rows * cols) / 2);
            const items = shuffle([...picks, ...picks]);
            console.log(items)
            const table = document.querySelector('.board')

            let index = 0
            // create the table element
            // create the rows and cells of the table
            for (let row = 0; row < rows; row++) {
                let tr = document.createElement("tr");
                for (let col = 0; col < cols; col++,index++) {
                    let td = document.createElement("td");
                    let img = document.createElement("img");
                    img.src = items[index].img;
                    img.classList.add(`${row}${col}`)
                    //img.classList.add(`${array[count++]}`)
                    td.appendChild(img);
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }

            // insert the table into the page


            /*            for (let i = 0; i < items.length; i++) {
                            const card = document.createElement('img')
                            card.setAttribute('src', 'images/blank.png')
                            card.setAttribute('data-id', i)
                            //card.addEventListener('click', flipCard)

                            grid.appendChild(card)
                        }*/


        }

        return {
            displayHighScore : leaderboardTable,
            runGame : startGame

        }
    }

    //-----------------------------------------------------------------------------------
    function validations (){

        const checkMatSize = (rows, cols) =>{
            return ((rows * cols) % 2) === 0;
        }

        const checkSizeParameters = (data) => {

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
            validateGameBoardSize :checkSizeParameters,
            validateName : checkName

        }

    }
    //-----------------------------------------------------------------------------------


    function getData() {

        const errorMessages = [
            "Number of cards (rows X columns) must be\n even, please correct your choice.",
            "Name cannot contain special charcters, \n also be no more than 12 characters."
        ];

        const unknownCard = { name: 'unknown', img: 'images/card.jpg'};
        const cardArray = [
            { name: 'Banana', img: 'images/0.jpg'},
            { name: 'Grape', img: 'images/1.jpg'},
            { name: 'Coconut', img: 'images/2.jpg'},
            { name: 'Guava', img: 'images/3.jpg'},
            { name: 'Watermelon', img: 'images/4.jpg'},
            { name: 'Peach', img: 'images/5.jpg'},
            { name: 'Blueberry', img: 'images/6.jpg'},
            { name: 'Orange', img: 'images/7.jpg'},
            { name: 'Apple', img: 'images/8.jpg'},
            { name: 'Lemon', img: 'images/9.jpg'},
            { name: 'Kiwi', img: 'images/10.jpg'},
            { name: 'Raspberry', img: 'images/11.jpg'},
            { name: 'Apricot', img: 'images/12.jpg'},
            { name: 'Pineapple', img: 'images/13.jpg'},
            { name: 'Strawberry', img: 'images/14.jpg'},
            { name: 'Melon', img: 'images/15.jpg'},
        ];

        let playersList = [];
        let boardRows, boardCols, gameDelay ;
        boardRows = boardCols = gameDelay = 0;

        return{
            getBoardRows: ()=>{ return boardRows;},
            getBoardCols: ()=>{ return boardCols;},
            getGameDelay: ()=>{ return gameDelay;},

            getError: (index)=>{ return errorMessages[index];},
            getImagesArray:()=>{return cardArray;},
            getPlayersList :()=>{return playersList;},
            getCardArray :()=>{return cardArray;},

            setBoardRows: (rows)=>{ boardRows = rows;},
            setBoardCols: (cols)=>{ boardCols = cols;},
            setGameDelay: (delay)=>{ gameDelay = delay;},

            initGameStat: (name, rows, cols)=>{
                playersList.push({name : 0})
                 boardRows = rows;
                 boardCols = cols;
            },

        }
    }
    //-----------------------------------------------------------------------------------
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

                domElements.getFormDivElem().style.display = 'none';
                gameData.initGameStat(name, domElements.getRowsSelect().value, domElements.getColsSelect().value);
                handleButtonsClick.runGame(gameData.getCardArray(),gameData.getBoardRows(),gameData.getBoardCols());
                document.getElementById("game").style.display = 'block'

            }
            else{
               if (!document.contains(document.getElementById("wrongName")))
                    domElements.getNameDivElem().appendChild(domElements.setNewElement("p","wrongName",gameData.getError(1),"block",`red`))
            }



        });




});

})();