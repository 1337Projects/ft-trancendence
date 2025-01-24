import { WebSocketService } from '@/sockets/index'

class GameSocket extends WebSocketService {

    eventCallback = (event: MessageEvent) => {

        const data = JSON.parse(event.data)
        const type = data.event;
        
        switch (type) {
            case 'init_game':
                if (this.callbacks['init']) {
                    this.callbacks['init'](data);
                }
                break;
            case 'update':
                if (this.callbacks['update']) {
                    this.callbacks['update'](data.stats);
                }
                break;
            case 'set_score':
                if (this.callbacks['set_score']) {
                    this.callbacks['set_score'](data.score);
                }
                break;
            case 'end_game':
                if (this.callbacks['set_match_result']) {
                    this.callbacks['set_match_result'](data.game_data)
                }
                break;
            default:
                break;
        }
    }
}

export const gameSocket = new GameSocket()