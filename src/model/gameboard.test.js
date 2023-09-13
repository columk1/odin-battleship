import Gameboard from './gameboard'
import Ship from './ship'

describe('Gameboard', () => {
  const board = Gameboard()
  const ship = Ship(3)

  describe('Place a ship', () => {
    test('When board is initialized', () => {
      expect(board.board[8][8]).toBe(null)
    })

    test('When ship is placed outside of board', () => {
      expect(board.placeShip(ship, 10, 10)).toBe('Invalid placement')
    })

    test('When ship does not fit on board', () => {
      expect(board.placeShip(ship, 8, 0)).toBe('Invalid placement')
    })

    test('When vertical ship does not fit on board', () => {
      expect(board.placeShip(ship, 0, 8, true)).toBe('Invalid placement')
    })

    test('When ship is placed on board horizontally', () => {
      board.placeShip(ship, 0, 0)
      expect(board.board[2][0]).toBe(ship)
    })

    test('When ship is placed on board vertically', () => {
      board.placeShip(ship, 0, 2, true)
      expect(board.board[0][0]).toBe(ship)
    })

    test('When a ship overlaps another ship', () => {
      board.placeShip(ship, 0, 0)
      expect(board.placeShip(ship, 0, 0)).toBe('Invalid placement')
    })

    test('When a vertical ship overlaps another ship', () => {
      board.placeShip(ship, 0, 2)
      expect(board.placeShip(ship, 2, 0, true)).toBe('Invalid placement')
    })
  })

  describe('Recieve Attack', () => {
    board.placeShip(ship, 0, 0)

    test('When ship is hit', () => {
      board.receiveAttack(0, 0)
      expect(board.board[0][0].getHits()).toBe(1)
    })

    test('When ship is missed', () => {
      board.receiveAttack(3, 0)
      expect(board.board[3][0]).toBe(null)
      expect(board.misses[0]).toEqual({ x: 3, y: 0 })
    })

    test('When a cell with no ship is hit twice', () => {
      board.receiveAttack(3, 0)
      expect(board.misses.length).toBe(1)
    })

    test('When a cell with a ship is hit twice', () => {})

    test('When a ship receives a second hit', () => {
      board.receiveAttack(1, 0)
      expect(board.board[1][0].getHits()).toBe(2)
    })

    test('When a ship is sunk', () => {
      board.receiveAttack(2, 0)
      expect(board.board[2][0].isSunk()).toBe(true)
    })

    test('When all ships on board are sunk', () => {
      expect(board.allShipsSunk()).toBe(true)
    })
  })
})
