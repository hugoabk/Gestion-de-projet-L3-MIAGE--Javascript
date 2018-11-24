// Target Object
class Target {

    constructor(id, x, y, w, h, vx, vy, couleur, pointDV) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.couleur = couleur;
        this.pointDV = pointDV;
    }

    draw(ctx) {
        ctx.save();
        // draw target
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        // draw healthbar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 5, this.y - 20, this.w + 10, 10);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 5, this.y - 20, (this.pointDV / 10) * (this.w + 10), 10);

        ctx.restore();
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

}