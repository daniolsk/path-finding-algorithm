'use client';

import { type cellType } from '../lib/types';

const Cell = ({
	cell,
	setWallAt,
	setPointAt,
	clearCellAt,
}: {
	cell: cellType;
	setWallAt: (x: number, y: number) => void;
	setPointAt: (x: number, y: number) => void;
	clearCellAt: (x: number, y: number) => void;
}) => {
	return (
		<div
			onAuxClick={() => clearCellAt(cell.x, cell.y)}
			onClick={() => setPointAt(cell.x, cell.y)}
			onContextMenu={(e) => {
				e.preventDefault();
				setWallAt(cell.x, cell.y);
			}}
			onMouseDown={(e) => {
				if (e.buttons == 4) {
					setWallAt(cell.x, cell.y);
				} else if (e.buttons == 2) {
					clearCellAt(cell.x, cell.y);
				}
			}}
			onMouseEnter={(e) => {
				if (e.buttons == 4) {
					setWallAt(cell.x, cell.y);
				} else if (e.buttons == 2) {
					clearCellAt(cell.x, cell.y);
				}
			}}
			className={`p-2 flex justify-center items-center border-2 hover:bg-opacity-50 border-black hover:cursor-pointer
				${cell.type == 'wall' ? 'bg-slate-700' : ''}
				${cell.type == 'start' ? 'bg-green-500' : ''}
				${cell.type == 'finish' ? 'bg-blue-500' : ''}
				${cell.type == 'path' ? 'bg-purple-600' : ''}
				${cell.type == 'empty' ? 'bg-neutral-400' : ''}`}
		>
			{cell.number ? cell.number : ''}
		</div>
	);
};

export default Cell;
