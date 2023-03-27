const {Engine,Render,Runner,World,Bodies,Body,Events} = Matter; // pull out objects from Matter library

const cellsHorizontal = 4;
const cellsVertical = 3;
const width = window.innerWidth ;
const height = window.innerHeight ;

// one of the length of cell
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine =Engine.create(); // when we create engine world object come along with that
engine.world.gravity.y=0;
const  { world } = engine;
const render = Render.create({
    // we are telling to render where we want to show our representation of everything
    element : document.body,
    engine : engine,
    options : {
        wireframes : false , // for solid shapes and giving color randomly
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
    Bodies.rectangle(width/2,0,width,2, { isStatic : true}),
    Bodies.rectangle(width/2,height,width,2 ,{isStatic:true}),
    Bodies.rectangle(0,height/2,2,height, {isStatic:true}),
    Bodies.rectangle(width,height/2,2,height, {isStatic:true})
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
const grid = Array(cellsVertical)
    .fill(null)
    .map(() => {
      return Array(cellsHorizontal).fill(false);
    });


const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal-1).fill(false))

const horizontals = Array(cellsVertical-1)
    .fill(null)
    .map(()=> Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);
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
        nextRow >= cellsVertical ||
        nextColumn < 0 ||
        nextColumn >= cellsHorizontal
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
        columnIndex * unitLengthX + unitLengthX / 2,
        rowIndex * unitLengthY + unitLengthY,
        unitLengthX,
        5,
        { label:'wall',
          isStatic: true,
          render: {
            fillStyle : 'red'
          }
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
        columnIndex * unitLengthX + unitLengthX,
        rowIndex * unitLengthY + unitLengthY / 2,
        5,
        unitLengthY,
        { label:'wall',
          isStatic: true,
          render : {
            fillStyle: 'red'
          }
        }
      );
      World.add(world, wall);
    });
  });

// Goal
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY /2,
    unitLengthX * .7,
    unitLengthY * .7,
    {   label:'goal',
        isStatic : true,
        render : {
            fillStyle :'green'
        }
    }
)
World.add(world,goal)

// Ball
const ball = Bodies.circle(
    unitLengthX/2,
    unitLengthY/2,
    Math.min(unitLengthX,unitLengthY) * .25,
    {
        label : 'ball',
        render :{
            fillStyle :'blue'
        }
    }
);
World.add(world,ball)
console.log(ball)

document.addEventListener('keydown', event => {
    const {x,y} = ball.velocity;

    if (event.keyCode === 87) {
        Body.setVelocity(ball, {x,y:y-5})
    }
  
    if (event.keyCode === 68) {
        Body.setVelocity(ball, {x:x+5,y})
    }
  
    if (event.keyCode === 83) {
        Body.setVelocity(ball, {x,y:y+5})
    }
  
    if (event.keyCode === 65) {
        Body.setVelocity(ball, {x:x-5,y})
    }
  });
  
// win dcondition
Events.on(engine,'collisionStart',event => {
    event.pairs.forEach(collision => {
        const labels = ['ball','goal']
        if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyA.label) ){
            document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y =1
            world.bodies.forEach(body => {
                if(body.label === 'wall'){
                    Body.setStatic(body,false)
                }
            })
        }
    })
})
console.log(grid);