const D = 5;
// const MAX_DIST = 50;
const NEAREST_N = 5;
// const FOV = 2*PI*5/6
const FOV = PI * 6/ 5;
const AVOID_DIST = 20;

class Bird {
  constructor(pos, v) {
    this.pos = pos;
    this.v = v;
    this.trail = [];
  }
}

class NearestBird {
  constructor(bird, dist) {
    this.bird = bird;
    this.dist = dist;
  }
}

class NearestBirds {
  constructor() {
    this.nearest = [];
    this.maxDist = Number.POSITIVE_INFINITY;
  }

  tryAdd(b, dist) {
    if (this.nearest.length <= NEAREST_N) {
      this.nearest.push(new NearestBird(b, dist));
    } else {
      let biggestDist = 0;
      let biggestDistIndex = 0;
      for (let i = 0; i < this.nearest.length; i++) {
        let nearestBird = this.nearest[i];
        if (nearestBird.dist > biggestDist) {
          biggestDistIndex = i;
          biggestDist = nearestBird.dist;
        }
      }
      if (dist < biggestDist) {
        this.nearest[biggestDistIndex] = new NearestBird(b, dist);
      }
    }
  }
}

function attraction(b, other, r){
    // attractionAngle += constrain(readB.v.angleBetween(r), -HALF_PI, HALF_PI)
  return b.v.angleBetween(r);
}

function repultion(b, other, r){
  //avoid those who are too close
    let dist = r.mag()
    let repultionAngle = 0
    if (dist < 1) {
      debug.push(() => {
        drawCircle(b.pos, 20, "rgba(0,0,0,0)", "red");
      })
      if (t > 40) {
        // pause = true;
      }
    }
    if (dist < AVOID_DIST) {
      let angle = b.v.angleBetween(sub(other.pos, b.pos));
      let correction = 1 / dist;
      if (angle > 0) {
        repultionAngle -= correction;
      } else {
        repultionAngle += correction;
      }
      debug.push(() => {
        // drawLine(readB.pos, other.pos, "rgb(0,6,255)");
      //   let attrativeForce = b.v.copy().normalize().rotate(attractionAngle * 0.01 )
      //   drawLine(readB.pos, add(b.pos, mult(attrativeForce, 20)), 'rgb(0,255,59)')
      //   let repulsiveForce = b.v.copy().normalize().rotate(repultionAngle * 0.1)
      //   drawLine(readB.pos, add(b.pos, mult(repulsiveForce, 20)), 'red')
      })
    }
  return repultionAngle
}

//todo: speed of other birds should be probably taken into consideration
//todo: fov of a bird should be probably taken into consideration
//todo: dist between birds should be probably taken into consideration
function updateVelocity(readB, writeB, others) {
  let nearestBirds = new NearestBirds();
  for (let i = 0; i < others.length; i++) {
    let other = others[i];
    if (readB != other) {
      let r = sub(other.pos, readB.pos);
      let dist = r.mag();
      if (abs(readB.v.angleBetween(r)) <= FOV / 2) {
        nearestBirds.tryAdd(other, dist);
      }
    }
  }
  let attractionAngle = 0;
  let repultionAngle = 0;
  let nearest = nearestBirds.nearest;

  //repel from the void
  if (nearest.length == 0) {
    attractionAngle += 1;
    // drawLine(readB.pos, add(readB.pos, mult(rotateV(readB.v, attractionAngle), 50)), 'red', 1);
  }

  for (let i = 0; i < nearest.length; i++) {
    let other = nearest[i].bird;
    let r = sub(other.pos, readB.pos);
    debug.push(()=>{
      // drawLine(readB.pos, other.pos, 'rgb(0,255,184)')
    })

    attractionAngle+=attraction(readB, other, r)
    repultionAngle+=repultion(readB, other, r)
  }
  // debug.push(()=>{
  //   drawLine(readB.pos, add(readB.pos, readB.v.copy().normalize().mult(20)), 'rgb(255,243,52)')
  // })
  writeB.v = rotateV(readB.v, attractionAngle * 0.01 + repultionAngle*2);
}

function updateBird(readB, writeB, others) {
  writeB.pos = add(readB.pos, readB.v);
  updateVelocity(readB, writeB, others);
}

function drawBird(b) {
  noStroke();
  fill("black");
  let pos = toScreenPos(b.pos);
  
  // circle(pos.x, pos.y, D);

  push();
  // let r = D/2 
  let r = D/2 * map(b.pos.z, -300, 300, 0, 2)
  noStroke()
  translate(pos.x, pos.y);
  rotate(b.v.heading());
  beginShape();
  vertex(r, 0);
  vertex(-r, -r);
  vertex(-r, r);
  endShape(CLOSE);
  pop();

  // fill('rgba(255,165,0,0.03)')
  // stroke('rgba(255,165,0,0.48)')
  // push()
  // translate(pos.x, pos.y)
  // rotate(b.v.heading())
  // arc(0,0,100,100,-FOV/2, FOV/2, PIE)
  // pop()
}
