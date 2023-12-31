import Gameboard from './gameboard.js'
import Player from './player.js'

const Game = () => {
  const player = Player()
  const computer = Player()
  let playerTurn = true

  const playerBoard = Gameboard()
  const computerBoard = Gameboard()

  computerBoard.autoPlaceFleet()

  const gameOver = () => (playerBoard.allShipsSunk() || computerBoard.allShipsSunk() ? true : false)

  const placePlayerFleet = () => {
    playerBoard.autoPlaceFleet()
    return playerBoard
  }

  // TODO: This function call should trigger a method in the Controller to call view.endGame()
  const declareWinner = () => {
    if (playerBoard.allShipsSunk()) {
      return 'Computer wins!'
    } else if (computerBoard.allShipsSunk()) {
      return 'Player wins!'
    }
  }

  // Used for testing game loop only
  const startGame = () => {
    while (!gameOver()) {
      if (!playerTurn) {
        alert(computer.autoAttack(playerBoard))
        playerTurn = true
      } else {
        // const input = prompt('Player turn: Enter coordinates (x, y)').split(',')
        // const [x, y] = input
        // player.attack(x, y, computerBoard)
        // playerTurn = !playerTurn
        setTimeout(() => {
          playerTurn = !playerTurn
        }, 2000)
      }
    }
    declareWinner()
  }

  const nextTurn = () => {
    if (gameOver()) {
      declareWinner()
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(computer.autoAttack(playerBoard))
        }, 300)
      })
    }
  }

  return {
    playerBoard,
    computerBoard,
    placePlayerFleet,
    gameOver,
    nextTurn,
  }
}
export default Game
