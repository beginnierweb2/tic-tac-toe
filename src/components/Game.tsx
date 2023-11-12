import React, { useCallback, useEffect, useRef, useState } from 'react';
import Board from './Board.tsx';

const GLOBAL_VARIABLE = {
    /** The number of checkerboards */
    matrix: 3,
    /** Tic-tac-toe piece style */
    chessToc: ['X', 'O'],
    /** Pentoko pieces style */
    chessFive: ['⚫', '⚪'],
    /** chess game status */
    status: '',
};

/**
 * main game logic
 */
function Game (props: object | any) {
    if (props.gameType === 'tictactoe') {
        GLOBAL_VARIABLE.matrix = 3;
    } else if (props.gameType === 'gobang') {
        GLOBAL_VARIABLE.matrix = 15;
    } else {
        console.warn('错误');
    }
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [ids, setIds] = useState(null);
    const [init, setInit] = useState(props.gameType);
    const [firstToc, secondToc] = GLOBAL_VARIABLE.chessToc;
    const [first, second] = GLOBAL_VARIABLE.chessFive;
    const [history, setHistory] = useState([
        {
            squares: Array(GLOBAL_VARIABLE.matrix * GLOBAL_VARIABLE.matrix).fill(null),
            row: 0,
            col: 0,
        },
    ]);
    const boardRef = useRef(null);
    useEffect(() => {
        handleClick();
    }, [ids]);

    /**
     * click the board
     */
    const handleClick = () => {
        if (ids === null) {
            return;
        }
        const currentHistory = history.slice(0, stepNumber + 1);
        const current: Object | any = currentHistory[currentHistory.length - 1];
        const squares = current.squares.slice();
        if (
            calculateWinner(props, squares, current.row, current.col).winner || squares[ids]
        ) {
            return;
        }
        if (props.gameType === 'tictactoe') {
            squares[ids] = xIsNext ? firstToc : secondToc;
        } else if (props.gameType === 'gobang') {
            squares[ids] = xIsNext ? first : second;
        } else {
            console.warn('错误');
        }
        setHistory(() => [
            ...currentHistory,
            {
                squares,
                row: parseInt(`${ids / GLOBAL_VARIABLE.matrix}`) + 1,
                col: (ids % GLOBAL_VARIABLE.matrix) + 1,
            },
        ]);
        setXIsNext(xIsNext => !xIsNext);
        setStepNumber(() => currentHistory.length);
        setTimeout(() => {
            (boardRef.current as any)?.mySetSquares(squares);
        });
    };

    /**
     * judgment drop
     */
    const jumpTo = (step: any) => {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
        (boardRef.current as any)?.mySetSquares(history[step].squares);
    };
    const current: any = history[stepNumber];
    const result = calculateWinner(props, current?.squares, current?.row, current?.col);
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

    /**
     * clear the board
     */
    const handleReset = () => {
        setHistory([
            {
                squares: Array(GLOBAL_VARIABLE.matrix * GLOBAL_VARIABLE.matrix).fill(null),
                row: 0,
                col: 0,
            },
        ]);
        setStepNumber(0);
        setXIsNext(true);
    };

    // reverse moves
    const orderableMoves = moves;
    if (winner) {
        GLOBAL_VARIABLE.status = `Winner:${winner}`;
    } else if (!winner && stepNumber === GLOBAL_VARIABLE.matrix * GLOBAL_VARIABLE.matrix) {
        GLOBAL_VARIABLE.status = 'MATCH!';
    } else {
        if (props.gameType === 'tictactoe') {
            GLOBAL_VARIABLE.status = `Next player:${(xIsNext ? firstToc : secondToc)}`;
        } else if (props.gameType === 'gobang') {
            GLOBAL_VARIABLE.status = `Next player:${(xIsNext ? first : second)}`;
        } else {
            console.warn('错误');
        }
    }
    if (init !== props.gameType) {
        setInit(props.gameType);
        handleReset();
    }
    const setHandleClick = useCallback((data) => {
        setIds(() => data);
    }, [ids]);
    return (
        <div className='game'>
            <div className='game-board'>
                <Board
                    ref={boardRef}
                    squares={current.squares}
                    line={lines}
                    chessboard={Array(GLOBAL_VARIABLE.matrix * GLOBAL_VARIABLE.matrix).fill(null)}
                    value={props.gameType}
                    onClick={(ids: number) => setHandleClick(ids)}
                />
            </div>
            <div className='game-info'>
                <div>{GLOBAL_VARIABLE.status}</div>
                <ol>{orderableMoves}</ol>
            </div>
        </div>
    );
}

/**
 * judge whether you win
 */
function calculateWinner (props: any, squares: number[], xaxis: number, yaxis: number) {
    if (!xaxis || !yaxis) {
        return { winner: null, lines: null };
    }

    const board: any[] = [];
    const matrixSize = GLOBAL_VARIABLE.matrix;
    const winCondition = props.gameType === 'tictactoe' ? 2 : 4;
    const directions = [
        [-1, 0], // up
        [-1, 1], // upper right
        [0, 1], // right
        [1, 1], // lower right
        [1, 0], // down
        [1, -1], // lower left
        [0, -1], // left
        [-1, -1], // upper left
    ];

    let num = 0;
    for (let ids = 0; ids < matrixSize; ids++) {
        board[ids] = [];
        for (let jam = 0; jam < matrixSize; jam++, num++) {
            board[ids][jam] = squares[num];
        }
    }

    xaxis = xaxis - 1;
    yaxis = yaxis - 1;
    const mark = board[xaxis][yaxis];
    const lines: any[] = [[], [], [], [], [], [], [], []];
    const goOn = Array(8).fill(true);

    for (let step = 1; step <= 4; step++) {
        for (let icount = 0; icount < directions.length; icount++) {
            const [dx, dy] = directions[icount];
            const newX = xaxis + (dx * step);
            const newY = yaxis + (dy * step);

            if (goOn[icount] && newX >= 0 && newX < matrixSize && newY >= 0 && newY < matrixSize) {
                if (board[newX][newY] === mark) {
                    lines[icount].push((newX * matrixSize) + newY);
                } else {
                    goOn[icount] = false;
                }
            } else {
                goOn[icount] = false;
            }
        }
    }

    for (let icount = 0; icount < lines.length; icount++) {
        if (lines[icount].length >= winCondition) {
            return {
                winner: mark,
                lines: [(xaxis * matrixSize) + yaxis].concat(lines[icount]),
            };
        }
    }

    return { winner: null, lines: null };
}
export default Game;
