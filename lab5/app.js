// Получаем элемент canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Функция для заполнения замкнутой области с использованием алгоритма растровой развертки с AET и AEL
function scanlineFill(vertices, fillColor) {
    // Находим минимальное и максимальное значение по оси Y среди всех вершин
    let minY = Infinity;
    let maxY = -Infinity;
    for (const vertex of vertices) {
        if (vertex.y < minY) {
            minY = vertex.y;
        }
        if (vertex.y > maxY) {
            maxY = vertex.y;
        }
    }

    // Создаем пустые списки AET и AEL
    const AET = [];
    const AEL = [];

    // Проходимся по каждой строке от minY до maxY
    for (let y = minY; y <= maxY; y++) {
        // Добавляем ребра, пересекаемые текущей строкой, из AEL в AET
        for (let i = 0; i < AEL.length; i++) {
            if (AEL[i].yMax === y) {
                AET.push(AEL[i]);
                AEL.splice(i, 1);
                i--;
            }
        }

        // Сортируем AET по значению xMin каждого ребра
        AET.sort((a, b) => a.xMin - b.xMin);

        // Заполняем пиксели между парами ребер в AET
        for (let i = 0; i < AET.length; i += 2) {
            const xStart = Math.ceil(AET[i].xMin);
            const xEnd = Math.floor(AET[i + 1].xMin);

            for (let x = xStart; x <= xEnd; x++) {
                setPixelColor(x, y, fillColor);
            }
        }

        // Обновляем значение xMin каждого ребра в AET
        for (const edge of AET) {
            edge.xMin += edge.slopeInverse;
        }

        // Удаляем ребра из AET, у которых yMax равен текущей строке
        for (let i = 0; i < AET.length; i++) {
            if (AET[i].yMax === y) {
                AET.splice(i, 1);
                i--;
            }
        }

        // Добавляем ребра в AEL, у которых yMin равен текущей строке
        for (const vertex of vertices) {
            if (vertex.yMin === y) {
                const edge = {
                    yMax: vertex.yMax,
                    xMin: vertex.x,
                    slopeInverse: 1 / (vertex.yMax - vertex.yMin)
                };
                AEL.push(edge);
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Функция для установки цвета пикселя
function setPixelColor(x, y, color) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const index = (y * canvas.width + x) * 4;
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = 255; // Alpha-канал, полностью непрозрачный
    ctx.putImageData(imageData, 0, 0);
}

// Пример использования
const vertices = [
    { x: 50, y: 50, yMin: 50, yMax: 200 },
    { x: 150, y: 150, yMin: 150, yMax: 300 },
    { x: 250, y: 100, yMin: 100, yMax: 250 }
];

const fillColor = [255, 0, 0]; // Красный цвет

scanlineFill(vertices, fillColor);