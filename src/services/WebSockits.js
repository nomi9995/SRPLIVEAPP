import {Singleton} from './Resources';
import {socket} from '../sockets/connection';
import {ReplaySubject} from 'rxjs';

class WebSockits {
  constructor() {
    this.onMessage = new ReplaySubject(1);
    this.onMessageUpdate = new ReplaySubject(1);

    socket.on('new_message', msg => {
      this.onMessage.next(msg);
    });
  
    socket.on('message_update', msg => {
      this.onMessageUpdate.next(msg);
    });
  }

  subscribeToMessages = handler => {
    return this.onMessage.subscribe(handler);
  };
  
  subscribeToMessagesUpdate = handler => {
    return this.onMessageUpdate.subscribe(handler);
  };
}

export default Singleton(WebSockits);