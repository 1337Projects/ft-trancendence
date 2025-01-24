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
    paddles: never; // Replace 'any' with the actual type
    game: never;   // Replace 'any' with the actual type
    ball: never; 
    game_data : MatchDataType   // Replace 'any' with the actual type
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