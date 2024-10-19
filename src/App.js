import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import SmallButton from "./composant/smallButton";
import LargeButton from "./composant/largeButton";
import BigTitle from "./composant/bigTitle";
import TextVar from "./composant/textVar";
import PixelImage from "./composant/pixelImage";  // Importer PixelImage

function App() {
  const basicUpgrade = [
    { name: "Unlock Energetic Pixels", price: 10000, pixelToDeblock: 50, unlocked: 0 },
    { name: "Unlock Ampli Pixels", price: 20000, pixelToDeblock: 400, unlocked: 0 },
    { name: "Unlock Decomp Pixels", price: 40000, pixelToDeblock: 1500, unlocked: 0 },
    { name: "Unlock auto buyer", price: 75000, pixelToDeblock: 1000, unlocked: 0 },
    { name: "Upgrade pixel production", price: 75000, pixelToDeblock: 10000, unlocked: 0 },
  ];
  const public_url = process.env.PUBLIC_URL
  // Charger les valeurs initiales depuis localStorage ou utiliser les valeurs par défaut
  const [cycles, setCycles] = useState(() => Number(localStorage.getItem("cycles")) || 125000);
  const [pixels, setPixels] = useState(() => Number(localStorage.getItem("pixels")) || 125000);
  const [pixelsEnergetic, setPixelsEnergetic] = useState(() => Number(localStorage.getItem("pixelsEnergetic")) || 0);
  const [pixelsAmpli, setPixelsAmpli] = useState(() => Number(localStorage.getItem("pixelsAmpli")) || 0);
  const [pixelsDecomp, setPixelsDecomp] = useState(() => Number(localStorage.getItem("pixelsDecomp")) || 0);
  const [pixelsTotal, setPixelsTotal] = useState(() => Number(localStorage.getItem("pixelsTotal")) || 125000);
  const [deadPixels, setDeadPixels] = useState(() => Number(localStorage.getItem("deadPixels")) || 0);
  const [pixelPositions, setPixelPositions] = useState(() => JSON.parse(localStorage.getItem("pixelPositions")) || []);
  const [pixelCycles, setPixelCycles] = useState(() => JSON.parse(localStorage.getItem("pixelCycles")) || {});
  const [autoBuyers, setAutoBuyers] = useState(() => Number(localStorage.getItem("autoBuyers")) || 0);
  const [typeAutoBuyers, setTypeAutoBuyers] = useState(() => String(localStorage.getItem("typeAutoBuyers")) || "basic");

  const [upgrades, setUpgrades] = useState(JSON.parse(localStorage.getItem("upgrades")) || basicUpgrade);

  const [totalPixels, setTotalPixels] = useState(1); // Nombre total de pixels

  // Utiliser useRef pour stocker des valeurs persistantes sans forcer un re-render
  const pixelPositionsRef = useRef(pixelPositions);
  const pixelCyclesRef = useRef(pixelCycles);
  const pixelsTotalRef = useRef(pixelsTotal);
  const autoBuyersRef = useRef(autoBuyers);
  const cyclesRef = useRef(cycles);

  // Ajout de l'état pour suivre les cycles ajoutés par seconde
  const [cyclesPerSecond, setCyclesPerSecond] = useState(0);

  // Prix initiaux
  const [pixelPrice, setPixelPrice] = useState(() => Number(localStorage.getItem("pixelPrice")) || 10);
  const [pixelEnergeticPrice, setPixelEnergeticPrice] = useState(() => Number(localStorage.getItem("pixelEnergeticPrice")) || 20);
  const [pixelAmpliPrice, setPixelAmpliPrice] = useState(() => Number(localStorage.getItem("pixelAmpliPrice")) || 30);
  const [pixelDecompPrice, setPixelDecompPrice] = useState(() => Number(localStorage.getItem("pixelDecompPrice")) || 40);

  useEffect(() => {
    pixelPositionsRef.current = pixelPositions;
    pixelCyclesRef.current = pixelCycles;
    pixelsTotalRef.current = pixelsTotal;
    autoBuyersRef.current = autoBuyers;
    cyclesRef.current = cycles;

  }, [pixelPositions, pixelCycles, pixelsTotal, upgrades, autoBuyers, cycles]);

  useEffect(() => {
    if (pixelsTotal > 50) {
      upgrades.forEach((upgrade, index) => {
        if (pixelsTotal > upgrade.pixelToDeblock && upgrade.unlocked == 0) {
          deblockUpgrade(index);
        }
      })
    }
  }, [pixelsTotal])

  // Sauvegarder les données dans localStorage à chaque mise à jour des états
  useEffect(() => {
    localStorage.setItem("cycles", cycles);
    localStorage.setItem("pixels", pixels);
    localStorage.setItem("pixelsEnergetic", pixelsEnergetic);
    localStorage.setItem("pixelsAmpli", pixelsAmpli);
    localStorage.setItem("pixelsDecomp", pixelsDecomp);
    localStorage.setItem("pixelsTotal", pixelsTotal);
    localStorage.setItem("deadPixels", deadPixels);
    localStorage.setItem("pixelPrice", pixelPrice);
    localStorage.setItem("pixelEnergeticPrice", pixelEnergeticPrice);
    localStorage.setItem("pixelAmpliPrice", pixelAmpliPrice);
    localStorage.setItem("pixelDecompPrice", pixelDecompPrice);
    localStorage.setItem("pixelPositions", JSON.stringify(pixelPositions));
    localStorage.setItem("pixelCycles", JSON.stringify(pixelCycles));
    localStorage.setItem("upgrades", JSON.stringify(upgrades));
    localStorage.setItem("autoBuyers", autoBuyers);
    localStorage.setItem("typeAutoBuyers", typeAutoBuyers);
  }, [
    cycles,
    pixels,
    pixelsEnergetic,
    pixelsAmpli,
    pixelsDecomp,
    pixelsTotal,
    deadPixels,
    pixelPrice,
    pixelEnergeticPrice,
    pixelAmpliPrice,
    pixelDecompPrice,
    pixelPositions,
    pixelCycles,
    upgrades,
    autoBuyers,
    typeAutoBuyers,
  ]);

  const addCycle = () => {
    setCycles((prevCycles) => prevCycles + 1);
    setCyclesPerSecond(cyclesPerSecond + 1);
  };

  // Générer un pixel avec des coordonnées aléatoires
  const generatePixelPosition = () => {
    return {
      left: Math.random() * 800,  // Génère une position aléatoire en pixels
      top: Math.random() * 800,
    };
  };

  // Fonction pour réinitialiser toutes les valeurs
  const resetGame = () => {
    setCycles(0);
    setPixels(0);
    setPixelsEnergetic(0);
    setPixelsAmpli(0);
    setPixelsDecomp(0);
    setPixelsTotal(0);
    setDeadPixels(0);
    setPixelPrice(10);
    setPixelEnergeticPrice(20);
    setPixelAmpliPrice(30);
    setPixelDecompPrice(40);
    setPixelPositions([]);
    setPixelCycles({});
    setUpgrades(basicUpgrade);
    setCyclesPerSecond(0);
    setAutoBuyers(0);
    setTypeAutoBuyers("basic");

    localStorage.clear();
    console.log("Reset effectué !");
  };

  const mapPercentage = Math.min((pixelsTotal / totalPixels) * 100, 100).toFixed(2);

  const buyPixel = (type) => {
    let addPixel = false;
    let newPosition = generatePixelPosition();
    console.log("test pixel " + type)

    if (type === "basic" && cyclesRef.current >= Math.floor(pixelPrice)) {
      console.log("buy buy")
      setPixels((prevPixels) => prevPixels + 1);
      setCycles((prevCycles) => prevCycles - Math.floor(pixelPrice));
      setPixelPrice((prevPrice) => prevPrice * 1.01);
      addPixel = true;
    } else if (type === "energetic" && upgrades[0].unlocked == 2 && cyclesRef.current >= Math.floor(pixelEnergeticPrice)) {
      setPixelsEnergetic((prevPixelsEnergetic) => prevPixelsEnergetic + 1);
      setCycles((prevCycles) => prevCycles - Math.floor(pixelEnergeticPrice));
      setPixelEnergeticPrice((prevPrice) => prevPrice * 1.02);
      addPixel = true;
    } else if (type === "ampli" && upgrades[1].unlocked == 2 && cyclesRef.current >= Math.floor(pixelAmpliPrice)) {
      setPixelsAmpli((prevPixelsAmpli) => prevPixelsAmpli + 1);
      setCycles((prevCycles) => prevCycles - Math.floor(pixelAmpliPrice));
      setPixelAmpliPrice((prevPrice) => prevPrice * 1.03);
      addPixel = true;
    } else if (type === "decomp" && upgrades[2].unlocked == 2 && cyclesRef.current >= Math.floor(pixelDecompPrice)) {
      setPixelsDecomp((prevPixelsDecomp) => prevPixelsDecomp + 1);
      setCycles((prevCycles) => prevCycles - Math.floor(pixelDecompPrice));
      setPixelDecompPrice((prevPrice) => prevPrice * 1.05);
      addPixel = true;
    }

    if (addPixel) {
      console.log("adazdazda pixel");
      // Ajouter un nouveau pixel avec sa position et l'initialiser à 0 cycles générés
      setPixelPositions((prevPositions) => [...prevPositions, { type, ...newPosition }]);
      setPixelCycles((prevPixelCycles) => ({ ...prevPixelCycles, [`${newPosition.left}-${newPosition.top}`]: 0 }));
      setPixelsTotal((prevPixelsTotal) => prevPixelsTotal + 1);
    }
  };

  const buyUpgrade = (index) => {
    if (cycles >= upgrades[index].price && upgrades[index].unlocked == 1) {
      setCycles((prevCycles) => prevCycles - upgrades[index].price);
      setUpgrades((prevUpgrades) =>
        prevUpgrades.map((upgrade, i) =>
          i === index ? { ...upgrade, unlocked: 2 } : upgrade
        )
      );
    }
  };

  const deblockUpgrade = (index) => {
    if (upgrades[index].unlocked == 0) {
      setUpgrades((prevUpgrades) =>
        prevUpgrades.map((upgrade, i) =>
          i === index ? { ...upgrade, unlocked: 1 } : upgrade
        )
      );
    }
  };

  // Calculer la distance entre deux pixels
  const calculateDistance = (pixel1, pixel2) => {
    const dx = pixel1.left - pixel2.left;
    const dy = pixel1.top - pixel2.top;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Fonction pour gérer la surchauffe d'un pixel
  const checkOverheat = (pixel) => {
    if (pixel.type == "decomp") {
      return false
    }
    const key = `${pixel.left}-${pixel.top}`;
    const cyclesForPixel = pixelCyclesRef.current[key] || 0;

    // Augmenter la chance de surchauffe en fonction des cycles générés
    const overheatChance = Math.min(cyclesForPixel / 10000, 0.001); // Chance maximum de 10%
    if (Math.random() < overheatChance) {
      // Si le pixel surchauffe, il est retiré
      setDeadPixels((prev) => prev + 1);
      setPixelPositions((prevPositions) =>
        prevPositions.filter((p) => p.left !== pixel.left || p.top !== pixel.top)
      );
      switch (pixel.type) {
        case "basic":
          setPixels((prev) => Math.max(0, prev - 1)); // Ne jamais aller en négatif
          break;
        case "energetic":
          setPixelsEnergetic((prev) => Math.max(0, prev - 1)); // Ne jamais aller en négatif
          break;
        case "ampli":
          setPixelsAmpli((prev) => Math.max(0, prev - 1)); // Ne jamais aller en négatif
          break;
        default:
          break;
      }
      setPixelsTotal((prevTotal) => prevTotal - 1);  // Retirer du total de pixels
      return true;
    }
    return false;
  };

  const calculateCycles = () => {
    let totalCycles = 0;
    const newPixelCycles = { ...pixelCyclesRef.current }; // Copier les cycles des pixels

    pixelPositionsRef.current.forEach((pixel) => {
      let cyclesForPixel = 1;

      // Si le pixel est de type "energetic", il ajoute un bonus aléatoire
      if (pixel.type === "energetic") {
        cyclesForPixel += Math.floor(Math.random() * 5);
      }

      // Si le pixel est de type "ampli", il multiplie les pixels à proximité
      if (pixel.type === "ampli") {
        pixelPositionsRef.current.forEach((otherPixel) => {
          if (pixel !== otherPixel && calculateDistance(pixel, otherPixel) <= 100) {
            cyclesForPixel *= 1.1;  // Multiplie les cycles générés par les pixels voisins
          }
        });
      }

      const key = `${pixel.left}-${pixel.top}`;
      newPixelCycles[key] = (newPixelCycles[key] || 0) + Math.floor(cyclesForPixel);  // Mettre à jour le suivi des cycles pour ce pixel

      // Vérifier si le pixel surchauffe
      if (!checkOverheat(pixel)) {
        totalCycles += Math.floor(cyclesForPixel); // Ajouter les cycles de ce pixel au total s'il ne surchauffe pas
      }
    });
    let multiplicator = typeof upgrades[4] !== 'undefined' && upgrades[4].unlocked == 2 ? 1 + Math.random() : 1;
    setCycles((prevCycles) => prevCycles + Math.floor(totalCycles * multiplicator));
    setPixelCycles(Math.floor(newPixelCycles * multiplicator));  // Mettre à jour les cycles des pixels
    setCyclesPerSecond(Math.floor(totalCycles * multiplicator)); // Mettre à jour les cycles par seconde
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pixelsTotalRef.current > 0) {
        calculateCycles(); // Calculer les cycles à chaque intervalle
      }
      if (autoBuyersRef.current > 0) {
        for (let index = 0; index < autoBuyersRef.current; index++) {
          buyPixel(typeAutoBuyers);
          console.log("buy poixel  " + typeAutoBuyers)
        }
      }
    }, 1000);

    return () => clearInterval(interval); // Nettoyer l'intervalle à la fin
  }, []); // On n'a plus besoin de surveiller pixelsTotal ici

  const buyAutoBuyer = () => {
    if (cycles >= 50000) {
      setAutoBuyers((prevAutoBuyers) => prevAutoBuyers + 1);
      setCycles((prevCycles) => prevCycles - 50000)
    }
  }

  const sellAutoBuyer = () => {
    if (autoBuyersRef.current >= 1) {
      setAutoBuyers((prevAutoBuyers) => prevAutoBuyers - 1);
      setCycles((prevCycles) => prevCycles + 25000)
    }
  }
  

  return (
    <div className="container">
      <div className="sidebar cycles">
        <BigTitle text={"Cycles"} />
        <div className="flex justify-between align-center">
          <TextVar text={`Total: ${cycles}`} type={"h3"} />
          <div className="bubble-cycles-per-second">
            +{cyclesPerSecond}/sec
          </div>
          <SmallButton func={addCycle} text={"+"} />
        </div>
      </div>

      <div className="main">
        <div className="zonePixel">
          <PixelImage pixelsTotal={pixelsTotal} pixelPositions={pixelPositions} setTotalPixels={setTotalPixels} />
          <TextVar text={`Map percentage: ${mapPercentage}%`} type={"h3"} />
        </div>
        <div className="bottomBar">
          <div className=" flex justify-between">
            {(typeof upgrades[5] !== 'undefined' && upgrades[5].unlocked == 2) ? (
              <div>
              </div>
            ) : <div></div>}
            <div>
              <BigTitle text={"Upgrades"} />
              {upgrades.map((upgrade, index) => (
                upgrade.unlocked === 1 && (
                  <LargeButton
                    key={index}
                    func={() => buyUpgrade(index)}
                    text={`${upgrade.name} (${upgrade.price} cycles)`}
                    disabled={upgrade.unlocked || cycles < upgrade.price}
                  />
                )
              ))}
            </div>
            {(upgrades[3].unlocked == 2) ? (
              <div>
                <img src={public_url + "/img/souris.png"} />
                <TextVar text={`Total: ${autoBuyers}`} type={"h3"} />
                <LargeButton func={() => {buyAutoBuyer()}} text={`Buy AutoBuyer (50 000 cycles)`} />
                <LargeButton func={() => {sellAutoBuyer()}} text={`Sell AutoBuyer (25 000 cycles)`} />
              </div>
            ) : <div></div>}
          </div>
        </div>
      </div>

      <div className="sidebar pixels">
        <BigTitle text={"Pixels"} />
        <TextVar text={`Total: ${pixelsTotal}`} type={"h3"} />
        <TextVar text={`Basic: ${pixels}`} type={"h3"} />
        {upgrades[0].unlocked == 2 && (<TextVar text={`Energetic: ${pixelsEnergetic}`} type={"h3"} />)}
        {upgrades[1].unlocked == 2 && (<TextVar text={`Ampli: ${pixelsAmpli}`} type={"h3"} />)}
        {upgrades[2].unlocked == 2 && (<TextVar text={`Decomp: ${pixelsDecomp}`} type={"h3"} />)}
        <LargeButton func={() => buyPixel("basic")} text={`Buy Basic Pixel (${Math.floor(pixelPrice)} cycles)`} />
        {upgrades[0].unlocked == 2 && (<LargeButton func={() => buyPixel("energetic")} text={`Buy Energetic Pixel (${Math.floor(pixelEnergeticPrice)} cycles)`} />)}
        {upgrades[1].unlocked == 2 && (<LargeButton func={() => buyPixel("ampli")} text={`Buy Ampli Pixel (${Math.floor(pixelAmpliPrice)} cycles)`} />)}
        {upgrades[2].unlocked == 2 && (<LargeButton func={() => buyPixel("decomp")} text={`Buy Decomp Pixel (${Math.floor(pixelDecompPrice)} cycles)`} />)}
        <TextVar text={`Dead Pixels: ${deadPixels}`} type={"h4"} />
        <LargeButton func={resetGame} text={"Reset game"} />
      </div>
    </div>
  );
}

export default App;
