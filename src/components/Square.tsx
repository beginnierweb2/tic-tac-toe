import React, { useMemo } from 'react';
/**
 * checkerboard
 */
const Square = (props: object | any) => {
    const SquareData = useMemo(() => <button className='square' onClick={() => props.onClick(props.keyValue)}>
        <strong style={{ backgroundColor: `${props.color}` }}>
            {props.value}
        </strong>
    </button>, [props.value, props.color]);
    return (
        <>{SquareData}</>
    );
};

export default Square;
