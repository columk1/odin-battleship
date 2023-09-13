import { randomCoordinates } from './helpers/helpers.js'
import Ship from './ship.js'

const Gameboard = () => {
  const SIZE = 10
  const SHIP_LENGTHS = [5, 4, 3, 3, 2]
  const ships = []

  // Create a grid
  let board = Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(null))

  const getBoard = () => board
  const getShips = () => ships

  const placeShip = (ship, x, y, isVertical) => {
    if (!isValidPlacement(ship, x, y, isVertical)) return 0

    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        board[x][y + i] = ship
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        board[x + i][y] = ship
      }
    }
    return ships.push(ship)
  }

  const autoPlaceShip = (ship) => {
    const [x, y] = randomCoordinates()
    const isVertical = Math.random() > 0.5
    const isPlaced = placeShip(ship, x, y, isVertical)
    if (!isPlaced) autoPlaceShip(ship)
  }

  const autoPlaceFleet = (fleet) => {
    SHIP_LENGTHS.forEach((length) => autoPlaceShip(Ship(length)))
  }

  const isValidPlacement = (ship, x, y, isVertical) => {
    // Check if coordinates are valid
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return false

    // Check if ship fits
    if (isVertical) {
      if (y + ship.length > SIZE) return false
    } else {
      if (x + ship.length > SIZE) return false
    }

    // Check if ship overlaps another ship
    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        if (board[x][y + i] !== null) return false
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        if (board[x + i][y] !== null) return false
      }
    }
    return true
  }

  const getCell = (x, y) => (x < SIZE || y < SIZE ? undefined : board[x][y])

  const receiveAttack = (x, y) => {
    let target = board[x][y]
    if (target === null) {
      board[x][y] = 'miss'
      // if (!misses.some((e) => e.x == x && e.y == y)) misses.push({ x, y })
    } else {
      target.hit()
      board[x][y] = 'hit'
    }
    return board[x][y]
  }

  const allShipsSunk = () => ships.every((ship) => ship.isSunk())

  return {
    getBoard,
    getShips,
    placeShip,
    autoPlaceShip,
    autoPlaceFleet,
    receiveAttack,
    allShipsSunk,
  }
}
export default Gameboard
