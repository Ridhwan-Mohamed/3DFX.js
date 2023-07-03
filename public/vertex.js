let l_yaw = 0
let l_pitch = 0

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
      return dotProduct > 0? Number(dotProduct.toFixed(2)) : 0
    }
}
  