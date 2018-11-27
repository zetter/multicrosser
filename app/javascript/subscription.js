import ActionCable from 'actioncable';
import MoveBuffer from 'move_buffer';

const createSubscription = function createSubscription(crossword, room, onReceiveMove, onInitialState) {
  const cable = ActionCable.createConsumer(process.env.WEBSOCKET_URL);
  const moveBuffer = new MoveBuffer(room);

  return cable.subscriptions.create(
    { channel: 'MovesChannel', crossword, room },
    {
      received: function received(data) {
        if (data.initialState) {
          onInitialState(data.initialState);
        } else {
          onReceiveMove(data);
        }
      },
      move: function move(data) {
        if (this.consumer.connection.isActive()) {
          this.perform('move', data);
        } else {
          moveBuffer.queue(data);
        }
      },
      connected: function connected() {
        moveBuffer.deqeueAll().forEach((move) => {
          this.move(move);
        });
      },
    },
  );
};

export { createSubscription };
