const {Engine,Render,Runner,World,Bodies} = Matter; // pull out objects from Matter library

const cells = 3;
const width = 600 ;
const height = 600 ;

// one of the length of cell
const unitLength = width / 3 ;

const engine =Engine.create(); // when we create engine world object come along with that
const  { world } = engine;
const render = Render.create({
    // we are telling to render where we want to show our representation of everything
    element : document.body,
    engine : engine,
    options : {
        wireframes : true , // for solid shapes and giving color randomly
        width : width,
        height : height
    }
})
Render.run(render);
Runner.run(Runner.create(),engine);


// walls
const walls = [
    // first argument: left corner to middle of the page
    // second  argument : how many units down from the top left corner
    // third arg : width  // fourth arg : height
    Bodies.rectangle(width/2,0,width,40, { isStatic : true}),
    Bodies.rectangle(width/2,height,width,40 ,{isStatic:true}),
    Bodies.rectangle(0,height/2,40,height, {isStatic:true}),
    Bodies.rectangle(width,height/2,40,height, {isStatic:true})
]
World.add(world,walls);

// Maze generation

// const grid = [];

// for(let i=0; i<3 ; i++) {
//     grid.push([])
//     for (let j=0; j<3 ; j++){
//         grid[i].push(false);
//     }
// }
// console.log(grid);


// aim of this function is changing the order of the elements, in other words sides of the elements
const shuffle = arr => {
    let counter =arr.length;
    while(counter > 0) {
        const index = Math.floor(Math.random() * counter);
        
        counter-- ;
        
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index]= temp;
    }
    return arr;
}



// Array() = creating array with defined number of element. And with map function for each element we defined an array
// that fill with false statement like the above code 
const grid = Array(cells)
    .fill(null)
    .map(() => {
      return Array(cells).fill(false);
    });


const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells-1).fill(false))

const horizontals = Array(cells-1)
    .fill(null)
    .map(()=> Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);
const stepThroughCell = (row, column) => {
    // If i have visted the cell at [row, column], then return
    if (grid[row][column]) {
      return;
    }
  
    // Mark this cell as being visited
    grid[row][column] = true;
  
    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
      [row - 1, column, 'up'],
      [row, column + 1, 'right'],
      [row + 1, column, 'down'],
      [row, column - 1, 'left']
    ]);
    // For each neighbor....
    for (let neighbor of neighbors) {
      const [nextRow, nextColumn, direction] = neighbor;
  
      // See if that neighbor is out of bounds
      if (
        nextRow < 0 ||
        nextRow >= cells ||
        nextColumn < 0 ||
        nextColumn >= cells
      ) {
        continue;
      }
  
      // If we have visited that neighbor, continue to next neighbor
      if (grid[nextRow][nextColumn]) {
        continue;
      }
  
      // Remove a wall from either horizontals or verticals
      if (direction === 'left') {
        verticals[row][column - 1] = true;
      } else if (direction === 'right') {
        verticals[row][column] = true;
      } else if (direction === 'up') {
        horizontals[row - 1][column] = true;
      } else if (direction === 'down') {
        horizontals[row][column] = true;
      }
  
      stepThroughCell(nextRow, nextColumn);
    }
  };
  

stepThroughCell(startRow,startColumn);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
      if (open) {
        return;
      }
  
      const wall = Bodies.rectangle(
        columnIndex * unitLength + unitLength / 2,
        rowIndex * unitLength + unitLength,
        unitLength,
        2,
        {
          isStatic: true
        }
      );
      World.add(world, wall);
    });
  });

  verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
      if (open) {
        return;
      }
  
      const wall = Bodies.rectangle(
        columnIndex * unitLength + unitLength,
        rowIndex * unitLength + unitLength / 2,
        2,
        unitLength,
        {
          isStatic: true
        }
      );
      World.add(world, wall);
    });
  });

// Goal
const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength /2,
    unitLength * .7,
    unitLength * .7,
    {
        isStatic : true
    }
)
World.add(world,goal)

// Ball
const ball = Bodies.circle(
    unitLength/2,
    unitLength/2,
    unitLength * .25,
);
World.add(world,ball)

console.log(grid);