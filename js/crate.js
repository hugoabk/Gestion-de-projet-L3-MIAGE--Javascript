// class crate
class Crate {
    constructor(x,y,image) {
        this.x = x;
        this.y = y;
        this.image = image;
    }

    draw(ctx) {
        ctx.save();

        ctx.strokeStyle ="black";
        ctx.drawImage(this.image, this.x, this.y);
        ctx.strokeRect(this.x,this.y,128,128);

        ctx.restore();
    }
}