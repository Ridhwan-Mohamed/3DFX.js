let canvas2 = document.getElementById("canvas2")
let ctx2    = canvas2.getContext("2d")
const buffer = new zBuffer(canvas2.height,canvas2.width)
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
            velA-=0.4;
        }
    }
    if (keys[87]) {
        if (velA < speed) {
            velA+=0.4;
        }
    }
    if (keys[65]) {
        if (velY < speed) {
            velY+=0.4;
        }
    }
    if (keys[68]) {
        if (velY > -speed) {
            velY-=0.4;
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
    ctx2.fill();
    ctx2.closePath()
}

function clip1(x1, y1, z1, x2, y2, z2, x3, y3, z3, vc1, vc2, vc3, v1, v2, v3, au, av, bu, bv, cu, cv){
    v1.u = au
    v1.v = av
    v2.u = bu
    v2.v = bv
    v3.u = cu
    v3.v = cv

    const alphaA = (-z1) / (z2 - z1);
    const alphaB = (-z1) / (z3 - z1);

    const fx1 = interpolate(x1, x2, alphaA);
    const fy1 = interpolate(y1, y2, alphaA);
    const c1  = interpolate(vc1, vc2, alphaA)
    let zu    = interpolate(au, bu, alphaA)
    let zv    = interpolate(av, bv, alphaA)

    const fx2 = interpolate(x1, x3, alphaB);
    const fy2 = interpolate(y1, y3, alphaB);
    const c2  = interpolate(vc1, vc3, alphaB)
    let du    = interpolate(au, cu, alphaB)
    let dv    = interpolate(av, cv, alphaB)

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

    clipRaster3p(screenX, screenY, screenX3, screenY3, screenX2, screenY2, c1, vc3, vc2, 1, z3, z2, zu, zv, cu, cv, bu, bv, v1.getPath())
    clipRaster3p(screenX, screenY, screenX1, screenY1, screenX3, screenY3, c1, c2, vc3, 1, 1, z3, zu, zv, du, dv, cu, cv, v1.getPath())
}

function clip2(x1, y1, z1, x2, y2, z2, x3, y3, z3, vc1, vc2, vc3, v1, v2, v3, au, av, bu, bv, cu, cv){
    v1.u = au
    v1.v = av
    v2.u = bu
    v2.v = bv
    v3.u = cu
    v3.v = cv

    const alphaA = (-z1) / (z3 - z1);
    const alphaB = (-z2) / (z3 - z2);

    const fx1 = interpolate(x1, x3, alphaA);
    const fy1 = interpolate(y1, y3, alphaA);
    const c1  = interpolate(vc1, vc3, alphaA)
    let zu    = interpolate(au, cu, alphaA)
    let zv    = interpolate(av, cv, alphaA)

    const fx2 = interpolate(x2, x3, alphaB);
    const fy2 = interpolate(y2, y3, alphaB);
    const c2  = interpolate(vc2, vc3, alphaB)
    let du    = interpolate(bu, cu, alphaB)
    let dv    = interpolate(bv, cv, alphaB)

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

    clipRaster3p(screenX, screenY, screenX1, screenY1, screenX2, screenY2, c1, c2, vc3, 1, 1, z3, zu, zv, du, dv, cu, cv, v1.getPath())
}

function interpolate(src, dst, alpha) {
    return (1-alpha)*src + dst * alpha ;
}

function cull(x1, y1, z1, x2, y2, z2, x3, y3, z3, v1, v2, v3, au, av, bu, bv, cu, cv) {

    // Check if all x points (absolute value) are greater than their corresponding z values (absolute value)
    const xCheck = ((x1 > z1 && x2 > z2 && x3 > z3) || (x1 < -z1 && x2 < -z2 && x3 < -z3));
  
    // Check if all y points (absolute value) are greater than or equal to their corresponding z values (absolute value)
    const yCheck = ((y1 > z1 && y2 > z2 && y3 > z3) || (y1 < -z1 && y2 < -z2 && y3 < -z3));
  
    // Check if all z points are negative
    let zCheck = z1 < 0 && z2 < 0 && z3 < 0

    if (!zCheck) {
        if (z1 < 0) {
            const vert1 = Vertex.subtract(v1, v2)
            const vert2 = Vertex.subtract(v2, v3)
            const vert3 = Vertex.subtract(v3, v1)

            let vc1 = Vertex.vertLighting(vert3,vert1)
            let vc2 = Vertex.vertLighting(vert1, vert2)
            let vc3 = Vertex.vertLighting(vert2, vert3) 
          if (z2 < 0) {
            clip2(x1, y1, z1, x2, y2, z2, x3, y3, z3, vc1, vc2, vc3, v1, v2, v3, au, av, bu, bv, cu, cv)
      
            return true;
          } else if (z3 < 0) {
            clip2(x1, y1, z1, x3, y3, z3, x2, y2, z2, vc1, vc3, vc2, v1, v3, v2, au, av, cu, cv, bu, bv)
           
            return true;
          } else {
            clip1(x1, y1, z1, x2, y2, z2, x3, y3, z3, vc1, vc2, vc3, v1, v2, v3, au, av, bu, bv, cu, cv)
            return true;
          }
        } else if (z2 < 0) {
            const vert1 = Vertex.subtract(v1, v2)
            const vert2 = Vertex.subtract(v2, v3)
            const vert3 = Vertex.subtract(v3, v1)

            let vc1 = Vertex.vertLighting(vert3,vert1)
            let vc2 = Vertex.vertLighting(vert1, vert2)
            let vc3 = Vertex.vertLighting(vert2, vert3) 
          if (z3 < 1) {
            clip2(x3, y3, z3, x2, y2, z2, x1, y1, z1, vc3, vc2, vc1, v3, v2, v1, cu, cv, bu, bv, au, av)
            return true;
          } else {
            clip1(x2, y2, z2, x1, y1, z1, x3, y3, z3, vc2, vc1, vc3, v2, v1, v3, bu, bv, au, av, cu, cv)
            return true;
          }
        } else if (z3 < 0) {
            const vert1 = Vertex.subtract(v1, v2)
            const vert2 = Vertex.subtract(v2, v3)
            const vert3 = Vertex.subtract(v3, v1)

            let vc1 = Vertex.vertLighting(vert3,vert1)
            let vc2 = Vertex.vertLighting(vert1, vert2)
            let vc3 = Vertex.vertLighting(vert2, vert3) 
          clip1(x3, y3, z3, x1, y1, z1, x2, y2, z2, vc3, vc1, vc2, v3, v1, v2, cu, cv, au, av, bu, bv)

          return true;
        }
    }

    // Return true if any of the conditions is true, indicating that the triangle should be culled
    return zCheck || xCheck || yCheck 
}

let drawTriangle = (vertex_arr, triangle_arr) => {
    let angle = -pa;
    let centerX = canvas2.width / 2;
    let centerY = canvas2.height / 2;
    let count = 0
    let drawBool = true
    // console.log("start")

    for (let i = 0; i < tri_arr.length; i += 3) {
        drawBool = true

        let px, pz, transx, transz, transy
        let px1, pz1, transx1, transz1, transy1
        let px2, pz2, transx2, transz2, transy2


        px = vertex_arr[triangle_arr[i]].getX() - y;
        pz = vertex_arr[triangle_arr[i]].getZ() - x;
        transx = px*Math.cos(angle) + (pz + 0.0001)*Math.sin(angle);
        transy = vertex_arr[triangle_arr[i]].getY() - fov;
        transz = px*(-Math.sin(angle)) + (pz + 0.0001)*Math.cos(angle); 

        // Store the original transy value before updating it
        let temp_transy = transy;

        transy = temp_transy * Math.cos(pitch) - transz * Math.sin(pitch);
        transz = temp_transy * Math.sin(pitch) + transz * Math.cos(pitch);

        let vert1 = new Vertex(transx,transy,transz)

        px1 = vertex_arr[triangle_arr[i+1]].getX() - y;
        pz1 = vertex_arr[triangle_arr[i+1]].getZ() - x;
        transx1 = px1 * Math.cos(angle) + (pz1 + 0.0001) * Math.sin(angle);
        transy1 = vertex_arr[triangle_arr[i+1]].getY() - fov;
        transz1 = px1 * (-Math.sin(angle)) + (pz1 + 0.0001) * Math.cos(angle);
        
        // Store the original transy1 value before updating it
        let temp_transy1 = transy1;


        transy1 = temp_transy1 * Math.cos(pitch) - transz1 * Math.sin(pitch);
        transz1 = temp_transy1 * Math.sin(pitch) + transz1 * Math.cos(pitch);

        let vert2 = new Vertex(transx1,transy1,transz1)

        px2 = vertex_arr[triangle_arr[i+2]].getX() - y;
        pz2 = vertex_arr[triangle_arr[i+2]].getZ() - x;
        transx2 = px2 * Math.cos(angle) + (pz2 + 0.0001) * Math.sin(angle);
        transy2 = vertex_arr[triangle_arr[i+2]].getY() - fov;
        transz2 = px2 * (-Math.sin(angle)) + (pz2 + 0.0001) * Math.cos(angle);
        
        // Store the original transy2 value before updating it
        let temp_transy2 = transy2;
        
        transy2 = temp_transy2 * Math.cos(pitch) - transz2 * Math.sin(pitch);
        transz2 = temp_transy2 * Math.sin(pitch) + transz2 * Math.cos(pitch);
        //console.log(transx, transy, transz, transx1, transy1, transz1, transx2, transy2, transz2)
        let vert3 = new Vertex(transx2,transy2,transz2)

        let vec1 = Vertex.subtract(vert1, vert2);
        let vec2 = Vertex.subtract(vert1, vert3);
        backfaceCull = Vertex.crossProduct(vec1, vec2, vert1);
        
        //console.log(triangle_arr[j],triangle_arr[j+1],triangle_arr[j+2])
        if(backfaceCull){

            let bool = cull(transx,transy,transz,transx1,transy1,transz1,transx2,transy2,transz2, vertex_arr[triangle_arr[i]], vertex_arr[triangle_arr[i+1]], vertex_arr[triangle_arr[i+2]], texInd_arr[uv_arr[i]*2], texInd_arr[uv_arr[i]*2+1], texInd_arr[uv_arr[i+1]*2], texInd_arr[uv_arr[i+1]*2+1], texInd_arr[uv_arr[i+2]*2], texInd_arr[uv_arr[i+2]*2+1])
            if(bool == true){
                drawBool = false
            }

            if(drawBool){
                

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
                
                // console.log(uv_arr[i]+", "+texInd_arr[uv_arr[i]*2]+", "+texInd_arr[uv_arr[i]*2+1])
                // console.log(uv_arr[i+1]+", "+texInd_arr[uv_arr[i+1]*2]+", "+texInd_arr[uv_arr[i+1]*2+1])
                // console.log(uv_arr[i+2]+", "+texInd_arr[uv_arr[i+2]*2]+", "+texInd_arr[uv_arr[i+2]*2+1])
                raster3p(screenX, screenY, screenX1, screenY1, screenX2, screenY2, vertex_arr[triangle_arr[i]], vertex_arr[triangle_arr[i+1]], vertex_arr[triangle_arr[i+2]], transz, transz1, transz2, texInd_arr[uv_arr[i]*2], texInd_arr[uv_arr[i]*2+1], texInd_arr[uv_arr[i+1]*2], texInd_arr[uv_arr[i+1]*2+1], texInd_arr[uv_arr[i+2]*2], texInd_arr[uv_arr[i+2]*2+1])
            }
        }
        count++
    }
};

function displayStoredTexture() {
    // Assuming texSize[0] is the width and texSize[1] is the height of the texture
    let width = texSize[0];
    let height = texSize[1];
    
    // Create a new ImageData object
    let imageData = ctx2.createImageData(width, height);

    // Loop through textures[0] and set the values in the new ImageData
    for (let i = 0; i < textures[0].length; i++) {
        imageData.data[i] = textures[0][i];
    }

    // Clear the 2D canvas and put the new ImageData onto it
    ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    ctx2.putImageData(imageData, 0, 0);
}

//game loop
function update(){
    window.requestAnimationFrame(update)
    clearScreen2()
    //lighting code
    // l_yaw += 0.005
    // if(l_yaw > 2*PI){
    //     l_yaw - 2*PI
    // }

    drawTriangle(vertex_arr, tri_arr)
    data2.data = data
    ctx2.putImageData(data2,0,0)
    data.fill(0)
    buffer.buffer.fill(Number.MIN_VALUE)
    drawDot()
    move()
}
