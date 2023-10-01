let vertex_arr = []
let texInd_arr = []
let tri_arr    = []
let uv_arr     = []
let colors     = []
let textures   = []
let texSize    = []  

async function loadModel(files) {
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

async function buildModel(xmlDoc) {
  let objects = xmlDoc.getElementsByTagName("object");
  let texPath = xmlDoc.getElementsByTagName("m:texture2d")
  let texCoord = xmlDoc.getElementsByTagName('m:texture2dgroup')
  let itemNodes = xmlDoc.getElementsByTagName('item');
  let transformMatrix = {};
  for (let item of itemNodes) {
    let id = item.getAttribute('objectid');
    let transform = item.getAttribute('transform').split(' ').map(Number);  
    transformMatrix[id] = transform;
  }

  for (let i = 0; i < texCoord.length; i++) {
    let texCoords = texCoord[i].getElementsByTagName('m:tex2coord');
    for (let j = 0; j < texCoords.length; j++) {
      let u = parseFloat(texCoords[j].getAttribute('u'));
      let v = 1 - parseFloat(texCoords[j].getAttribute('v'));
      texInd_arr.push(u, v);
    }
  }

  console.log(texInd_arr)

  const imageLoadPromises = [];
  // Iterate over every object
  let textureOffset = 0
  for (let j = 0; j < objects.length; j++) {
    let id = objects[j].getAttribute('id');
    // Extract vertices
    let vertices  = objects[j].getElementsByTagName("vertex");
    let tex_value = texCoord[j].getElementsByTagName("m:tex2coord");
    console.log(texPath[j].getAttribute("path"))
    const imageLoadPromise = await loadImageData("./public/models/Untitled" + texPath[j].getAttribute("path"));
    imageLoadPromises.push(imageLoadPromise);

    for (let i = 0; i < vertices.length; i++) {
      let x = parseFloat(vertices[i].getAttribute('x'));
      let y = parseFloat(vertices[i].getAttribute('y'));
      let z = parseFloat(vertices[i].getAttribute('z'));
      //let [u, v] = [parseFloat(tex_value[i].getAttribute("u")), parseFloat(tex_value[i].getAttribute("v"))]
      let textureInd = j
      let transformedVertex = new Vertex(x, y, z, textureInd);
      console.log(transformedVertex)
      transformedVertex.applyTransform(transformMatrix[id]); // assuming Vertex has applyTransform method

      vertex_arr.push(transformedVertex);
    }

    // Save the current length of the vertex array
    let vertexOffset  = vertex_arr.length - vertices.length;

    // Extract triangles
    let triangles = objects[j].getElementsByTagName('triangle');
    for (let i = 0; i < triangles.length; i++) {
      tri_arr.push(
        parseInt(triangles[i].getAttribute('v1')) + vertexOffset,
        parseInt(triangles[i].getAttribute('v2')) + vertexOffset,
        parseInt(triangles[i].getAttribute('v3')) + vertexOffset
      );

      uv_arr.push(
        parseInt(triangles[i].getAttribute('p1')) + textureOffset,
        parseInt(triangles[i].getAttribute('p2')) + textureOffset,
        parseInt(triangles[i].getAttribute('p3')) + textureOffset
      );
    }
    textureOffset = Math.max(...uv_arr)+1
  }

  await Promise.all(imageLoadPromises); // Wait for all image data to be loaded
  console.log(vertex_arr, tri_arr);
  console.log(textures)
  console.log(texPath)
  console.log(texSize)
  update()
}

function loadImageData(imageUrl) {
  return new Promise((resolve, reject) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => createImageBitmap(blob))
      .then(imageBitmap => {
        const offscreenCanvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        texSize.push(imageBitmap.width)
        texSize.push(imageBitmap.height)
        const imageCanvas = offscreenCanvas.getContext('2d');
        imageCanvas.drawImage(imageBitmap, 0, 0);
        // Now you have the pixel data, and you can manipulate it as needed
        // For example, to get the color at pixel (x, y):
        const imageData = imageCanvas.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        textures.push(imageData.data); // Use push() to add the pixel data to textures
        resolve(); // Resolve the promise when image data is loaded and processed
      })
      .catch(error => {
        console.error('Error loading or processing the image:' + imageUrl);
        reject(error); // Reject the promise if there's an error
      });
  });
}
