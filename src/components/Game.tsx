'use client';

import React, { useEffect, useState } from 'react';

import { type cellType } from '../utils/types';
import Cell from './Cell';

const generateGridTemplate = (size: number) => {
	const gridTemplate: (string | number)[][] = [];

	for (let i = 0; i < size; i++) {
		gridTemplate.push([]);
		for (let j = 0; j < size; j++) {
			gridTemplate[i].push(0);
		}
	}

	return gridTemplate;
};

const generateBoardTemplate = (size: number) => {
	const boardTemplate: cellType[] = [];

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			boardTemplate.push({ y: i, x: j, type: 'empty' });
		}
	}

	return boardTemplate;
};

const Game = () => {
	const [mazeSize, setMazeSize] = useState(20);
	const [pathLength, setPathLength] = useState(0);
	const [isNoPath, setIsNoPath] = useState(false);

	const [board, setBoard] = useState(generateBoardTemplate(mazeSize));
	const [action, setAction] = useState<'finish' | 'start'>('start');

	const [changed, setChanged] = useState(false);

	const [isStartSet, setIsStartSet] = useState(false);
	const [isFinishSet, setIsFinishSet] = useState(false);

	useEffect(() => {}, []);

	useEffect(() => {
		calculatePath();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [changed]);

	useEffect(() => {
		if (!isFinishSet || !isStartSet) {
			clearPath();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFinishSet, isStartSet]);

	const calculatePath = () => {
		if (!(isFinishSet && isStartSet)) return;

		const grid = generateGridTemplate(mazeSize);

		let endX: number = 0,
			endY: number = 0;

		board.forEach((cell) => {
			switch (cell.type) {
				case 'empty':
					grid[cell.y][cell.x] = 0;
					break;
				case 'start':
					grid[cell.y][cell.x] = 'S';
					break;
				case 'finish':
					endX = cell.x;
					endY = cell.y;
					grid[cell.y][cell.x] = 'M';
					break;
				case 'wall':
					grid[cell.y][cell.x] = -3;
					break;
				case 'path':
					grid[cell.y][cell.x] = 0;
					break;
				default:
					break;
			}
		});

		let ended: boolean = false;
		let failed: boolean = false;
		let pathLevel: number = 0;

		while (!ended) {
			pathLevel = pathLevel + 1;

			if (pathLevel > mazeSize * mazeSize) {
				ended = true;

				setPathLength(0);
				setIsNoPath(true);

				setBoard((prevBoard) => {
					const newBoard: cellType[] = prevBoard.map((cell) => {
						if (cell.type == 'path') {
							return { ...cell, type: 'empty' };
						} else {
							return cell;
						}
					});
					return newBoard;
				});

				failed = true;
			}

			for (let i = 0; i < mazeSize; i++) {
				for (let j = 0; j < mazeSize; j++) {
					if (pathLevel == 1) {
						if (grid[i][j] == 'S') {
							if (
								(grid[i - 1] && grid[i - 1][j] == 'M') ||
								(grid[i + 1] && grid[i + 1][j] == 'M') ||
								grid[i][j - 1] == 'M' ||
								grid[i][j + 1] == 'M'
							) {
								ended = true;
							} else {
								if (grid[i - 1] && grid[i - 1][j] == 0) {
									grid[i - 1][j] = pathLevel;
								}
								if (grid[i + 1] && grid[i + 1][j] == 0) {
									grid[i + 1][j] = pathLevel;
								}
								if (grid[i][j - 1] == 0) {
									grid[i][j - 1] = pathLevel;
								}
								if (grid[i][j + 1] == 0) {
									grid[i][j + 1] = pathLevel;
								}
							}
						}
					} else {
						if (grid[i][j] == pathLevel - 1) {
							if (
								(grid[i - 1] && grid[i - 1][j] == 'M') ||
								(grid[i + 1] && grid[i + 1][j] == 'M') ||
								grid[i][j - 1] == 'M' ||
								grid[i][j + 1] == 'M'
							) {
								ended = true;
							} else {
								if (grid[i - 1] && grid[i - 1][j] == 0) {
									grid[i - 1][j] = pathLevel;
								}
								if (grid[i + 1] && grid[i + 1][j] == 0) {
									grid[i + 1][j] = pathLevel;
								}
								if (grid[i][j - 1] == 0) {
									grid[i][j - 1] = pathLevel;
								}
								if (grid[i][j + 1] == 0) {
									grid[i][j + 1] = pathLevel;
								}
							}
						}
					}
				}
			}
		}

		if (!failed) {
			let RoadLenght: number;
			let pathRednerEnded: boolean = false;
			let pathRenderLevel: number = 0;

			let currnetX: number = endX;
			let currnetY: number = endY;

			if (grid[currnetY - 1] && grid[currnetY - 1][currnetX] == pathLevel) {
				pathRenderLevel = pathLevel;
			}
			if (grid[currnetY + 1] && grid[currnetY + 1][currnetX] == pathLevel) {
				pathRenderLevel = pathLevel;
			}
			if (grid[currnetY][currnetX - 1] == pathLevel) {
				pathRenderLevel = pathLevel;
			}
			if (grid[currnetY][currnetX + 1] == pathLevel) {
				pathRenderLevel = pathLevel;
			}
			if (grid[currnetY - 1] && grid[currnetY - 1][currnetX] == pathLevel - 1) {
				pathRenderLevel = pathLevel - 1;
			}
			if (grid[currnetY + 1] && grid[currnetY + 1][currnetX] == pathLevel - 1) {
				pathRenderLevel = pathLevel - 1;
			}
			if (grid[currnetY][currnetX - 1] == pathLevel - 1) {
				pathRenderLevel = pathLevel - 1;
			}
			if (grid[currnetY][currnetX + 1] == pathLevel - 1) {
				pathRenderLevel = pathLevel - 1;
			}

			RoadLenght = pathRenderLevel + 1;

			const pathList: { x: number; y: number }[] = [];

			while (!pathRednerEnded) {
				if (grid[currnetY - 1] && grid[currnetY - 1][currnetX] == pathRenderLevel) {
					pathList.push({ x: currnetX, y: currnetY - 1 });
					currnetX = currnetX;
					currnetY = currnetY - 1;
					pathRenderLevel--;
				} else if (grid[currnetY + 1] && grid[currnetY + 1][currnetX] == pathRenderLevel) {
					pathList.push({ x: currnetX, y: currnetY + 1 });
					currnetX = currnetX;
					currnetY = currnetY + 1;
					pathRenderLevel--;
				} else if (grid[currnetY][currnetX - 1] == pathRenderLevel) {
					pathList.push({ x: currnetX - 1, y: currnetY });
					currnetX = currnetX - 1;
					currnetY = currnetY;
					pathRenderLevel--;
				} else if (grid[currnetY][currnetX + 1] == pathRenderLevel) {
					pathList.push({ x: currnetX + 1, y: currnetY });
					currnetX = currnetX + 1;
					currnetY = currnetY;
					pathRenderLevel--;
				}

				if (pathRenderLevel == 0) {
					pathRednerEnded = true;
					setIsNoPath(false);
					setPathLength(pathLevel);
				}
			}

			setBoard((prevBoard) => {
				const newBoard: cellType[] = prevBoard.map((cell) => {
					if (pathList.find((obj: { x: number; y: number }) => obj.x == cell.x && obj.y == cell.y)) {
						return { ...cell, type: 'path' };
					} else if (cell.type == 'path') {
						return { ...cell, type: 'empty' };
					} else {
						return cell;
					}
				});
				return newBoard;
			});
		}
	};

	const clearPath = () => {
		setPathLength(0);
		setBoard((prevBoard) => {
			const newBoard: cellType[] = prevBoard.map((cell) => {
				if (cell.type == 'path') {
					return { ...cell, type: 'empty' };
				} else {
					return cell;
				}
			});
			return newBoard;
		});
	};

	const setWallAt = (x: number, y: number) => {
		setBoard((prevBoard) => {
			const newBoard: cellType[] = prevBoard.map((cell) => {
				if (cell.x == x && cell.y == y) {
					if (cell.type == 'start') setIsStartSet(false);
					if (cell.type == 'finish') setIsFinishSet(false);
					return { ...cell, type: 'wall' };
				} else {
					return cell;
				}
			});
			return newBoard;
		});
		setChanged((changed) => !changed);
	};

	const setPointAt = (x: number, y: number) => {
		let cellAlreadyExist = board.find((cell) => cell.type == action);
		if (cellAlreadyExist) {
			if (cellAlreadyExist.type == 'start') setIsStartSet(false);
			if (cellAlreadyExist.type == 'finish') setIsFinishSet(false);
		}
		let oldX = cellAlreadyExist?.x;
		let oldY = cellAlreadyExist?.y;
		setBoard((prevBoard) => {
			const newBoard: cellType[] = prevBoard.map((cell) => {
				if (cell.x == x && cell.y == y) {
					if (cell.type == 'finish' && action == 'start') setIsFinishSet(false);
					if (cell.type == 'start' && action == 'finish') setIsStartSet(false);
					if (action == 'start') setIsStartSet(true);
					if (action == 'finish') setIsFinishSet(true);
					return { ...cell, type: action };
				} else if (cellAlreadyExist && cell.x == oldX && cell.y == oldY) {
					return { ...cell, type: 'empty' };
				} else {
					return cell;
				}
			});
			return newBoard;
		});
		setChanged((changed) => !changed);
	};

	const clearCellAt = (x: number, y: number) => {
		setBoard((prevBoard) => {
			const newBoard: cellType[] = prevBoard.map((cell) => {
				if (cell.x == x && cell.y == y) {
					if (cell.type == 'start') setIsStartSet(false);
					if (cell.type == 'finish') setIsFinishSet(false);
					return { ...cell, type: 'empty' };
				} else {
					return cell;
				}
			});
			return newBoard;
		});
		setChanged((changed) => !changed);
	};

	return (
		<div className="flex items-center flex-col justify-between">
			<div className="flex p-4 items-center justify-between self-stretch">
				<div className="flex items-center text-base text-white">
					<div className="mr-4">Set:</div>
					<button
						className={`border-2 border-black mr-4  py-1 px-2 rounded-md cursor-pointer hover:bg-opacity-70 bg-green-600 font-semibold ${
							action == 'start' ? 'bg-opacity-100' : 'opacity-60'
						}`}
						onClick={() => setAction('start')}
					>
						Start
					</button>
					<button
						className={`border-2 border-black mr-4 cursor-pointer py-1 px-2 rounded-md font-semibold hover:bg-opacity-70 bg-blue-600 ${
							action == 'finish' ? 'bg-opacity-100' : 'opacity-60'
						}`}
						onClick={() => setAction('finish')}
					>
						Finish
					</button>
				</div>
				<div className="flex text-lg text-white">
					{isNoPath ? (
						<div className="font-semibold text-red-700">There is no path!</div>
					) : (
						<div>
							Path length: <span className="font-semibold">{pathLength}</span>
						</div>
					)}
				</div>
			</div>
			<div
				className={`grid gap-1 p-2`}
				style={{
					gridTemplateColumns: `repeat(${mazeSize}, calc(70vh/${mazeSize}))`,
					gridTemplateRows: `repeat(${mazeSize}, calc(70vh/${mazeSize}))`,
				}}
				onContextMenu={(e) => e.preventDefault()}
			>
				{board.map((cell, index) => (
					<Cell key={index} cell={cell} setPointAt={setPointAt} setWallAt={setWallAt} clearCellAt={clearCellAt} />
				))}
			</div>
			<div className="flex justify-center p-4 text-base text-white">
				<div className="mr-4">
					<span className="font-semibold">Left click</span> to set start or finish (slect above the board)
				</div>
				<div className="mr-4">
					<span className="font-semibold">Right click</span> to set wall
				</div>
				<div className="mr-4">
					<span className="font-semibold">Middle click</span> to erease
				</div>
			</div>
		</div>
	);
};

export default Game;
