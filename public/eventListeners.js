
canvas2.addEventListener("click", async () => {
    if(!document.pointerLockElement) {
      await canvas2.requestPointerLock({
        unadjustedMovement: true,
      });
    }
  });
  
  // pointer lock event listeners
  
  document.addEventListener("pointerlockchange", lockChangeAlert, false);
  
  function lockChangeAlert() {
    if (document.pointerLockElement === canvas2) {
      console.log("The pointer lock status is now locked");
      document.addEventListener("mousemove", updatePosition, false);
    } else {
      console.log("The pointer lock status is now unlocked");
      document.removeEventListener("mousemove", updatePosition, false);
    }
  }

  // function updatePosition(e) {
  //   pa += e.movementX*0.001;
  //   pitch -= e.movementY*0.002
  //   height -= e.movementY; //bound this l8r please
  //   if(pa < 0){
  //       pa += 2*PI
  //   }
  //   else if(pitch > 2*PI){
  //       pitch -= 2*PI
  //   }
  //   if(pitch < 0){
  //     pitch += 2*PI
  //   }
  //   else if(pa > 2*PI){
  //       pa -= 2*PI
  //   }
  // }

  function updatePosition(e) {
    pa += e.movementX*0.001;
    pitch -= e.movementY*0.002;
    height -= e.movementY; //bound this l8r please
    if(pa < 0){
        pa += 2*PI;
    }
    else if(pa > 2*PI){
        pa -= 2*PI;
    }
    // Clamp pitch to the range -85 to +85 degrees
    const maxPitch = 85 * (PI / 180);  // convert to radians
    const minPitch = -85 * (PI / 180); // convert to radians
    if(pitch > maxPitch){
        pitch = maxPitch;
    }
    else if(pitch < minPitch){
        pitch = minPitch;
    }
}

  
// key events
document.body.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
});