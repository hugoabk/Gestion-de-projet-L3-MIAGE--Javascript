class Background{
    constructor(x,y,image,floor){
        this.x = x;
        this.y = y;
        this.vx = 3;
        this.image = image;
        this.floor = floor;
    }

    draw(ctx,w,h){
        ctx.save();

        ctx.drawImage(this.image,this.x,this.y,w,h);

        ctx.restore();

    }

    move(){
        this.x += this.vx;
    }
}