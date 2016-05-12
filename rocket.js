class RocketPart 
    {
      constructor(name, mass) 
      {
        this.name = name;
        this.mass = mass;
        this.orientation = new Vector(0,0);
        this.renderobject = null;
      }
    };
    
    class Engine extends RocketPart
    {
        constructor(name, mass, thrust, isp) 
        {
            super(name, mass);
            this.thrust = thrust;
            this.isp = isp;
        }
    };
    
    class SolidFuelTank extends RocketPart
    {
        constructor(name, mass, density = 7.5) 
        {
            super(name, mass);
            this.density = density;
        }
        
        volume()
        {
            return this.mass / this.density;
        }
    };
    
    class Rocket 
    {
      constructor(name) 
      {
        this.name = name
        this.parts = [];
        this.velocity = new Vector(0,0);
        this.position = new Vector(0,0);
      }
      
      addPart(part)
      {
          this.parts.push(part);
      }
      
      mass()
      {
          var result = 0;
          for(var i = 0; i < this.parts.length; ++i)
          {
              var part = this.parts[i];
              result += part.mass;
          }
          
          return result;
      }
      
      solidfuel()
      {
          var result = 0;
          for(var i = 0; i < this.parts.length; ++i)
          {
              var part = this.parts[i];
              if(part instanceof SolidFuelTank)
              {
                result += part.volume()
              }
          }
          
          return result;
      }
      
      thrust()
      {
          var result = new Vector(0,0);
          
          for(var i = 0; i < this.parts.length; ++i)
          {
              var part = this.parts[i];
              if(part instanceof Engine)
              {
                if(part.orientation.length())
                    part.orientation.normalize();
                
                //var fuel_consumption = part.thrust / part.isp;
                
                result.x += part.thrust * part.orientation.x;
                result.y += part.thrust * part.orientation.y;
              }
          }
          
          
          return result;
      }
      
      fuel_consumption()
      {
        var consumption = 0;

        for(var i = 0; i < this.parts.length; ++i)
        {
            var part = this.parts[i];
            if(part instanceof Engine)
            {
                consumption += part.thrust / part.isp;
            }
        }
        
        return consumption;
      }
      
    };