let col = [139,69,19]
function raster3p(ax, ay, bx, by, cx, cy, v1, v2, v3, z1, z2, z3) {

    const vert1 = Vertex.subtract(v1, v2)
    const vert2 = Vertex.subtract(v2, v3)
    const vert3 = Vertex.subtract(v3, v1)

    let vc1 = Vertex.vertLighting(vert3,vert1)
    let vc2 = Vertex.vertLighting(vert1,vert2)
    let vc3 = Vertex.vertLighting(vert2,vert3) 

    //sort by y
    data = data2.data
    if(ay > by) [ax, ay, bx, by, vc1, vc2, z1, z2] = [bx, by, ax, ay, vc2, vc1, z2, z1];
    if(ay > cy) [ax, ay, cx, cy, vc1, vc3, z1, z3] = [cx, cy, ax, ay, vc3, vc1, z3, z1];
    if(by > cy) [bx, by, cx, cy, vc2, vc3, z2, z3] = [cx, cy, bx, by, vc3, vc2, z3, z2];
    
    if( ay == by ) // natural flat top
		{
			// sorting top vertices by x
			if( bx < ax ) [ax, ay, bx, by, vc1, vc2, z1, z2] = [bx, by, ax, ay, vc2, vc1, z2, z1]

			DrawFlatTopTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3);
		}
    else if( by == cy ) // natural flat bottom
    {
        // sorting bottom vertices by x
        if( cx < bx ) [cx, cy, bx, by, vc3, vc2, z3, z2] = [bx, by, cx, cy, vc2, vc3, z2, z3]
        DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3);
    }
    else{ //regular triangle
        const alphaSplit = (by - ay) / (cy - ay)
        let int_x = ax + (cx - ax) * alphaSplit
        //const colorSplit =  getdistance(int_x,by,ax,ay) / getdistance(cx,cy,ax,ay)
        let int_color = interpolate(vc1, vc3, alphaSplit)
        let int_z     = 1/interpolate(1/z1, 1/z3, alphaSplit)
        if(bx < int_x){ //major right
            DrawFlatBottomTriangle(ax, ay, bx, by, int_x, by, vc1, vc2, int_color, z1, z2, int_z)
            DrawFlatTopTriangle(bx, by, int_x, by, cx, cy, vc2, int_color, vc3, z2, int_z, z3)
        }
        else{ //major left
            DrawFlatBottomTriangle(ax, ay, int_x, by, bx, by, vc1, int_color, vc2, z1, int_z, z2)
            DrawFlatTopTriangle(int_x, by, bx, by, cx, cy, int_color, vc2, vc3, int_z, z2, z3)
        }
    }
}

function clipRaster3p(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3) {

    //sort by y
    data = data2.data
    if(ay > by) [ax, ay, bx, by, vc1, vc2, z1, z2] = [bx, by, ax, ay, vc2, vc1, z2, z1];
    if(ay > cy) [ax, ay, cx, cy, vc1, vc3, z1, z3] = [cx, cy, ax, ay, vc3, vc1, z3, z1];
    if(by > cy) [bx, by, cx, cy, vc2, vc3, z2, z3] = [cx, cy, bx, by, vc3, vc2, z3, z2];
    
    if( ay == by ) // natural flat top
		{
			// sorting top vertices by x
			if( bx < ax ) [ax, ay, bx, by, vc1, vc2, z1, z2] = [bx, by, ax, ay, vc2, vc1, z2, z1]

			DrawFlatTopTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3);
		}
    else if( by == cy ) // natural flat bottom
    {
        // sorting bottom vertices by x
        if( cx < bx ) [cx, cy, bx, by, vc3, vc2, z3, z2] = [bx, by, cx, cy, vc2, vc3, z2, z3]
        DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3);
    }
    else{ //regular triangle
        const alphaSplit = (by - ay) / (cy - ay)
        let int_x = ax + (cx - ax) * alphaSplit
        //const colorSplit =  getdistance(int_x,by,ax,ay) / getdistance(cx,cy,ax,ay)
        let int_color = interpolate(vc1, vc3, alphaSplit)
        let int_z     = 1/interpolate(1/z1, 1/z3, alphaSplit)
        if(bx < int_x){ //major right
            DrawFlatBottomTriangle(ax, ay, bx, by, int_x, by, vc1, vc2, int_color, z1, z2, int_z)
            DrawFlatTopTriangle(bx, by, int_x, by, cx, cy, vc2, int_color, vc3, z2, int_z, z3)
        }
        else{ //major left
            DrawFlatBottomTriangle(ax, ay, int_x, by, bx, by, vc1, int_color, vc2, z1, int_z, z2)
            DrawFlatTopTriangle(int_x, by, bx, by, cx, cy, int_color, vc2, vc3, int_z, z2, z3)
        }
    }
}

function DrawFlatTopTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3){
    //slopes for constaints
    const m0 = (cx - ax) / (cy - ay)
    const m1 = (cx - bx) / (cy - by)
    //console.log("start")
    //start and end scanline
    const ystart = Math.max(Math.ceil(ay - 0.5), 0)
    const yend   = Math.min(Math.ceil(cy - 0.5), canvas2.height)
    for(let y = ystart; y < yend; y++){
        //start and end of horizontal scanline
        const px0 = m0 * (y + 0.5 - ay) + ax
        const px1 = m1 * (y + 0.5 - by) + bx

        //start and end pixels of scanline
        const xBegin = Math.max(Math.ceil( px0 - 0.5), 0)
        const xEnd   = Math.min(Math.ceil( px1 - 0.5), canvas2.width)

        // let ac = getdistance(xBegin,y,ax,ay) / getdistance(cx,cy,ax,ay)
        // let bc = getdistance(xEnd,y,bx,by) / getdistance(cx,cy,bx,by)
        // let ac = (y - ystart) / (yend - ystart)
        //let bc = (y - ystart) / (yend - ystart)
        // if(ac>1 || ac < 0){console.log(ac)}
      //  console.log(ac,bc)
        // let acCol = interpolate(vc1, vc3, ac)
        // let acCol = 1/vc1 * (1-ac) + 1/vc3 * ac
        // let acDepth = interpolate(1/z1, 1/z3, ac)
        // let acDepth = 1/z1 * (1-ac) + 1/z3 * ac
        // let bcCol = interpolate(vc2, vc3, bc)
        // let bcCol = 1/vc2 * (1-bc) + 1/vc3 * bc
        // let bcDepth = interpolate(1/z2, 1/z3, ac)
        // let bcDepth = 1/z2 * (1-bc) + 1/z3 * bc
        for(let x = xBegin; x < xEnd; x++){
            // let ab = (x-xBegin) / (xEnd - xBegin)
            // let shade = interpolate(acCol, bcCol, ab)
            // let shade = 1/acCol * (1-ab) + 1/bcCol * ab
            // let depth = interpolate(acDepth, bcDepth, ab)
            // let depth = 1/acDepth * (1-ab) + 1/bcDepth * ab
            let depth = zBuffer.calculateDepth(ax,ay,bx,by,cx,cy,x,y,z1,z2,z3)
            let shade = zBuffer.calculateColor(ax,ay,bx,by,cx,cy,x,y,vc1,vc2,vc3)
            //console.log(depth)

            if(buffer.emptySpot(x,y,depth)){
                data[4*(y*canvas2.width+x)]   = col[0]*shade
                data[4*(y*canvas2.width+x)+1] = col[1]*shade
                data[4*(y*canvas2.width+x)+2] = col[2]*shade
                data[4*(y*canvas2.width+x)+3] = 255
            }
        }
    }
}

function DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3, z1, z2, z3){
    //slopes for constaints
    const m0 = (bx - ax) / (by - ay)
    const m1 = (cx - ax) / (cy - ay)
    //console.log("start")

    //start and end scanline
    const ystart = Math.max(Math.ceil(ay - 0.5), 0)
    const yend   = Math.min(Math.ceil(cy - 0.5), canvas2.height)

    for(let y = ystart; y < yend; y++){
        //start and end of horizontal scanline
        const px0 = m0 * (y + 0.5 - ay) + ax;
        const px1 = m1 * (y + 0.5 - ay) + ax;


        //start and end pixels of scanline
        const xBegin = Math.max(Math.ceil( px0 - 0.5), 0)
        const xEnd   = Math.min(Math.ceil( px1 - 0.5), canvas2.width)
        // let ab = getdistance(xBegin,y,ax,ay) / getdistance(bx,by,ax,ay)
        // let ac = getdistance(xEnd,y,ax,ay) / getdistance(cx,cy,ax,ay)
        // if(ab>1){console.log(ab)}
        // if(ac>1){console.log(ac)}
        // let ab = (y - ystart) / (yend - ystart)
        //let ac = (y - ystart) / (yend - ystart)

        // console.log(ac)
        // let acCol = interpolate(vc1, vc3, ac)
        // let acCol = 1/vc1 * (1-ac) + 1/vc3 * ac
        // let acDepth = interpolate(1/z1, 1/z3, ab)
        // let acDepth = 1/z1 * (1-ac) + 1/z3 * ac
        // let abCol = interpolate(vc1, vc2, ab)
        // let abCol = 1/vc1 * (1-ab) + 1/vc2 * ab
        // let abDepth = interpolate(1/z1, 1/z2, ab)
        // let abDepth = 1/z1 * (1-ab) + 1/z2 * ab
        for(let x = xBegin; x < xEnd; x++){
            // let bc = (x-xBegin) / (xEnd - xBegin)
            // let shade = interpolate(abCol, acCol, bc)
            // let shade = 1/abCol * (1-bc) + 1/acCol * bc
            // let depth = interpolate(abDepth, acDepth, bc)
            // let depth = 1/abDepth * (1-bc) + 1/acDepth * bc
            let shade = zBuffer.calculateColor(ax,ay,bx,by,cx,cy,x,y,vc1,vc2,vc3)
            let depth = zBuffer.calculateDepth(ax,ay,bx,by,cx,cy,x,y,z1,z2,z3)
            //console.log(depth)
            //if(depth == undefined){console.log("error")}
            //console.log(shade)
            if(buffer.emptySpot(x,y,depth)){
                data[4*(y*canvas2.width+x)]   = col[0]*shade
                data[4*(y*canvas2.width+x)+1] = col[1]*shade
                data[4*(y*canvas2.width+x)+2] = col[2]*shade
                data[4*(y*canvas2.width+x)+3] = 255
            }
        }
    }
}