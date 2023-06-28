// const canvas = document.getElementById('canvas2');
// canvas.width = window.innerWidth
// canvas.height = window.innerHeight
// const ctx = canvas.getContext('2d');
// let data2 = ctx.getImageData(0,0,canvas.width,canvas.height)
// let data = data2.data

function raster3p(ax, ay, bx, by, cx, cy) {
    //sort by y

    data = data2.data
    if(ay > by) [ax, ay, bx, by] = [bx, by, ax, ay];
    if(ay > cy) [ax, ay, cx, cy] = [cx, cy, ax, ay];
    if(by > cy) [bx, by, cx, cy] = [cx, cy, bx, by];
    

    if( ay == by ) // natural flat top
		{

			// sorting top vertices by x
			if( bx < ax ) [ax, ay, bx, by] = [bx, by, ax, ay]

			DrawFlatTopTriangle(ax, ay, bx, by, cx, cy);
		}
    else if( by == cy ) // natural flat bottom
    {
        // sorting bottom vertices by x
        if( cx < bx ) [cx, cy, bx, by] = [bx, by, cx, cy]

        DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy);
    }
    else{ //nooooooooooooooooooooooooooooooooooooooooo
        const alphaSplit = (by - ay) / (cy - ay)
        
        let int_x = ax + (cx - ax) * alphaSplit
        if(bx < int_x){ //major right
            DrawFlatBottomTriangle(ax, ay, bx, by, int_x, by)
            DrawFlatTopTriangle(bx, by, int_x, by, cx, cy)
        }
        else{ //major left
            DrawFlatBottomTriangle(ax, ay, int_x, by, bx, by)
            DrawFlatTopTriangle(int_x, by, bx, by, cx, cy)
        }
    }
}

function DrawFlatTopTriangle(ax, ay, bx, by, cx, cy){
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
        for(let x = xBegin; x < xEnd; x++){


            data[4*(y*canvas2.width+x)]   = 100
            data[4*(y*canvas2.width+x)+1] = 100
            data[4*(y*canvas2.width+x)+2] = 255
            data[4*(y*canvas2.width+x)+3] = 255
            //ctx2.fillRect(x,y,1,1)
        }
    }
}

function DrawFlatBottomTriangle(ax, ay, bx, by, cx, cy){
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

        for(let x = xBegin; x < xEnd; x++){
            

            data[4*(y*canvas2.width+x)]   = 255
            data[4*(y*canvas2.width+x)+1] = 100
            data[4*(y*canvas2.width+x)+2] = 100
            data[4*(y*canvas2.width+x)+3] = 255
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


