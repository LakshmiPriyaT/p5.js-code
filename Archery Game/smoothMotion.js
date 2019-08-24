
function doPhysics(physicsVector) {
  physicsVector.x += physicsVector.y;
  physicsVector.y += physicsVector.z;
  physicsVector.z = 0;
}

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

function smoothFollow2D(object, targetPos, physicsVector, motionVector) {
    let target = targetPos;

    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = motionVector.x;

    if (d < this.slowingRadius)
      speed = map(d, 0, motionVector.z, 0, motionVector.x);

    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, physicsVector.y);
    steer.limit(motionVector.y);

    object.addForce(steer);
}