class Score {

    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.save();

        ctx.font = '16px OCR A Std, monospace';
        ctx.fillStyle = "black";
        ctx.fillText(this.value, this.x, this.y);

        ctx.restore();
    }
}
