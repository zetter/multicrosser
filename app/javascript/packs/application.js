// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import Crossword from 'react-crossword'

document.addEventListener('DOMContentLoaded', () => {
  const crosswordElement = document.getElementsByClassName('js-crossword')[0];
  const crosswordData = JSON.parse(crosswordElement.dataset.crossword);
  ReactDOM.render(<Crossword
    data={crosswordData}
  />, crosswordElement);

})
