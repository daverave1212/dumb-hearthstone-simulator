


// Network and Location

function submitForm(_url, _data, type, callback){
    if(type == null){
        type = 'get'
    }
    $.ajax({
        type : type,
        url : _url + '?' + objectToURLParameters(_data),
        data : {},
        success : function(response){
            callback(response);
        }
    });
}

function doPost(url, data, callback){
    submitForm(url, data, 'post', callback)
}

function doGet(url, data, callback){
    submitForm(url, data, 'get', callback)
}

function getURLParametersAsObject() {
    function paramsToObject(entries) {
      const result = {}
      for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
      }
      return result;
    }
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return paramsToObject(urlParams)
}
function objectToURLParameters(obj) {
    if(obj == null) return ''
    url = Object.keys(obj).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
    }).join('&')
    return url
}













// Other utilities

function imgToBase64(img, isRegexModifiying) {    // Not sure what the second param is
    const canvas = document.createElement('canvas')
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png; base64");
    if (isRegexModifiying == false)
        return dataURL
    else 
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function playSound(path){
    new Audio(path).play();
}












// Object and Array utilities

function getRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}
function randomOf(...args){
    return args[randomInt(0, args.length - 1)];
}
function randomizeArray(array_a){
    var iRandomize;
    for(iRandomize = 0; iRandomize < array_a.length; iRandomize++){
        var randomizeArrayIndex = randomInt(0, array_a.length - 1);
        var auxRandomize = array_a[iRandomize];
        array_a[iRandomize] = array_a[randomizeArrayIndex];
        array_a[randomizeArrayIndex] = auxRandomize;
    }
}












// Math
function roundUp(nr, by){
    return (nr - nr%by + by);
}
function roundUp25(nr){
    return (nr - nr%25 + 25);
}
function roundUp50(nr){
    return (nr - nr%50 + 50);
}
function roundDown25(nr){
    return (nr - nr%25);
}
function roundDown50(nr){
    return (nr - nr%50);
}
function round50(nr){
    var roundness = nr%50;
    var complement  = 50 - roundness;
    if(roundness <= complement){
        return nr - roundness;}
    else return nr + complement;
}
function distanceBetween(t1, t2) {
    return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y))
}
function angleBetween(t1, t2) {
    return Math.atan2(t2.y - t1.y, t2.x - t1.x) * 180 / Math.PI
}
function percentChance(chance){	/* Ex: percentChance(20) = 20% chance to return true; */
    var c = randomInt(1, 100);
    if(c <= chance) return true;
    return false;
}
function randomInt(low, high){
    return Math.floor(Math.random() * (high - low + 1) + low);
}









// Strings
function quotify(str){
    return "\"" + str + "\"";
}
function isUpperCase(str){
    if(str == str.toUpperCase()){
        return true;
    }
    return false;
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function isString(obj) {
    return typeof obj === 'string' || obj instanceof String
}











// DOM
function removeAllChildren(node){
    while (node.firstChild) {
        node.removeChild(node.firstChild);}
}
export const dom = function (str, clickListeners={}) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    const firstDiv = doc.body.firstChild;
    for (const listenerName of Object.keys(clickListeners)) {
        for (const elem of Array.from(firstDiv.querySelectorAll(listenerName))) {
            elem.addEventListener('click', () => {
                clickListeners[listenerName](firstDiv)
            })
        }
    }
	return firstDiv
}



let ctxSettings = {
    'default': {}
}
function saveCtxSettings(ctx, key) {
    let ctxSettingsObject
    if (key == null) {
        ctxSettingsObject = ctxSettings['default']
    } else {
        if (ctxSettings[key] == null) {
            ctxSettings[key] = {}
        }
        ctxSettingsObject = ctxSettings[key]
    }
    ctxSettingsObject.textAlign = ctx.textAlign
    ctxSettingsObject.font = ctx.font
    ctxSettingsObject.fillStyle = ctx.fillStyle
    ctxSettingsObject.globalAlpha = ctx.globalAlpha
}
function loadCtxSettings(ctx, key) {
    const ctxSettingsObject = key == null? ctxSettings['default'] : ctxSettings[key]
    for (const key of Object.keys(ctxSettingsObject)) {
        ctx[key] = ctxSettingsObject[key]
    }
}

/*
    globalCompositeOperation explained:
    'source-in': draw only on top of pixels that exist, and erase all else
    'source-out': draw only around the pixels that exist, and erase all else
    'source-atop': draw only ON the pixels that exist
*/

export function drawImageOnCanvasAsync({canvas, pathOrImage, x, y, width, height, alpha, crop}) {
    const ctx = canvas.getContext('2d')
    let image
    if (typeof pathOrImage === 'string' || pathOrImage instanceof String) {
        image = new Image()
        image.src = pathOrImage
    } else {
        image = pathOrImage
    }
    return new Promise((res, rej) => {
        image.onload = function() {
            ctx.save()
            if (alpha != null) {
                ctx.globalAlpha = alpha
            }
            if (width != null && height == null) {
                const aspectRatio = image.naturalHeight / image.naturalWidth
                height = aspectRatio * width
            } else if (width == null && height != null) {
                const aspectRatio = image.naturalWidth / image.naturalHeight
                width = aspectRatio * height
            }
            
            if (width != null && height != null) {
                if (crop != null) {
                    const { centerX, centerY, width, height, type } = crop
                    ctx.fillStyle = 'blue'
                    ctx.beginPath()
                    if (type == 'circle') {
                        ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, Math.PI * 2)
                    }
                    ctx.closePath()
                    ctx.fill()
                    ctx.globalCompositeOperation = 'source-in'
                }
                ctx.drawImage(image, x, y, width, height)
            } else {
                ctx.drawImage(image, x, y)
            }
            ctx.restore()
            res()
        }
    })
}
function fillCanvasColor(canvas, color) {
    const ctx = canvas.getContext('2d')
    saveCtxSettings(ctx)
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    loadCtxSettings(ctx)
}
function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.reset()
}
function clearRect(canvas, x, y, width, height) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(x, y, width, height)
}
export const FONT_EXAMPLE = '19px arial black'
export function drawText({canvas, font, x, y, text, textAlign='center', color, strokeColor, strokeSize, rotation}) {
    const ctx = canvas.getContext('2d')
    ctx.save()
    if (color != null) {
        ctx.fillStyle = color
    }
    ctx.textAlign = textAlign
    ctx.font = font
    if (strokeColor != null) {
        ctx.strokeStyle = strokeColor
    }
    if (strokeSize != null) {
        ctx.lineWidth = strokeSize
    }
    if (rotation != null) {
        ctx.rotate(Math.PI / 180 * rotation)
    }
    if (strokeSize != null || strokeColor != null) {
        ctx.miterLimit = strokeSize / 4         // Prevents a known glitch; remove it to see what happens without it
        ctx.strokeText(text, x, y);
    }
    ctx.fillText(text, x, y)
    ctx.restore()
}

export function drawTextLines({canvas, font, x, y, width, text, lineHeight, textAlign='center', color, isCenteredY=true}) {
    const ctx = canvas.getContext('2d')
    saveCtxSettings(ctx, 'drawTextLines')
    ctx.font = font
    const lines = getLines(ctx, text, width)
    const totalHeight = lines.length * lineHeight
    const startY = isCenteredY ? y - totalHeight / 2 : y
    for (let i = 0; i < lines.length; i++) {
        const textLine = lines[i]
        const thisY = startY + i * lineHeight
        drawText({canvas, font, x, y: thisY, text: textLine, textAlign, color})
    }
    loadCtxSettings(ctx, 'drawTextLines')
    return lines
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function getOnlyKey(obj) {
    return Object.keys(obj)[0]
}
function getTextWidth(font, text) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = font
    const width = ctx.measureText(text).width
    return width
    
}



export const DRAW_CURVED_TEXT_BEZIER_EXAMPLE = {
    maxChar: 50,
    startX: 99.2,
    startY: 177.2,
    control1X: 130.02,
    control1Y: 60.0,
    control2X: 300.5,
    control2Y: 276.2,
    endX: 300.7,
    endY: 176.2
}

export function drawCurvedTextBezier(canvas, options) {
    const { text, font, color, strokeColor, strokeSize, isDebug, rotationModifier } = options
    const TEXT = text

    const ctx = canvas.getContext('2d');

    let xDist = 0

    start({maxChar: 50, ...options})

    function drawBezierCurveLine(ctx, options) {
        ctx.save();
        ctx.beginPath();

        ctx.moveTo(options.startX, options.startY);
        ctx.bezierCurveTo(options.control1X, options.control1Y,
            options.control2X, options.control2Y,
            options.endX, options.endY);

        ctx.stroke();
        ctx.restore();
    }

    function start(options) {
        ctx.font = font

        if (isDebug == true) {
            drawBezierCurveLine(ctx, options)
        }

        const text = TEXT

        var textCurve = [];
        var ribbon = text.substring(0, options.maxChar);
        var curveSample = 1000;


        xDist = 0;
        for (let i = 0; i < curveSample; i++) {
            const a = new bezier2(i / curveSample, options.startX, options.startY, options.control1X, options.control1Y, options.control2X, options.control2Y, options.endX, options.endY);
            const b = new bezier2((i + 1) / curveSample, options.startX, options.startY, options.control1X, options.control1Y, options.control2X, options.control2Y, options.endX, options.endY);
            const c = new bezier(a, b);
            textCurve.push({
                bezier: a,
                curve: c.curve
            });
        }

        const letterPadding = ctx.measureText(" ").width / 4;
        const textWidth = Math.round(ctx.measureText(ribbon).width);
        const totalPadding = (ribbon.length - 1) * letterPadding;
        const totalLength = textWidth + totalPadding;
        const cDist = textCurve[curveSample - 1].curve.cDist;
        
        let p = 0;

        const z = (cDist / 2) - (totalLength / 2);

        for (let i = 0; i < curveSample; i++) {
            if (textCurve[i].curve.cDist >= z) {
                p = i;
                break;
            }
        }

        for (let i = 0; i < ribbon.length; i++) {
            ctx.save();
            ctx.translate(textCurve[p].bezier.point.x, textCurve[p].bezier.point.y);
            let letterRotation = textCurve[p].curve.rad
            if (rotationModifier != null) {
                letterRotation = rotationModifier(letterRotation)
            }
            if (letterRotation != 0) {
                ctx.rotate(letterRotation);
            }
            drawText({
                canvas,
                font: font,
                x: 0,
                y: 0,
                text: ribbon[i],
                textAlign: "left",
                color,
                strokeColor,
                strokeSize
                
            })
            ctx.restore();

            const x1 = ctx.measureText(ribbon[i]).width + letterPadding;
            let x2 = 0;
            for (let j = p; j < curveSample; j++) {
                x2 = x2 + textCurve[j].curve.dist;
                if (x2 >= x1) {
                    p = j;
                    break;
                }
            }




        }
    }


    function bezier(b1, b2) {
        //Final stage which takes p, p+1 and calculates the rotation, distance on the path and accumulates the total distance
        this.rad = Math.atan(b1.point.mY / b1.point.mX);
        this.b2 = b2;
        this.b1 = b1;
        const dx = (b2.x - b1.x);
        const dx2 = (b2.x - b1.x) * (b2.x - b1.x);
        this.dist = Math.sqrt(((b2.x - b1.x) * (b2.x - b1.x)) + ((b2.y - b1.y) * (b2.y - b1.y)));
        xDist = xDist + this.dist;
        this.curve = {
            rad: this.rad,
            dist: this.dist,
            cDist: xDist
        };
    }

    function bezierT(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY) {
        //calculates the tangent line to a point in the curve; later used to calculate the degrees of rotation at this point.
        this.mx = (3 * (1 - t) * (1 - t) * (control1X - startX)) + ((6 * (1 - t) * t) * (control2X - control1X)) + (3 * t * t * (endX - control2X));
        this.my = (3 * (1 - t) * (1 - t) * (control1Y - startY)) + ((6 * (1 - t) * t) * (control2Y - control1Y)) + (3 * t * t * (endY - control2Y));
    }

    function bezier2(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY) {
        //Quadratic bezier curve plotter
        this.Bezier1 = new bezier1(t, startX, startY, control1X, control1Y, control2X, control2Y);
        this.Bezier2 = new bezier1(t, control1X, control1Y, control2X, control2Y, endX, endY);
        this.x = ((1 - t) * this.Bezier1.x) + (t * this.Bezier2.x);
        this.y = ((1 - t) * this.Bezier1.y) + (t * this.Bezier2.y);
        this.slope = new bezierT(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY);

        this.point = {
            t: t,
            x: this.x,
            y: this.y,
            mX: this.slope.mx,
            mY: this.slope.my
        };
    }

    function bezier1(t, startX, startY, control1X, control1Y, control2X, control2Y) {
        //linear bezier curve plotter; used recursivly in the quadratic bezier curve calculation
        this.x = ((1 - t) * (1 - t) * startX) + (2 * (1 - t) * t * control1X) + (t * t * control2X);
        this.y = ((1 - t) * (1 - t) * startY) + (2 * (1 - t) * t * control1Y) + (t * t * control2Y);

    }
}

export function getRelativePercent(forThis, baseValue) {
    return forThis / baseValue
}

export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function sleep(fn, ...args) {
    await timeout(3000);
    return fn(...args);
}

export async function waitForConditionAsync(cond) {
    while (cond() != true) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

export const expoOut = x => x * x
export const expoIn = x => 1 - Math.pow(1 - x, 2)

export function lerp(from, to, value, easeFunc) {
    const totalDistance = to - from
    const valueWithoutOffset = value - from
    const valuePercent = valueWithoutOffset / totalDistance
    const y = easeFunc(valuePercent)
    const realY = totalDistance * y
    return from + realY
}
export function lerpPercent(from, to, valuePercent, easeFunc) {
    const totalDistance = to - from
    const y = easeFunc(valuePercent)
    const realY = totalDistance * y
    return from + realY
}
window.lerp = lerp

export function radiansToDegrees(rad) {
    return rad * 180 / Math.PI
}
window.lerpPercent = lerpPercent