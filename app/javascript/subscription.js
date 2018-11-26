import ActionCable from 'actioncable';

const createSubscription = function createSubscription(crossword, room, onReceiveMove, onInitialState) {
  const cable = ActionCable.createConsumer(process.env.WEBSOCKET_URL);

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
        this.perform('move', data);
      },
      connected: function connected() {
      },
    },
  );
};

export { createSubscription };
