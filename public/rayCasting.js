
function castRays(){
    //Horizontal cast

    let angle = pa - (0.02*25)
    let start = 0.5;
    ctx2.lineWidth = 3;   
    for(let i = 0; i < 400; i++){

        if(angle > 2*PI){
            angle -= 2*PI
        }
        else if (angle < 0){
            angle += 2*PI
        }

        let ca = pa - angle;
        if(ca < 0){ca += 2*PI}
        else if(ca > 2*PI){ca -= 2*PI}
          
    
        let hcast = horizontalCast(angle)
        let vcast = verticalCast(angle)
        

        if(vcast != -1){
            if(hcast != -1){
                if(hcast[0] > vcast[0] && vcast[0] < RAYDISTANCE){
                    // set line stroke and line width
                    ctx.strokeStyle = 'lightblue';
                    ctx.lineWidth = 1;                    

                    let a = 1 - vcast[0]*Math.cos(ca)/RAYDISTANCE
                    let color = 'rgba(255,255,255,'+a+')'
                    ctx2.strokeStyle = color;

                    // //draw a red line
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(vcast[1], vcast[2]);
                    ctx.stroke();

                    ctx2.beginPath();
                    let lhegiht = (5000/(vcast[0]*Math.cos(ca)))/2 
                    ctx2.moveTo(start, height-lhegiht);
                    ctx2.lineTo(start, height+lhegiht)
                    ctx2.stroke();
                }
                else if(hcast[0] < RAYDISTANCE){
                    // set line stroke and line width
                    ctx.strokeStyle = 'lightblue';
                    ctx.lineWidth = 1;

                    let a = 1 - hcast[0]*Math.cos(ca)/RAYDISTANCE
                    let color = 'rgba(200,200,200,'+a+')'
                    ctx2.strokeStyle = color;

                    // // draw a red line
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(hcast[1], hcast[2]);
                    ctx.stroke();

                    ctx2.beginPath();
                    let lhegiht = (5000/(hcast[0]*Math.cos(ca)))/2
                    ctx2.moveTo(start, height-lhegiht);
                    ctx2.lineTo(start, height+lhegiht)
                    ctx2.stroke();
                }
            }
            else if(vcast[0] < RAYDISTANCE){
                // set line stroke and line width
                ctx.strokeStyle = 'lightblue';
                ctx.lineWidth = 1;

                let a = 1 - vcast[0]*Math.cos(ca)/RAYDISTANCE
                let color = 'rgba(255,255,255,'+a+')'
                ctx2.strokeStyle = color;

                // // draw a red line
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(vcast[1], vcast[2]);
                ctx.stroke();

                ctx2.beginPath();
                let lhegiht = (5000/(vcast[0]*Math.cos(ca)))/2
                ctx2.moveTo(start, height-lhegiht);
                ctx2.lineTo(start, height+lhegiht)
                ctx2.stroke();
            }
        }
        else if(hcast[0] < RAYDISTANCE){
            // set line stroke and line width
            ctx.strokeStyle = 'lightblue';
            ctx.lineWidth = 1;
            

            let a = 1 - hcast[0]*Math.cos(ca)/RAYDISTANCE
            let color = 'rgba(200,200,200,'+a+')'
            ctx2.strokeStyle = color;
            ctx2.strokeStyle = color;

            // // draw a red line
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(hcast[1], hcast[2]);
            ctx.stroke();

            ctx2.beginPath();
            let lhegiht = (5000/(hcast[0]*Math.cos(ca)))/2 
            ctx2.moveTo(start, height-lhegiht);
            ctx2.lineTo(start, height+lhegiht)
            ctx2.stroke();
        }
        start+=3
        angle+=0.005/2
    }
}

function correct(pa){
    if(pa <= PI/2){
        return pa
    }
    else if(pa > PI/2 && pa <= PI){
        return PI - pa
    }
    else if(pa > PI && pa <= (3*PI)/2){
        return pa - PI;
    }
    else if(pa > (3*PI)/2){
        return 2*PI - pa
    }
}

function horizontalCast(pa){
    let rx = x, ry = y;
    let cx = rx, cy = ry;
    let ox = 0, oy = 0;
    let ra = correct(pa)
    if(ra != PI/2 && ra != (3*PI)/2){
        let init = initializex(rx,ry,ra,pa)
        rx = init[0]
        ry = init[1]
        cx = init[2]
        cy = init[3]
        let hitBox = false
        count = 30  //CHANGE THIS PLEASEEEEEEEEEEEEEEEEEEEEE
        ox = 16
        oy = ox * Math.tan(ra)
        while(!hitBox && count != 0){
            let pos = getPosition(cx,cy) 
            // console.log("horizontal")
            // console.log("x: "+pos[0]+" y: "+pos[1])
            // console.log("pa: "+pa+" rx: "+rx+", ry: "+ry)
            // console.log("count: "+count+" x: "+pos[0]+" y: "+pos[1])
            if(arr[pos[0]][pos[1]] == 1){
                hitBox = true
                //console.log("WALL DETECT, x :" + pos[0]+", y: "+pos[1])
                return [getdistance(x,y,rx,ry),rx,ry]
            }
            if(pa > PI/2 && pa < (3*PI)/2){ // looking left
                if(pa >= 0 && pa <= PI){ // looking down
                    rx -= ox 
                    ry += oy 
                    cx = rx - 1
                    cy = ry 
                }
                else{ // looking up
                    rx -= ox 
                    ry -= oy
                    cx = rx - 1
                    cy = ry 
                }
            }
            else{  // looking right
                if(pa > 0 && pa < PI){ // looking down
                    rx += ox
                    ry += oy
                    cx = rx + 1
                    cy = ry 
                }
                else{ //looking up
                    rx += ox
                    ry -= oy
                    cx = rx + 1
                    cy = ry 
                }
            }
            count-=1
        }
    }

    return -1
}

function verticalCast(pa){
    let rx = x, ry = y;
    let cx = rx, cy = ry;
    let ox = 0, oy = 0;
    let ra = correct(pa)
    if(ra != PI && ra != 0){
        let init = initializey(rx,ry,ra,pa)
        rx = init[0]
        ry = init[1]
        cx = init[2]
        cy = init[3]
        let hitBox = false
        count = 30
        oy = 16
        ox = oy * cot(ra)
        while(!hitBox && count != 0){
            let pos = getPosition(cx,cy)
            // console.log("vertical")
            // console.log("x: "+pos[0]+" y: "+pos[1])
            // console.log("pa: "+pa+" rx: "+rx+", ry: "+ry)
            if(arr[pos[0]][pos[1]] == 1){
                hitBox = true
                //console.log("WALL DETECT, x :" + pos[0]+", y: "+pos[1])
                return [getdistance(x,y,rx,ry),rx,ry]
            }
            if(pa > 0 && pa < PI){ // looking down
                if(pa >= PI/2 && pa <= (3*PI)/2){ // looking left
                    rx -= ox
                    ry += oy  
                    cx = rx
                    cy = ry + 1
                }
                else{ // looking right
                    rx += ox
                    ry += oy
                    cx = rx 
                    cy = ry + 1
                }
            }
            else{  // looking up
                if(pa > PI/2 && pa < (3*PI)/2){ // looking left
                    rx -= ox
                    ry -= oy
                    cx = rx 
                    cy = ry - 1
                }
                else{ //looking right
                    rx += ox
                    ry -= oy
                    cx = rx 
                    cy = ry - 1
                }
            }
            count-=1      
        }
    }
    
    return -1
}


function initializex(rx,ry,ra,pa){
    let cx = rx, cy = ry;
    if(pa > PI/2 && pa < (3*PI)/2){ // looking left
        let ox = rx % 16
        let oy = ox * Math.tan(ra)  

        if(pa >= 0 && pa <= PI){ // looking up
            rx -= ox
            ry += oy  
            cx = rx - 1
            cy = ry 
        }
        else{ // looking down
            rx -= ox
            ry -= oy
            cx = rx - 1
            cy = ry 
        }
    }
    else{  // looking right
        let ox = 16 - (rx % 16)
        let oy = ox * Math.tan(ra)    


        if(pa > 0 && pa < PI){ // looking up
            rx += ox
            ry += oy
            cx = rx + 1
            cy = ry 
        }
        else{ //looking down
            rx += ox
            ry -= oy
            cx = rx + 1
            cy = ry
        }
    }

    return [rx,ry,cx,cy]
}

function initializey(rx,ry,ra,pa){
    let cx = rx, cy = ry;
    if(pa >= 0 && pa <= PI){ // looking up
        let oy = 16 - (ry % 16)
        let ox = oy * cot(ra)  


        if(pa >= PI/2 && pa <= (3*PI)/2){ // looking left
            rx -= ox
            ry += oy
            cx = rx 
            cy = ry + 1
        }
        else{ // looking right
            rx += ox
            ry += oy
            cx = rx 
            cy = ry + 1
        }
    }
    else{  // looking down
        let oy = ry % 16
        let ox = oy * cot(ra)  

        if(pa >= PI/2 && pa <= (3*PI)/2){ // looking left
            rx -= ox
            ry -= oy
            cx = rx
            cy = ry - 1
        }
        else{ //looking right
            rx += ox
            ry -= oy
            cx = rx 
            cy = ry - 1
        }
    }

    return [rx,ry,cx,cy]
}


function cot(x) { return 1 / Math.tan(x); }