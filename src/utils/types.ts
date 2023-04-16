export type cellType = {
	x: number;
	y: number;
	type: 'wall' | 'empty' | 'path' | 'start' | 'finish';
	number?: number;
};
