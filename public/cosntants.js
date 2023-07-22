let pa = 0
let pitch = 0
let x = -200
let y = 0
canvas2.width = 300
canvas2.height = 300
let centerX = canvas2.width / 2;
let centerY = canvas2.height / 2;
let height = canvas2.height / 2
let pdx = Math.cos(pa)*5, pdy = Math.sin(pa)*5;
let RAYDISTANCE = 1000
let fov = 10
let jump = 10
let r = 100
let rj = 0.5
let g = 50
let gj = 0.25
let b = 0
let bj = 0.1
velA = 0,
velY = 0,
speed = 2, // max speed
friction = 0.4 // friction
keys = [];
console.log(canvas2.width, canvas2.height)
function getdistance(x,y,rx,ry){

    var a = x - rx;
    var b = y - ry;

    var c = Math.sqrt( a*a + b*b );
    return Math.abs(c)
}