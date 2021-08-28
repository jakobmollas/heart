const fontWidth = 700;
const fontName = "Hind";

export function GeneratePoints(text, pixelsPerPoint, stageWidth, stageHeight) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = stageWidth;
    canvas.height = stageHeight;

    let fontSize = 10;

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // find a good size for the text based on canvas size
    while (true) {
        ctx.font = `${fontWidth} ${fontSize}px arial`;
        const m = ctx.measureText(text);
        const textWidth = m.width;
        const textHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;

        if (textWidth > (stageWidth * 0.8) ||
            textHeight > (stageHeight * 0.7))
            break;

        fontSize *= 1.1;
    }

    // write text - the resulting image will be used to calculate points
    ctx.fillText(text, stageWidth / 2, stageHeight / 2);

    return createPointsFromImage(ctx, pixelsPerPoint);
}

function createPointsFromImage(ctx, pixelsPerPoint) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;

    // sample image data and create points for pixels with data
    const points = [];
    for (let height = 0; height < ctx.canvas.height; height += pixelsPerPoint) {
        for (let width = 0; width < ctx.canvas.width; width += pixelsPerPoint) {
            const pixelAlpha = imageData[((width + (height * ctx.canvas.width)) * 4) - 1];

            if (pixelAlpha != 0)
                points.push({ x: width, y: height });
        }
    }

    return points;
}