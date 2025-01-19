import { WebSocketService } from '@/sockets/index'
import { UserType } from '@/types/userTypes'


class TournamentSocket extends WebSocketService {

    eventCallback = (event : MessageEvent) => {
        const data = JSON.parse(event.data)
        switch (data.response.status) {
            case 100: {
                const players : UserType[] = []
                for (const [, value] of Object.entries(data.response.data.players as Record<string, UserType>) ) {
                    players.push(value)
                }
                data.response.data.players = players
                this.callbacks["roomDataHandler"]?.(data.response.data)
                break;
            }
            case 201:
                this.callbacks["setRoom"]?.(data.response.room)
                break;
            case 210:
                this.callbacks["tr_data"]?.(data.response.data)
                setTimeout(() => {
                    this.sendMessage({"event" : "start"})
                }, 4000)
                break;
            case 211:
                this.callbacks["match_data"]?.(data.response.data)
                break;
            case 212:
                this.callbacks["winner_data"]?.(data.response.data)
                break;
            case 400:
                this.callbacks["error"]?.(data.response.error)
                this.socket?.close()
                break;
        }
    }
}

export const tournamentSocket = new TournamentSocket()