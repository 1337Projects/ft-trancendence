import React, { useRef, useContext, useEffect } from 'react';
import { ApearanceContext } from "@/Contexts/ThemeContext";
import { Game } from './Game';
import { gameSocket } from '@/sockets/gameSocket';
import { CanvasProps, GameStatsType } from '@/types/gameTypes';



const Canvas: React.FC<CanvasProps> = ({ game }) => {
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const canvaParentRef = useRef<null | HTMLDivElement>(null);
    const gameInstanceRef = useRef<null | Game>(null);


    const { theme } = useContext(ApearanceContext) || {}

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            event.preventDefault()
            const keyData = {
                event: 'movePaddle',
                key: event.key,
            };
            if (keyData.key === 'ArrowUp' || keyData.key === 'ArrowDown')
                gameSocket.sendMessage(keyData);
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
        gameSocket.addCallback('update', update_stats);
    }, [])

    useEffect(() => {
        if (game !== null && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            const { paddles, ball } = game;
            if (context) {
                gameInstanceRef.current = new Game(context, paddles, ball);
                gameInstanceRef.current.render();
            }
        }
    }, [game]);

    if (!game) {
        return (
            <div className='w-full h-[200px] rounded bg-gray-300 animate-pulse'></div>
        )
    }

    return (
        <div 
            ref={canvaParentRef}
            className={` ${theme === 'light' ? "border-lightText" : "border-darkText"}
            rounded-sm relative w-full flex justify-center items-center h-full transition-transform duration-1000`}
        >
            <div className='w-full h-full'>
                <canvas 
                    className={`w-full h-full border-[.1px] rounded border-white/50 ${theme === 'light' ? "bg-black/60" : "bg-white/10"}  backdrop-blur-md`}
                    width="550px" height="300px" 
                    ref={canvasRef}></canvas>
            </div>
        </div>
    );
}

export default Canvas;