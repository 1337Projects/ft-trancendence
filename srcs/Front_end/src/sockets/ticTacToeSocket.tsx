import { WebSocketService } from '@/sockets/index'
import { TicTacTeoType } from '@/types/gameTypes'


class TicTacTeoSocket extends WebSocketService {

    eventCallback = (event : MessageEvent) => {
        const data = JSON.parse(event.data)
        switch (data.status) {
            case 201: {
                this.callbacks["init"]?.(() => {
                    return {
                        players : data.data.players,
                        user : data.data.user,
                        board : data.data.board,
                        player : null,
                        winner : null,
                    }
                })
                break;
            }
            case 202: {
                this.callbacks["init"]?.((prev : TicTacTeoType | null) => {
                    return {
                        ...prev,
                        user : data.data.user,
                        board : data.data.board,
                    }
                })
                break;
            }
            case 203: {
                this.callbacks["init"]?.((prev : TicTacTeoType | null) => {
                    return {
                        ...prev,
                        board : data.data.board,
                        winner : data?.data?.winner || undefined,
                    }
                })
                break;
            }
            case 204: {
                this.callbacks["time"]?.(data.data.time)
                break;
            }
            case 400: {
                this.callbacks["err"]?.(() => {
                    return {
                        type : "error",
                        message : [data.data.error]
                    }
                })
                break;
            };
            default:
                break;
        }
    }
}



export const ticTacTeoSocket = new TicTacTeoSocket()