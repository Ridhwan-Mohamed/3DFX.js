let col = [139,69,19]
function raster3p(ax, ay, bx, by, cx, cy, v1, v2, v3, z1, z2, z3, au, av, bu, bv, cu, cv) {
    v1.u = au
    v1.v = av
    v2.u = bu
    v2.v = bv
    v3.u = cu
    v3.v = cv
    let path = v1.getPath()

    const vert1 = Vertex.subtract(v1, v2)
    const vert2 = Vertex.subtract(v2, v3)
    const vert3 = Vertex.subtract(v3, v1)

    let vc1 = Vertex.vertLighting(vert3,vert1)
    let vc2 = Vertex.vertLighting(vert1,vert2)
    let vc3 = Vertex.vertLighting(vert2,vert3)

    //sort by y
    data = data2.data
    if(ay > by) [ax, ay, bx, by, vc1, vc2, z1, z2, v1, v2] = [bx, by, ax, ay, vc2, vc1, z2, z1, v2, v1];
    if(ay > cy) [ax, ay, cx, cy, vc1, vc3, z1, z3, v1, v3] = [cx, cy, ax, ay, vc3, vc1, z3, z1, v3, v1];
    if(by > cy) [bx, by, cx, cy, vc2, vc3, z2, z3, v2, v3] = [cx, cy, bx, by, vc3, vc2, z3, z2, v3, v2];
    
    if( ay == by ) // natural flat top
		{
			// sorting top vertices by x
			if( bx < ax ) [ax, ay, bx, by, vc1, vc2, z1, z2, v1, v2] = [bx, by, ax, ay, vc2, vc1, z2, z1, v2, v1]
			DrawFlatTopTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3, v1.getU(), v1.getV(), v2.getU(), v2.getV(), v3.getU(), v3.getV(), path);
		}
    else if( by == cy ) // natural flat bottom
        {
            // sorting bottom vertices by x
            if( cx < bx ) [cx, cy, bx, by, vc3, vc2, z3, z2, v3, v2] = [bx, by, cx, cy, vc2, vc3, z2, z3, v2, v3]
            DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3, v1.getU(), v1.getV(), v2.getU(), v2.getV(), v3.getU(), v3.getV(), path);
        }
    else{ //regular triangle
        const alphaSplit = (by - ay) / (cy - ay)
        let int_x = ax + (cx - ax) * alphaSplit
        //const colorSplit =  getdistance(int_x,by,ax,ay) / getdistance(cx,cy,ax,ay)
        let int_color = interpolate(vc1, vc3, alphaSplit)
        let [intU, intV] = v1.interpolateTo(v3.getU(), v3.getV(), z1, z3, alphaSplit)
        let int_z     = 1/interpolate(1/z1, 1/z3, alphaSplit)
        if(bx < int_x){ //major right
            DrawFlatBottomTriangle(ax, ay, bx, by, int_x, by, vc1, vc2, int_color, z1, z2, int_z, v1.getU(), v1.getV(), v2.getU(), v2.getV(), intU, intV, path)
            DrawFlatTopTriangle(bx, by, int_x, by, cx, cy, vc2, int_color, vc3, z2, int_z, z3, v2.getU(), v2.getV(), intU, intV, v3.getU(), v3.getV(), path)
        }
        else{ //major left
            DrawFlatBottomTriangle(ax, ay, int_x, by, bx, by, vc1, int_color, vc2, z1, int_z, z2, v1.getU(), v1.getV(), intU, intV, v2.getU(), v2.getV(), path)
            DrawFlatTopTriangle(int_x, by, bx, by, cx, cy, int_color, vc2, vc3, int_z, z2, z3, intU, intV, v2.getU(), v2.getV(), v3.getU(), v3.getV(), path)
        }
    }
}

function clipRaster3p(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3, au, av, bu, bv, cu, cv, path) {

    //sort by y
    data = data2.data
    if(ay > by) [ax, ay, bx, by, vc1, vc2, z1, z2, au, av, bu, bv] = [bx, by, ax, ay, vc2, vc1, z2, z1, bu, bv, au, av];
    if(ay > cy) [ax, ay, cx, cy, vc1, vc3, z1, z3, au, av, cu, cv] = [cx, cy, ax, ay, vc3, vc1, z3, z1, cu, cv, au, av];
    if(by > cy) [bx, by, cx, cy, vc2, vc3, z2, z3, bu, bv, cu, cv] = [cx, cy, bx, by, vc3, vc2, z3, z2, cu, cv, bu, bv];
    
    if( ay == by ) // natural flat top
		{
			// sorting top vertices by x
			if( bx < ax ) [ax, ay, bx, by, vc1, vc2, z1, z2, au, av, bu, bv] = [bx, by, ax, ay, vc2, vc1, z2, z1, bu, bv, au, av]
			DrawFlatTopTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3, au, av, bu, bv, cu, cv, path);
		}
    else if( by == cy ) // natural flat bottom 
        {
            // sorting bottom vertices by x
            if( cx < bx ) [cx, cy, bx, by, vc3, vc2, z3, z2, cu, cv, bu, bv] = [bx, by, cx, cy, vc2, vc3, z2, z3, bu, bv, cu, cv]
            DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3, au, av, bu, bv, cu, cv, path);
        }
    else{ //regular triangle
        const alphaSplit = (by - ay) / (cy - ay)
        let int_x = ax + (cx - ax) * alphaSplit
        //const colorSplit =  getdistance(int_x,by,ax,ay) / getdistance(cx,cy,ax,ay)
        let int_color = interpolate(vc1, vc3, alphaSplit)
        let [intU, intV] = interpolateTo(au, av, cu, cv, z1, z3, alphaSplit)
        let int_z     = 1/interpolate(1/z1, 1/z3, alphaSplit)
        if(bx < int_x){ //major right
            DrawFlatBottomTriangle(ax, ay, bx, by, int_x, by, vc1, vc2, int_color, z1, z2, int_z, au, av, bu, bv, intU, intV, path)
            DrawFlatTopTriangle(bx, by, int_x, by, cx, cy, vc2, int_color, vc3, z2, int_z, z3, bu, bv, intU, intV, cu, cv, path)
        }
        else{ //major left
            DrawFlatBottomTriangle(ax, ay, int_x, by, bx, by, vc1, int_color, vc2, z1, int_z, z2, au, av, intU, intV, bu, bv, path)
            DrawFlatTopTriangle(int_x, by, bx, by, cx, cy, int_color, vc2, vc3, int_z, z2, z3, intU, intV, bu, bv, cu, cv, path)
        }
    }
}

function DrawFlatTopTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3, au, av, bu, bv, cu ,cv, path){
    const m0 = (cx - ax) / (cy - ay)
    const m1 = (cx - bx) / (cy - by)
    const ystart = Math.max(Math.ceil(ay - 0.5), 0)
    const yend   = Math.min(Math.ceil(cy - 0.5), canvas2.height)
    const clampX  = texSize[path*2]
    const clampY = texSize[path*2+1]

    const edgeStepUz0 = (cu/z3 - au/z1) / (cy - ay)
    const edgeStepVz0 = (cv/z3 - av/z1) / (cy - ay)
    const edgeStepZInv0 = (1/z3 - 1/z1) / (cy - ay)

    const edgeStepUz1 = (cu/z3 - bu/z2) / (cy - by)
    const edgeStepVz1 = (cv/z3 - bv/z2) / (cy - by)
    const edgeStepZInv1 = (1/z3 - 1/z2) / (cy - by)

    let lUz = au/z1 + edgeStepUz0 * (ystart + 0.5 - ay)
    let lVz = av/z1 + edgeStepVz0 * (ystart + 0.5 - ay)
    let lZInv = 1/z1 + edgeStepZInv0 * (ystart + 0.5 - ay)

    let rUz = bu/z2 + edgeStepUz1 * (ystart + 0.5 - by)
    let rVz = bv/z2 + edgeStepVz1 * (ystart + 0.5 - by)
    let rZInv = 1/z2 + edgeStepZInv1 * (ystart + 0.5 - by)

    for(let y = ystart; y < yend; y++, lUz += edgeStepUz0, lVz += edgeStepVz0, lZInv += edgeStepZInv0,
        rUz += edgeStepUz1, rVz += edgeStepVz1, rZInv += edgeStepZInv1){
        const px0 = m0 * (y + 0.5 - ay) + ax
        const px1 = m1 * (y + 0.5 - by) + bx
        const xBegin = Math.max(Math.ceil( px0 - 0.5), 0)
        const xEnd   = Math.min(Math.ceil( px1 - 0.5), canvas2.width)
        const scanStepU = (rUz - lUz) / (px1 - px0)
        const scanStepV = (rVz - lVz) / (px1 - px0)
        const scanStepZInv = (rZInv - lZInv) / (px1 - px0)

        let texUz = lUz + scanStepU * (xBegin + 0.5 - px0)
        let texVz = lVz + scanStepV * (xBegin + 0.5 - px0)
        let texZInv = lZInv + scanStepZInv * (xBegin + 0.5 - px0)

        for(let x = xBegin; x < xEnd; x++, texUz += scanStepU, texVz += scanStepV, texZInv += scanStepZInv){
            if(buffer.emptySpot(x, y, texZInv)){
                let texU = texUz / texZInv
                let texV = texVz / texZInv

                let xCol = Math.floor(texU * clampX)
                let yCol = Math.floor(texV * clampY)
                let texCol = 4*(yCol*clampX+xCol)
                data[4*(y*canvas2.width+x)]   = textures[path][texCol]
                data[4*(y*canvas2.width+x)+1] = textures[path][texCol+1]
                data[4*(y*canvas2.width+x)+2] = textures[path][texCol+2]
                data[4*(y*canvas2.width+x)+3] = textures[path][texCol+3]
            }
        }
    }
}

function DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3, au, av, bu, bv, cu ,cv, path){
    const m0 = (bx - ax) / (by - ay)
    const m1 = (cx - ax) / (cy - ay)
    const ystart = Math.max(Math.ceil(ay - 0.5), 0)
    const yend   = Math.min(Math.ceil(cy - 0.5), canvas2.height)
    const clampX  = texSize[path*2]
    const clampY = texSize[path*2+1]

    const edgeStepUz0 = (bu/z2 - au/z1) / (by - ay)
    const edgeStepVz0 = (bv/z2 - av/z1) / (by - ay)
    const edgeStepZInv0 = (1/z2 - 1/z1) / (by - ay)

    const edgeStepUz1 = (cu/z3 - au/z1) / (cy - ay)
    const edgeStepVz1 = (cv/z3 - av/z1) / (cy - ay)
    const edgeStepZInv1 = (1/z3 - 1/z1) / (cy - ay)

    let lUz = au/z1 + edgeStepUz0 * (ystart + 0.5 - ay)
    let lVz = av/z1 + edgeStepVz0 * (ystart + 0.5 - ay)
    let lZInv = 1/z1 + edgeStepZInv0 * (ystart + 0.5 - ay)

    let rUz = au/z1 + edgeStepUz1 * (ystart + 0.5 - ay)
    let rVz = av/z1 + edgeStepVz1 * (ystart + 0.5 - ay)
    let rZInv = 1/z1 + edgeStepZInv1 * (ystart + 0.5 - ay)

    for(let y = ystart; y < yend; y++, lUz += edgeStepUz0, lVz += edgeStepVz0, lZInv += edgeStepZInv0,
        rUz += edgeStepUz1, rVz += edgeStepVz1, rZInv += edgeStepZInv1){
        const px0 = m0 * (y + 0.5 - ay) + ax
        const px1 = m1 * (y + 0.5 - ay) + ax
        const xBegin = Math.max(Math.ceil( px0 - 0.5), 0)
        const xEnd   = Math.min(Math.ceil( px1 - 0.5), canvas2.width)
        const scanStepU = (rUz - lUz) / (px1 - px0)
        const scanStepV = (rVz - lVz) / (px1 - px0)
        const scanStepZInv = (rZInv - lZInv) / (px1 - px0)

        let texUz = lUz + scanStepU * (xBegin + 0.5 - px0)
        let texVz = lVz + scanStepV * (xBegin + 0.5 - px0)
        let texZInv = lZInv + scanStepZInv * (xBegin + 0.5 - px0)

        for(let x = xBegin; x < xEnd; x++, texUz += scanStepU, texVz += scanStepV, texZInv += scanStepZInv){
            if(buffer.emptySpot(x, y, texZInv)){
                let texU = texUz / texZInv
                let texV = texVz / texZInv
                let xCol = Math.floor(texU * clampX)
                let yCol = Math.floor(texV * clampY)
                let texCol = 4*(yCol*clampX+xCol)
                data[4*(y*canvas2.width+x)]   = textures[path][texCol]
                data[4*(y*canvas2.width+x)+1] = textures[path][texCol+1]
                data[4*(y*canvas2.width+x)+2] = textures[path][texCol+2]
                data[4*(y*canvas2.width+x)+3] = textures[path][texCol+3]
            }
        }
    }
}
