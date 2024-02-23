const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let points = []; // Массив опорных точек
let curveType = 'hermite'; // Тип кривой по умолчанию

// Функция для установки типа кривой
function setCurveType(type) {
    curveType = type;
}

// Функция для добавления опорной точки
function addPoint(x, y) {
    points.push({ x, y });
}

// Функция для отрисовки кривой
function drawCurve() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка опорных точек
    ctx.fillStyle = 'red';
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    // Отрисовка кривой
    ctx.strokeStyle = 'blue';
    ctx.beginPath();

    if (curveType === 'hermite') {
        // Построение кривой по форме Эрмита
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const t0 = i > 0 ? (p1.x - points[i - 1].x) / 2 : 0;
            const t1 = i < points.length - 2 ? (points[i + 2].x - p0.x) / 2 : 0;

            for (let t = 0; t <= 1; t += 0.01) {
                const h1 = 2 * Math.pow(t, 3) - 3 * Math.pow(t, 2) + 1;
                const h2 = -2 * Math.pow(t, 3) + 3 * Math.pow(t, 2);
                const h3 = Math.pow(t, 3) - 2 * Math.pow(t, 2) + t;
                const h4 = Math.pow(t, 3) - Math.pow(t, 2);

                const x = h1 * p0.x + h2 * p1.x + h3 * t0 + h4 * t1;
                const y = h1 * p0.y + h2 * p1.y + h3 * t0 + h4 * t1;

                if (t === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
    } else if (curveType === 'bezier') {
        // Построение кривой по форме Безье
        if (points.length >= 4 && (points.length - 1) % 3 === 0) {
            for (let i = 0; i < points.length - 1; i += 3) {
                const p0 = points[i];
                const p1 = points[i + 1];
                const p2 = points[i + 2];
                const p3 = points[i + 3];

                const iterations = 10000; // Количество итераций дискретизации

                for (let j = 0; j <= iterations; j++) {
                    const t = j / iterations;

                    const x =
                        Math.pow(1 - t, 3) * p0.x +
                        3 * Math.pow(1 - t, 2) * t * p1.x +
                        3 * (1 - t) * Math.pow(t, 2) * p2.x +
                        Math.pow(t, 3) * p3.x;
                    const y =
                        Math.pow(1 - t, 3) * p0.y +
                        3 * Math.pow(1 - t, 2) * t * p1.y +
                        3 * (1 - t) * Math.pow(t, 2) * p2.y +
                        Math.pow(t, 3) * p3.y;

                    if (j === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            }
        }
    } else if (curveType === 'bspline') {
        console.log(1);
        var xScale = d3.scaleLinear()
            .domain([0, d3.max(points, d => d.x)])
            .range([0, d3.max(points, d => d.x)]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(points, d => d.y)])
            .range([0, d3.max(points, d => d.y)]);

        // Создаем генератор сплайна
        var lineGenerator = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveNatural);

        lineGenerator.context(ctx)(points);

    }

    ctx.stroke();
    ctx.closePath();
}


function clearCanvas(){
    points = []
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// Обработчик события клика на холсте
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    addPoint(x, y);
    let svg = d3.select("#mySvg");

    svg.selectAll('*').remove();
    drawCurve();
});

// Обработчик события контекстного меню на холсте
canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    if (points.length > 0) {
        points.pop();
        drawCurve();
    }
});
