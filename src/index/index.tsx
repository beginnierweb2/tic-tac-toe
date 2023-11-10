import React, { useState } from 'react';
import Game from '../components/Game.tsx';
import './index.css';

/**
 * judge the user click and pass the value
 */
const Index = () => {
    const [gameType, setGameType] = useState('tictactoe');

    /**
     * store the user by clicking the button
     */
    const handleGameTypeChange = (type: 'tictactoe' | 'gobang') => {
        setGameType(type);
    };
    return (
        <div>
            <div>
                <button onClick={() => handleGameTypeChange('tictactoe')}>
                  井字棋
                </button>
                <button onClick={() => handleGameTypeChange('gobang')}>五子棋</button>
            </div>
            {gameType === 'tictactoe' ? (
                <GameContainer  gameType='tictactoe' />
            ) : (
                <GameContainer  gameType='gobang' />
            )}
        </div>
    );
};

/**
 * main page display
 */
const GameContainer = ({ gameType }: { gameType: 'tictactoe' | 'gobang' }) => {
    return (
        <div>
            <h2>{gameType === 'tictactoe' ? '井字棋' : '五子棋'}</h2>
            <Game gameType={gameType}></Game>
        </div>
    );
};


export default Index;
