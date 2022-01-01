let playablePos = [];
let map = new Map();
let turn = true;
let win = false;
let mostRecent = "";

let whitePieces = ["\u2656", "\u2658", "\u2657", "\u2655", "\u2654", "\u2659"];
let blackPieces = ["\u265C", "\u265E", "\u265D", "\u265B", "\u265A", "\u265F"];
let board = document.getElementsByClassName("board")[0];

map.set("\u2656", "rook");
map.set("\u265C", "rook");
map.set("\u2658", "knight");
map.set("\u265E", "knight");
map.set("\u2657", "bishop");
map.set("\u265D", "bishop");
map.set("\u2655", "queen");
map.set("\u265B", "queen");
map.set("\u2654", "king");
map.set("\u265A", "king");
map.set("\u2659", "pawn");
map.set("\u265F", "pawn");

function createBoard()
{
    for (let i=8;i>=1;i--)
    {
        let alternate = i % 2 === 0;
        let letter = "A";

        for (let j=1;j<=8;j++)
        {
            let block = document.createElement("div");
            block.className = "board-block";
            block.id = i + String.fromCharCode(letter.charCodeAt(0));
            block.addEventListener("click", function () {
                blockClick(this.id);
            })

            letter = String.fromCharCode(letter.charCodeAt(0) + 1);
            board.appendChild(block);

            if (alternate)
                block.style.backgroundColor = "sandybrown";
            else
                block.style.backgroundColor = "saddlebrown";

            alternate = !alternate;
        }
    }
}

function fillBoard()
{
    let letter = "A";
    while (letter !== "I")
    {
        let whiteBlock = document.getElementById("1" + letter);
        let whitePawnBlock = document.getElementById("2" + letter);
        let blackBlock = document.getElementById("8" + letter);
        let blackPawnBlock = document.getElementById("7" + letter);

        if (letter === "A" || letter === "H")
        {
            whiteBlock.innerText = "\u2656";
            blackBlock.innerText = "\u265C";
            blackBlock.style.color = "#1A1A1A";
        }
        else if (letter === "B" || letter === "G")
        {
            whiteBlock.innerText = "\u2658";
            blackBlock.innerText = "\u265E";
            blackBlock.style.color = "#1A1A1A";
        }
        else if (letter === "C" || letter === "F")
        {
            whiteBlock.innerText = "\u2657";
            blackBlock.innerText = "\u265D";
            blackBlock.style.color = "#1A1A1A";
        }
        else if (letter === "D")
        {
            whiteBlock.innerText = "\u2655";
            blackBlock.innerText = "\u265B";
            blackBlock.style.color = "#1A1A1A";
        }
        else
        {
            whiteBlock.innerText = "\u2654";
            blackBlock.innerText = "\u265A";
            blackBlock.style.color = "#1A1A1A";
        }

        whitePawnBlock.innerText = "\u2659";
        blackPawnBlock.innerText = "\u265F";
        blackPawnBlock.style.color = "#1A1A1A";

        letter = String.fromCharCode(letter.charCodeAt(0) + 1);
    }
}

function blockClick(buttonId)
{
    if (win)
        return;

    let block = document.getElementById(buttonId);

    if (playablePos.includes(buttonId) && mostRecent !== buttonId)
    {
        let tempText = document.getElementById(mostRecent).innerText;
        block.innerText = document.getElementById(mostRecent).innerText;
        document.getElementById(mostRecent).innerText = "";

        turn = !turn;
        let kingBlock = findKing();
        if (checkCheck(parseInt(kingBlock[0]), kingBlock[1])[0])
        {
            window.alert("Invalid Move! You are still or will be under check");
            document.getElementById(mostRecent).innerText = block.innerText;
            block.innerText = tempText;
            clearBoard();
            turn = !turn;
            return;
        }
        turn = !turn;

        if (!turn)
            block.style.color = "#1A1A1A";
        else
            block.style.color = "#FFF";

        kingBlock = findKing();
        let possibleChecks = checkCheck(parseInt(kingBlock[0]), kingBlock[1]);
        if (possibleChecks[0])
        {
            if (checkMate(possibleChecks))
            {
                window.alert("🎉🎉🎉CHECKMATE🎉🎉🎉\n" + (turn ? "🎉🎉Player One Wins!🎉🎉" : "🎉🎉Player Two Wins!🎉🎉"));

                if (turn)
                    document.getElementsByClassName("player-one")[0].innerHTML = "Check Mate";
                else
                    document.getElementsByClassName("player-two")[0].innerHTML = "Check Mate";

                clearBoard();
                win = true;
                return;
            }

            if (turn)
            {
                window.alert("Player One has declared a check !");
                document.getElementsByClassName("player-one")[0].innerHTML = "Check";
            }
            else
            {
                window.alert("Player Two has declared a check !");
                document.getElementsByClassName("player-two")[0].innerHTML = "Check";
            }
        }
        else
        {
            document.getElementsByClassName("player-one")[0].innerHTML = "Player 1";
            document.getElementsByClassName("player-two")[0].innerHTML = "Player 2";
        }

        if (turn)
        {
            document.getElementsByClassName("board")[0].style.transform = "rotate(180deg)";
            let arr = document.getElementsByClassName("board-block");
            for (let i=0;i<arr.length;i++)
                arr[i].style.transform = "rotate(180deg)";
        }
        else
        {
            document.getElementsByClassName("board")[0].style.transform = "rotate(0)";
            let arr = document.getElementsByClassName("board-block");
            for (let i=0;i<arr.length;i++)
                arr[i].style.transform = "rotate(0)";
        }

        turn = !turn;

        if (turn)
        {
            document.getElementById("white").style.backgroundColor = "limegreen";
            document.getElementById("black").style.backgroundColor = "red";
        }
        else
        {
            document.getElementById("white").style.backgroundColor = "red";
            document.getElementById("black").style.backgroundColor = "limegreen";
        }
    }

    if (playablePos.length !== 0)
        clearBoard();

    if (turn && whitePieces.includes(block.innerText))
    {
        block.style.backgroundColor = "#2DD65A";
        playablePos.push(block.id);
        makeMove(block);
        mostRecent = buttonId;
    }
    else if (!turn && blackPieces.includes(block.innerText))
    {
        block.style.backgroundColor = "#2DD65A";
        playablePos.push(block.id);
        makeMove(block);
        mostRecent = buttonId;
    }
}

function checkMate(possibleChecks)
{
    let kingBlock = findKing();
    let row = parseInt(kingBlock[0]), col = kingBlock[1];
    let i, j = "A";

    if (turn)
    {
        if (possibleChecks.length === 2)
        {
            turn = !turn;
            if (checkCheck(parseInt(possibleChecks[1][0]), possibleChecks[1][1]))
            {
                turn = !turn;
                return false;
            }

            if (map.get(document.getElementById(possibleChecks[1]).innerText) === "rook")
            {
                if (row === parseInt(possibleChecks[1][0]))
                {
                    if (col.charCodeAt(0) < possibleChecks[1][1].charCodeAt(0))
                    {
                        for (let i=col;i!==possibleChecks[1][1];i = String.fromCharCode(possibleChecks[1][1].charCodeAt(0) + 1))
                        {
                            if (checkCheck(row, i))
                            {
                                turn = !turn;
                                return false;
                            }
                        }
                    }
                    else
                    {
                        for (let i=col;i!==possibleChecks[1][1];i = String.fromCharCode(possibleChecks[1][1].charCodeAt(0) - 1))
                        {
                            if (checkCheck(row, i))
                            {
                                turn = !turn;
                                return false;
                            }
                        }
                    }
                }
                else
                {
                    if (row < parseInt(possibleChecks[1][0]))
                    {
                        for (let i=row;i!==parseInt(possibleChecks[1][1]);i++)
                        {
                            if (checkCheck(i, col))
                            {
                                turn = !turn;
                                return false;
                            }
                        }
                    }
                    else
                    {
                        for (let i=row;i!==parseInt(possibleChecks[1][1]);i--)
                        {
                            if (checkCheck(i, col))
                            {
                                turn = !turn;
                                return false;
                            }
                        }
                    }
                }
            }
            else if (map.get(document.getElementById(possibleChecks[1]).innerText) === "bishop")
            {
                let i, j;

                if (row < parseInt(possibleChecks[1][0]) && col.charCodeAt(0) < possibleChecks[1][1].charCodeAt(0))
                {
                    i = row;
                    j = col;

                    while (row !== parseInt(possibleChecks[1][0]) && col !== possibleChecks[1][1])
                    {
                        if (checkCheck(i, j))
                        {
                            turn = !turn;
                            return false;
                        }

                        i++;
                        j = String.fromCharCode(j.charCodeAt(0) + 1);
                    }
                }
                else if (row > parseInt(possibleChecks[1][0]) && col.charCodeAt(0) > possibleChecks[1][1].charCodeAt(0))
                {
                    i = row;
                    j = col;

                    while (row !== parseInt(possibleChecks[1][0]) && col !== possibleChecks[1][1])
                    {
                        if (checkCheck(i, j))
                        {
                            turn = !turn;
                            return false;
                        }

                        i--;
                        j = String.fromCharCode(j.charCodeAt(0) - 1);
                    }
                }
                else if (row > parseInt(possibleChecks[1][0]) && col.charCodeAt(0) < possibleChecks[1][1].charCodeAt(0))
                {
                    i = row;
                    j = col;

                    while (row !== parseInt(possibleChecks[1][0]) && col !== possibleChecks[1][1])
                    {
                        if (checkCheck(i, j))
                        {
                            turn = !turn;
                            return false;
                        }

                        i--;
                        j = String.fromCharCode(j.charCodeAt(0) + 1);
                    }
                }
                else
                {
                    i = row;
                    j = col;

                    while (row !== parseInt(possibleChecks[1][0]) && col !== possibleChecks[1][1])
                    {
                        if (checkCheck(i, j))
                        {
                            turn = !turn;
                            return false;
                        }

                        i++;
                        j = String.fromCharCode(j.charCodeAt(0) - 1);
                    }
                }
            }
            else
            {
                let i, j;

                if (row === parseInt(possibleChecks[1][0]))
                {
                    if (col.charCodeAt(0) < possibleChecks[1][1].charCodeAt(0))
                    {
                        for (let i=col;i!==possibleChecks[1][1];i = String.fromCharCode(possibleChecks[1][1].charCodeAt(0) + 1))
                        {
                            if (checkCheck(row, i))
                            {
                                turn = !turn;
                                return false;
                            }
                        }
                    }
                    else
                    {
                        for (let i=col;i!==possibleChecks[1][1];i = String.fromCharCode(possibleChecks[1][1].charCodeAt(0) - 1))
                        {
                            if (checkCheck(row, i))
                            {
                                turn = !turn;
                                return false;
                            }
                        }
                    }
                }
                else if (col === possibleChecks[1][1])
                {
                    if (row < parseInt(possibleChecks[1][0]))
                    {
                        for (let i=row;i!==parseInt(possibleChecks[1][1]);i++)
                        {
                            if (checkCheck(i, col))
                            {
                                turn = !turn;
                                return false;
                            }
                        }
                    }
                    else
                    {
                        for (let i=row;i!==parseInt(possibleChecks[1][1]);i--)
                        {
                            if (checkCheck(i, col))
                            {
                                turn = !turn;
                                return false;
                            }
                        }
                    }
                }
                else if (row < parseInt(possibleChecks[1][0]) && col.charCodeAt(0) < possibleChecks[1][1].charCodeAt(0))
                {
                    i = row;
                    j = col;

                    while (row !== parseInt(possibleChecks[1][0]) && col !== possibleChecks[1][1])
                    {
                        if (checkCheck(i, j))
                        {
                            turn = !turn;
                            return false;
                        }

                        i++;
                        j = String.fromCharCode(j.charCodeAt(0) + 1);
                    }
                }
                else if (row > parseInt(possibleChecks[1][0]) && col.charCodeAt(0) > possibleChecks[1][1].charCodeAt(0))
                {
                    i = row;
                    j = col;

                    while (row !== parseInt(possibleChecks[1][0]) && col !== possibleChecks[1][1])
                    {
                        if (checkCheck(i, j))
                        {
                            turn = !turn;
                            return false;
                        }

                        i--;
                        j = String.fromCharCode(j.charCodeAt(0) - 1);
                    }
                }
                else if (row > parseInt(possibleChecks[1][0]) && col.charCodeAt(0) < possibleChecks[1][1].charCodeAt(0))
                {
                    i = row;
                    j = col;

                    while (row !== parseInt(possibleChecks[1][0]) && col !== possibleChecks[1][1])
                    {
                        if (checkCheck(i, j))
                        {
                            turn = !turn;
                            return false;
                        }

                        i--;
                        j = String.fromCharCode(j.charCodeAt(0) + 1);
                    }
                }
                else
                {
                    i = row;
                    j = col;

                    while (row !== parseInt(possibleChecks[1][0]) && col !== possibleChecks[1][1])
                    {
                        if (checkCheck(i, j))
                        {
                            turn = !turn;
                            return false;
                        }

                        i++;
                        j = String.fromCharCode(j.charCodeAt(0) - 1);
                    }
                }
            }
        }

        turn = !turn;

        i = row - 1;
        if (i <= 0 || blackPieces.includes(document.getElementById(i + col).innerText))
        {}
        else if (!checkCheck(i, col))
            return false;

        i = row + 1;
        if (i > 8 || blackPieces.includes(document.getElementById(i + col).innerText))
        {}
        else if (!checkCheck(i, col))
            return false;

        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (j === "@" || blackPieces.includes(document.getElementById(row + j).innerText))
        {}
        else if (!checkCheck(row, j))
            return false;

        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (j === "I" || blackPieces.includes(document.getElementById(row + j).innerText))
        {}
        else if (!checkCheck(row, j))
            return false;

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (i > 8 || j === "I" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (!checkCheck(i, j))
            return false;

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (i <= 0 || j === "@" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (!checkCheck(i, j))
            return false;

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (i > 8 || j === "@" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (!checkCheck(i, j))
            return false;

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (i <= 0 || j === "I" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (!checkCheck(i, j))
            return false;
    }
    else
    {
        i = row - 1;
        if (i <= 0 || whitePieces.includes(document.getElementById(i + col).innerText))
        {}
        else if (!checkCheck(i, col))
            return false;

        i = row + 1;
        if (i > 8 || whitePieces.includes(document.getElementById(i + col).innerText))
        {}
        else if (!checkCheck(i, col))
            return false;

        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (j === "@" || whitePieces.includes(document.getElementById(row + j).innerText))
        {}
        else if (!checkCheck(row, j))
            return false;

        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (j === "I" || whitePieces.includes(document.getElementById(row + j).innerText))
        {}
        else if (!checkCheck(row, j))
            return false;

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (i > 8 || j === "I" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (!checkCheck(i, j))
            return false;

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (i <= 0 || j === "@" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (!checkCheck(i, j))
            return false;

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (i > 8 || j === "@" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (!checkCheck(i, j))
            return false;

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (i <= 0 || j === "I" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (!checkCheck(i, j))
            return false;
    }

    return true;
}

function checkCheck(row, col)
{
    let i, j;
    let possibleChecks = [false];

    if (turn)
    {
        i = row - 1;
        while (i > 0 && document.getElementById(i + col).innerHTML === "")
            i--;

        if (i === 0 || blackPieces.includes(document.getElementById(i + col).innerText))
        {}
        else if (map.get(document.getElementById(i + col).innerText) === "rook" ||
            map.get(document.getElementById(i + col).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + col);
        }

        i = row + 1;
        while (i <= 8 && document.getElementById(i + col).innerHTML === "")
            i++;

        if (i === 9 || blackPieces.includes(document.getElementById(i + col).innerText))
        {}
        else if (map.get(document.getElementById(i + col).innerText) === "rook" ||
            map.get(document.getElementById(i + col).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + col);
        }

        j = String.fromCharCode(col.charCodeAt(0) - 1);
        while (j !== "@" && document.getElementById(row + j).innerHTML === "")
            j = String.fromCharCode(j.charCodeAt(0) - 1);

        if (j === "@" || blackPieces.includes(document.getElementById(row + j).innerText))
        {}
        else if (map.get(document.getElementById(row + j).innerText) === "rook" ||
            map.get(document.getElementById(row + j).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(row + j);
        }

        j = String.fromCharCode(col.charCodeAt(0) + 1);
        while (j !== "I" && document.getElementById(row + j).innerHTML === "")
            j = String.fromCharCode(j.charCodeAt(0) + 1);

        if (j === "I" || blackPieces.includes(document.getElementById(row + j).innerText))
        {}
        else if (map.get(document.getElementById(row + j).innerText) === "rook" ||
            map.get(document.getElementById(row + j).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(row + j);
        }

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        while (i !== 0 && j !== "@" && document.getElementById(i + j).innerHTML === "")
        {
            i--;
            j = String.fromCharCode(j.charCodeAt(0) - 1);
        }

        if (i === 0 || j === "@" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "bishop" ||
            map.get(document.getElementById(i + j).innerText) === "queen" ||
            map.get(document.getElementById(i + j).innerText) === "pawn")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        while (i <= 8 && j !== "I" && document.getElementById(i + j).innerHTML === "")
        {
            i++;
            j = String.fromCharCode(j.charCodeAt(0) + 1);
        }

        if (i === 9 || j === "I" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "bishop" ||
            map.get(document.getElementById(i + j).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        while (i <= 8 && j !== "@" && document.getElementById(i + j).innerHTML === "")
        {
            i++;
            j = String.fromCharCode(j.charCodeAt(0) - 1);
        }

        if (i === 9 || j === "@" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "bishop" ||
            map.get(document.getElementById(i + j).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        while (i > 0 && j !== "I" && document.getElementById(i + j).innerHTML === "")
        {
            i--;
            j = String.fromCharCode(j.charCodeAt(0) + 1);
        }

        if (i === 0 || j === "I" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "bishop" ||
            map.get(document.getElementById(i + j).innerText) === "queen" ||
            map.get(document.getElementById(i + j).innerText) === "pawn")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 2;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (i <= 0 || j === "@" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 2;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (i <= 0 || j === "I" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 2;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (i > 8 || j === "@" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 2;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (i > 8 || j === "I" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) - 2);
        if (i <= 0 || j === "@" || j === "?" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) - 2);
        if (i > 8 || j === "@" || j === "?" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) + 2);
        if (i <= 0 || j === "I" || j === "J" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) + 2);
        if (i > 8 || j === "I" || j === "J" || blackPieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }
    }
    else
    {
        i = row - 1;
        while (i > 0 && document.getElementById(i + col).innerHTML === "")
            i--;

        if (i === 0 || whitePieces.includes(document.getElementById(i + col).innerText))
        {}
        else if (map.get(document.getElementById(i + col).innerText) === "rook" ||
            map.get(document.getElementById(i + col).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + col);
        }

        i = row + 1;
        while (i <= 8 && document.getElementById(i + col).innerHTML === "")
            i++;

        if (i === 9 || whitePieces.includes(document.getElementById(i + col).innerText))
        {}
        else if (map.get(document.getElementById(i + col).innerText) === "rook" ||
            map.get(document.getElementById(i + col).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + col);
        }

        j = String.fromCharCode(col.charCodeAt(0) - 1);
        while (j !== "@" && document.getElementById(row + j).innerHTML === "")
            j = String.fromCharCode(j.charCodeAt(0) - 1);

        if (j === "@" || whitePieces.includes(document.getElementById(row + j).innerText))
        {}
        else if (map.get(document.getElementById(row + j).innerText) === "rook" ||
            map.get(document.getElementById(row + j).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(row + j);
        }

        j = String.fromCharCode(col.charCodeAt(0) + 1);
        while (j !== "I" && document.getElementById(row + j).innerHTML === "")
            j = String.fromCharCode(j.charCodeAt(0) + 1);

        if (j === "I" || whitePieces.includes(document.getElementById(row + j).innerText))
        {}
        else if (map.get(document.getElementById(row + j).innerText) === "rook" ||
            map.get(document.getElementById(row + j).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(row + j);
        }

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        while (i !== 0 && j !== "@" && document.getElementById(i + j).innerHTML === "")
        {
            i--;
            j = String.fromCharCode(j.charCodeAt(0) - 1);
        }

        if (i === 0 || j === "@" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "bishop" ||
            map.get(document.getElementById(i + j).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        while (i <= 8 && j !== "I" && document.getElementById(i + j).innerHTML === "")
        {
            i++;
            j = String.fromCharCode(j.charCodeAt(0) + 1);
        }

        if (i === 9 || j === "I" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "bishop" ||
            map.get(document.getElementById(i + j).innerText) === "queen" ||
            map.get(document.getElementById(i + j).innerText) === "pawn")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        while (i <= 8 && j !== "@" && document.getElementById(i + j).innerHTML === "")
        {
            i++;
            j = String.fromCharCode(j.charCodeAt(0) - 1);
        }

        if (i === 9 || j === "@" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "bishop" ||
            map.get(document.getElementById(i + j).innerText) === "queen" ||
            map.get(document.getElementById(i + j).innerText) === "pawn")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        while (i > 0 && j !== "I" && document.getElementById(i + j).innerHTML === "")
        {
            i--;
            j = String.fromCharCode(j.charCodeAt(0) + 1);
        }

        if (i === 0 || j === "I" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "bishop" ||
            map.get(document.getElementById(i + j).innerText) === "queen")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 2;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (i <= 0 || j === "@" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 2;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (i <= 0 || j === "I" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 2;
        j = String.fromCharCode(col.charCodeAt(0) - 1);
        if (i > 8 || j === "@" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 2;
        j = String.fromCharCode(col.charCodeAt(0) + 1);
        if (i > 8 || j === "I" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) - 2);
        if (i <= 0 || j === "@" || j === "?" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) - 2);
        if (i > 8 || j === "@" || j === "?" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row - 1;
        j = String.fromCharCode(col.charCodeAt(0) + 2);
        if (i <= 0 || j === "I" || j === "J" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }

        i = row + 1;
        j = String.fromCharCode(col.charCodeAt(0) + 2);
        if (i > 8 || j === "I" || j === "J" || whitePieces.includes(document.getElementById(i + j).innerText))
        {}
        else if (map.get(document.getElementById(i + j).innerText) === "knight")
        {
            possibleChecks[0] = true;
            possibleChecks.push(i + j);
        }
    }

    return possibleChecks;
}

function findKing()
{
    for (let i=1;i<=8;i++)
    {
        for (let j="A";j!=="I";j = String.fromCharCode(j.charCodeAt(0) + 1))
        {
            let block = document.getElementById(i + j);

            if (!turn && block.innerText === "\u2654")
                return i + j;
            if (turn && block.innerText === "\u265A")
                return i + j;
        }
    }
}

function clearBoard()
{
    for (let i=0;i<playablePos.length;i++)
    {
        let block = document.getElementById(playablePos[i]);
        if (parseInt(playablePos[i][0]) % 2)
        {
            if (playablePos[i].charCodeAt(1) % 2)
                block.style.backgroundColor = "saddlebrown";
            else
                block.style.backgroundColor = "sandybrown";
        }
        else
        {
            if (playablePos[i].charCodeAt(1) % 2)
                block.style.backgroundColor = "sandybrown";
            else
                block.style.backgroundColor = "saddlebrown";
        }
    }

    playablePos = [];
}

function makeMove(block)
{
    let piece = map.get(block.innerText);
    let i = 0, j = "A";
    const row = parseInt(block.id[0]), column = block.id[1];

    if (piece === "rook")
    {
        for (let i=row+1;i<=8;i++)
        {
            let movableBlock = document.getElementById(i + column);
            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }

                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }

                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + column);
            }
        }

        for (let i=row-1;i>0;i--)
        {
            let movableBlock = document.getElementById(i + column);
            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }

                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }

                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + column);
            }
        }

        i = String.fromCharCode(column.charCodeAt(0) + 1);
        while (i !== "I")
        {
            let movableBlock = document.getElementById(row + i);
            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(row + i);
                }

                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(row + i);
                }

                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(row + i);
            }

            i = String.fromCharCode(i.charCodeAt(0) + 1);
        }

        i = String.fromCharCode(column.charCodeAt(0) - 1);
        while (i !== "@")
        {
            let movableBlock = document.getElementById(row + i);
            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(row + i);
                }

                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(row + i);
                }

                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(row + i);
            }

            i = String.fromCharCode(i.charCodeAt(0) - 1);
        }
    }
    else if (piece === "bishop")
    {
        i = row + 1;
        j = String.fromCharCode(column.charCodeAt(0) + 1);
        while (i <= 8 && j !== "I")
        {
            let movableBlock = document.getElementById(i + j);
            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }

            i++;
            j = String.fromCharCode(j.charCodeAt(0) + 1);
        }

        i = row - 1;
        j = String.fromCharCode(column.charCodeAt(0) - 1);
        while (i > 0 && j !== "@")
        {
            let movableBlock = document.getElementById(i + j);
            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }

            i--;
            j = String.fromCharCode(j.charCodeAt(0) - 1);
        }

        i = row + 1;
        j = String.fromCharCode(column.charCodeAt(0) - 1);
        while (i <= 8 && j !== "@")
        {
            let movableBlock = document.getElementById(i + j);
            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }

            i++;
            j = String.fromCharCode(j.charCodeAt(0) - 1);
        }

        i = row - 1;
        j = String.fromCharCode(column.charCodeAt(0) + 1);
        while (i > 0 && j !== "I")
        {
            let movableBlock = document.getElementById(i + j);
            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }

            i--;
            j = String.fromCharCode(j.charCodeAt(0) + 1);
        }
    }
    else if (piece === "knight")
    {
        i = row + 2;
        j = String.fromCharCode(column.charCodeAt(0) + 1);
        if (i <= 8 && j !== "I")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row + 2;
        j = String.fromCharCode(column.charCodeAt(0) - 1);
        if (i <= 8 && j !== "@")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row - 2;
        j = String.fromCharCode(column.charCodeAt(0) + 1);
        if (i > 0 && j !== "I")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row - 2;
        j = String.fromCharCode(column.charCodeAt(0) - 1);
        if (i > 0 && j !== "@")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row + 1;
        j = String.fromCharCode(column.charCodeAt(0) - 2);
        if (i <= 8 && j !== "@" && j !== "?")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row + 1;
        j = String.fromCharCode(column.charCodeAt(0) + 2);
        if (i <= 8 && j !== "I" && j !== "J")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row - 1;
        j = String.fromCharCode(column.charCodeAt(0) - 2);
        if (i > 0 && j !== "@" && j !== "?")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row - 1;
        j = String.fromCharCode(column.charCodeAt(0) + 2);
        if (i > 0 && j !== "I" && j !== "J")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }
    }
    else if (piece === "queen")
    {
        for (let i=row+1;i<=8;i++)
        {
            let movableBlock = document.getElementById(i + column);

            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + column);
            }
        }

        for (let i=row-1;i>0;i--)
        {
            let movableBlock = document.getElementById(i + column);

            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + column);
            }
        }

        j = String.fromCharCode(column.charCodeAt(0) + 1);
        while (j !== "I")
        {
            let movableBlock = document.getElementById(row + j);

            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(row + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(row + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(row + j);
            }

            j = String.fromCharCode(j.charCodeAt(0) + 1);
        }

        j = String.fromCharCode(column.charCodeAt(0) - 1);
        while (j !== "@")
        {
            let movableBlock = document.getElementById(row + j);

            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(row + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(row + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(row + j);
            }

            j = String.fromCharCode(j.charCodeAt(0) - 1);
        }

        i = row + 1;
        j = String.fromCharCode(column.charCodeAt(0) + 1);
        while (i <= 8 && j !== "I")
        {
            let movableBlock = document.getElementById(i + j);

            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }

            i++;
            j = String.fromCharCode(j.charCodeAt(0) + 1);
        }

        i = row - 1;
        j = String.fromCharCode(column.charCodeAt(0) - 1);
        while (i > 0 && j !== "@")
        {
            let movableBlock = document.getElementById(i + j);

            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }

            i--;
            j = String.fromCharCode(j.charCodeAt(0) - 1);
        }

        i = row + 1;
        j = String.fromCharCode(column.charCodeAt(0) - 1);
        while (i <= 8 && j !== "@")
        {
            let movableBlock = document.getElementById(i + j);

            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }

            i++;
            j = String.fromCharCode(j.charCodeAt(0) - 1);
        }

        i = row - 1;
        j = String.fromCharCode(column.charCodeAt(0) + 1);
        while (i > 0 && j !== "I")
        {
            let movableBlock = document.getElementById(i + j);

            if (whitePieces.includes(movableBlock.innerText))
            {
                if (!turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else if (blackPieces.includes(movableBlock.innerText))
            {
                if (turn)
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
                break;
            }
            else
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }

            i--;
            j = String.fromCharCode(j.charCodeAt(0) + 1);
        }
    }
    else if (piece === "king")
    {
        i = row + 1;
        if (i <= 8)
        {
            let movableBlock = document.getElementById(i + column);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + column);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + column);
            }
        }

        i = row - 1;
        if (i > 0)
        {
            let movableBlock = document.getElementById(i + column);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + column);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + column);
            }
        }

        j = String.fromCharCode(column.charCodeAt(0) + 1);
        if (j !== "I")
        {
            let movableBlock = document.getElementById(row + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(row + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(row + j);
            }
        }

        j = String.fromCharCode(column.charCodeAt(0) - 1);
        if (j !== "@")
        {
            let movableBlock = document.getElementById(row + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(row + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(row + j);
            }
        }

        i = row + 1
        j = String.fromCharCode(column.charCodeAt(0) + 1);
        if (i <= 8 && j !== "I")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row - 1
        j = String.fromCharCode(column.charCodeAt(0) - 1);
        if (i > 0 && j !== "@")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row + 1
        j = String.fromCharCode(column.charCodeAt(0) - 1);
        if (i <= 8 && j !== "@")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }

        i = row - 1
        j = String.fromCharCode(column.charCodeAt(0) + 1);
        if (i > 0 && j !== "I")
        {
            let movableBlock = document.getElementById(i + j);

            if (turn && !whitePieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
            else if (!turn && !blackPieces.includes(movableBlock.innerText))
            {
                movableBlock.style.backgroundColor = "#2DD65A";
                playablePos.push(i + j);
            }
        }
    }
    else
    {
        if (turn)
        {
            if (row === 2)
            {
                for (let i=row+1;i<=row+2;i++)
                {
                    let movableBlock = document.getElementById(i + column);
                    if (blackPieces.includes(movableBlock.innerText) || whitePieces.includes(movableBlock.innerText))
                        break;
                    else
                    {
                        movableBlock.style.backgroundColor = "#2DD65A";
                        playablePos.push(i + column);
                    }
                }
            }
            else
            {
                i = row + 1;
                let movableBlock = document.getElementById(i + column);
                if (!blackPieces.includes(movableBlock.innerText) && !whitePieces.includes(movableBlock.innerText))
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }
            }

            i = row + 1;
            j = String.fromCharCode(column.charCodeAt(0) - 1);

            if (i <= 8 && j !== "@")
            {
                let movableBlock = document.getElementById(i + j);

                if (blackPieces.includes(movableBlock.innerText))
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
            }

            j = String.fromCharCode(column.charCodeAt(0) + 1);

            if (i <= 8 && j !== "I")
            {
                let movableBlock = document.getElementById(i + j);

                if (blackPieces.includes(movableBlock.innerText))
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
            }
        }
        else
        {
            if (row === 7)
            {
                for (let i=row-1;i>=row-2;i--)
                {
                    let movableBlock = document.getElementById(i + column);
                    if (blackPieces.includes(movableBlock.innerText) || whitePieces.includes(movableBlock.innerText))
                        break;
                    else
                    {
                        movableBlock.style.backgroundColor = "#2DD65A";
                        playablePos.push(i + column);
                    }
                }
            }
            else
            {
                i = row - 1;
                let movableBlock = document.getElementById(i + column);
                if (!blackPieces.includes(movableBlock.innerText) && !whitePieces.includes(movableBlock.innerText))
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + column);
                }
            }

            i = row - 1;
            j = String.fromCharCode(column.charCodeAt(0) - 1);

            if (i > 0 && j !== "@")
            {
                let movableBlock = document.getElementById(i + j);

                if (whitePieces.includes(movableBlock.innerText))
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
            }

            j = String.fromCharCode(column.charCodeAt(0) + 1);

            if (i > 0 && j !== "I")
            {
                let movableBlock = document.getElementById(i + j);

                if (whitePieces.includes(movableBlock.innerText))
                {
                    movableBlock.style.backgroundColor = "#2DD65A";
                    playablePos.push(i + j);
                }
            }
        }
    }
}

function newGame()
{
    window.alert("Starting New Game...");
    window.location.reload();
}

function draw()
{
    window.alert("Match is Declared Draw!\nStarting New Game...");
    window.location.reload();
}

function concede()
{
    if (turn)
        window.alert("Player One Concedes Defeat!\n🎉🎉Player Two Wins!🎉🎉")
    else
        window.alert("Player Two Concedes Defeat!\n🎉🎉Player One Wins!🎉🎉")

    window.location.reload();
}

window.onload = function ()
{
    createBoard();
    fillBoard();
}
