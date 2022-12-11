"use strict";
(()=>{

//-----------------------------------------------------------------------------------
    /**
     * Function to create an error element with error message
     * @param type
     * @param id
     * @param error
     * @param status
     * @param color
     * @returns {*}
     */
    function createElement (type, id, error, status, color ) {

        const elem = document.createElement(type);
        elem.id = id;
        elem.textContent = error;
        elem.style.display = status;
        elem.style.color = color;

        return elem;
    }

//-----------------------------------------------------------------------------------
    /**
     * Module for functions that setting the game
     * @returns {{buildBoard: buildBoard, shuffle: (function(*): *[]), pickRandom: (function(*, *): *[])}}
     */
    function gamePreparations(){

        return {
            buildBoard: (table, unknown, rows, cols, func) =>{
                let i = 0 ;
                for (let row = 0; row < rows; row++) {
                    let tr = document.createElement("tr");
                    for (let col = 0; col < cols; col++,i++) {
                        let td = document.createElement("td");
                        let card = document.createElement("img");
                        card.src = unknown;
                        card.addEventListener('click', func)
                        card.setAttribute('card-id', `${i}`);
                        td.appendChild(card);
                        tr.appendChild(td);
                    }
                    table.appendChild(tr);
                }
            },

            pickRandom : (array, items) => {
                const clonedArray = [...array];
                const randomPicks = [];

                for (let index = 0; index < items; index++) {
                    const randomIndex = Math.floor(Math.random() * clonedArray.length);

                    randomPicks.push(clonedArray[randomIndex]);
                    clonedArray.splice(randomIndex, 1);
                }
                return randomPicks;
            },

            shuffle : (array) =>{
                const clonedArray = [...array];

                for (let index = clonedArray.length - 1; index > 0; index--) {
                    const randomIndex = Math.floor(Math.random() * (index + 1));
                    const original = clonedArray[index];

                    clonedArray[index] = clonedArray[randomIndex];
                    clonedArray[randomIndex] = original;
                }
                return clonedArray;
            }
        }
    }

//-----------------------------------------------------------------------------------
    /**
     * Module of functions that handles the leaderboard table
     * @returns {{isTopThree: ((function(*, *): (boolean))|*), makeTable: (function(*): string), sortPlayers: (function(*): *), alreadyPlayed: ((function(*): (boolean))|*), displayTable: leaderboardTable}}
     */
    function handleTable (){



        const sortPlayersByScore = (players) =>{
            return players.sort( (playerA, playerB) =>{return(playerA.score > playerB.score ? -1 : 1); })
        }

        const checkExists = (name)=>{
            const leadPlayers = JSON.parse(localStorage.getItem('players'));
            if (leadPlayers.length === 0) return false

            for (const player of leadPlayers){
                if (player.name.toLowerCase() === name.toLowerCase() ) return true;
            }
            return false;
        }

        const createTable = (playersList) =>{
            let playersTable = "<table class='table table-hover table-light table-striped-columns'>"+
                " <thead >" + "<tr>" + " <th> Rank </th> " + " <th> Player </th> " + " <th> Score </th> " + "</tr> " + "</thead>" + "<tbody > " ;
            playersList.forEach(player =>{
                playersTable += "" + "<tr> " + "<td>" + (playersList.indexOf(player) + 1) + " </td> " + "<td >" + player.name + " </td> " + "<td >" + player.score + " </td> " + " </tr> "
            })
            playersTable += "</tbody> " + "</table> " ;
            return playersTable;
        }

        const leaderboardTable = (content) =>{
            const leadPlayers = JSON.parse(localStorage.getItem('players'));
            console.log("hi from leader",leadPlayers)
            if (leadPlayers.length === 0) content.textContent  = "No high scores yet !";
            else content.innerHTML = createTable(sortPlayersByScore(leadPlayers));
        }

        const checkAmongTheBest = (playerScore, players) =>{

            for (let i = 0 ; i < players.length ;i++){
                if(playerScore > players[i].score) return true
            }
            return false;
        }

        return{
            sortPlayers : sortPlayersByScore,
            alreadyPlayed : checkExists,
            makeTable : createTable,
            displayTable : leaderboardTable,
            isTopThree: checkAmongTheBest,

        }

    }


//-----------------------------------------------------------------------------------
    /**
     * Module of functions that handles user input(click) and therefore the gameplay
     * @returns {{runGame: startGame, displayHighScore: leaderboardTable, deleteBoard: deleteCurrBoard}}
     */
    function handleClickEvents (){

        let items = [];
        let cardsChosen = [];
        let cardsChosenId = [];
        let cardsMatchedId = [];
        let steps = 0 ;
        let cards , currGameData;
        let stepsElem = document.getElementById("steps");
        let cardPlayedElem = document.getElementById("cardsPlayed");
        let scoreElem = document.getElementById("score");
        const manageTable = handleTable();


        function initData (data) {
            items = [];
            cardsChosen = [];
            cardsChosenId = [];
            cardsMatchedId = [];
            steps = 0 ;
            currGameData = {...data}
        }


        function handleWin(){

            cardPlayedElem.textContent = `Number of cards played : ${currGameData.row * currGameData.col }`;
            let score = Math.floor((10 * currGameData.row * currGameData.col) - steps - (10 *  currGameData.delay));
            const leadPlayers = JSON.parse(localStorage.getItem('players'));
            const newElem = document.createElement("p")
            newElem.setAttribute('id', 'currLeadboard');
            scoreElem.insertAdjacentElement('afterend',newElem)
            let index ,sorted;

            const findIndex = (array)=>{
                index = array.findIndex(object => {
                    return object.name === currGameData.playerName;
                });
            }

            const addOrEditPlayer = ()=>{
            if (!manageTable.alreadyPlayed(currGameData.playerName)){
                leadPlayers.push({name: currGameData.playerName ,score});
            }
            else{
                findIndex(leadPlayers);
                leadPlayers[index].score = score;
            }
        }

        if (leadPlayers.length < 3 ) {
            addOrEditPlayer()
            sorted = manageTable.sortPlayers(leadPlayers);
            findIndex(sorted);
            localStorage.clear()
            localStorage.setItem("players", JSON.stringify(sorted));
            newElem.innerHTML = manageTable.makeTable(sorted)
            scoreElem.textContent = `Score: ${score} ,You are ranked :  ${index+1}`;
        }
        else {
            if (manageTable.isTopThree(score, leadPlayers)){

                addOrEditPlayer()
                sorted = manageTable.sortPlayers(leadPlayers);
                let topThree = sorted.slice(0,3);
                findIndex(topThree);
                localStorage.clear()
                localStorage.setItem("players", JSON.stringify(topThree));
                scoreElem.textContent = `Score: ${score} ,You are ranked :  ${index+1}`;
                newElem.innerHTML = manageTable.makeTable(topThree)
            }
            else{
                scoreElem.textContent = `Score: ${score} ,You score is not high enough to be at top 3 !`;
                newElem.innerHTML = manageTable.makeTable(leadPlayers)
            }
        }

            document.getElementById("game").style.display = 'none';
            document.getElementById("gameOver").style.display = 'block';
        }


        function checkMatchCards () {

            if (cardsChosen[0] === cardsChosen[1] && cardsChosenId[0] !== cardsChosenId[1]){
                cards[cardsChosenId[0]].removeEventListener('click', flipCard);
                cards[cardsChosenId[1]].removeEventListener('click', flipCard);
                cardsMatchedId.push(cardsChosenId[0])
                cardsMatchedId.push(cardsChosenId[1])
            }
            else {
                cards[cardsChosenId[0]].setAttribute('src', 'images/card.jpg')
                cards[cardsChosenId[1]].setAttribute('src', 'images/card.jpg')
            }

            if  (cardsMatchedId.length === items.length) {
                handleWin();
            }
            cards.forEach((elem) =>{
                if (!cardsMatchedId.includes(elem.getAttribute('card-id')))
                    elem.addEventListener('click', flipCard)});
            cardsChosen = [];
            cardsChosenId = [];
        }


        function flipCard () {

            steps++;
            stepsElem.textContent = `Steps: ${steps} `
            let imageIndex = this.getAttribute('card-id')
            cardsChosen.push(items[imageIndex].name)
            cardsChosenId.push(imageIndex);
            this.setAttribute('src', items[imageIndex].img)
            if (cardsChosen.length === 2 ) {
                cards.forEach((elem) =>{elem.removeEventListener('click', flipCard);});
                setTimeout(checkMatchCards, currGameData.delay * 1000);
            }

        }

        const startGame = (data) => {
            const gamePrep = gamePreparations();
            initData(data);
            stepsElem.textContent = `Steps: ${steps} `
            gamePrep.buildBoard(data.board, data.allCard[0].img, data.row, data.col, flipCard);
            cards = document.querySelectorAll('img')
            const picks = gamePrep.pickRandom(data.allCard.splice(1,data.allCard.length+1), (data.row * data.col) / 2);
            items = gamePrep.shuffle([...picks, ...picks]);

        }

        const deleteCurrBoard = (board) =>{
            while ( board.firstChild) {
                board.removeChild( board.firstChild);
            }
        }

        return {
            displayHighScore : manageTable.displayTable,
            runGame : startGame,
            deleteBoard : deleteCurrBoard,
        }
    }

    //-----------------------------------------------------------------------------------
    /**
     * Module of functions of validations. such as name , correct size of board ,etc.
     * @returns {{validateGameBoardSize: checkSizeParameters, matSizeValidator: (function(*, *): boolean), validateName: (function(*))}}
     */
    function validations (){

        const checkMatSize = (rows, cols) =>{
            return ((rows * cols) % 2) === 0;
        }

        const checkSizeParameters = (data) => {

            if (!checkMatSize(data.row, data.col) && !document.contains(document.getElementById("wrongMatSizeMessage"))){
                data.elemDiv.appendChild(createElement("p","wrongMatSizeMessage",data.error,"block",`red`));
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
    /**
     * Module of functions that stores all the data about the game, with getter and setter functions.
     * @returns {{getError: (function(*): string), setGameDelay: setGameDelay, getBoardRows: (function(): *), getCardArray: (function(): ({img: string, name: string}|{img: string, name: string}|{img: string, name: string}|{img: string, name: string}|{img: string, name: string})[]), getBoardCols: (function(): *), initGameStat: initGameStat, getGameDelay: (function(): *)}}
     */
    function getData() {

        const errorMessages = [
            "Number of cards (rows X columns) must be\n even, please correct your choice.",
            "Name cannot contain special charcters, \n also be no more than 12 characters."
        ];

        const cardArray = [
            { name: 'unknown', img: 'images/card.jpg'},
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

        let boardRows, boardCols, gameDelay ;
        boardRows = boardCols = gameDelay = 0;

        return{
            getBoardRows: ()=>{ return boardRows;},
            getBoardCols: ()=>{ return boardCols;},
            getGameDelay: ()=>{ return gameDelay;},

            getError: (index)=>{ return errorMessages[index];},
            getCardArray :()=>{
                const cloned = Array.from(cardArray);
                return cloned;},

            setGameDelay: (delay)=>{
                gameDelay = delay;},

            initGameStat: (name, rows, cols, delay)=>{
                boardRows = rows;
                boardCols = cols;
                gameDelay = delay;
            },

        }
    }
    //-----------------------------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {

        const leaderboardModalContent = document.getElementsByClassName("modal-body")[0].children[0];

        const playNameInput = document.getElementById("playerName");
        const playButton = document.getElementById("btnPlay");
        const highScoresButton = document.getElementById("btnHighScores");
        const abandonButton = document.getElementById("btnAbandon");
        const okButton = document.getElementById("btnOK");

        const selectRows = document.getElementById("NumberOfRows");
        const selectCols = document.getElementById("NumberOfCols");
        const selectDelay = document.getElementById("Delay");
        const gameBoardTable = document.querySelector('.table')

        const NameDivElem = document.getElementById("Name");
        const rowsDivElem = document.getElementById("rows");
        const colsDivElem = document.getElementById("cols");
        const formDivElem = document.getElementById("preGame");


        const handleButtonsClick = handleClickEvents();
        const validator = validations();
        const gameData = getData();

        highScoresButton.addEventListener('click', ()=>{
            handleButtonsClick.displayHighScore(leaderboardModalContent);
        });

        selectRows.addEventListener('change',(e)=>{

            let checkedData = {
                row : e.target.value,
                col : selectCols.value,
                elemDiv : rowsDivElem,
                elemPlay : playButton,
                error : gameData.getError(0),
            };

            validator.validateGameBoardSize(checkedData);

        });

        selectCols.addEventListener('change',(e)=>{

            let checkedData = {
                row : selectRows.value,
                col : e.target.value,
                elemDiv : colsDivElem,
                elemPlay : playButton,
                error : gameData.getError(0),
            };

            validator.validateGameBoardSize(checkedData);
        });

        selectDelay.addEventListener('change',(e)=>{
            gameData.setGameDelay(e.target.value);
        });

        playButton.addEventListener('click',(e)=>{

            let name = playNameInput.value.trim();

            if(validator.validateName(name)){

                if (document.contains(document.getElementById("wrongName")))
                    document.getElementById("wrongName").remove()

                formDivElem.style.display = 'none';
                gameData.initGameStat( name, selectRows.value, selectCols.value, selectDelay.value);
                const data = {
                    playerName : name,
                    board :gameBoardTable,
                    allCard : gameData.getCardArray(),
                    row : gameData.getBoardRows(),
                    col : gameData.getBoardCols(),
                    delay : gameData.getGameDelay(),
                };
                handleButtonsClick.runGame(data);
                document.getElementById("game").style.display = 'block'
            }
            else{
                if (!document.contains(document.getElementById("wrongName")))
                    NameDivElem.appendChild(createElement("p","wrongName",gameData.getError(1),"block",`red`))
            }
        });

        abandonButton.addEventListener('click', ()=>{
            handleButtonsClick.deleteBoard(gameBoardTable)
            document.getElementById("game").style.display = 'none';
            formDivElem.style.display = 'block';
        })
        okButton.addEventListener('click', ()=>{
            handleButtonsClick.deleteBoard(gameBoardTable)
            document.getElementById('currLeadboard').remove()
            document.getElementById("gameOver").style.display = 'none';
            formDivElem.style.display = 'block';
        })
    });

})();