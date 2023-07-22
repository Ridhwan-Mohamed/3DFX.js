let l_yaw = 0
let l_pitch = -1
let PI = Math.PI

function getCameraDirectionVector(pitch, yaw) {
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);

  const x = -sinYaw * cosPitch;
  const y = -sinPitch;
  const z = -cosYaw * cosPitch;

  const magnitude = Math.sqrt(x * x + y * y + z * z);

  return {
    x: x / magnitude,
    y: y / magnitude,
    z: z / magnitude
  };
}

class Vertex {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    applyTransform(matrix) {
      // apply the transformation using matrix multiplication
      console.log("matrix "+matrix)
      let transformedX = this.x * matrix[0] + this.y * matrix[3] + this.z * matrix[6] + matrix[9];
      let transformedY = this.x * matrix[1] + this.y * matrix[4] + this.z * matrix[7] + matrix[10];
      let transformedZ = this.x * matrix[2] + this.y * matrix[5] + this.z * matrix[8] + matrix[11];
			
			var xrv = [transformedX, 0, 0];
			xrv[1] = transformedY * Math.cos(-PI/2) - transformedZ * Math.sin(-PI/2);  //x rotation
			xrv[2] = transformedY * Math.sin(-PI/2) + transformedZ * Math.cos(-PI/2);
			
			var yrv = [0, xrv[1], 0];
			yrv[0] = xrv[0] * Math.cos(0) + xrv[2] * Math.sin(0);  //y rotation
			yrv[2] = xrv[0] * -Math.sin(0) + xrv[2] * Math.cos(0);
			
			this.x = yrv[0] * Math.cos(0) + yrv[1] * -Math.sin(0); //z rotation
			this.y = yrv[0] * Math.sin(0) + yrv[1] * Math.cos(0);
			this.z = yrv[2];
      
      this.x *= 1000;
      this.y *= 1000;
      this.z *= 1000;
    }

    getX() {
      return this.x;
    }

    getY() {
      return this.y;
    }

    getZ() {
      return this.z;
    }

    static subtract(vertex1, vertex2) {
      const x = vertex1.getX() - vertex2.getX();
      const y = vertex1.getY() - vertex2.getY();
      const z = vertex1.getZ() - vertex2.getZ();
      return new Vertex(x, y, z);
    }

    static crossProduct(vert1, vert2, camV) {
      const x1 = vert1.getX();
      const y1 = vert1.getY();
      const z1 = vert1.getZ();
      const x2 = vert2.getX();
      const y2 = vert2.getY();
      const z2 = vert2.getZ();
      
      const crossProductX = y1 * z2 - z1 * y2;
      const crossProductY = z1 * x2 - x1 * z2;
      const crossProductZ = x1 * y2 - y1 * x2;
      
      let dotProduct = (crossProductX * camV.getX() + crossProductY * camV.getY() + crossProductZ * camV.getZ()) < 0;
      
      return dotProduct;
    }  

    static lighting(vert1,vert2){
      const x1 = vert1.getX();
      const y1 = vert1.getY();
      const z1 = vert1.getZ();
      const x2 = vert2.getX();
      const y2 = vert2.getY();
      const z2 = vert2.getZ();
  
      const crossProductX = y1 * z2 - z1 * y2;
      const crossProductY = z1 * x2 - x1 * z2;
      const crossProductZ = x1 * y2 - y1 * x2;
      let camera = getCameraDirectionVector(l_pitch, l_yaw)
      const magnitude = Math.sqrt(crossProductX * crossProductX + crossProductY * crossProductY + crossProductZ * crossProductZ);
      const normalizedVector = {
        x: crossProductX / magnitude,
        y: crossProductY / magnitude,
        z: crossProductZ / magnitude
      }
      const dotProduct = normalizedVector.x * camera.x + normalizedVector.y * camera.y + normalizedVector.z * camera.z;
      if(dotProduct > 0){
        colors.push(Math.abs(dotProduct.toFixed(2)));
      }
      else{
        colors.push('0')
      }
    }

    static vertLighting(vert1, vert2){
      const x1 = vert1.getX();
      const y1 = vert1.getY();
      const z1 = vert1.getZ();
      const x2 = vert2.getX();
      const y2 = vert2.getY();
      const z2 = vert2.getZ();
  
      const crossProductX = y1 * z2 - z1 * y2;
      const crossProductY = z1 * x2 - x1 * z2;
      const crossProductZ = x1 * y2 - y1 * x2;
      let camera = getCameraDirectionVector(l_pitch, l_yaw)
      const magnitude = Math.sqrt(crossProductX * crossProductX + crossProductY * crossProductY + crossProductZ * crossProductZ);
      const normalizedVector = {
        x: crossProductX / magnitude,
        y: crossProductY / magnitude,
        z: crossProductZ / magnitude
      }
      let dotProduct = normalizedVector.x * camera.x + normalizedVector.y * camera.y + normalizedVector.z * camera.z;
      return dotProduct > 0.2? Number(dotProduct.toFixed(2)) : 0.2
    }
}