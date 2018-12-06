// Target Object
class Target {

    constructor(id, x, y,vx,pointDV,action) {
        this.sprite = new Sprite(action);
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = 134;
        this.h = 166;
        this.vx = vx;
        this.pointDV = pointDV;
        this.isShooting = false;
        this.willShoot = 0;
        this.isHitting = false;
    }

    extractSprites(spriteSheet){
        this.sprite.extractSprites(spriteSheet);
    }

    setNbImagesPerSecond(nb){
        this.sprite.setNbImagesPerSecond(nb);
    }

    draw(ctx) {
        ctx.save();

        this.sprite.draw(ctx,this.x,this.y);

        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 5, this.y - 20, this.w + 10, 10);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 5, this.y - 20, (this.pointDV / 10) * (this.w+10), 10);

        if(this.willShoot != 0){
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.x + 50, this.y - 50);
            ctx.lineTo(this.x + 65, this.y - 50);
            ctx.moveTo(this.x + 75 , this.y - 50);
            ctx.lineTo(this.x + 90, this.y - 50);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x + 70, this.y - 70);
            ctx.lineTo(this.x + 70, this.y - 55);
            ctx.moveTo(this.x + 70, this.y -30);
            ctx.lineTo(this.x + 70, this.y -45);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(this.x + 70, this.y - 50, 20, 0, 2 * Math.PI);
            ctx.stroke();
        }

        ctx.restore();
    }

    move() {
        this.x += this.vx;
    }

}
