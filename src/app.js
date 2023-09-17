import './style.css'
import Game from './factories/game.js'

function init() {
  window.app = Controller(Game(), View())
}

const View = () => {
  const board1 = document.getElementById('board1')
  const board2 = document.getElementById('board2')
  const gameOptions = document.getElementById('game-options')
  const fleetContainer = document.querySelector('.fleet-container')
  const rotateBtn = document.getElementById('rotate-btn')
  const placeShipsBtn = document.getElementById('place-ships-btn')
  const startButton = document.getElementById('start-btn')

  const renderCell = (x, y, state) => {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.dataset.x = x
    cell.dataset.y = y
    if (typeof state === 'object' && state !== null) state = 'ship'
    cell.classList.add(state, 'cell')
    return cell
  }
  const renderGrid = (gameboard) => {
    const board = gameboard.getBoard()
    const grid = document.createElement('div')
    grid.classList.add('grid')
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const cell = renderCell(i, j, board[i][j])
        grid.appendChild(cell)
      }
    }
    return grid
  }

  const renderBoard1 = (playerBoard) => {
    board1.innerHTML = ''
    board1.appendChild(renderGrid(playerBoard))
  }

  const renderBoard2 = (computerBoard) => {
    board2.innerHTML = ''
    board2.appendChild(renderGrid(computerBoard))
  }

  const renderBoards = (gameboard1, gameboard2) => {
    board1.innerHTML = ''
    board2.innerHTML = ''
    board1.appendChild(renderGrid(gameboard1))
    board2.appendChild(renderGrid(gameboard2))
  }

  // ** Refactor this. Render one board at a time. Separate click handler **
  // callback is the game.nextTurn function passed in by the Controller
  const addGridListeners = (gameboard1, gameboard2, callback) => {
    // Add listeners to computer's board
    const cells = document.querySelectorAll('#board2 .cell')
    cells.forEach((cell) => {
      cell.addEventListener('click', async (e) => {
        if (e.target.classList.contains('miss') || e.target.classList.contains('hit')) return
        const x = e.target.dataset.x
        const y = e.target.dataset.y
        gameboard2.receiveAttack(x, y)
        renderBoards(gameboard1, gameboard2)
        // Process computer's turn and wait for timeout to complete before re-rendering
        await callback()
        renderBoards(gameboard1, gameboard2)
        addGridListeners(gameboard1, gameboard2, callback)
      })
    })
  }

  const autoPlaceShips = (fn) => {
    placeShipsBtn.addEventListener('click', () => {
      renderBoard1(fn())
      startButton.classList.remove('hidden')
    })
  }

  const addRotateListener = () => {
    const currentShip = document.querySelector('.fleet-container .ship')
    rotateBtn.addEventListener('click', () => {
      currentShip.classList.toggle('vertical')
    })
  }

  const renderFleet = (fleet) => {
    fleet.forEach((ship, index) => {
      const container = document.createElement('div')
      container.classList.add('ship')
      container.setAttribute('id', 'ship-' + index)
      container.setAttribute('draggable', true)
      container.dataset.type = ship.type
      container.dataset.length = ship.length
      container.dataset.orientation = 'horizontal'
      for (let i = 0; i < ship.length; i++) {
        const cell = document.createElement('div')
        cell.classList.add('ship-cell')
        cell.dataset.index = i
        container.appendChild(cell)
      }
      fleetContainer.appendChild(container)
    })
  }

  // Initialize Drag and Drop Event Listeners
  const initDragAndDrop = (playerBoard) => {
    let draggedShip
    let draggedShipIndex

    const getDraggedShipIndex = (e) => (draggedShipIndex = Number(e.target.dataset.index))

    const dragStart = (e) => {
      draggedShip = e.target
    }

    const dragDrop = (e) => {
      const cell = e.target
      const ship = playerBoard.getFleet()[Number(draggedShip.id.slice(-1))]
      // const isVertical = ship.isVertical()
      // const isHorizontal = !ship.isVertical()
      const isHorizontal = !draggedShip.classList.contains('vertical')

      const x = Number(cell.dataset.x) - (isHorizontal ? 0 : draggedShipIndex)
      const y = Number(cell.dataset.y) - (isHorizontal ? draggedShipIndex : 0)

      const outcome = playerBoard.placeShip(ship, x, y, isHorizontal)

      if (outcome) {
        // Update grid
        renderBoard1(playerBoard)
        addDragAndDropEventListeners()
        // Remove dragged ship
        const parent = draggedShip.parentElement
        parent.removeChild(draggedShip)
        const nextShip = parent.firstChild
        if (nextShip) {
          nextShip.setAttribute('style', 'display: flex')
          addRotateListener()
        } else {
          rotateBtn.classList.add('hidden')
          placeShipsBtn.classList.add('hidden')
          startButton.classList.remove('hidden')
        }
      }
    }

    const dragOver = (e) => e.preventDefault()
    const dragEnter = (e) => e.preventDefault()
    const dragLeave = () => {}
    const dragEnd = () => {}

    const addDragAndDropEventListeners = () => {
      const ships = document.querySelectorAll('.ship')
      const cells = document.querySelectorAll('.cell')

      for (const ship of ships) {
        ship.addEventListener('mousedown', getDraggedShipIndex)
        ship.addEventListener('dragstart', dragStart)
        ship.addEventListener('dragend', dragEnd)
      }
      for (const cell of cells) {
        cell.addEventListener('dragenter', dragEnter)
        cell.addEventListener('dragover', dragOver)
        cell.addEventListener('dragleave', dragLeave)
        cell.addEventListener('drop', dragDrop)
      }
    }
    addDragAndDropEventListeners()
  }

  // ** Start Game Listener **
  startButton.addEventListener('click', () => {
    gameOptions.classList.toggle('hidden')
    board2.classList.toggle('hidden')
  })

  return {
    renderBoards,
    addGridListeners,
    autoPlaceShips,
    renderFleet,
    addRotateListener,
    initDragAndDrop,
  }
}

const Controller = (game, view) => {
  const placeShips = () => game.placeFleet(game.playerBoard)
  const renderGame = () => view.renderBoards(game.playerBoard, game.computerBoard)
  const autoPlaceShips = () => view.autoPlaceShips(game.placePlayerFleet)
  const startGame = () => game.startGame()
  // const drag = view.Drag(game.playerBoard)

  renderGame()
  autoPlaceShips()
  view.renderFleet(game.playerBoard.getShipTypes())
  view.initDragAndDrop(game.playerBoard)
  view.addGridListeners(game.playerBoard, game.computerBoard, game.nextTurn)
  view.addRotateListener()

  return { renderGame, startGame }
}

init()
