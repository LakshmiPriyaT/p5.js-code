
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