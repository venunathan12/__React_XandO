import React, { useState } from 'react';
import './App.css';

function App() {

    return (
        <>
            <Head />
            <VerticalSeparator />
            <Body />
            <VerticalSeparator />
            <Foot />
        </>
    );
}

function VerticalSeparator()
{
    return (
        <>
            <br />
            <hr className='VerticalSeparator' />
            <br />
        </>
    );
}

function Head()
{
    return (
        <div className='Head'>
            Tic Tac Toe
        </div>
    );
}

function Body()
{
    let stateTable = {};
    stateTable['status'] = useState('NEUTRAL');
    stateTable['statusDetails'] = useState(null);
    stateTable['gameDetails'] = useState({});
    stateTable['board'] = useState(null);
    stateTable['turn'] = useState(null);
    let defaultplayerdata = { gamesPlayed: 0, gamesWon: 0 };
    stateTable['dataX'] = useState(structuredClone(defaultplayerdata));
    stateTable['dataO'] = useState(structuredClone(defaultplayerdata));

    return (
        <div className='Body'>
            <PlayerScreen   stateTable={stateTable} player={'X'}/>
            <BodyMid        stateTable={stateTable} />
            <PlayerScreen   stateTable={stateTable} player={'O'}/>
        </div>
    );
}

function Foot()
{
    return (
        <div className='Foot'>
        </div>
    );
}

function PlayerScreen({stateTable, player})
{
    return (
        <div className='PlayerScreen'>
            {player}
            <br />
            <br />
            <br />
            Score: {stateTable['data' + player][0].gamesWon}
            <br />
            Winrate: {stateTable['data' + player][0].gamesPlayed == 0 ? '?' : Math.ceil(100 * stateTable['data' + player][0].gamesWon / stateTable['data' + player][0].gamesPlayed) + ' %'}
            <br />
            <br />
            <br />
            <PlayerTurnIndicator stateTable={stateTable} player={player} />
        </div>
    );
}
function PlayerTurnIndicator({stateTable, player})
{
    let startplayer = stateTable['gameDetails'][0].startingPlayer;
    if (startplayer == null) return (<></>);
    let otherplayer = (startplayer == 'X' ? 'O' : 'X');
    let currentplayer = (stateTable['turn'][0] % 2 == 1 ? startplayer : otherplayer);

    return (
        (currentplayer == player && stateTable['status'][0] == 'RUNNING')
        ? <div className='PlayerTurnIndicator'>Your Turn !</div>
        : <></>
    );
}

function BodyMid({stateTable})
{
    return (
        <div className='BodyMid'>
            <MenuScreen stateTable={stateTable}/>
            <Board      stateTable={stateTable}/>
        </div>
    );
}

function MenuScreen({stateTable})
{
    let successcontent = (
        <div>
            <br /><br />
            <br /><br />
            <StartGameButton stateTable={stateTable}/>
            <br /><br />
        </div>
    );
    
    return (
        stateTable['status'][0] == 'NEUTRAL'
        ? successcontent
        : (<></>)
    );
}

function StartGameButton({stateTable, text})
{
    function startgame()
    {
        stateTable['status'][0] = 'RUNNING'; stateTable['status'][1](stateTable['status'][0]);
        stateTable['board'][0] = [[null, null, null], [null, null, null], [null, null, null]]; stateTable['board'][1](stateTable['board'][0]);
        stateTable['gameDetails'][0].startingPlayer = (Math.random() < 0.5 ? 'X' : 'O'); stateTable['gameDetails'][1](stateTable['gameDetails'][0]);
        stateTable['turn'][0] = 1; stateTable['turn'][1](stateTable['turn'][0]);
    }

    return (
        <button onClick={startgame} className='BodyMidButton'>{text == null ? 'Start Game !' : text}</button>
    );
}

function Board({stateTable})
{
    let uiboard = structuredClone(stateTable['board'][0]);
    if (uiboard == null) return (<></>);

    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) uiboard[r][c] = (<BoardCell key={'Cell-'+(r*3+c)} stateTable={stateTable} r={r} c={c} v={uiboard[r][c]}/>);
    for (let i = 0; i < 3; i++) uiboard[i] = (<tr key={'CellRow'+i}>{uiboard[i]}</tr>);
    uiboard = (<table className='Board'><tbody>{uiboard}</tbody></table>);

    let gameendingtext = (stateTable['status'][0] == 'ENDED' ? (stateTable['statusDetails'][0] == 'TIE' ? 'It was a Tie !' : stateTable['statusDetails'][0] + ' has Won !!!') : null);
    let playagainbutton = (stateTable['status'][0] == 'ENDED' ? <StartGameButton stateTable={stateTable} text="Play again !"/> : null);

    let successcontent = (
        <>
            <br />{gameendingtext}<br />
            {uiboard}{playagainbutton}
            <br /><br />
        </>
    );
    
    return (
        (stateTable['status'][0] == 'RUNNING' || stateTable['status'][0] == 'ENDED')
        ? (successcontent)
        : (<></>)
    );
}
function BoardCell({stateTable, r, c, v})
{
    function click()
    {
        if (stateTable['status'][0] != 'RUNNING') return;
        if (v != null) return;

        let startplayer = stateTable['gameDetails'][0].startingPlayer;
        let otherplayer = (startplayer == 'X' ? 'O' : 'X');
        let newchar = (stateTable['turn'][0] % 2 == 1 ? startplayer : otherplayer);
        stateTable['board'][0][r][c] = newchar; stateTable['board'][1](structuredClone(stateTable['board'][0]));
        stateTable['turn'][0] ++; stateTable['turn'][1](stateTable['turn'][0]);

        checkWin({stateTable});
    }

    return (
        <td className='BoardCell' onClick={click}>
            {v}
        </td>
    );
}

function checkWin({stateTable})
{
    let board = stateTable['board'][0];
    
    let ls = [], l = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (r == 0) l.push(board[r][c]); ls.push(l); l = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (r == 1) l.push(board[r][c]); ls.push(l); l = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (r == 2) l.push(board[r][c]); ls.push(l); l = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (c == 0) l.push(board[r][c]); ls.push(l); l = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (c == 1) l.push(board[r][c]); ls.push(l); l = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (c == 2) l.push(board[r][c]); ls.push(l); l = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (r == c) l.push(board[r][c]); ls.push(l); l = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (r+c==2) l.push(board[r][c]); ls.push(l); l = [];
    for (let l of ls) {
        let st = l.length > 0 ? l[0] : null, won = true;
        for (let s of l) if (s == null || s != st) won = false;
        if (won){ finishGame({stateTable, winner:st}); return; }
    }
    
    if (stateTable['turn'][0] > 3*3) { finishGame({stateTable, winner:'TIE'}); return; }
}
function finishGame({stateTable, winner})
{
    stateTable['status'][0] = 'ENDED'; stateTable['status'][1](stateTable['status'][0]);
    stateTable['statusDetails'][0] = winner; stateTable['statusDetails'][1](stateTable['statusDetails'][0]);
    stateTable['dataX'][0].gamesPlayed ++; stateTable['dataX'][1](stateTable['dataX'][0]);
    stateTable['dataO'][0].gamesPlayed ++; stateTable['dataO'][1](stateTable['dataO'][0]);
    if (winner.length == 1) {stateTable['data' + winner][0].gamesWon ++; stateTable['data' + winner][1](stateTable['data' + winner][0]);}
}

export default App;
