import React from 'react';
import ReactDOM from 'react-dom';
import Crossword from 'react-crossword';
import { createSubscription } from 'subscription';

const crosswordElement = document.getElementsByClassName('js-crossword')[0];

const { crossword, crosswordIdentifier, room } = crosswordElement.dataset;
const crosswordData = JSON.parse(crossword);

const crosswordRef = React.createRef();
const onReceiveMove = (move) => { crosswordRef.current.setCellValue(move.x, move.y, move.value, false); };

const subscription = createSubscription(crosswordIdentifier, room, onReceiveMove, (initialState) => {
  ReactDOM.render(<Crossword
    ref={crosswordRef}
    data={crosswordData}
    loadGrid={() => {} }
    saveGrid={() => {} }
    onMove={(move) => { subscription.move(move); }}
  />, crosswordElement);
  crosswordRef.current.updateGrid(initialState)
});
