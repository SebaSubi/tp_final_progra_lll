"use client";

import Image from "next/image";
import Placer from "./components/objectPlacer";
import { useState, useEffect, useRef } from "react";

import {
  glod_mine_Array,
  lumber_camp_Array,
  stone_mine_Array,
} from "./utils/StructuresData";
import SideBar from "./components/sideBar";
import { User } from "../objects/user";
import Collectors from "../collectors/objects/collector";
import MapBuildings from "./components/mapBuildings";

export default function Home() {
  const [placerApear, setPlacerApear] = useState(false);
  const [structure, setStructure] = useState<null | number>(null);
  const cursorPosition = useRef({ x: 0, y: 0 });

  // console.log(glod_mine_Array);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      cursorPosition.current = { x: event.clientX, y: event.clientY };
    };

    // Agrega el event listener cuando el componente se monta
    document.addEventListener("mousemove", handleMouseMove);

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (structure) {
      setPlacerApear(true);
      document.body.classList.add("cursor-none");
    }
  }, [structure]);

  const user: User = {
    id: 1,
    name: "Lando Norris",
    username: "Papi_de_Max",
    password: "f1_E>",
    level: 1,
  };

  return (
    <main className="flex min-h-screen items-center justify-center relative">
      {/* <button
        className="absolute bg-blue-500 text-white px-4 py-2 rounded-md"
        style={{ left: "10px", zIndex: 2 }} // Ajusta el valor de 'left' según tus necesidades
        onClick={() => {
          setPlacerApear(!placerApear);
        }}
      >
        Toggle Cursor Marker
      </button> */}
      <SideBar user={user} setStructure={setStructure} />
      <Placer appearence={placerApear} structure={structure} />
      <MapBuildings />
      <Image
        src="/Map_Classic_Scenery.jpg"
        alt="clash_map"
        width={2000}
        height={500}
        onClick={() => {
          if (placerApear) {
            checkTerrain(cursorPosition.current, structure)
              ? addstructure(cursorPosition.current, structure)
              : null;
          }
          // console.log("click en el mapa");
          if (placerApear) {
            setPlacerApear(false);
            setStructure(null);
            document.body.classList.remove("cursor-none");
          } //this if is to hide the cursor marker when the map is clicked, if the conditional doesn`t exist it will always reload the component because of how useState works.
        }}
        className="inset-0 w-full h-full object-cover"
      />
    </main>
  );
}

function checkTerrain( //this function will chech if the terrain is suitable for the structure and taht it is not occupied by another structure
  position: { x: number; y: number },
  structure: number | null
): boolean {
  return true;
}

const collectorArray: Collectors[] = [
  {
    id: 1,
    name: "Gold Collector",
    img: (
      <Image
        key="GoldMine"
        src="/Gold_Mine1.png"
        width={60}
        height={70}
        alt="png of Gold Mine"
      />
    ),
    cost: 100,
    prod_per_hour: 1,
    workers: 1,
    level: 1,
    unlock_level: 2,
    maxWorkers: 1,
    position: { x: 0, y: 0 },
  },
  {
    id: 2,
    name: "Wood Collector",
    img: (
      <Image
        key="WoodCollecor"
        src="/Elexir_Collector.png"
        width={60}
        height={70}
        alt="png of Wood Collector"
      />
    ),
    cost: 100,
    prod_per_hour: 1,
    workers: 1,
    level: 1,
    unlock_level: 1,
    maxWorkers: 1,
    position: { x: 0, y: 0 },
  },
];

function addstructure(
  position: { x: number; y: number },
  structure: number | null
): void {
  switch (structure) {
    case 1:
      // glod_mine_Array.push({
      //   id: glod_mine_Array.length,
      //   position: { x: position.x, y: position.y },
      // });
      break;
    case 2:
      lumber_camp_Array.push({
        id: lumber_camp_Array.length, //ESTO HAY QUE CORREGIRLO A FUTURO
        position: { x: position.x, y: position.y },
        name: "Wood Collector",
        img: (
          <Image
            key="WoodCollecor"
            src="/Elexir_Collector.png"
            width={60}
            height={70}
            alt="png of Wood Collector"
          />
        ),
        cost: 100,
        prod_per_hour: 1,
        workers: 1,
        level: 1,
        unlock_level: 1,
        maxWorkers: 1,
      });
      break;
    case 3:
      // stone_mine_Array.push({
      //   id: stone_mine_Array.length,
      //   position: { x: position.x, y: position.y },
      // });
      break;
  }
}