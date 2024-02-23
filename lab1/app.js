// Создаем HTML элементы для редактора
const canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

let mode = 'cda'

// Функция для рисования отрезка между двумя точками

function drawLine(startX, startY, endX, endY) {
    if (mode === 'cda'){
        const dx = endX - startX;
        const dy = endY - startY;

        const steps = Math.max(Math.abs(dx), Math.abs(dy));

        const xIncrement = dx / steps;
        const yIncrement = dy / steps;

        let currentX = startX;
        let currentY = startY;

        for (let i = 0; i <= steps; i++) {
            console.log(Math.round(currentX) + ' | ' + Math.round(currentY))
            ctx.fillRect(Math.round(currentX), Math.round(currentY), 1, 1);
            currentX += xIncrement;
            currentY += yIncrement;
        }
        return;
    }
    if (mode === 'bresenham'){
        const dx = Math.abs(endX - startX);
        const dy = Math.abs(endY - startY);
        const sx = startX < endX ? 1 : -1;
        const sy = startY < endY ? 1 : -1;
        let err = dx - dy;

        while (startX !== endX || startY !== endY) {
            ctx.fillRect(startX, startY, 1, 1);

            const err2 = err * 2;

            if (err2 > -dy) {
                err -= dy;
                startX += sx;
            }

            if (err2 < dx) {
                err += dx;
                startY += sy;
            }
        }

        // Рисуем последнюю точку (x2, y2)
        ctx.fillRect(endX, endY, 1, 1);
        return;
    }
    if (mode === 'wu'){
        let y2 = endY;
        let y1 = startY;
        let x1 = startX;
        let x2 =endX;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const gradient = dy / dx;

        let x = x1;
        let y = y1;

        // Рисуем первую конечную точку
        ctx.fillRect(x, y, 1, 1);

        if (Math.abs(gradient) <= 1) {
            const yEnd = y2 < y1 ? y1 - 1 : y1 + 1;

            let intery = y + gradient;

            for (let x = x1 + 1; x <= x2 - 1; x++) {
                ctx.fillRect(x, Math.floor(intery), 1, 1);
                ctx.fillRect(x, Math.floor(intery) + 1, 1, 1);

                intery += gradient;
            }

            // Рисуем вторую конечную точку
            ctx.fillRect(x2, yEnd, 1, 1);
        } else {
            const xEnd = x2 < x1 ? x1 - 1 : x1 + 1;

            let interx = x + (1 / gradient);

            for (let y = y1 + 1; y <= y2 - 1; y++) {
                ctx.fillRect(Math.floor(interx), y, 1, 1);
                ctx.fillRect(Math.floor(interx) + 1, y, 1, 1);

                interx += (1 / gradient);
            }

            // Рисуем вторую конечную точку
            ctx.fillRect(xEnd, y2, 1, 1);
        }
    }

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

let startX = 0;
let startY = 0;
let lines = []

// Обработчики событий для рисования отрезков
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const [currentX, currentY] = [e.offsetX, e.offsetY];
        redrawLines()
        drawLine(startX, startY, currentX, currentY);

    }
});
function redrawLines(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let line of lines){
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    }
}

canvas.addEventListener('mouseup', (e) => {
    drawLine(startX, startY, e.offsetX, e.offsetY);
    let line = new Line();
    line.x1 = startX;
    line.y1 = startY;
    line.x2 = e.offsetX;
    line.y2 = e.offsetY;
    lines.push(line);
    isDrawing = false;
});

function clearCanvas(){
    lines = []
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setAlgorithm(alg){
    mode = alg;
}

class Line{
    constructor() {
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
    }
}
