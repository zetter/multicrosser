# Multiplayer Crosswords with Multicrosser

This is a Rails Application that uses WebSockets and the [react-crossword](https://github.com/zetter/react-crossword) component to create multiplayer crosswords. You can [read a blog post about why I built it and how it works](https://chriszetter.com/blog/2018/12/02/multiplayer-crosswords/).

You can see a demo at [multicrosser.chriszetter.com](https://multicrosser.chriszetter.com).

## Setup

To run this project:
+ Install Redis and make sure the server is running
+ Run `./bin/setup` to install dependencies
+ Run `./bin/rails server` to start the project

## How it works

### Sending a Move

Here's what happens when a player types a character:

1. Client: `react-crossword` calls `setCellValue` to update the grid
  * `setCellValue` calls the `onMove` callback with cell location and value
  * `onMove` callback calls the `move` function in the action cable subscription
  * The `move` function sends the move to the server
2. Server: `MovesChannel#move` is run
  * The move is recorded in Redis
  * The move is rebroadcast to others in the channel
3. On all clients:
  * The `received` function runs in the Action Cable subscriptions which calls the `onReceiveMove` callback
  * `onReceiveMove` calls `setCellValue` with the `triggerOnMoveCallback` option set to `false` so `onMove` isn't called again
  * `setCellValue` updates the crossword gird

### Working with Intermittent Connections

If the move can't be broadcast with Action Cable it's stored in the `MoveBuffer`. On reconnection:

1. The remote state of the grid will be received from the server and updated
2. The moves in the moves buffer will be replayed

When the move `MoveBuffer` is replayed, moves will only apply if the cell they change still has the same character in it when the move was made. For example, if you change an 'A' to a 'B' while offline this move will be discarded if someone has since changed the 'A' to a 'C' and broadcast it to the server before you.

The `MoveBuffer` uses local storage so will persist if the page is refreshed or the browser is closed.

## The Source of the Crosswords Data

Crosswords are scraped from the Guardian Crossword pages which contain a JSON representation of each crossword. The crosswords are re-used following their [Open Licence Terms](https://syndication.theguardian.com/open-licence-terms/).
