// Take Cover Object
class TakeCover {

    constructor(w, h, image) {
        this.image = image;
        this.x = 0;
        this.y = h;
        this.w = w;
        this.h = h;
        this.vy = 20;
    }

    draw(ctx) {
        ctx.save();

        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);

        ctx.restore();
    }

    moveToTheTop() {
        if (this.y > this.h * 0.25) {
            this.y -= this.vy;
        }
        else {
            this.y = this.h * 0.25;
        }
    }

    moveToTheBottom(h) {
        if (this.y < this.h) {
            this.y += this.vy;
        }
        else {
            this.y = this.h;
        }
    }

    isSafe(){
        if(this.y <= (this.h/2)){
            return true;
        }else{
            return false;
        }
    }
}