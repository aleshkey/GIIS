const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let centerX, centerY;
let isDrawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(event) {
    isDrawing = true;
    centerX = event.clientX - canvas.offsetLeft;
    centerY = event.clientY - canvas.offsetTop;
}

function draw(event) {
    if (!isDrawing) return;
    const curveType = document.getElementById('curveType').value;
    const a = Math.abs(event.clientX - canvas.offsetLeft - centerX);
    const b = Math.abs(event.clientY - canvas.offsetTop - centerY);
    const step = 1 / Math.max(a, b); // шаг изменения угла

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    for (let angle = 0; angle < 2 * Math.PI; angle += step) {
        let x, y;

        // Вычисляем координаты в зависимости от типа кривой
        switch (curveType) {
            case 'circle':
                x = centerX + a * Math.cos(angle);
                y = centerY + a * Math.sin(angle);
                break;
            case 'ellipse':
                x = centerX + a * Math.cos(angle);
                y = centerY + b * Math.sin(angle);
                break;
            case 'hyperbola':
                x = centerX + a / Math.cos(angle);
                y = centerY + b * Math.tan(angle);
                break;
            case 'parabola':
                x = centerX + a * angle;
                y = centerY + b * Math.pow(angle, 2);
                break;
        }

        ctx.fillRect(x, y, 1, 1); // рисуем пиксель
    }

    ctx.closePath();
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}