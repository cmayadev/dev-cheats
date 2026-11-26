export function scaledHeight(width, originalWidth, originalHeight) {
  return Math.max(1, Math.round(width / originalWidth * originalHeight));
}

export function validDimensions(width, height) {
  return [width, height].every((value) =>
    Number.isInteger(value) && value > 0 && value <= 8192
  ) && width * height <= 16_000_000;
}

export async function encodeImage(image, width, height, type, quality) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  try {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable.");
    if (type === "image/jpeg") {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
    }
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
    if (!blob) throw new Error("The image could not be exported at this size.");
    if (blob.type !== type) throw new Error("This browser cannot export the selected format.");
    return blob;
  } finally {
    canvas.width = canvas.height = 0;
  }
}
