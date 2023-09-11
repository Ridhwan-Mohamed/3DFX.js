class zBuffer {
    constructor(height, width) {
        this.height = height
        this.width = width
        this.buffer = new Array(height*width).fill(Number.MAX_VALUE)
    }

    static calculateDepth(ax, ay, bx, by, cx, cy, dx, dy, z1, z2, z3){
        const cTri = Math.abs(((dx-bx)*(ay-by)) - ((ax-bx)*(dy-by)))
        const bTri = Math.abs(((cx-ax)*(dy-ay)) - ((dx-ax)*(cy-ay)))
        const aTri = Math.abs(((dx-cx)*(by-cy)) - ((bx-cx)*(dy-cy)))

        let total = cTri + bTri + aTri

        return (cTri/total)*1/z3 + (bTri/total)*1/z2 + (aTri/total)*1/z1
    }

    static calculateColor(ax, ay, bx, by, cx, cy, dx, dy, vc1, vc2, vc3){
        const cTri = Math.abs(((dx-bx)*(ay-by)) - ((ax-bx)*(dy-by)))
        const bTri = Math.abs(((cx-ax)*(dy-ay)) - ((dx-ax)*(cy-ay)))
        const aTri = Math.abs(((dx-cx)*(by-cy)) - ((bx-cx)*(dy-cy)))

        let total = cTri + bTri + aTri

        return (cTri/total)*vc3 + (bTri/total)*vc2 + (aTri/total)*vc1
    }

     emptySpot(x, y, z) {
        if (z > this.buffer[y * this.width + x]) {
            this.buffer[y * this.width + x] = z;
            return true;
        }
        return false;
    }
}