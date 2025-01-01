import React, { useRef, useContext, useEffect } from 'react';
import { ApearanceContext } from "@/Contexts/ThemeContext";
import { Game } from './Game';
import { GameType } from './PingPong';
import { gameSocket } from '@/sockets/gameSocket';

interface CanvasProps {
    game: GameType,
};

interface GameStatsType {
    paddle1: number,
    paddle2: number,
    ball: {
        x: number,
        y: number
    } 
};

// function Canvas(game: GameType) {
const Canvas: React.FC<CanvasProps> = ({ game }) => {
    console.log(game)
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const canvaParentRef = useRef<null | HTMLDivElement>(null);
    const gameInstanceRef = useRef<null | Game>(null);


    const { theme } = useContext(ApearanceContext) || {}

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const keyData = {
                event: 'movePaddle',
                key: event.key,
            };
            if (keyData.key === 'ArrowUp' || keyData.key === 'ArrowDown')
                gameSocket.sendMessage(keyData);
            console.log('key down on ', event.key);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function update_stats(stats: GameStatsType) {
        gameInstanceRef.current?.setUpdate(stats);
        gameInstanceRef.current?.render();
    }

    useEffect(() => {
        if (game !== null) {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            const { paddles, ball } = game;
            if (context) {
                gameInstanceRef.current = new Game(context, paddles, ball);
                gameInstanceRef.current.render();
                gameSocket.addCallback('update', update_stats);
            } else {
                console.error('Error in getting context of canvas.');
            }
        } else {
            console.error('Game is null');
        }
    }, [game]);

    return (
        <div 
            ref={canvaParentRef}
            className={` ${theme === 'light' ? "border-lightText" : "border-darkText"}
            rounded-sm w-full flex justify-center items-center h-5/6 relative transition-transform duration-1000`}
        >
            <div className=''>
                <canvas 
                    className={`border-[.1px] border-white/50 mr-10 bg-white/30 rounded-sm backdrop-blur-md w-full`}
                    width="800px" height="400px" 
                    ref={canvasRef}></canvas>
            </div>
        </div>
    );
}

export default Canvas;