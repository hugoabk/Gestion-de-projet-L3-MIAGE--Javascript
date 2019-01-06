// class crate
class Crate {
    constructor(x,y,image) {
        this.x = x;
        this.y = y;
        this.image = image;
    }

    draw(ctx) {
        ctx.save();

        ctx.drawImage(this.image, this.x, this.y);

        ctx.restore();
    }
}