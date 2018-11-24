import { initCrosswords } from './main';
import ActionCable from 'actioncable';

const crosswordElement = document.getElementsByClassName('js-crossword')[0];
const crosswordIdentifier = crosswordElement.getAttribute('data-crosswordIdentifier');
const room = crosswordElement.getAttribute('data-room');

const cable = ActionCable.createConsumer(process.env.WEBSOCKET_URL);
const subscription = cable.subscriptions.create(
  { channel: 'MovesChannel', crossword: crosswordIdentifier, room },
  {
    received: function received(data) {
      if (data.initialState) {
        initCrosswords(data.initialState);
      } else {
        this.handleMoveCallback(data.x, data.y, data.value, true);
      }
    },
    move: function move(data) {
      this.perform('move', data);
    },
    connected: function connected() {
    },
    handleMove: function handleMove(func) {
      this.handleMoveCallback = func;
    }
  }
);


export { subscription };
