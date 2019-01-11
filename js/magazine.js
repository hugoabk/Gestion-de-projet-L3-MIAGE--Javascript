// Magazine Object
class Magazine {
    constructor(capacityMax, image) {
        this.image = image;
        this.capacityMax = capacityMax;
        this.capacity = capacityMax;
    }

    draw(ctx) {
        ctx.save();

        for (var i = 0; i < this.capacity; i++) {
            var j = 25;
            ctx.drawImage(this.image, (i*j)+5, 5);
        }
        ctx.restore();
    }
}