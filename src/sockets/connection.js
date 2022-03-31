import io from 'socket.io-client';

export const socket = io('https://www.srplivehelp.com:2020', {
  transports: ['websocket'],
});