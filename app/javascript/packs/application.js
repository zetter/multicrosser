import React from 'react'
import ReactDOM from 'react-dom'
import Crossword from 'react-crossword'
import { createSubscription } from 'subscription'

const crosswordElement = document.getElementsByClassName('js-crossword')[0];

const crosswordData = JSON.parse(crosswordElement.dataset.crossword);
const crosswordIdentifier = crosswordElement.dataset.crosswordIdentifier;
const room = crosswordElement.dataset.room;

const crosswordRef = React.createRef();
const onReceiveMove = (move) => { crosswordRef.current.setCellValue(move.x, move.y, move.value, false) }

let subscription = createSubscription(crosswordIdentifier, room, onReceiveMove, function(initialState) {
  ReactDOM.render(<Crossword
    ref={ crosswordRef }
    data={ crosswordData }
    loadGrid={ () => initialState }
    onMove={ (move) => { subscription.move(move) }}
  />, crosswordElement);
});
