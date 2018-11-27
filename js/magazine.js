
// Magazine Object
class Magazine {
    constructor(capacityMax) {
        this.capacityMax = capacityMax;
        this.capacity = capacityMax;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgb(255, 230, 0)';
        ctx.strokeStyle = 'black';
        for (var i = 0; i < this.capacity; i++) {
            var j = 20;
            ctx.fillRect((i * j)+5, 5, 10, 50);
            ctx.strokeRect((i * j)+5, 5, 10, 50);
        }
        ctx.restore();
    }
}