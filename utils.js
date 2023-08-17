const PI = 3.14159265358979323846

let getMouse = () => createVector(mouseX, mouseY);
let add = p5.Vector.add;
let sub = p5.Vector.sub;
let mult = p5.Vector.mult;
let normalize = p5.Vector.normalize;
let rotateV = p5.Vector.rotate

function drawLine(a, b, color='black', width=0.5){
  stroke(color)
  strokeWeight(width)
  a = toScreenPos(a)
  b = toScreenPos(b)
  line(a.x, a.y, b.x, b.y)
}

function drawCircle(a, r, fillC='orange', strokeC='black', width=0.5){
  stroke(strokeC)
  strokeWeight(width)
  fill(fillC)
  a = toScreenPos(a)
  circle(a.x, a.y, r*2)
}