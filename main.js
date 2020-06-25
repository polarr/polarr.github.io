var sketchProc = function(processingInstance) {
    with (processingInstance) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        size(width, height); 
        frameRate(Infinity);
        var METER = 200;
        // Vector library
    function vector (a, b, c){
        return {
            x: a,
            y: b || a, 
            z: c || (b || a),
        };
    }

    var v = {
        // Vector operations
        add: function(a, b){
            return {
                x: a.x + b.x,
                y: a.y + b.y,
                z: a.z + b.z,
            };
        },
        sub: function(a, b){
            return {
                x: a.x - b.x,
                y: a.y - b.y,
                z: a.z - b.z
            };
        },
        scale: function(a, b){
            b = b.x ? b : vector(b);
            return {
                x: a.x * b.x,
                y: a.y * b.y,
                z: a.z * b.z
            };
        },
        cross: function(a, b){
            return {
                x: a.y * b.z - a.z * b.y,
                y: a.z * b.x - a.x * b.z,
                z: a.x * b.y - a.y * b.x
            };
        },
        normalize: function(a){
            return this.scale(a, 1/this.mag(false, a));
        },
        // Returns Vector data
        mag: function(squ, a, b){
            // Efficiency optimization option to not use sqrt()
            b = b ? b : vector(0);
            var d = sq(a.x - b.x) + sq(a.y - b.y) + sq(a.z - b.z);
            return squ ? d : Math.sqrt(d);
        },
        dot: function(a, b){
            return a.x * b.x + a.y * b.y + a.z * b.z;
        },
    };
    
    // Camera
    var camera = {
        pos: vector(0, 0, - METER/2),
        // Input a normalized direction vector
        direction: vector(0, 0, 1),
        // Non directional light source
        light: vector(0, 0, - METER ),
        FOV: 90
    };
    
    var mesh = {
        cuboid: function(a, b, c, w, h, d, co){
            var x = a - w/2;
            var y = b + h/2;
            var z = c - d/2;
        
            return {
                center: vector(a, b, c),
                color: co,
                v: [
                    // Front face
                    [vector(x, y, z),
                    vector(x, y - h, z),
                    vector(x + w, y - h, z),
                    vector(x + w, y, z)],
                    
                    // Back face
                    [vector(x, y, z + d),
                    vector(x, y - h, z + d),
                    vector(x + w, y - h, z + d),
                    vector(x + w, y, z + d)],
            
                    // Right face
                    [vector(x + w, y, z),
                    vector(x + w, y - h, z),
                    vector(x + w, y - h, z + d),
                    vector(x + w, y, z + d)],
                    
                    // Left face
                    [vector(x, y, z),
                    vector(x, y, z + d),
                    vector (x, y - h, z + d),  
                    vector(x, y - h, z)],
            
                    // Top face
                    [vector(x, y - h, z) ,
                    vector(x, y - h, z + d),
                    vector(x + w, y - h, z + d),
                    vector(x + w, y - h, z)],
                    
                    // Bottom face
                    [vector(x, y, z),
                    vector(x + w, y, z),
                    vector(x + w, y, z + d), 
                    vector(x, y, z + d)],
                ]
            };
        }
    };
    
    var cube = mesh.cuboid (0, 0, 0, 50, 50, 50, color(255, 0, 0));
    
    function rot(shape, dimension, angle){
        var sinA = sin(angle);
        var cosA = cos(angle);
        
        var a, b;
        for (var face = 0; face < shape.length; face ++){
            var f = shape[face];
            for (var vr = 0; vr < f.length; vr ++){
                var v = f[vr];
                switch (dimension.toLowerCase()){
                    case 'x':
                        a = v.y;
                        b = v.z;
                        
                        v.y = a * cosA - b * sinA;
                        v.z = b * cosA + a * sinA;
                    break;
                    case 'y':
                        a = v.x;
                        b = v.z;
                        
                        v.x = a * cosA + b * sinA;
                        v.z = b * cosA - a * sinA;
                    break;
                    case 'z':
                        a = v.x;
                        b = v.y;
                        v.x = a * cosA - b * sinA;
                        v.y = b * cosA + a * sinA;
                    break;
                }
            }
        }
    }
    var fc = [];
        for (var i = 0; i < 8; i++){
            fc.push(color(random(0, 255), random(0, 255), random(0, 255)));
        }
    function facesort(shape){
        var faces = [];
        var centroids = [];
        var sorted = [];
        var tempc = fc;
        fc = [];
        
        for (var face = 0; face < shape.length; face ++){
            faces.push(shape[face]);
            var centroid = vector(0);
            for (var vr = 0; vr < shape[face].length; vr ++){
                centroid = v.add(centroid, shape[face][vr]);
            }
            centroid = v.scale(centroid, 1/shape[face].length);
            centroids.push([centroid, face]);
        }   
        
        centroids.sort(function(a, b){return b[0].z - a[0].z;});
        
        for (var s = 0; s < centroids.length; s ++){
            sorted.push(faces[centroids[s][1]]);
            fc.push(tempc[centroids[s][1]]);
        }
        
        return sorted;
    }
    
    rot (cube.v, 'x', 50);
    rot (cube.v, 'y', -60);
        
    function render(shape){
        
        shape = shape.v;
        
        // For each face, find normal, calculate shading, and render
        for (var face = 0; face < shape.length; face ++){
            var col = fc[face];
            var f = shape[face];
            var vs = f.length;
            
            // Backface clipping
            var clipped = true;
            for (var vr = 0; vr < vs; vr ++){
                if (f[vr].z < 0){
                    clipped = false;
                    break;
                }
            }
            
            if (clipped){
                continue;
            }
            
            var shade, d = 0;
            var n1 = vector(0);
            var n2 = vector(0);
            
            for (var vr = 0; vr < vs; vr ++){
                // Newells Algorithm to finding convex normal
                n1 = v.add(n1, v.cross(f [(vr + 1) % vs], f[vr]));
                n2 = v.add(n2, v.cross(f[vr], f [(vr + 1) % vs]));
                
                // Also interpolates distance
                d += v.mag(false, camera.light, f[vr]);
            }
            
            var nr = v.mag(true, v.add(f[0], n1)) > v.mag(true, v.add(f[0], n2)) ? n1 : n2;
            // Angle shading 
            var cosangle = v.dot(nr, camera.light) / (v.mag(false, nr) * v.mag(false, camera.light));
            cosangle = Math.max(0, cosangle);
            var shade = lerpColor(color(0), col, cosangle);
            
            // Distance shading
            d /= vs;
            var invsq = 1/ sq(d / METER); 
            shade = lerpColor(color(0), shade, invsq > 1 ? 1: invsq);
            
            fill(shade);
            stroke(shade);
            pushMatrix();
            translate(200, 200);
            beginShape();
                for (var vr = 0; vr < vs; vr ++){
                    var c = v.mag(false, camera.pos, f[vr]);
                    vertex(f[vr].x * METER/c, f[vr].y * METER/c);
                }
            endShape(CLOSE);
            popMatrix();
        }
    }

        noStroke();
        var circles = [];
        var circle = function(x, y, t, c){
            this.x = x;
            this.y = y;
            this.t = t;
            this.c = c;
        };

        circle.prototype.draw = function(){
            fill(this.c, this.t * 255/100);
            ellipse(this.x, this.y, 10, 10);
            this.t--;
        };
        
        var fireworks = [];

        var firework = function(trail, sx, sy, x, y, color){
            if (!trail){
                this.x = sx;
                this.y = sy;
                this.tx = x;
                this.ty = y;
                this.vel = 10;
                this.angle = atan2(this.y - this.ty, this.tx - this.x);
            }
            else{
                this.x = sx;
                this.y = sy;
                this.angle = y;
                this.velX = x * cos(this.angle);
                this.velY = x * sin(this.angle);
            }
            this.c = color;
            this.stage = true;
            this.trail = trail;
        };

        firework.prototype = {
            init : function(){
                if (!this.trail){
                    if (this.stage){
                        this.x += this.vel * cos(this.angle);
                        this.y -= this.vel * sin(this.angle);
                        if (this.y <= this.ty){
                            this.stage = false;
                        }
                    }
                    if (!this.stage){
                        for (var i = 0; i < 360; i+= 60){
                            fireworks.push(new firework(true, this.x, this.y, random(15, 25), i, this.c));
                        }
                    }
                }
                else{
                    this.x += this.velX;
                    this.y += this.velY;
                    this.velY += 1;
                }
                circles.push(new circle(this.x, this.y, 100, this.c));
            }
        };

        var confettis = [];

        var confetti = function(x, y, t, s, c){
            this.x = x;
            this.y = y;
            this.t = t;
            this.s = s;
            this.c = c;
        };

        confetti.prototype.draw = function(){
            fill(this.c, 150);
            quad(this.x, this.y - 10, this.x + sin(this.t/5) * 10, this.y, this.x, this.y + 10, this.x -sin(this.t/5) * 10, this.y);
            this.x += random(-1, 1);
            this.y += this.s;
            this.t ++;
        };

        var colors = [color(255, 128, 0), color(255, 0, 0), color(255, 255, 0), color(255, 255, 255), color(255, 0, 255), color(0, 255, 0), color(0, 0, 255), color(0, 255, 255)];
        var draw = function(){
            background(0, 0, 0);
            cube.v = facesort(cube.v);
            render(cube);
            var img = get(100, 100, 200, 200);
            background(0, 0, 0);

        for (var i = 100; i <= 1100; i+= 300){
            pushMatrix();
            translate(i + 100,(i - 100)/300 % 2 === 0 ? 150: 450);
            scale((i - 100)/300 % 2 === 0 ? 1: -1);
            image(img, -100, -100);
            popMatrix();
        }
            noStroke();
            for (var i = 0; i < confettis.length; i++){
                confettis[i].draw();
                if (confettis[i].y > height){
                    confettis.splice(i, 1);
                    i--;
                }
            }
            var ranColor = Math.floor(random(0, colors.length));
            confettis.push(new confetti(random(0, width), -10, 0, random(3, 5), colors[ranColor]));
            if (frameCount % 200 === 0){
                for (var i = 0; i < 3; i++){
                    var ranColor = Math.floor(random(0, colors.length));
                    fireworks.push(new firework(false, random(0, width), height, random(0, width), random(0, height/2), colors[ranColor]));
                }
            }
            for (var i = 0; i < fireworks.length; i++){
                fireworks[i].init();
                if (!fireworks[i].stage){
                    fireworks.splice(i, 1);
                    i--;
                }
            }

            for (var i = 0; i < circles.length; i++){
                circles[i].draw();
                if (circles[i].t <= 0){
                    circles.splice(i, 1);
                    i--;
                    continue;
                }
                if (circles[i].y > height){
                    circles.splice(i, 1);
                    i--;
                    continue;
                }
            }
            pushMatrix();
                translate(width/2, height/2);
                scale(sin(frameCount * 2/50) * 0.3 + 0.6);
                rotate(sin(frameCount/50) * 45 * Math.PI/180);
                fill(255, 255, 255);
                textAlign(CENTER, CENTER);
                textFont(createFont("impact"), 100);
                text("Happy 14th bday Connor!", 0, 0);
            popMatrix();
            textFont(createFont('consolas'), 15);
            fill(255, 255, 255, 150);
            text("From a few friends ;)", width/2, height - 50);
            rot(cube.v, 'x', 2 * Math.PI /360);
            rot(cube.v, 'y', - 2 * Math.PI /360);
        };
    }
};

// Get the canvas that Processing-js will use
var canvas = document.querySelector("canvas");

// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc); 
