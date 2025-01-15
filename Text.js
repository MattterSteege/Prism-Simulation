Text.prototype = new Shape();
Text.prototype.constructor = Text;
function Text (x, y, font, fill, content) {
    this.x = x || 0;
    this.y = y || 0;
    this.font = font;
    this.fill = fill;
    this.w = content.length * 10;
    this.content = content;
    this.points = [{x: this.x, y: this.y+ 18}, {x: this.x + this.w, y: this.y+ 18}, {x: this.x + this.w, y: this.y + 20+ 18}, {x: this.x, y: this.y + 20+ 18}];
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

Text.prototype.updatePoints = function(){
    this.points = [{x: this.x, y: this.y- 18}, {x: this.x + this.w, y: this.y- 18}, {x: this.x + this.w, y: this.y + this.h- 18}, {x: this.x, y: this.y + this.h- 18}];
}