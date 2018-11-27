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

        ctx.restore();
    }

    move() {
        this.x += this.vx;
    }

}