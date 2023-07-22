let vertex_arr = []
let tri_arr = []
let colors = [];

function loadModel(files) {
  vertex_arr.length = 0;
  tri_arr.length = 0;
  colors.length = 0;
  var reader = new FileReader();

  reader.onload = function(e) {
    var fileContents = e.target.result;
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(fileContents, "application/xml");
    buildModel(xmlDoc);
  }
  reader.readAsText(files[0]);
}


function buildModel(xmlDoc) {
  let objects = xmlDoc.getElementsByTagName("object");
  let itemNodes = xmlDoc.getElementsByTagName('item');
  let transformMatrix = {};
  for (let item of itemNodes) {
    let id = item.getAttribute('objectid');
    let transform = item.getAttribute('transform').split(' ').map(Number);  
    transformMatrix[id] = transform;
  }
  // Iterate over every object
  for(let j = 0; j < objects.length; j++) {
    let id = objects[j].getAttribute('id');

    // Extract vertices
    let vertices = objects[j].getElementsByTagName("vertex");
    for(let i = 0; i < vertices.length; i++) {
      let x = parseFloat(vertices[i].getAttribute('x'));
      let y = parseFloat(vertices[i].getAttribute('y'));
      let z = parseFloat(vertices[i].getAttribute('z'));
      
      let transformedVertex = new Vertex(x, y, z);
      console.log(transformedVertex)
      transformedVertex.applyTransform(transformMatrix[id]); // assuming Vertex has applyTransform method
      
      vertex_arr.push(transformedVertex);
    }

    // Save the current length of the vertex array
    let vertexOffset = vertex_arr.length - vertices.length;

    // Extract triangles
    let triangles = objects[j].getElementsByTagName('triangle');
    for (let i = 0; i < triangles.length; i++) {
      tri_arr.push(
        parseInt(triangles[i].getAttribute('v1')) + vertexOffset,
        parseInt(triangles[i].getAttribute('v2')) + vertexOffset,
        parseInt(triangles[i].getAttribute('v3')) + vertexOffset
      );
    }
  }
  console.log(vertex_arr, tri_arr);
  update()
}
