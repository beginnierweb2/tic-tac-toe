import React from 'react';
import Square from './Square.tsx';
type Props = {
    line: number[] | null;
    onClick: any;
    squares: number[];
};
class Board extends React.Component<Props> {
    renderSquare (ids:number) {
        let color: string;
        if (this.props.line && this.props.line.includes(ids)) {
            color = 'red';
        } else {
            color = '';
        }
        return (
            <Square
                key={ids}
                value={this.props.squares[ids]}
                color={color}
                onClick={() => this.props.onClick(ids)}
            />
        );
    }

    // rerender by loop
    render () {
        let num = 0;
        let matrix = 3;
        const board: any[] = [];
        if (sessionStorage.getItem('gameType') === 'tictactoe') {
            matrix = 3;
        } else if (sessionStorage.getItem('gameType') === 'gobang') {
            matrix = 15;
        }
        for (let ids = 0; ids < matrix; ids++) {
            const boardRow: any[] = [];
            for (let jam = 0; jam < matrix; jam++, num++) {
                boardRow.push(this.renderSquare(num));
            }
            board.push(<div className='board-row' key={ids}>
                {boardRow}
            </div>);
        }
        return <div>{board}</div>;
    }
}

export default Board;
