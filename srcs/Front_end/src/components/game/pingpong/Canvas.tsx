import React, { useRef, useContext, useEffect } from 'react';
import { ApearanceContext } from "@/Contexts/ThemeContext";
import { Game } from './game';
import { GameType } from './PingPong';

interface CanvasProps {
    game: GameType,
};

// function Canvas(game: GameType) {
const Canvas: React.FC<CanvasProps> = ({ game }) => {
    console.log(game)
//    const {a,b,c} = game;
//    console.log(a,b,c);
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const canvaParentRef = useRef<null | HTMLDivElement>(null);


    const { theme } = useContext(ApearanceContext) || {}

    useEffect(() => {
        const canvas = canvasRef.current;
        console.log('use effect of canvas conponent.....');
        if (canvas) {
            console.log('canva is created .....');
            // const context = canvas.getContext('2d');
            // Perform any setup or drawing on the canvas here 
            // Cleanup function
            return () => {
                // Perform any necessary cleanup here
            };
        }
    }, [theme]); // Dependency array

    useEffect(() => {
        if (game !== null) {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            const { paddles, ball } = game;
            if (context) {
                const gameInstance = new Game(context, paddles, ball);
                gameInstance.render();
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