var source
var audioContext = new (window.AudioContext || window.webkitAudioContext)()

var analyser = audioContext.createAnalyser()
var maxFFT = 1024
analyser.fftSize = 32

var dataArray = new Uint8Array(analyser.fftSize)
var bufferLength = analyser.frequencyBinCount

var canvas
var canvasContext

// default visualization
var drawPick = 7

// offsets for wavefunction
var randomOffsets = []
var numOffsets = 6
var offSetRange = 150;

var mouseX
var mouseY

var musicObjs = []
var triangleMusicObjs = []

// SETUP
window.onload = function () {
    navigator.getUserMedia(
        {"audio": true},
        function gotStream(stream) {
            source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            setup();
        }, 
        function(e) { 
            alert('Error getting audio'); 
            console.log(e); 
        }
    );
    
    for (var i = 0; i < numOffsets; i++) {
        randomOffsets.push(Math.floor(Math.random() * (offSetRange + offSetRange)) - offSetRange)
    }
    
}

function setup() {
    
    canvas = document.getElementById('canvas0')
    canvas.focus()
    canvasContext = canvas.getContext('2d')
    
    canvasContext.imageSmoothingEnabled = false

    canvasContext.canvas.width  = window.innerWidth;
    canvasContext.canvas.height = window.innerHeight;
    
    // for future resize
    window.onresize = function () {
        canvasContext.canvas.width  = window.innerWidth;
        canvasContext.canvas.height = window.innerHeight;
    }
    
    // listeners
    canvas.addEventListener('mousedown', function (e) {
        drawPick = (drawPick + 1) % 10
        if (drawPick === 0 || drawPick === 4) {
            analyser.fftSize = maxFFT
            dataArray = new Uint8Array(analyser.fftSize)
            bufferLength = analyser.frequencyBinCount
        } else if (drawPick === 7) {
            analyser.fftSize = 64
            dataArray = new Uint8Array(analyser.fftSize)
            bufferLength = analyser.frequencyBinCount
        } else {
            analyser.fftSize = 64
            dataArray = new Uint8Array(analyser.fftSize)
            bufferLength = analyser.frequencyBinCount
        }
       
    })
    
    canvas.addEventListener('mousemove', function (e) {
        if (e.key = ' ') {
            mouseX = e.clientX
            mouseY = e.clientY  
        }
    })
    
    canvas.addEventListener('keydown', function (e) { 
        if (drawPick === 5) {
            musicObjs.push(new Circle(mouseX, mouseY, Math.random() * 50 + 25, Math.random() * 302))
        } else if (drawPick === 6) {
            var tri = new Triangle(mouseX, mouseY, Math.random() * 50 + 25, Math.random() * 302)
            tri.generate()
            triangleMusicObjs.push(tri)
        }
    })
    
    
    setInterval(update, 10)
}


// UPDATE
function update() {
    if (drawPick === 4) {
        analyser.getByteTimeDomainData(dataArray)
    } else {
        analyser.getByteFrequencyData(dataArray)
    }
    
    
    if (drawPick === 0) { // bar graph 
        drawStandardVisual()
    } else if (drawPick === 1) { // draw aesthetic speaker
        draw1()
    } else if (drawPick === 2) { // draw many layers
        draw2()
    } else if (drawPick === 3) { // draw bigger color circles
       drawColorCircles()
    } else if (drawPick === 4) { // draw wave form
        canvasContext.fillStyle = 'rgba(0,0,0,' + (Math.random() + .2) + ')'; 
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < numOffsets; i++) {
            drawWave(randomOffsets[i])
        }
    } else if (drawPick === 5) { // draw circles
        canvasContext.fillStyle = 'rgb(0,0,0)'
        canvasContext.fillRect(0,0,canvas.width,canvas.height)
        for (var obj of musicObjs) {
            obj.draw()
        }
    } else if (drawPick === 6) { // draw triangles
        canvasContext.fillStyle = 'rgb(0,0,0)'
        canvasContext.fillRect(0,0,canvas.width,canvas.height)
        for (var obj of triangleMusicObjs) {
            obj.draw()
        }
    } else if (drawPick === 7) {
        drawSpiralWave()
    } else if (drawPick === 8) {
        drawSprioGraph()
    } else if (drawPick === 9) {
        claire()
    }
}

// DRAWING FUNCTIONS
function drawColorCircles () {
    analyser.getByteFrequencyData(dataArray)

    canvasContext.fillStyle = 'rgb(0,0,0)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < bufferLength; i += 15) {

        third = dataArray[bufferLength * 7 / 8] / 255
        second = dataArray[bufferLength * 4 / 8] / 255
        first = dataArray[bufferLength * 1 / 8] / 255

        canvasContext.fillStyle = 'rgb(' + 255 * first + ',' + 255 * second + ',' + 255 * third + ')'
        canvasContext.fillRect(0, 0, canvas.width, canvas.height)

//      canvasContext.strokeStyle = 'rgb(255,255,255)';

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255 * second + ',' + 255 * first + ',' + 255 * third + ')'
        canvasContext.arc(canvas.width / 2, canvas.height / 2, second * canvas.height + 300, 0, 2 * Math.PI);
        canvasContext.fill();
//      canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255 * third + ',' + 255 * first + ',' + 255 * second + ')'
        canvasContext.arc(canvas.width / 2, canvas.height / 2, second * canvas.height + 200, 0, 2 * Math.PI);
        canvasContext.fill();
//      canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255 * second + ',' + 255 * third + ',' + 255 * first + ')'
        canvasContext.arc(canvas.width / 2, canvas.height / 2, second * canvas.height + 100, 0, 2 * Math.PI);
        canvasContext.fill();
//      canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255 * third + ',' + 255 * second + ',' + 255 * first + ')'
        canvasContext.arc(canvas.width / 2, canvas.height / 2, second * canvas.height, 0, 2 * Math.PI);
        canvasContext.fill();
//      canvasContext.stroke()
    }
}

function drawStandardVisual () {
    analyser.getByteFrequencyData(dataArray)

    canvasContext.fillStyle = 'rgba(0,0,0, .1)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    var barWidth = 1.2 * (canvas.width / bufferLength)
    var barHeight
    var x = 0

    for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * canvas.height / 255
        intensity = dataArray[i] / 200
        canvasContext.fillStyle = 'rgb(' + 255*intensity + ',' + 50 + ',' + 255*(1-intensity)
        canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth
    }
}

function drawBubbleVisual () {
    analyser.getByteFrequencyData(dataArray)

    canvasContext.fillStyle = 'rgb(0,0,0)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < bufferLength; i+= 100) {

        third = dataArray[bufferLength *  7/ 8] / 255
        second = dataArray[bufferLength * 4 / 8] / 255
        first = dataArray[bufferLength * 1 / 8] / 255

        canvasContext.fillStyle = 'rgb(' + 255* first + ',' + 255 * second + ',' + 255* third + ')'
        canvasContext.fillRect(0, 0, canvas.width, canvas.height)

//      canvasContext.strokeStyle = 'rgb(255,255,255)';

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255* second + ',' + 255 * first + ',' + 255* third + ')'
        canvasContext.arc(canvas.width * Math.random(),canvas.height * Math.random() ,first * canvas.height,0,2*Math.PI);
        canvasContext.fill();
//      canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255* third + ',' + 255 * first + ',' + 255* second + ')'
        canvasContext.arc(canvas.width * Math.random(),canvas.height * Math.random() ,third * canvas.height,0,2*Math.PI);
        canvasContext.fill();
//      canvasContext.stroke();
        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255* second + ',' + 255 * third + ',' + 255* first + ')'
        canvasContext.arc(canvas.width * Math.random(),canvas.height * Math.random() ,second * canvas.height,0,2*Math.PI);
        canvasContext.fill();
//      canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255* third + ',' + 255 * second + ',' + 255* first + ')'
        canvasContext.arc(canvas.width * Math.random(),canvas.height * Math.random(),second * canvas.height,0,2*Math.PI);
        canvasContext.fill();
//      canvasContext.stroke()
    }

}

function draw1 () {
    var r = dataArray[2] - 10
    var g = dataArray[4] - 20
    var b = dataArray[8] - 30
    var avg = (r+g+b)/3
    
    canvasContext.fillStyle = 'rgb(' + (255-r) + ',' + (255-g) + ',' + (255 - b) + ')'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    
    var radi0 = canvas.width * avg / 255 / 4
    var radi1 = radi0 / 2
    var radi2 = radi1/ 2
    
    canvasContext.fillStyle = 'rgb(' + (255-b) + ',' + r + ',' + (255-g) + ')'
    canvasContext.fillRect(canvas.width/2 - radi0, canvas.height/2 - radi0, radi0*2, radi0*2)
    
    canvasContext.fillStyle = 'rgb(' + r + ',' + (255 - b) + ',' + (255 - b) + ')'
    canvasContext.fillRect(canvas.width/2 - radi1, canvas.height/2 - radi1, radi1*2, radi1*2)
    
    canvasContext.fillStyle = 'rgb(' + (255-g) + ',' + (255-b) + ',' + (255-r) + ')'
    canvasContext.fillRect(canvas.width/2 - radi2, canvas.height/2 - radi2, radi2*2, radi2*2)
}

function draw2 () {
    // draw bg
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    for (var i = 0; i < bufferLength; i++) {       
        // draw circle
        canvasContext.beginPath()
        canvasContext.arc(canvas.width/2, canvas.height/2, Math.sqrt(canvas.width*canvas.width + canvas.height*canvas.height) * (1 - i / bufferLength) / 2, 0, 2 * Math.PI, false);

        canvasContext.fillStyle = 'rgba(' + (dataArray[i]) + ',' + (dataArray[bufferLength - i]) + ',' + (255 - dataArray[i]) + ',' + (1 - i/bufferLength) + ')'
        canvasContext.fill()
        canvasContext.closePath()  
    }
}

function drawWave(offset) {    

    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = 'rgba(255, 255, 255,' + 1 + ')';

    canvasContext.beginPath();

    var sliceWidth = canvas.width / bufferLength;
    var x = 0;
    
    
    for(var i = 0; i < bufferLength; i++) {

        var v = (dataArray[i] - 128.0) / 128;
        var y = v * 100 + canvas.height / 2;
        
        if(i === 0) {
            canvasContext.moveTo(x, y + offset);
        } else {
            canvasContext.lineTo(x, y + offset);
        }

        x += sliceWidth;
    }

    canvasContext.lineTo(canvas.width, canvas.height/2 + offset);
    canvasContext.stroke();
    canvasContext.closePath();
}

function drawSpiralWave() {
    third = dataArray[bufferLength * 7 / 8] / 255
    second = dataArray[bufferLength * 4 / 8] / 255
    first = dataArray[bufferLength * 1 / 8] / 255
    
    canvasContext.fillStyle = 'rgb(0, 0, 0)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    canvasContext.lineWidth = 10;
    canvasContext.strokeStyle = 'rgb(' + 255* first + ',' + 255 * second + ',' + 255* third + ')'

    canvasContext.beginPath();
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    canvasContext.moveTo(x, y);
    for (var i = bufferLength; i > 0; i--) {
        var width = dataArray[i] / 255 * canvas.height / 1.5
        switch(i % 4) {
            case 0:
                canvasContext.lineTo(width + x, width + y);
                break;
            case 1:
                canvasContext.lineTo(width + x, -width + y);
                break;
            case 2:
                canvasContext.lineTo(-width + x, -width + y);
                break;
            case 3:
                canvasContext.lineTo(-width + x, width + y);
                break;
        }
    }
    canvasContext.stroke();
}

function drawSprioGraph() {
    x = function (t, R, r, a) {
        return (R-r) * Math.cos(r * t / R) + a * Math.cos((1- (r/R)) * t)
    }
    
    y = function (t, R, r, a) {
        return (R-r) * Math.sin(r * t / R) + a * Math.sin((1- (r/R)) * t)
    }
    
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
            

    var offset = Math.random() * 256
    
    for (var i = 1; i < bufferLength; i++) {
        var step = .1
        var R = 5
        var r = 1.009
        var a = 2
        var scale = 50;
        var t = 0;
        
        canvasContext.beginPath()
        canvasContext.moveTo(
            canvas.width/2 + scale*x(t, R, r, a), 
            canvas.height/2 + scale*y(t, R, r, a)
        )
            
        for (t = step; t <= dataArray[i] / 16 * 5 * 2 * Math.PI + step; t += step) {
            canvasContext.lineTo(
                canvas.width/2 + scale*x(t, R, r, a), 
                canvas.height/2 + scale*y(t, R, r, a)
            )
        }
        canvasContext.lineWidth = 4
        
        var r = Math.floor( (dataArray[i] + offset ) % 256 )
        var g = Math.floor( (dataArray[bufferLength - i] + offset ) % 256 )
        var b = Math.floor( ((255 - dataArray[i]) + offset ) % 256 )
     
        canvasContext.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (1 - i/bufferLength) + ')'
        canvasContext.stroke()
    }
    
    canvasContext.closePath()
}


var circleArray;

function claire() {

    if (!circleArray) {
        circleArray = []
        for (var i = 0; i < bufferLength; i++) {
            var radius = dataArray[i];
            var myColor = getRandomColor();
            var x = Math.random() * (innerWidth - (radius * 2)) + radius;
            var y = Math.random() * (innerHeight - (radius * 2)) + radius;
            var dx = (Math.random() - 0.5);
            var dy = (Math.random() - 0.5);
            circleArray.push(new Circle(x, y, dx, dy, radius))
        }
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    var mouse= {
        x:undefined,
        y:undefined
    }

    window.addEventListener('mousemove',
        function(event){
            mouse.x = event.x;
            mouse.y = event.y;
        })

    function Circle(x, y, dx, dy, radius){
        this.x = x;
        this.y = y;
        this.dx0 = dx
        this.dy0 = dy
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;

        this.draw = function(){
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radius, 0,
                Math.PI*2, false);
            canvasContext.strokeStyle = myColor;
            canvasContext.stroke();

        }

        this.update = function(){
            var avg = (dataArray[0] + dataArray[bufferLength / 2] + dataArray[bufferLength - 5]) / 3;
            //change direction upon horizontal impact
            if(this.x + this.radius > innerWidth ||
                this.x - this.radius < 0){
                this.dx = -this.dx;
            }
            //change direction upon vertical impact
            if(this.y + this.radius > innerHeight ||
                this.y - this.radius < 0){
                this.dy = -this.dy;
            }
            this.x += this.dx * avg / 20;
            this.y += this.dy * avg / 20;
            this.radius = avg / 7;

            //interactivity
            if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
                if(this.radius < 40 && this.radius != 0){
                    this.radius += dataArray[bufferLength / 2] / 5;
                }
                
                if (this.dx != 0 && this.dy != 0) {
                    this.dx0 = this.dx
                    this.dy0 = this.dy
                    this.dx = 0
                    this.dy = 0
                }
            }else if(this.radius > 2) {
                this.radius -= 1;
                if (this.dx === 0 && this.dy === 0) {
                    this.dx = this.dx0
                    this.dy = this.dy0
                }
            }

            this.draw();
        }
    }



    function animate() {
        // requestAnimationFrame(animate);
        canvasContext.clearRect(0, 0, innerWidth, innerHeight);

        for(var i = 0; i < circleArray.length; i++){
            circleArray[i].update();
        }

    }

    animate();

}

// DRAWING OBJECTS
function Circle(posX, posY, radius, offset) {
    this.maxRad = radius
    this.x = posX
    this.y = posY
    this.offset = offset
    
    this.draw = function () {
        for (var i = 1; i < bufferLength; i*=2) {              
            // draw circle
            canvasContext.beginPath()
            canvasContext.arc(this.x, this.y, dataArray[i] / 255 * this.maxRad, 0, 2 * Math.PI, false);
            
            var r = Math.floor( (dataArray[i] + this.offset ) % 256 )
            var g = Math.floor( (dataArray[bufferLength - i] + this.offset ) % 256 )
            var b = Math.floor( ((255 - dataArray[i]) + this.offset ) % 256 )
            
            
            canvasContext.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (1 - i/bufferLength) + ')'
            canvasContext.fill()
            canvasContext.closePath()  
        }
    }
}

function Triangle(posX, posY, radius, offset) {
    this.maxRad = radius
    this.x = posX
    this.y = posY
    this.offset = offset
    this.p0 = []
    this.p1 = []
    this.p2 = []
    
    
    
    this.draw = function () {
        for (var i = 1; i < bufferLength; i *= 2) {
            
            var r = Math.floor( (255 - dataArray[i] + this.offset ) % 256 )
            var g = Math.floor( (255 - dataArray[bufferLength - i] + this.offset ) % 256 )
            var b = Math.floor( ((dataArray[i]) + this.offset ) % 256 )
            
            
            canvasContext.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (1 - i / bufferLength) + ')'
            canvasContext.lineWidth = 10 + 10 * dataArray[i] / 255 
            var multi = dataArray[i] / 255
            canvasContext.beginPath()
            canvasContext.moveTo(this.x + this.p0[0] * multi, this.y + this.p0[1] * multi)
            canvasContext.lineTo(this.x + this.p1[0] * multi, this.y + this.p1[1] * multi)
            canvasContext.lineTo(this.x + this.p2[0] * multi, this.y + this.p2[1] * multi)
            canvasContext.lineTo(this.x + this.p0[0] * multi, this.y + this.p0[1] * multi)
            canvasContext.lineTo(this.x + this.p1[0] * multi, this.y + this.p1[1] * multi)
            canvasContext.stroke()
            canvasContext.closePath()
        }
    }
    
    this.generate = function () {
        var theta = Math.PI * 2 * Math.random()
        
        this.p0 = this.rotate(theta, this.maxRad * 1, this.maxRad * 0)
        this.p1 = this.rotate(theta, this.maxRad * -1 / 2, this.maxRad * Math.sqrt(3) / 2)
        this.p2 = this.rotate(theta, this.maxRad * -1 / 2, this.maxRad * -Math.sqrt(3) / 2)
    }
    
    this.rotate = function (theta, xIn, yIn) {
        var r00 = Math.cos(theta)
        var r01 = -Math.sin(theta)
        var r10 = Math.sin(theta)
        var r11 = Math.cos(theta)

        var point = []

        point[0] = r00 * xIn + r01 * yIn
        point[1] = r10 * xIn + r11 * yIn
        
        return point
    }
}
