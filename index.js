var three = [0, 1, 2];

var players = ["x", "o"];
var grid;

var model = {
	grid: grid,
	current: "",
	winner: false,
	choose_block: choose_block,
	reset: reset
}

var main = document.querySelector("main");

rivets.bind(main, model);
reset();

function choose_block(e) {
	if (model.winner) return;
	var data = this.dataset;
	var x = data.x;
	var y = data.y;
	var block = find(x, y);
	if (block.type === "") {
		block.type = model.current;
		next_turn();
	}
}

function reset() {
	grid = three.map(function (x) {
		return three.map(function (y) {
			return {
				x: x,
				y: y,
				type: "",
			};
		});
	});
	model.grid = grid;
	model.winner = false;
	model.current = players[0];
}

function find(x, y) {
	return grid[x][y];
}

function next_turn() {
	var current = model.current;
	var index = players.indexOf(current);
	if (check_win()) return;
	if (index === (players.length - 1))
		model.current = players[0];
	else if (index >= 0)
		model.current = players[index + 1];
}

function check_win() {
	var win = null;
	[check_rows, check_columns, check_diagonals].some(function (fn) {
		return (win = fn());
	});
	if (win) {
		model.winner = win[0].type;
		win.forEach(function (block) {
			block.win = true;
		});
	}
	return win;
}

function check_rows() {
	return check_sets(grid);
}

function check_columns() {
	var columns = three.map(function (y) {
		return three.map(function (x) {
			return grid[x][y];
		})
	});
	return check_sets(columns);
}

function check_diagonals() {
	var diagonals = [];
	diagonals.push(three.map(function (i) {
		return grid[i][i];
	}));
	diagonals.push(three.map(function (i) {
		return grid[grid.length - i - 1][i];
	}));
	return check_sets(diagonals);
}

function check_sets(sets) {
	var res = false
	sets.some(function (set) {
		if (!check_set(set)) return;
		res = set;
		return true;
	});
	return res;
}

function check_set(block_set) {
	var val = block_set[0].type;
	if (!val) return false;
	return block_set.every(function (e) {
		return e.type === val;
	})
}
