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

  // Extract vertices
  let vertices = xmlDoc.getElementsByTagName("vertex");
  for(let i = 0; i < vertices.length; i++) {
    let x = parseFloat(vertices[i].getAttribute('x'));
    let y = parseFloat(vertices[i].getAttribute('y'));
    let z = parseFloat(vertices[i].getAttribute('z'));
    vertex_arr.push(new Vertex(x, y, z)); // Replace Vertex object creation with something applicable in your code
  }

  let triangles = xmlDoc.getElementsByTagName('triangle');
  tri_arr = [].concat(...Array.from(triangles).map(triangle => [
    triangle.getAttribute('v1'),
    triangle.getAttribute('v2'),
    triangle.getAttribute('v3')
  ]));

  update()
  // console.log(vertex_arr);
  // console.log(tri_arr)
}
