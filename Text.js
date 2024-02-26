Text.prototype = new Shape();
Text.prototype.constructor = Text;
function Text (x, y, font, fill, content) {
    this.x = x || 0;
    this.y = y || 0;
    this.font = font;
    this.fill = fill;
    this.content = content;
}

Text.prototype.draw = function(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.fill;
    var metrics = ctx.measureText(this.content);
    this.w = metrics.width;
    this.h = 20; //Nasty hack
    ctx.fillText(this.content, this.x, this.y);
}
Text.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Height) and its Y and (Y + Height)
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y >= my) && (this.y + this.h >= my);
}
Text.prototype.stroke = function(ctx, strokeStyle, lineWidth) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    //ctx.strokeRect(this.x,this.y,this.w,this.h)
    this.draw(ctx);
    ctx.stroke();
}