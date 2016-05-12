class AtmosphereLayer
{
    constructor(name, height, density) 
    {
        this.name = name;
        this.height = height;
        this.density = density;
    }
};

class Atmosphere
{
    constructor() 
    {
        this.layers = [];
    }
};


class Planet
{
    constructor(name, mass, radius) 
    {
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.atmosphere = new Atmosphere();
        this.position = new Vector();
        this.renderobject = null;
    }
};