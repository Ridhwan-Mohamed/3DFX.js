class zBuffer {
    constructor(height, width) {
        this.height = height
        this.width = width
        this.buffer = new Array(height*width).fill(Number.MAX_VALUE)
    }

    emptySpot(x,y,z){
        if(this.buffer[y*this.width+x] > z){
            this.buffer[y*this.width+x] = z
            return true
        }
        return false        
    }
}