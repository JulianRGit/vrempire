import React, { useState, useEffect, useRef } from "react";

const PixelImage = ({ pixelsTotal, setTotalPixels }) => {  // Ajout de setTotalPixels
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [pixelOrder, setPixelOrder] = useState([]); // Ordre aléatoire des pixels
  const pixelSize = 1; // Taille des pixels

  // Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Charger l'image et extraire les données des pixels
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const image = new Image();
    image.src = process.env.PUBLIC_URL + "/img/arbre.jpg"; // Chemin vers l'image locale
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      // Calculer et transmettre le nombre total de pixels à App
      const totalPixels = image.width * image.height;
      setTotalPixels(totalPixels); // Passer cette information au composant parent (App)

      context.drawImage(image, 0, 0);
      const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height); // Effacer l'image du canvas
      setImageData(imgData);

      // Créer une liste de tous les pixels (index)
      const pixels = Array.from(Array(totalPixels).keys()); // Tableau [0, 1, 2, ..., totalPixels-1]
      shuffleArray(pixels); // Mélanger le tableau des pixels
      setPixelOrder(pixels); // Stocker l'ordre aléatoire
      setImageLoaded(true);
    };
  }, [setTotalPixels]);

  // Afficher les pixels basés sur pixelsTotal
  useEffect(() => {
    if (!imageLoaded || !imageData || pixelsTotal === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { width, height } = canvas;

    // Dessiner les pixels en fonction de pixelsTotal
    for (let i = 0; i < pixelsTotal && i < pixelOrder.length; i++) {
      const randomPixelIndex = pixelOrder[i]; // Récupérer l'index du pixel aléatoire
      const x = randomPixelIndex % width; // Calculer la position X
      const y = Math.floor(randomPixelIndex / width); // Calculer la position Y

      // Calculer la position du pixel dans les données
      const pixelPos = (y * width + x) * 4;
      const r = imageData.data[pixelPos];
      const g = imageData.data[pixelPos + 1];
      const b = imageData.data[pixelPos + 2];
      const a = imageData.data[pixelPos + 3] / 255;

      // Dessiner le pixel
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      context.fillRect(x, y, pixelSize, pixelSize);
    }
  }, [imageLoaded, imageData, pixelOrder, pixelsTotal]);

  return <canvas ref={canvasRef}></canvas>;
};

export default PixelImage;
