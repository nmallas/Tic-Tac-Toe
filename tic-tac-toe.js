window.addEventListener("DOMContentLoaded", (event) => {


    const board = document.getElementById("tic-tac-toe-board");
    let arr = ["square-0", "square-1", "square-2", "square-3", "square-4", "square-5", "square-6", "square-7", "square-8"];
    const turnOnComputer = localStorage.getItem("computer");
    populate();
    if(turnOnComputer) {
        computerOpponent();
    } else {
        playSelf();
    }

    //Play Computer Logic

    function computerOpponent() {
        board.addEventListener("click", event => {
            let numberOfTimesClicked = arr.filter(el => el === "X" || el === "O").length;
            let difficulty = localStorage.getItem("computer");
            const clicked = event.target;
            console.log(clicked);
            let clickedID = event.target.id;
            let xImage = document.createElement("img");
            let oImage = document.createElement("img");
            xImage.setAttribute("src", "./images/player-x.svg");
            oImage.setAttribute("src", "./images/player-o.svg");
            if(arr.indexOf(clickedID) > -1 && numberOfTimesClicked % 2 === 0) {
                function playerMove () {
                    arr[arr.indexOf(clickedID)] = "X";
                    localStorage.setItem(clicked.id, "<img src = './images/player-x.svg'>");
                    clicked.appendChild(xImage);
                }
                function computerMove () {
                    let possibilites = arr.filter(el => el !== "X" && el !== "O");
                    let computerInd = Math.floor((Math.random()*possibilites.length));
                    let computerMove = possibilites[computerInd];

                    const optimize = () => {
                        let winning;

                        // take mid-square on first move if available
                        // Otherwise play corner move
                        if(numberOfTimesClicked < 2) {
                            if(arr[4] !== "X") {
                                computerMove = "square-4";
                        }   else if (Number(computerMove[computerMove.length-1]) % 2 !== 0 && (difficulty === "Impossible")) {
                            computerMove = "square-8";
                            }
                        }

                        // test to see if immediate win
                        if(numberOfTimesClicked >= 2) {
                            // Winning Check
                            for(let i=0; i<possibilites.length; i++) {
                                let arrCopy = arr.slice();
                                let possibility = possibilites[i];
                                arrCopy[arr.indexOf(possibility)] = "O";
                                if(determineWinner(arrCopy, numberOfTimesClicked, true)) {
                                    computerMove = possibility;
                                    winning = true;
                                    break;
                                }
                            }

                            // Block opponents winning move if no immediate win
                            if(!winning) {
                                for(let i=0; i<possibilites.length; i++) {
                                    let arrCopy = arr.slice();
                                    let possibility = possibilites[i];
                                    arrCopy[arr.indexOf(possibility)] = "X";
                                    if(determineWinner(arrCopy, numberOfTimesClicked, true)) {
                                        computerMove = possibility;
                                        winning = true;
                                        break;
                                     }
                                }
                            }

                            // If no winning move, play corner move -- impossible to win against
                            if(!winning) {
                                if (Number(computerMove[computerMove.length-1]) % 2 !== 0 && (difficulty === "Impossible")) {
                                    let corners = possibilites.filter(poss => Number(poss[poss.length-1]) % 2 === 0 && poss !== "square-4");
                                    computerMove = corners.length ? corners[0] : computerMove;
                                }
                            }

                        }
                    }

                    if(difficulty === "Hard" || difficulty === "Impossible") optimize();

                    let computerReplace = document.getElementById(computerMove);
                    arr[arr.indexOf(computerMove)] = "O";
                    localStorage.setItem(computerMove, "<img src = './images/player-o.svg'>");
                    computerReplace.appendChild(oImage);
                }
                playerMove();
                let gameResult = determineWinner(arr, numberOfTimesClicked);
                if(gameResult) handleResult();
                if(!gameResult) computerMove();
                gameResult = determineWinner(arr, numberOfTimesClicked);
                if(gameResult) handleResult();
                function handleResult(){
                    let newGameButton = document.getElementById("new-game");
                    newGameButton.removeAttribute("disabled");
                    let gameStatus = document.getElementById("game-status");
                    if(gameResult === "tie") {
                        gameStatus.innerHTML = "Winner: None";
                    } else {
                    gameStatus.innerHTML = `${gameResult}'s Win!`
                    }
                    newGameButton.addEventListener("click", e => {
                        localStorage.clear();
                        location.reload();
                    })
                }

            }
       })
    }

    // Play Self Logic

    function playSelf() {
        board.addEventListener("click", (event) => {
            const clicked = event.target;
            let xImage = document.createElement("img");
            let oImage = document.createElement("img");
            xImage.setAttribute("src", "./images/player-x.svg");
            oImage.setAttribute("src", "./images/player-o.svg");
            let clickedID = event.target.id;
            let numberOfTimesClicked = arr.filter(el => el === "X" || el === "O").length;
            if(arr.indexOf(clickedID) > -1 && numberOfTimesClicked % 2 === 0&& !determineWinner(arr)) {
                arr[arr.indexOf(clickedID)] = "X";
                localStorage.setItem(clicked.id, "<img src = './images/player-x.svg'>");
                clicked.appendChild(xImage);
            }
            if(arr.indexOf(clickedID) > -1 && numberOfTimesClicked % 2 !== 0 && !determineWinner(arr)) {
                arr[arr.indexOf(clickedID)] = "O";
                localStorage.setItem(clicked.id, "<img src = './images/player-o.svg'>");
                clicked.appendChild(oImage);
            }

            if (numberOfTimesClicked >= 4) {
                let gameResult = determineWinner(arr, numberOfTimesClicked);
                if(gameResult) {
                    let newGameButton = document.getElementById("new-game");
                    newGameButton.removeAttribute("disabled");
                    let gameStatus = document.getElementById("game-status");
                    if(gameResult === "tie") {
                        gameStatus.innerHTML = "Winner: None";
                    } else {
                    gameStatus.innerHTML = `${gameResult}'s Win!`;
                    }
                    newGameButton.addEventListener("click", e => {
                        localStorage.clear();
                        location.reload();
                    });
                }
            }
        })
    }


    function populate() {
        const squares = document.querySelectorAll(".square");
        let xImage = document.createElement("img");
        let oImage = document.createElement("img");
        xImage.setAttribute("src", "./images/player-x.svg");
        oImage.setAttribute("src", "./images/player-o.svg");
        squares.forEach(square => {
            innerVal = localStorage.getItem(`${square.id}`);
            square.innerHTML = innerVal;
            let arrIndex = arr.indexOf(square.id);
            if(innerVal && innerVal.includes("player-x")) {
                arr[arrIndex] = "X";
            } else if (innerVal && innerVal.includes("player-o")) {
                arr[arrIndex] = "O";
            }
        })
    }

    function determineWinner(arr, num, noStyle) {
        let array2D = [[arr[0], arr[1], arr[2]], [arr[3], arr[4], arr[5]], [arr[6], arr[7], arr[8]]];
        // test horizontally
        for(let i=0; i<array2D.length; i++) {
            let innerArray = array2D[i];
            if(innerArray.filter(el => el === innerArray[0]).length === 3) {
                if(!noStyle) {
                    let winners = document.getElementsByClassName(`row-${i+1}`);
                    for(let i=0; i<winners.length; i++) {
                        winners[i].style.backgroundColor = "#51E2F5";
                    }
                }
                return innerArray[0];
            }
        }
        // test vertically
        for(let j=0; j<3; j++) {
            if(arr[j] === arr[j+3] && arr[j] === arr[j+6]) {
                if(!noStyle) {
                    let winners = document.getElementsByClassName(`col-${j+1}`);
                    for(let i=0; i<winners.length; i++) {
                        winners[i].style.backgroundColor = "#51E2F5";
                    }
                }
                return arr[j];
            }
        }
        // test diagonally
        if(arr[0] === arr[4] && arr[0] === arr[8]) {
            if(!noStyle) {
                let winners = document.getElementsByClassName(`diag-1`);
                for(let i=0; i<winners.length; i++) {
                    winners[i].style.backgroundColor = "#51E2F5";
                }
            }
            return arr[0];
        }
        if(arr[2] === arr[4] && arr[2] === arr[6]) {
            if(!noStyle) {
                let winners = document.getElementsByClassName(`diag-2`);
                for(let i=0; i<winners.length; i++) {
                    winners[i].style.backgroundColor = "#51E2F5";
                }
            }
            return arr[2];
        }

        if(num === 8) {
            let all = document.getElementsByClassName(`square`);
                for(let i=0; i<all.length; i++) {
                    all[i].style.backgroundColor = "#FFA8B6";
                }
            return "tie";
        }
        return false;
    }


    // Give up -----  //
    let giveUpButton = document.getElementById("give-up");
    giveUpButton.addEventListener("click", e => {
        let numberOfTimesClicked = arr.filter(el => el === "X" || el === "O").length;
        let gameStatus = document.getElementById("game-status");
        let gameResult = numberOfTimesClicked % 2 ? "X" : "O";
        gameStatus.innerHTML = `${gameResult}'s Win!`
        let all = document.getElementsByClassName(`square`);
            for(let i=0; i<all.length; i++) {
                all[i].style.backgroundColor = "#FFA8B6";
            }
        giveUpButton.setAttribute("disabled", "true");
        let newGameButton = document.getElementById("new-game");
        newGameButton.removeAttribute("disabled");
        newGameButton.addEventListener("click", e => {
            localStorage.clear();
            location.reload();
        })
    })


    // Logic to play computer
    let computerButton = document.getElementById("play-computer");
    computerButton.addEventListener("click", e => {
        const difficulty = document.getElementById("set-difficulty");
        localStorage.clear();
        localStorage.setItem("computer", difficulty.value);
        location.reload();
    })

})
