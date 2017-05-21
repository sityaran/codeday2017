var source
var audioContext = new (window.AudioContext || window.webkitAudioContext)()
var analyser = audioContext.createAnalyser()
analyser.fftSize = 32
var dataArray = new Uint8Array(analyser.fftSize)
var bufferLength = analyser.frequencyBinCount

var canvas
var canvasContext

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
}

function setup() {
    console.log("hi")
    canvas = document.getElementById('canvas0')
    canvas.focus()
    canvasContext = canvas.getContext('2d')
    
    setInterval(update, 10)
}

function update() {
    analyser.getByteFrequencyData(dataArray)
    //drawColorCircles()
    //drawStandardVisual()
    //drawBubbleVisual()
    draw2()
    //draw1()
}

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

    canvasContext.fillStyle = 'rgb(0,0,0)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    var barWidth = (canvas.width / bufferLength)
    var barHeight
    var x = 0

    for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * canvas.height / 100
        intensity = dataArray[i] / 100
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
    var r = Math.min(dataArray[2], 200)
    var g = Math.min(dataArray[4], 190)
    var b = Math.min(dataArray[8], 180)
    var avg = (r+g+b)/3
    
    canvasContext.fillStyle = 'rgb(' + (255-r) + ',' + (255-g) + ',' + (255 - b) + ')'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    
    canvasContext.beginPath()
    canvasContext.arc(canvas.width/2, canvas.height/2, canvas.width * avg / 2 / 250, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = 'rgb(' + (255-b) + ',' + r + ',' + (255-g) + ')'
    canvasContext.fill()
    canvasContext.closePath()
    
    canvasContext.beginPath()
    canvasContext.arc(canvas.width/2, canvas.height/2, canvas.width * avg / 4 / 250, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = 'rgb(' + r + ',' + (255 - b) + ',' + (255-g) + ')'
    canvasContext.fill()
    canvasContext.closePath()
    
    canvasContext.beginPath()
    canvasContext.arc(canvas.width/2, canvas.height/2, canvas.width * avg / 8 / 250, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = 'rgb(' + (255-g) + ',' + (255-b) + ',' + (255-r) + ')'
    canvasContext.fill()
    canvasContext.closePath()  
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
