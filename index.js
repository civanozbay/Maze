const {Engine,Render,Runner,World,Bodies} = Matter; // pull out objects from Matter library

const width = 600 ;
const height = 600 ;

const engine =Engine.create(); // when we create engine world object come along with that
const  { world } = engine;
const render = Render.create({
    // we are telling to render where we want to show our representation of everything
    element : document.body,
    engine : engine,
    options : {
        wireframes : true, // for solid shapes and giving color randomly
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



