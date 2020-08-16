gl = initgl("canvas");

var canvas2d = document.getElementById("2D");
var ctx = canvas2d.getContext('2d');

var program = createProgram("vts", "fts");

var posL = gl.getAttribLocation(program, "position");
var posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

var positions = [
    -1, -1, 
    +1, -1,
    -1, +1, 
    -1, +1, 
    +1, -1, 
    +1, +1
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

resize(false, false, gl.canvas, true);
canvas2d.width = window.innerWidth - gl.canvas.clientWidth - 4;
canvas2d.height = gl.canvas.clientHeight;

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.enableVertexAttribArray(posL);
gl.vertexAttribPointer(posL, 2, gl.FLOAT, false, 0, 0);

var resL = gl.getUniformLocation(program, "res");
gl.uniform2f(resL, 2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight);
var timeL = gl.getUniformLocation(program, "time");

// Choose best requestAnimationFrame
window.reqAnimationFrame = (function(callback){
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
var startTime = (new Date()).getTime();

var Links = new Array(); // Links information
var hoverLink = ""; // Href of the link which cursor points at
ctx.font = "15px Courier New"; // Monospace font for links
ctx.textBaseline = "top"; // Makes left top point a start point for rendering text

// Draw the link
function drawLink(x,y,href,title){
    var linkTitle = title,
        linkX = x,
        linkY = y,
        linkWidth = ctx.measureText(linkTitle).width,
        linkHeight = parseInt(ctx.font); // Get lineheight out of fontsize

    // Draw the link
    ctx.fillText(linkTitle, linkX, linkY);

    // Underline the link (you can delete this block)
    ctx.beginPath();
    ctx.moveTo(linkX, linkY + linkHeight);
    ctx.lineTo(linkX + linkWidth, linkY + linkHeight);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#0000ff";
    ctx.stroke();

    // Add mouse listeners
    canvas2d.addEventListener("mousemove", on_mousemove, false);
    canvas2d.addEventListener("click", on_click, false);

    // Add link params to array
    Links.push(x + ";" + y + ";" + linkWidth + ";" + linkHeight + ";" + href);
}

// Link hover
function on_mousemove (ev) {
    var x, y;

    // Get the mouse position relative to the canvas element
    if (ev.clientX || ev.clientX == 0) { // For Firefox
        x = ev.clientX;
        y = ev.clientY;
    }
    x -= gl.canvas.width;
    // Link hover
    for (var i = Links.length - 1; i >= 0; i--) {
        var params = new Array();

        // Get link params back from array
        params = Links[i].split(";");

        var linkX = parseInt(params[0]),
            linkY = parseInt(params[1]),
            linkWidth = parseInt(params[2]),
            linkHeight = parseInt(params[3]),
            linkHref = params[4];
        
        // Check if cursor is in the link area
        if (x >= linkX && x <= (linkX + linkWidth) && y >= linkY && y <= (linkY + linkHeight)){
            document.body.style.cursor = "pointer";
            hoverLink = linkHref;
            
            break;
        }
        else {
            document.body.style.cursor = "";
            hoverLink = "";
        }
    };
}

// Link click
function on_click(e) {
    if (hoverLink){
        window.open(hoverLink); // Use this to open in new tab
        //window.location = hoverLink; // Use this to open in current window
    }
}

function draw(){
    var time = (new Date()).getTime();

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.uniform1f(timeL, (time - startTime)/2000);
    
    ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
    ctx.font = "bold 50px Segoe UI";
    ctx.fillText("CSA's Website", 70, 100);

    ctx.beginPath();
    ctx.moveTo(70, 170);
    ctx.lineTo(170, 170);
    ctx.moveTo(415, 360);
    ctx.lineTo(475, 360);
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    ctx.font = "normal 18px Segoe UI";
    ctx.fillText("Hey there I'm a 14yo who likes math, physics & computer science", 70, 200);
    ctx.fillText("I am proficient at university+contest math and I do competitive programming", 70, 230);
    ctx.fillText("I also play the guitar and basketball, tho I'm not very great at either :P", 70, 260);
    ctx.fillText("Sometimes I fiddle with cool things like 3D rendering and make games", 70, 290);

    ctx.fillText("Quick links", 70, 350);

    drawLink(95, 400, "https://github.com/CSA-Programming","My Github");
    drawLink(95, 430, "https://codeforces.com/profile/1egend", "My Codeforces");
    drawLink(95, 460, "https://artofproblemsolving.com/community/my-aops","My AoPS");
    drawLink(95, 490, "https://www.shadertoy.com/profile?show=shaders","My Shadertoy");
    drawLink(95, 520, "https://www.khanacademy.org/profile/IsCSA/projects","Old Inactive KA (Cringe games)");

    ctx.fillText("Games I suck at play", 350, 350);
    ctx.fillText("Minecraft", 375, 400);
    ctx.fillText("Destiny 2", 375, 425);
    ctx.fillText("KSP", 375, 450);
    ctx.fillText("CS: GO", 375, 475);
    ctx.fillText("Valorant", 375, 500);

    ctx.fillText("Discord: CSA#3493", canvas2d.width - 170, canvas2d.height - 30);

    window.reqAnimationFrame(draw, 1000/60);
}
window.addEventListener("load", draw, false);

