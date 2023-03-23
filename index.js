const {Engine,Render,Runner,World,Bodies,MouseConstraint,Mouse} = Matter; // pull out objects from Matter library

const width = 800 ;
const height = 600 ;

const engine =Engine.create(); // when we create engine world object come along with that
const  { world } = engine;
const render = Render.create({
    // we are telling to render where we want to show our representation of everything
    element : document.body,
    engine : engine,
    options : {
        wireframes : false, // for solid shapes and giving color randomly
        width : width,
        height : height
    }
})
Render.run(render);
Runner.run(Runner.create(),engine);

World.add(world,MouseConstraint.create(engine,{
    mouse:Mouse.create(render.canvas)
}))

// walls
const walls = [
    Bodies.rectangle(400,0,800,40, { isStatic : true}),
    Bodies.rectangle(400,600,800,40 ,{isStatic:true}),
    Bodies.rectangle(0,300,40,600, {isStatic:true}),
    Bodies.rectangle(800,300,40,600, {isStatic:true})
]
World.add(world,walls);

//random shapes

for(let i =0 ; i<30 ; i++){
    if(Math.random() > 0.5){
        World.add(world,Bodies.rectangle(Math.random() * width,Math.random() * height,50,50))
    }else{
        World.add(world,Bodies.circle(Math.random() * width,Math.random() * height, 35),{
            render :{
                fillStyle : 'red'
            }
        })

    }
}

