// const canvas = document.getElementById('canvas2');
// canvas.width = window.innerWidth
// canvas.height = window.innerHeight
// const ctx = canvas.getContext('2d');
// let data2 = ctx.getImageData(0,0,canvas.width,canvas.height)
// let data = data2.data

function raster3p(ax, ay, bx, by, cx, cy, vc1, vc2, vc3) {
    //sort by y
    data = data2.data
    if(ay > by) [ax, ay, bx, by, vc1, vc2] = [bx, by, ax, ay, vc2, vc1];
    if(ay > cy) [ax, ay, cx, cy, vc1, vc3] = [cx, cy, ax, ay, vc3, vc1];
    if(by > cy) [bx, by, cx, cy, vc2, vc3] = [cx, cy, bx, by, vc3, vc2];
    

    if( ay == by ) // natural flat top
		{

			// sorting top vertices by x
			if( bx < ax ) [ax, ay, bx, by, vc1, vc2] = [bx, by, ax, ay, vc2, vc1]

			DrawFlatTopTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3);
		}
    else if( by == cy ) // natural flat bottom
    {
        // sorting bottom vertices by x
        if( cx < bx ) [cx, cy, bx, by, vc3, vc2] = [bx, by, cx, cy, vc2, vc3]

        DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3);
    }
    else{ //nooooooooooooooooooooooooooooooooooooooooo
        const alphaSplit = (by - ay) / (cy - ay)
        let int_x = ax + (cx - ax) * alphaSplit
        const colorSplit =  getdistance(int_x,by,ax,ay) / getdistance(cx,cy,ax,ay) 
        let int_color = interpolate(vc1, vc3, colorSplit)
        if(bx < int_x){ //major right
            DrawFlatBottomTriangle(ax, ay, bx, by, int_x, by, vc1, vc2, int_color)
            DrawFlatTopTriangle(bx, by, int_x, by, cx, cy, vc2, int_color, vc3)
        }
        else{ //major left
            DrawFlatBottomTriangle(ax, ay, int_x, by, bx, by, vc1, int_color, vc2)
            DrawFlatTopTriangle(int_x, by, bx, by, cx, cy, int_color, vc2, vc3)
        }
    }
}

function DrawFlatTopTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3){
    //slopes for constaints
    const m0 = (cx - ax) / (cy - ay)
    const m1 = (cx - bx) / (cy - by)

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
        let ac = getdistance(xBegin,y,ax,ay) / getdistance(cx,cy,ax,ay)
        let bc = getdistance(xEnd,y,bx,by) / getdistance(cx,cy,bx,by)
        let acCol = interpolate(vc1, vc3, ac)
        let bcCol = interpolate(vc2, vc3, bc)
        for(let x = xBegin; x < xEnd; x++){
            let ab = (x-xBegin) / (xEnd - xBegin)
            let shade = interpolate(acCol, bcCol, ab)

            data[4*(y*canvas2.width+x)]   = 139
            data[4*(y*canvas2.width+x)+1] = 69
            data[4*(y*canvas2.width+x)+2] = 19
            data[4*(y*canvas2.width+x)+3] = shade*255
            //ctx2.fillRect(x,y,1,1)
        }
    }
}

function DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy, vc1, vc2, vc3){
    //slopes for constaints
    const m0 = (bx - ax) / (by - ay)
    const m1 = (cx - ax) / (cy - ay)

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
        let ab = getdistance(xBegin,y,ax,ay) / getdistance(bx,by,ax,ay)
        let ac = getdistance(xEnd,y,ax,ay) / getdistance(cx,cy,ax,ay)
        let acCol = interpolate(vc1, vc3, ac)
        let abCol = interpolate(vc1, vc2, ab)
        for(let x = xBegin; x < xEnd; x++){
            let bc = (x-xBegin) / (xEnd - xBegin)
            let shade = interpolate(abCol, acCol, bc)
            //console.log(shade)

            data[4*(y*canvas2.width+x)]   = 139
            data[4*(y*canvas2.width+x)+1] = 69
            data[4*(y*canvas2.width+x)+2] = 19
            data[4*(y*canvas2.width+x)+3] = shade*255
            //ctx2.fillRect(x,y,1,1)
        }
    }
}
// let i = 0
// function draw(){
//     window.requestAnimationFrame(draw)
//     ctx.clearRect(0,0,canvas.width,canvas.height)
//     i++
//     raster3p(100,100+i,500,50+i,300,300+i)
//     raster3p(0,0,100,100,500,50)
//     ctx.putImageData(data2, 0,0)
// }

// draw()


