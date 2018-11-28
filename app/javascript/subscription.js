import ActionCable from 'actioncable';
import MoveBuffer from 'move_buffer';

const createSubscription = function createSubscription(crossword, room, onReceiveMove, onReplayMove, onInitialState) {
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
        let success = false;
        try {
          success = this.perform('move', data);
        } catch (e) {
          // catch error
        } finally {
          if (!success) {
            moveBuffer.queue(data);
          }
        }
      },
      connected: function connected() {
        moveBuffer.deqeueAll().forEach((move) => {
          onReplayMove(move);
        });
      },
    },
  );
};

export { createSubscription };
