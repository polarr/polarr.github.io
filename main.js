var sketchProc = function(processingInstance) {
    with (processingInstance) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        size(width, height); 
        frameRate(Infinity);

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
            for (var i = 0; i < confettis.length; i++){
                confettis[i].draw();
                if (confettis[i].y > height){
                    confettis.splice(i, 1);
                    i--;
                }
            }
            var ranColor = Math.floor(random(0, colors.length));
            confettis.push(new confetti(random(0, width), -10, 0, random(3, 5), colors[ranColor]));
            if (frameCount % 100 === 0){
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
                scale(sin(frameCount * 2/50) * 0.6 + 1);
                rotate(sin(frameCount/50) * 45 * Math.PI/180);
                fill(255, 255, 255);
                textAlign(CENTER, CENTER);
                textFont(createFont("impact"), 100);
                text("Happy 11th Birthday!", 0, 0);
            popMatrix();
        };
    }
};

// Get the canvas that Processing-js will use
var canvas = document.querySelector("canvas");

// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc); 