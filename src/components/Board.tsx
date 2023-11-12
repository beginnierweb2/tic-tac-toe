
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Square from './Square.tsx';

/**
 * square of board
 */
const Board = forwardRef((props: object | any, ref) => {
    const [squares, setSquares] = useState(props.chessboard);

    /**
     * memory board
     */
    const mySetSquares = (list:string) => {
        setSquares([...list]);
    };

    /**
     * determine the drop position
     */
    const myClick = (index:number) => {
        props.onClick(index);
    };
    useImperativeHandle(ref, () => ({ mySetSquares }));
    let color: string;
    const SquareData = React.useMemo(
        () =>
            <div className={squares.length === 9 ? 'board-row' : 'board-row1'}>
                {
                    squares.map((item:string, index:number) => {
                        if (props.line && props.line.includes(index)) {
                            color = 'red';
                        } else {
                            color = '';
                        }
                        return (
                            <Square
                                key={index}
                                keyValue={index}
                                value={item}
                                color={color}
                                onClick={(index:number) => myClick(index)}
                            />
                        );
                    })
                }
            </div>
        , [squares]
    );

    return (
        <>
            {SquareData}
        </>
    );
});

export default Board;
