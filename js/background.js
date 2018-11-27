class Background{
    constructor(x,y,image){
        this.x = x;
        this.y = y;
        this.vx = 3;
        this.image = image;
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