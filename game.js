$(function()
{
    var G = 6.67408e-11;
    
    
    class SolarSystem
    {
        constructor(name) 
        {
            this.name = name;
            this.planets = [];
            this.position = new Vector();
        }
    };
    
    
    
    //http://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
    var sun = new Planet("sun", 19885000e24, 695700 * 1000);
    var earth = new Planet("earth", 5.9736e24, 6378.137 * 1000);
    var moon = new Planet("moon", 0.07346e24, 1738.1 * 1000);
    
    sun.position = new Vector(0,0);
    earth.position = new Vector(149785000 * 1000,0);
    moon.position = new Vector(earth.position.x - 384853 * 1000,0);
    
    var solarsystem = new SolarSystem("kerbal");
    solarsystem.planets.push(sun);
    solarsystem.planets.push(earth);
    solarsystem.planets.push(moon);
    
    var planet = earth;
    var current_solar_system = solarsystem;

    
    var wind = new Vector(0,0);
    var rocket = new Rocket("rocket");
    rocket.position.x = earth.position.x;
    rocket.position.y = earth.position.y + earth.radius;
    
    var engine = new Engine("engine", 1500, 162.91 * 1000.0, 140);
    var cmdmodule = new RocketPart("commandmodule", 5000);
    rocket.addPart(engine);
    rocket.addPart(cmdmodule);
    

    $("body").on("keydown", function(evt)
    {
        //left
        if(evt.which == 37)
        {
            engine.orientation.x -= 1.0;
        }
        //right
        else if(evt.which == 39)
        {
            engine.orientation.x += 1.0;
        }
        //top
        else if(evt.which == 38)
        {
            engine.orientation.y += 1.0;
        }
        //bottom
        else if(evt.which == 40)
        {
            engine.orientation.y -= 1.0;
        }
        
        /*
        evt.preventDefault();
        evt.stopPropagation();
        return false;
        */
    });
    
    var lastCalledTime = new Date();

    function simulate(dt_s)
    {
        //F = m * a;
        //a = F / m;
        
        var F = rocket.thrust();
        
        var m = rocket.mass();
        
        var all_planets = new Vector(0,0);
        
        for(var i = 0; i < current_solar_system.planets.length; ++i)
        {
            var p = current_solar_system.planets[i];
            var direction_x = rocket.position.x - p.position.x;
            var direction_y = rocket.position.y - p.position.y;
            
            var dir = new Vector(direction_x, direction_y);
            var d = dir.length();
            dir.normalize();
            
            if(d >= p.radius)
            {
                var planet_force =  G * (m * p.mass) / (d * d);
                all_planets.x += dir.x * planet_force;
                all_planets.y += dir.y * planet_force;
            }
        }
        
        F.x -= all_planets.x;
        F.y -= all_planets.y;
        
        F.x += wind.x;
        F.y += wind.y;
        
        var a_x = F.x / m;
        var a_y = F.y / m;
        
        rocket.velocity.x += a_x * dt_s;
        rocket.velocity.y += a_y * dt_s;
        
        rocket.position.x += rocket.velocity.x * dt_s;
        rocket.position.y += rocket.velocity.y * dt_s;
    }
    
    var canvas = $("#canvas");
    var statistics_mass = $("#mass")
    var statistics_thrust = $("#thrust")
    var statistics_velocity = $("#velocity")
    
    function makeSVG(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    }
    
    function render(dt_s)
    {
        var m_to_px = 0.2 * 1e9 / 1920.0;
        
        if(!rocket.renderobject)
        {
            rocket.renderobject = makeSVG("path");
            rocket.renderobject.setAttribute("d", "M-5,0l10,0l-5,-5z");
            rocket.renderobject.setAttribute("fill", "red");
            
            canvas.append(rocket.renderobject);
        }
        
        for(var i = 0; i < current_solar_system.planets.length; ++i)
        {
            var p = current_solar_system.planets[i];
            if(!p.renderobject)
            {
                p.renderobject = makeSVG("circle");
                p.renderobject.setAttribute("r", Math.round(p.radius / m_to_px));
                p.renderobject.setAttribute("fill", "#CCC");
                p.renderobject.setAttribute("stroke", "black");
                p.renderobject.setAttribute("stroke-width", 2);
                p.renderobject.setAttribute("title", p.name);
                canvas.append(p.renderobject);
            }
        }
        
        var camera = new Vector(rocket.position.x, rocket.position.y);
        
        var window_bottom = window.innerHeight;
        var offset_x = window.innerWidth * 0.5;
        var offset_y = window_bottom * 0.5;
        
        
        for(var i = 0; i < current_solar_system.planets.length; ++i)
        {
            var p = current_solar_system.planets[i];
            
            p.renderobject.setAttribute("cx", offset_x + Math.round((p.position.x -camera.x) / m_to_px));
            p.renderobject.setAttribute("cy", offset_y - Math.round((p.position.y -camera.y)  / m_to_px));
        }
        
        
        
        var x = (rocket.position.x - camera.x) / m_to_px;
        var y = (rocket.position.y - camera.y)/ m_to_px;
        
        
        rocket.renderobject.setAttribute("transform", 
            "translate(" + (offset_x + x) + "," + (offset_y - y)+ ")");
        
        var v_x = Math.round(rocket.velocity.x);
        var v_y = Math.round(rocket.velocity.y);
        
        var thrust = rocket.thrust();
        
        var t_x = Math.round(thrust.x);
        var t_y = Math.round(thrust.y);
        
        statistics_velocity.text( v_x + " m/s" + "," + v_y + " m/s");
        statistics_thrust.text(t_x + " N" + "," + t_y + " N");
        statistics_mass.text(rocket.mass() + " kg");
    }
    
    function gameloop(timestamp)
    {
        var now = new Date();
        var dt_s = (now - lastCalledTime) / 1000.0;
        simulate(dt_s);
        render(dt_s);
        lastCalledTime = now;
        window.requestAnimationFrame(gameloop);
    }

    window.requestAnimationFrame(gameloop);
});