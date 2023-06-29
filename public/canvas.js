let canvas2 = document.getElementById("canvas2")
let ctx2    = canvas2.getContext("2d")
let data2 = ctx2.getImageData(0,0,canvas2.width,canvas2.height)
let data = data2.data

function inBounds(x, y){
    if(x > 0 && x < canvas2.width && y > 0 && y < canvas2.height){
        return true
    }
    return false
}

function clearScreen2(){
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
}

function move(e){
    // check the keys and do the movement.
    if (keys[83]) {
        if (velA > -speed) {
            velA-=0.3;
        }
    }
    if (keys[87]) {
        if (velA < speed) {
            velA+=0.3;
        }
    }
    if (keys[65]) {
        if (velY < speed) {
            velY+=0.3;
        }
    }
    if (keys[68]) {
        if (velY > -speed) {
            velY-=0.3;
        }
    }
    if (keys[32]){
        fov--
        console.log(fov)
    }
    if (keys[86]){
        fov++
    }
    if (keys[88]){
        jump++
    }
    if (keys[90]){
        jump--
    }

    velA*=friction
    velY*=friction
    
    pdx = Math.cos(pa) * 5
    pdy = Math.sin(pa) * 5
    perp_pa = pa - PI/2;
    if(perp_pa > 2*PI){
        perp_pa -= 2*PI
    }
    if(perp_pa > 2*PI){
        perp_pa -= 2*PI
    }
    perpdx = Math.cos(perp_pa) * 5
    perpdy = Math.sin(perp_pa) * 5

    x += perpdx*velY
    y += perpdy*velY
    x += pdx*velA
    y += pdy*velA 
    if(pa > 2*PI){
            pa -= 2*PI
    }
    if(pa > 2*PI){
            pa -= 2*PI
    }
    //update()
}

function drawDot(){
    ctx2.fillStyle = "white";
    ctx2.beginPath();
    ctx2.arc(centerX, centerY, 1, 0, 2 * Math.PI);
    //console.log(ctx2.fillStyle)
    ctx2.fill();
    ctx2.closePath()
}

function clip1(x1, y1, z1, x2, y2, z2, x3, y3, z3){
    //ctx2.fillStyle = 'white';

    const threshold = 1e-6;

    const alphaA = (-z1) / (z2 - z1);
    const alphaB = (-z1) / (z3 - z1);

    const fx1 = interpolate(x1, x2, alphaA);
    const fy1 = interpolate(y1, y2, alphaA);

    const fx2 = interpolate(x1, x3, alphaB);
    const fy2 = interpolate(y1, y3, alphaB);

    const fz1 = 1
    const fz2 = 1

    let projX = fx1 / fz1;
    let projY = fy1 / fz1;

    let screenX = centerX + centerX * projX;
    let screenY = centerY - centerY * projY;

    let projX1 = fx2 / fz2;
    let projY1 = fy2 / fz2;

    let screenX1 = centerX + centerX * projX1;
    let screenY1 = centerY - centerY * projY1;

    let projX2 = x2 / z2;
    let projY2 = y2 / z2;

    let screenX2 = centerX + centerX * projX2;
    let screenY2 = centerY - centerY * projY2;

    let projX3 = x3 / z3;
    let projY3 = y3 / z3;

    let screenX3 = centerX + centerX * projX3;
    let screenY3 = centerY - centerY * projY3;

   // ctx2.save()

   raster3p(screenX, screenY, screenX3, screenY3, screenX2, screenY2)


//    ctx2.beginPath()

//     ctx2.moveTo(screenX, screenY);
//     ctx2.lineTo(screenX3, screenY3);
//     ctx2.lineTo(screenX2, screenY2);

//     ctx2.closePath();
    
    
//     ctx2.fill();

    raster3p(screenX, screenY, screenX1, screenY1, screenX3, screenY3)


    // ctx2.beginPath()

    // ctx2.moveTo(screenX1, screenY1);
    // ctx2.lineTo(screenX, screenY);
    // ctx2.lineTo(screenX3, screenY3);

    // ctx2.closePath();
    // ctx2.fill();

}

function clip2(x1, y1, z1, x2, y2, z2, x3, y3, z3,){
    //ctx2.fillStyle = 'white';

    const threshold = 1e-6;
    const alphaA = (-z1) / (z3 - z1);
    const alphaB = (-z2) / (z3 - z2);


    const fx1 = interpolate(x1, x3, alphaA);
    const fy1 = interpolate(y1, y3, alphaA);

    const fx2 = interpolate(x2, x3, alphaB);
    const fy2 = interpolate(y2, y3, alphaB);

    const fz1 = 1
    const fz2 = 1

    let projX = fx1 / fz1;
    let projY = fy1 / fz1;

    let screenX = centerX + centerX * projX;
    let screenY = centerY - centerY * projY;

    let projX1 = fx2 / fz2;
    let projY1 = fy2 / fz2;

    let screenX1 = centerX + centerX * projX1;
    let screenY1 = centerY - centerY * projY1;

    let projX2 = x3 / z3;
    let projY2 = y3 / z3;

    let screenX2 = centerX + centerX * projX2;
    let screenY2 = centerY - centerY * projY2;

    raster3p(screenX, screenY, screenX1, screenY1, screenX2, screenY2)


    // ctx2.beginPath()

    // ctx2.moveTo(screenX, screenY);
    // ctx2.lineTo(screenX1, screenY1);
    // ctx2.lineTo(screenX2, screenY2);

    // ctx2.closePath();

    // ctx2.fill();

}



function interpolate(src, dst, alpha) {
    return src + (dst - src) * alpha ;
}

function cull(x1, y1, z1, x2, y2, z2, x3, y3, z3) {

    // // Check if all x points (absolute value) are greater than their corresponding z values (absolute value)
    // const xCheck = Math.abs(x1) > z1 && Math.abs(x2) > z2 && Math.abs(x3) > z3;
  
    // // Check if all y points (absolute value) are greater than or equal to their corresponding z values (absolute value)
    // const yCheck = Math.abs(y1) >= z1 && Math.abs(y2) >= z2 && Math.abs(y3) >= z3;
  
    // Check if all z points are negative
    let zCheck = z1 < 0 && z2 < 0 && z3 < 0

    if (!zCheck) {
        if (z1 < 0) {
          if (z2 < 0) {
            clip2(x1, y1, z1, x2, y2, z2, x3, y3, z3)
      
            return true;
          } else if (z3 < 0) {
            clip2(x1, y1, z1, x3, y3, z3, x2, y2, z2)
           
            return true;
          } else {
            clip1(x1, y1, z1, x2, y2, z2, x3, y3, z3)
          
            return true;
          }
        } else if (z2 < 0) {
          if (z3 < 1) {
            clip2(x3, y3, z3, x2, y2, z2, x1, y1, z1)
      
            return true;
          } else {
            clip1(x2, y2, z2, x1, y1, z1, x3, y3, z3)
            
            return true;
          }
        } else if (z3 < 0) {
          clip1(x3, y3, z3, x1, y1, z1, x2, y2, z2)

          return true;
        }
    }
      
      
   
    // Return true if any of the conditions is true, indicating that the triangle should be culled
    return zCheck;
}

// function backfaceCull(vertex_arr, tri_arr){
//     let cullFlags = [];
//     let angle = -pa

//     for (let i = 0; i < tri_arr.length; i += 3) {
//     let px = vertex_arr[tri_arr[i]].getX() - y
//     let pz = vertex_arr[tri_arr[i]].getZ() - x
//     let transx = px*Math.cos(angle) + (pz + 0.0001)*Math.sin(angle)
//     let transy = vertex_arr[tri_arr[i]].getY() - fov 
//     let transz = px*(-Math.sin(angle)) + (pz + 0.0001)*Math.cos(angle) 
//     transy = transy * Math.cos(pitch) - transz * Math.sin(pitch)
//     transz = transy * Math.sin(pitch) + transz * Math.cos(pitch)

//     let vert1 = new Vertex(transx,transy,transz)

//     px = vertex_arr[tri_arr[i+1]].getX() - y
//     pz = vertex_arr[tri_arr[i+1]].getZ() - x
//     transx = px*Math.cos(angle) + (pz + 0.0001)*Math.sin(angle)
//     transy = vertex_arr[tri_arr[i+1]].getY() - fov 
//     transz = px*(-Math.sin(angle)) + (pz + 0.0001)*Math.cos(angle) 
//     transy = transy * Math.cos(pitch) - transz * Math.sin(pitch)
//     transz = transy * Math.sin(pitch) + transz * Math.cos(pitch)

//     let vert2 = new Vertex(transx,transy,transz)
   
//     px = vertex_arr[tri_arr[i+2]].getX() - y
//     pz = vertex_arr[tri_arr[i+2]].getZ() - x
//     transx = px*Math.cos(angle) + (pz + 0.0001)*Math.sin(angle)
//     transy = vertex_arr[tri_arr[i+2]].getY() - fov 
//     transz = px*(-Math.sin(angle)) + (pz + 0.0001)*Math.cos(angle) 
//     transy = transy * Math.cos(pitch) - transz * Math.sin(pitch)
//     transz = transy * Math.sin(pitch) + transz * Math.cos(pitch)

//     let vert3 = new Vertex(transx,transy,transz)

//     let vec1 = Vertex.subtract(vert1, vert2);
//     let vec2 = Vertex.subtract(vert1, vert3);
//     let bool = Vertex.crossProduct(vec1, vec2, vert1);
//     cullFlags.push(bool);
//     }

//     return cullFlags
// }

let drawTriangle = (vertex_arr, triangle_arr) => {
    //ctx2.save()
    //ctx2.fillStyle = 'white'
    //ctx2.strokeStyle = 'red'

    let angle = -pa;
    let centerX = canvas2.width / 2;
    let centerY = canvas2.height / 2;
    let cx = y
    let cz = x
    let count = 0
    let draw = 0
    let drawBool = true

    // for(let j = 0; j < triangle_arr.length ; j+=3){
    //     //ctx2.strokeStyle = color


    for (let i = 0; i < tri_arr.length; i += 3) {
        drawBool = true

        let px, pz, transx, transz, transy
        let px1, pz1, transx1, transz1, transy1
        let px2, pz2, transx2, transz2, transy2

        px = vertex_arr[triangle_arr[i]].getX() - y
        pz = vertex_arr[triangle_arr[i]].getZ() - x
        transx = px*Math.cos(angle) + (pz + 0.0001)*Math.sin(angle)
        transy = vertex_arr[triangle_arr[i]].getY() - fov 
        transz = px*(-Math.sin(angle)) + (pz + 0.0001)*Math.cos(angle) 
        transy = transy * Math.cos(pitch) - transz * Math.sin(pitch)
        transz = transy * Math.sin(pitch) + transz * Math.cos(pitch)

        let vert1 = new Vertex(transx,transy,transz)

        px1 = vertex_arr[triangle_arr[i+1]].getX() - y;
        pz1 = vertex_arr[triangle_arr[i+1]].getZ() - x;
        transx1 = px1 * Math.cos(angle) + (pz1 + 0.0001) * Math.sin(angle);
        transy1 = vertex_arr[triangle_arr[i+1]].getY() - fov;
        transz1 = px1 * (-Math.sin(angle)) + (pz1 + 0.0001) * Math.cos(angle);
        transy1 = transy1 * Math.cos(pitch) - transz1 * Math.sin(pitch);
        transz1 = transy1 * Math.sin(pitch) + transz1 * Math.cos(pitch);        

        let vert2 = new Vertex(transx1,transy1,transz1)

        px2 = vertex_arr[triangle_arr[i+2]].getX() - y;
        pz2 = vertex_arr[triangle_arr[i+2]].getZ() - x;
        transx2 = px2 * Math.cos(angle) + (pz2 + 0.0001) * Math.sin(angle);
        transy2 = vertex_arr[triangle_arr[i+2]].getY() - fov;
        transz2 = px2 * (-Math.sin(angle)) + (pz2 + 0.0001) * Math.cos(angle);
        transy2 = transy2 * Math.cos(pitch) - transz2 * Math.sin(pitch);
        transz2 = transy2 * Math.sin(pitch) + transz2 * Math.cos(pitch);

        let vert3 = new Vertex(transx2,transy2,transz2)

        let vec1 = Vertex.subtract(vert1, vert2);
        let vec2 = Vertex.subtract(vert1, vert3);
        backfaceCull = Vertex.crossProduct(vec1, vec2, vert1);
        
        //console.log(triangle_arr[j],triangle_arr[j+1],triangle_arr[j+2])
        if(backfaceCull){
            // ctx2.fillStyle = 'white'//rgba(150,50,10,' + (colors[count]) + ')';
            // ctx2.strokeStyle = ctx2.fillStyle;

            let bool = cull(transx,transy,transz,transx1,transy1,transz1,transx2,transy2,transz2)
            if(bool == true){
                drawBool = false
            }

            if(drawBool){
                const vert1 = Vertex.subtract(vertex_arr[triangle_arr[i]], vertex_arr[triangle_arr[i+1]])
                const vert2 = Vertex.subtract(vertex_arr[triangle_arr[i+1]], vertex_arr[triangle_arr[i+2]])
                const vert3 = Vertex.subtract(vertex_arr[triangle_arr[i+2]], vertex_arr[triangle_arr[i]])

                const vertL1 = Vertex.vertLighting(vert3,vert1)
                const vertL2 = Vertex.vertLighting(vert1, vert2)
                const vertL3 = Vertex.vertLighting(vert2, vert3) 

                let projX = transx / transz;
                let projY = transy / transz;

                let screenX = centerX + centerX * projX;
                let screenY = centerY - centerY * projY;

                let projX1 = transx1 / transz1;
                let projY1 = transy1 / transz1;

                let screenX1 = centerX + centerX * projX1;
                let screenY1 = centerY - centerY * projY1;

                let projX2 = transx2 / transz2;
                let projY2 = transy2 / transz2;

                let screenX2 = centerX + centerX * projX2;
                let screenY2 = centerY - centerY * projY2;

                // ctx2.fillStyle = color
                // ctx2.strokeStyle = color
                raster3p(screenX, screenY, screenX1, screenY1, screenX2, screenY2, vertL1, vertL2, vertL3)

            //     ctx2.beginPath();
    
            //     ctx2.moveTo(screenX, screenY);
            //     ctx2.lineTo(screenX1, screenY1);
            //     ctx2.lineTo(screenX2, screenY2);
            
            //     ctx2.closePath();
    
    
            //     ctx2.fill();
    
            }
        }
        count++
    }
};

function lights(){
    console.log("camera... ACTION")
    for(let i = 0; i < tri_arr.length; i+=3){
        let vec1 = Vertex.subtract(vertex_arr[tri_arr[i]], vertex_arr[tri_arr[i+1]]);
        let vec2 = Vertex.subtract(vertex_arr[tri_arr[i]], vertex_arr[tri_arr[i+2]]);
        Vertex.lighting(vec1, vec2, vertex_arr[tri_arr[i+2]]);
    }
}

//game loop
function update(){
    window.requestAnimationFrame(update)
    clearScreen2()
    // colors.length = 0
    // lights()
    //lighting code
    l_yaw += 0.005
    if(l_yaw > 2*PI){
        l_yaw - 2*PI
    }

    // r+=rj
    // g+=gj
    // b+=bj
    // if(r > 255){
    //     rj *= -1
    // }
    // else if(r < 100){
    //     rj = 0.5
    // }
    // if(g > 255){
    //     gj *= -1
    // }
    // else if(g < 50){
    //     gj = 0.25
    // }
    // if(b > 255){
    //     bj *= -1
    // }
    // else if(b < 0){
    //     bj = 0.1
    // }

    //lights();
    drawTriangle(vertex_arr, tri_arr)
    data2.data = data
    ctx2.putImageData(data2,0,0)
    data.fill(0)
    //drawDot()
    move()
}



//update()
//document.addEventListener('keydown' , (e) => {move()})