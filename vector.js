class Vector
{
    constructor(x, y) 
    {
        this.x = x;
        this.y = y;
    }
    
    normalize()
    {
        var length = this.length();
        this.x /= length;
        this.y /= length;
    }
    
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
};