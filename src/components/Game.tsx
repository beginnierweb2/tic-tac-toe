import React, { useState } from 'react';
import Board from './Board.tsx';

let matrix = 3;

/**
 * main game logic
 */
function Game (props: object | any) {
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [isBlack, setIsBlack] = useState(true);
    const [history, setHistory] = useState([
        {
            squares: Array(matrix * matrix).fill(null),
            row: 0,
            col: 0,
        },
    ]);

    /**
     * click drop
     */
    const handleClick = (ids: number) => {
        const currentHistory = history.slice(0, stepNumber + 1);
        const current: Object | any = currentHistory[currentHistory.length - 1];
        const squares = current.squares.slice();
        if (
            calculateWinner(squares, current.row, current.col).winner || squares[ids]
        ) {
            return;
        }
        if (props.gameType === 'tictactoe') {
            matrix = 3;
            squares[ids] = xIsNext ? 'X' : 'O';
            if (squares[ids] === 'X') {
                setIsBlack(true);
                isBlack === true ?  1 : 0;
            } else {
                setIsBlack(false);
            }
        } else if (props.gameType === 'gobang') {
            matrix = 15;
            squares[ids] = xIsNext ? '⚫' : '⚪';
            if (squares[ids] === '⚫') {
                setIsBlack(true);
            } else {
                setIsBlack(false);
            }
        }
        setHistory([
            ...currentHistory,
            {
                squares,
                row: parseInt(`${ids / matrix}`) + 1,
                col: (ids % matrix) + 1,
            },
        ]);
        setXIsNext(!xIsNext);
        setStepNumber(currentHistory.length);
    };

    /**
     * judgment drop
     */
    const jumpTo = (step: any) => {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
    };
    const current: any = history[stepNumber];
    const result = calculateWinner(current?.squares, current?.row, current?.col);
    const { winner, lines } = result;
    const moves = history.map((step: [number, string] | any, move: number) => {
        let desc: string = '';
        if (move !== 0) {
            desc = `#${move} ${step.row},${step.col}`;
        }

        // point current move
        return (
            <ol key={move}>
                <div
                    className={move === 0 ? '' : 'list-step'}
                    onClick={() => jumpTo(move)}>
                    <strong>{desc}</strong>
                </div>
            </ol>
        );
    });

    // reverse moves
    const orderableMoves = moves;
    let status: string;
    if (props.gameType === 'tictactoe') {
        if (winner) {
            status = `Winner:${winner}`;
        } else if (!winner && stepNumber === matrix * matrix) {
            status = 'MATCH!';
        } else {
            status = `Next player:${(xIsNext ? 'X' : 'O')}`;
        }
    } else {
        if (winner) {
            status = `Winner:${winner}`;
        } else if (!winner && stepNumber === matrix * matrix) {
            status = 'MATCH!';
        } else {
            status = `Next player:${(xIsNext ? '⚫' : '⚪')}`;
        }
    }

    return (
        <div className='game'>
            <div className='game-board'>
                <Board
                    squares={current.squares}
                    line={lines}
                    onClick={(ids: number) => handleClick(ids)}
                />
            </div>
            <div className='game-info'>
                <div>{status}</div>
                <ol>{orderableMoves}</ol>
            </div>
        </div>
    );
}

/**
 * judge whether you win
 */
function calculateWinner (squares: number[], xaxis: number, yaxis: number) {
    if (!xaxis || !yaxis) {
        return { winner: null, lines: null };
    }

    // 1D -> 2D
    const board: any[] = [];
    let num = 0;
    for (let ids = 0; ids < matrix; ids++) {
        board[ids] = [];
        for (let jam = 0; jam < matrix; jam++, num++) {
            board[ids][jam] = squares[num];
        }
    }

    // as array starts from zero
    xaxis = xaxis - 1;
    yaxis = yaxis - 1;
    const mark = board[xaxis][yaxis];
    const lines: any[] = [[], [], [], [], [], [], [], []];
    const goOn = Array(8).fill(true);
    for (let step = 1; step <= 4; step++) {
        // up ↑0
        if (goOn[0] && xaxis - step >= 0) {
            if (board[xaxis - step][yaxis] === mark) {
                lines[0].push(((xaxis - step) * matrix) + yaxis);
            } else {
                goOn[0] = false;
            }
        }

        // upper right ↗ 1
        if (goOn[1] && xaxis - step >= 0 && yaxis + step < matrix) {
            if (board[xaxis - step][yaxis + step] === mark) {
                lines[1].push(((xaxis - step) * matrix) + yaxis + step);
            } else {
                goOn[1] = false;
            }
        }

        // right → 2
        if (goOn[2] && yaxis + step < matrix) {
            if (board[xaxis][yaxis + step] === mark) {
                lines[2].push((xaxis * matrix) + yaxis + step);
            } else {
                goOn[2] = false;
            }
        }

        // lower right ↘ 3
        if (goOn[3] && xaxis + step < matrix && yaxis + step < matrix) {
            if (board[xaxis + step][yaxis + step] === mark) {
                lines[3].push(((xaxis + step) * matrix) + yaxis + step);
            } else {
                goOn[3] = false;
            }
        }

        // down ↓ 4
        if (goOn[4] && xaxis + step < matrix) {
            if (board[xaxis + step][yaxis] === mark) {
                lines[4].push(((xaxis + step) * matrix) + yaxis);
            } else {
                goOn[4] = false;
            }
        }

        // lower left ↙ 5
        if (goOn[5] && xaxis + step < matrix && yaxis - step >= 0) {
            if (board[xaxis + step][yaxis - step] === mark) {
                lines[5].push(((xaxis + step) * matrix) + yaxis - step);
            } else {
                goOn[5] = false;
            }
        }

        // left ← 6
        if (goOn[6] && yaxis - step >= 0) {
            if (board[xaxis][yaxis - step] === mark) {
                lines[6].push((xaxis * matrix) + yaxis - step);
            } else {
                goOn[6] = false;
            }
        }

        // upper left ↖ 7
        if (goOn[7] && xaxis - step >= 0 && yaxis - step >= 0) {
            if (board[xaxis - step][yaxis - step] === mark) {
                lines[7].push(((xaxis - step) * matrix) + yaxis - step);
            } else {
                goOn[7] = false;
            }
        }
    }
    if (
        sessionStorage.getItem('gameType') === 'tictactoe'
            ? lines[0].length + lines[4].length >= 2
            : lines[0].length + lines[4].length >= 4
    ) {
        return {
            winner: mark,
            lines: [(xaxis * matrix) + yaxis].concat(lines[0]).concat(lines[4]),
        };
    } else if (
        sessionStorage.getItem('gameType') === 'tictactoe'
            ? lines[1].length + lines[5].length >= 2
            : lines[1].length + lines[5].length >= 4
    ) {
        return {
            winner: mark,
            lines: [(xaxis * matrix) + yaxis].concat(lines[1]).concat(lines[5]),
        };
    } else if (
        sessionStorage.getItem('gameType') === 'tictactoe'
            ? lines[2].length + lines[6].length >= 2
            : lines[2].length + lines[6].length >= 4
    ) {
        return {
            winner: mark,
            lines: [(xaxis * matrix) + yaxis].concat(lines[2]).concat(lines[6]),
        };
    } else if (
        sessionStorage.getItem('gameType') === 'tictactoe'
            ? lines[3].length + lines[7].length >= 2
            : lines[3].length + lines[7].length >= 4
    ) {
        return {
            winner: mark,
            lines: [(xaxis * matrix) + yaxis].concat(lines[3]).concat(lines[7]),
        };
    }
    return { winner: null, lines: null };
}

export default Game;
