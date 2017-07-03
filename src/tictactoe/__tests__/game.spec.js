/* @flow */
import { Game, genScoreCard, createGrid } from '../Models';
import type { GameBoard, GameGrid } from '../tictactoe.types';
import { Side } from '../tictactoe.types';
import { blank } from '../Handlers';

describe('TicTacToe Game', () => {
  let game: Game;

  beforeEach(() => game = new Game());

  it('resetScores should set X and O scores to 0', () => {
    game.state.score[Side.X] = 1;
    game.state.score[Side.O] = 1;

    game.resetScores();

    expect(game.getScore(Side.X)).toBe(0);
    expect(game.getScore(Side.O)).toBe(0);
  });

  it('canTakeSquare returns true if requested square is available', () => {
    const gameGrid = { x: 0, y: 0, player: Side.X };
    expect(game.canTakeSquare(gameGrid)).toBe(true);
  });

  it('canTakeSquare returns false if requested square is unavailable', () => {
    const gameGrid = { x: 0, y: 0, player: Side.X };
    game.takeTurn(gameGrid);
    expect(game.canTakeSquare(gameGrid)).toBe(false);
  });

  it('instantiates with correct default state', () => {
    expect(game.state.input).toBe(false);
    expect(game.state.history).toEqual([]);
    expect(game.state.turn).toBe('X');
    expect(game.state.player).toBe('X');
    expect(game.state.finished).toBe(false);
    expect(game.state.grid).toEqual(createGrid());
    expect(game.state.score).toEqual(genScoreCard());
  });

  it('rollback should move back 2 states', () => {
    game.takeTurn({ x: 0, y: 0, player: 'X' });
    game.simulateMove();
    game.rollback();

    expect(game.state.history.length).toBe(0);
    expect(game.current()).toEqual(blank);
  });

  it('getScore return score of given player', () => {
    expect(game.getScore('X')).toBe(0);
    expect(game.getScore('O')).toBe(0);
  });

  it('canMove returns true when player === turn', () => {
    expect(game.canMove()).toBe(true);
  });

  it('canMove returns false when player !== turn', () => {
    game.state.player = 'O';
    expect(game.canMove()).toBe(false);
  });

  it('player return the player selection', () => {
    expect(game.player()).toBe('X');
  });

  it('restart should reset game state', () => {
    game.state.input = false;
    game.state.finished = true;
    game.state.turn = 'O';
    game.state.history = [createGrid()];
    game.state.grid = ((['a']: any): Array<GameGrid>);

    game.restart();

    expect(game.state.input).toBe(true);
    expect(game.state.finished).toBe(false);
    expect(game.state.turn).toBe('X');
    expect(game.state.history).toEqual([]);
    expect(game.state.grid).toEqual(createGrid());
  });

  it('isOver should return game finished state', () => {
    expect(game.isOver()).toBe(false);
  });

  it('update should game state', () => {
    game.update({ finished: true });
    expect(game.isOver()).toBe(true);
  });

  it('markWinner should update player score', () => {
    game.markWinner('X');
    expect(game.state.score['X']).toBe(1);
  });

  it('chooseSide should set player', () => {
    game.chooseSide('O');
    expect(game.state.player).toBe('O');
  });

  it('takeTurn should reject move if player !== turn', () => {
    game.chooseSide('O');
    game.takeTurn({ x: 0, y: 0, player: null });
    expect(game.current()[0]).toBe('');
  });

  it('takeTurn should make move, update turn', () => {
    game.takeTurn({ x: 0, y: 0, player: null });
    expect(game.current()[0]).toBe('X');
    expect(game.state.turn).toBe('O');
    expect(game.state.finished).toBe(false);
  });

  it('takeTurn should detect when board already full', () => {
    game.state.grid.map(
      (c, i) => (i % 2 === 0 ? (c.player = 'X') : (c.player = 'O')),
    );
    game.takeTurn({ x: 0, y: 0, player: null });
    expect(game.state.history.length).toBe(0);
  });

  it('takeTurn should detect when winning move just made', () => {
    game.state.grid[0].player = 'X';
    game.state.grid[1].player = 'X';
    game.takeTurn({ x: 0, y: 2, player: null });
    expect(game.isOver()).toBe(true);
    expect(game.state.score['X']).toBe(1);
  });

  it('startPlayerMove should set input to true', () => {
    game.startPlayerMove();
    expect(game.state.input).toBe(true);
  });

  it('endPlayerMove should set input to false', () => {
    game.state.input = true;
    game.endPlayerMove();
    expect(game.state.input).toBe(false);
  });

  it('simulateFirstMove should update turn, input, and call simulateMove', () => {
    const spy = jest.spyOn(game, 'simulateMove').mockImplementation(() => {});
    game.simulateFirstMove();
    expect(game.state.turn).toBe('X');
    expect(game.state.input).toBe(false);
    expect(spy).toHaveBeenCalled();

    //$FlowIgnore
    spy.mockRestore();
  });

  it("simulateMove shouldn't move if game board is full", () => {
    game.state.grid.map(
      (c, i) => (i % 2 === 0 ? (c.player = 'X') : (c.player = 'O')),
    );
    game.simulateMove();
    expect(game.state.finished).toBe(true);
  });

  it('simulateMove should move on next available game square', () => {
    game.simulateMove();
    expect(game.current()[0]).toBe('X');
    expect(game.state.turn).toBe('O');
  });

  it('simulateMove should detect if computer has won', () => {
    game.state.grid[0].player = 'X';
    game.state.grid[1].player = 'X';
    game.simulateMove();
    expect(game.isOver()).toBe(true);
    expect(game.state.score['X']).toBe(1);
  });

  it("current should return current game board with it's players", () => {
    game.state.grid[0].player = 'X';
    game.state.grid[1].player = 'O';
    expect(game.current()).toEqual(['X', 'O', '', '', '', '', '', '', '']);
  });
});
