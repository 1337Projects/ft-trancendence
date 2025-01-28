import { UserType } from "./userTypes"


export type MatchDataType = {
    id : number
    player1 : UserType
    player2 : UserType
    score1? : number
    score2? : number
    updated_at? : string
    created_at : string
    winner : number | UserType |null
    loser : UserType | null
}

export interface CanvasProps {
    game: GameType | null
};

export interface GameStatsType {
    paddle1: number,
    paddle2: number,
    ball: {
        x: number,
        y: number
    } 
};

export interface GameType {
    paddles: {
        paddle1: number,
        paddle2: number
        width : number,
        height : number
    };
    game: {
        width : number,
        height : number
    };
    ball: {x : number, y: number}; 
    game_data : MatchDataType
}

export interface ScoreType {
    score1: number;
    score2: number;
}


export type RoomType = {
    players : UserType[],
    status : string,
    name : string
}

export type TicTacTeoType = {
    players : {user : UserType, char : string}[],
    user : UserType,
    board : string[][],
    winner : UserType | null
}

export type XpRecordType = {
	experience_gained : number,
	date_logged : string
}