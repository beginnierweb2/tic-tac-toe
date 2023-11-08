import React from 'react';

/**
 * checkerboard
 */
function Square (props: object | any) {
    return (
        <button className='square' onClick={props.onClick}>
            <strong style={{ backgroundColor: `${props.color}` }}>
                {props.value}
            </strong>
        </button>
    );
}

export default Square;
