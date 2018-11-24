// Take Cover Object
class TakeCover {

    constructor(w, h) {
        this.x = 0;
        this.y = h;
        this.w = w;
        this.h = h;
        this.vy = 20;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }

    moveToTheTop(h) {
        if (this.y > h * 0.25) {
            this.y -= this.vy;
        }
        else {
            this.y = h * 0.25;
        }
    }

    moveToTheBottom(h) {
        if (this.y < h) {
            this.y += this.vy;
        }
        else {
            this.y = h;
        }
    }
}