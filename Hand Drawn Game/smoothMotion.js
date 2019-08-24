
function doPhysics(physicsVector) {
  physicsVector.x += physicsVector.y;
  physicsVector.y += physicsVector.z;
  physicsVector.z = 0;
}

function doPhysics2D(object) {
  object.pos.add(object.vel);
  object.vel.add(object.acc);
  object.acc.mult(0);
}

//physicsVector = createVector(pos, vel, acc);
//motionVector = createVector(maxSpeed, maxForce, slowingRadius);
function smoothFollow(targetNum, physicsVector, motionVector) {
  let desired = targetNum - physicsVector.x;
  let speed = motionVector.x;

  if (desired < motionVector.z)
    speed = map(desired, 0, motionVector.z, 0, motionVector.x);

  desired = speed;

  let steer = desired - physicsVector.y;

  if (steer > motionVector.y)
    steer = motionVector.y;

  physicsVector.z += steer;
}

//***Object Requirements***
//this.maxSpeed;
//this.slowingRadius;
//this.maxForce;
//this.pos = createVector();
//this.vel = createVector();
//this.acc = createVector();
function seek(object, targetPos) {
    let bite = targetPos;
    if (bite == null || bite == undefined)
      return;

    let desired = p5.Vector.sub(bite, object.pos);
    let d = desired.mag();
    let speed = object.maxSpeed;


    if (d < object.slowingRadius)
      speed = map(d, 0, object.slowingRadius, 0, object.maxSpeed);

    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, object.vel);
    steer.limit(object.maxForce);
    object.addForce(steer);
}
