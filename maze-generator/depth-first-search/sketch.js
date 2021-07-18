// No of cells per row
const cellsCount = 80;

// grid of cells
const grid = [];

// current cell
let current;

// stack of all visited cells for backtracking
const stack = [];

function setup() {
    createCanvas(400, 400);

    // creating grid
    for (let i = 0; i < cellsCount; i++) {
        for (let j = 0; j < cellsCount; j++) {
            grid.push(new Cell(i, j));
        }
    }

    // initializing current with first cell
    current = grid[0];
}

function draw() {
    background(51);
    stroke(255);

    // drawing grid
    for (const cell of grid) {
        cell.draw();
    }

    // 1. make current cell visited and highlight visiting cell
    current.visited = true;
    current.highlight();

    // 2. get next random neighbor
    const next = current.getNbr();

    if (next) {
        // 3. remove wall between two cells
        current.removeWall(next);

        // 4. push current cell for backtracking
        stack.push(current);

        // 5. make next cell as current
        current = next;
    }

    // if stack contains cells
    else if (stack.length) {
        // 6. pop last cell
        current = stack.pop();
    }
}

/* Cell */

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.w = width / cellsCount;
    this.h = height / cellsCount;
    this.x = this.j * this.w;
    this.y = this.i * this.h;
    this.visited = false;

    this.nbrs = [
        {
            i: 0,
            j: -1,
        },
        {
            i: -1,
            j: 0,
        },
        {
            i: 0,
            j: 1,
        },
        {
            i: 1,
            j: 0,
        },
    ];

    this.walls = {
        top: true,
        right: true,
        bottom: true,
        left: true,
    };

    this.getNbrIndex = (nbr) => {
        const i = this.i + nbr.i;
        const j = this.j + nbr.j;

        if (i < 0 || i >= cellsCount || j < 0 || j >= cellsCount) {
            return -1;
        }

        return i * cellsCount + j;
    };

    this.getNbr = () => {
        const availableNbrs = [];

        for (const nbr of this.nbrs) {
            const cell = grid[this.getNbrIndex(nbr)];
            if (cell && !cell.visited) {
                availableNbrs.push(cell);
            }
        }

        return random(availableNbrs);
    };

    this.removeWall = (nbr) => {
        const i = nbr.i - this.i;
        if (i === 1) {
            this.walls.bottom = false;
            nbr.walls.top = false;
        } else if (i === -1) {
            this.walls.top = false;
            nbr.walls.bottom = false;
        }

        const j = nbr.j - this.j;
        if (j === 1) {
            this.walls.right = false;
            nbr.walls.left = false;
        } else if (j === -1) {
            this.walls.left = false;
            nbr.walls.right = false;
        }
    };

    this.highlight = () => {
        fill(0, 255, 200);
        rect(this.x, this.y, this.w, this.h);
    };

    this.draw = () => {
        stroke(255);

        const x = this.x;
        const y = this.y;
        const w = this.w;
        const h = this.h;

        if (this.walls.top) {
            line(x, y, x + w, y);
        }

        if (this.walls.right) {
            line(x + w, y, x + w, y + h);
        }

        if (this.walls.bottom) {
            line(x + w, y + h, x, y + h);
        }

        if (this.walls.left) {
            line(x, y + h, x, y);
        }

        if (this.visited) {
            noStroke();
            fill(255, 0, 200, 100);
            rect(x, y, w, h);
        }
    };
}
