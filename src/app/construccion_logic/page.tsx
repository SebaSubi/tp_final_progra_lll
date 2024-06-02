"use client";

import Image from "next/image";
import Placer from "./components/objectPlacer";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  glod_mine_Array,
  lumber_camp_Array,
  stone_mine_Array,
  barracs_Array,
} from "./utils/StructuresData";
import SideBar from "./components/sideBar";
import { User } from "../objects/user";
import Collectors from "../collectors/objects/collector";
import MapBuildings from "./components/mapBuildings";
import TrainingMenu from "./components/trainingMenu";
import Progressbar, { units } from "./components/progressbar";
import Units from "../collectors/objects/Units";
import { Boosts } from "../objects/boost";
import BarracsMenu from "./components/barracsMenu";
// import BarracsMenu from "./components/barracsMenu";
import { getUserBuildings, postUserBuildings } from "../server/buildings";
import userBuildings from "../models/userBuildings";
import MessageSection from "./components/messages";
import InboxSection from "./components/buzon";

const boost: Boosts[] = [
  {
  id: 1,
  name: "Mate",
  type: "mate",
  img: (
  <Image 
    key="mate"
    src="/Mate.png"
    width={30}
    height={40}
    alt="png of a mate"
  />),
  quantity: 3,
  boost: 1.5 
},
{
  id: 2,
  name: "Facturas",
  type: "facturas",
  img: (
  <Image 
    key="facturas"
    src="/Facturas.png"
    width={30}
    height={40}
    alt="png of facturas"
  />),
  quantity: 1, 
  boost: 1.2
},

]

export const user: User = {
  id: 1,
  name: "Lando Norris",
  username: "Papi_de_Max",
  password: "f1_E>",
  level: 1,
  boosts: boost, 
  workers: 3
};



export interface placerApear {
  beingPlaced: boolean,
  placed: boolean
}

export default function Home() {
  // const [placerApear, setPlacerApear] = useState<placerApear>({beingPlaced: false, placed: false});
  const [placerApear, setPlacerApear] = useState(false)
  const [structure, setStructure] = useState<any>(null);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const [progressBar, setProgressBar] = useState<boolean | null>(null)
  const [unit, setUnit] = useState<Units>()
  const [quantity, setQuantity] = useState(0)
  const [maxTraining, setMaxTraining] = useState(false)
  const [appliedBoost, setAppliedBoost] = useState<Boosts | null>(null)
  const [barracsMenu, setBarracsMenu] = useState(false)
  const [existingBuildings, setExistingBuildings] = useState<any[]>([])

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: 'http://localhost:3000' });
  };


  useEffect(() => {
    const fetchUserBuildings = async () => {
      const userBuildings = await getUserBuildings();
      setExistingBuildings(userBuildings);
    };
    fetchUserBuildings();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      cursorPosition.current = { x: event.clientX, y: event.clientY };
    };

    document.addEventListener("mousemove", handleMouseMove);

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

    return (
    <main className="flex min-h-screen items-center justify-center relative">
        <div className="absolute bottom-0 right-0 m-4">
          <button className="p-2 bg-black text-white border border-white rounded-lg font-bold uppercase duration-200 hover:bg-gray-900 h-10" onClick={handleSignOut}>
              Logout
          </button>
      </div>

      <MessageSection/>
      <InboxSection/>

      
      {barracs_Array.length ? 
      <TrainingMenu 
          user={user} 
          setProgressBar={setProgressBar} 
          setUnit={setUnit} 
          setQuantity={setQuantity} 
          quantity={quantity} 
      />
      : 
      null}

      {progressBar ? 
      <Progressbar 
        running={progressBar} 
        unit={unit!} 
        setProgressBar={setProgressBar} 
        quantity={quantity} 
        barracs={barracs_Array[0]!} 
        setMaxTraining={setMaxTraining} 
        setQuantity={setQuantity}
        boost={appliedBoost}

        /> 
      : 
      null} {/*If this is throwing an error, ad an if inside to check if its undefined and take out the !*/}

      <SideBar user={user} setStructure={setStructure} />
      {barracsMenu? 
        <BarracsMenu 
          barracs={barracs_Array[0]} 
          user={user} 
          setAppliedBoost={setAppliedBoost} 
          progressBar={progressBar}
        /> 
      : null}

      <Placer appearence={placerApear} structure={structure} />
      {existingBuildings.length? existingBuildings.map((building, index) => (
        <MapBuildings 
        key={index}
        setBarracsMenu={setBarracsMenu}
        barracMenu={barracsMenu}
        building={building}
        placed={placerApear}
        structure={null}
        // setPlacerApear={setPlacerApear}
      />
      )):
      null
      }
      <MapBuildings 
        setBarracsMenu={setBarracsMenu}
        barracMenu={barracsMenu}
        building={cursorPosition}
        placed={placerApear}
        structure={structure}
        // setPlacerApear={setPlacerApear}
      />
      <Image
        src="/Map_Classic_Scenery.jpg"
        alt="clash_map"
        width={2000}
        height={500}
        onClick={() => {
          if (placerApear) {
            checkTerrain(cursorPosition.current, structure)
              ? addStructureToDB(
                cursorPosition.current, 
                structure,
                user.id,
                new Date()
              )
              : null;
          }

          if (placerApear) {
            setPlacerApear(false);
            setStructure(null);
            document.body.classList.remove("cursor-none");
          } //this if is to hide the cursor marker when the map is clicked, if the conditional doesn`t exist it will always reload the component because of how useState works.itional doesn`t exist it will always reload the component because of how useState works.
        }}
        className="inset-0 w-full h-full object-cover"
      />
      {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4">
        <button className="px-6 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        onClick={() => {setBarracsMenu(barracs_Array.length? !barracsMenu : false)}}
        >
            Barracs
        </button>
      </div> */}
      
    </main>
  );
}

function checkTerrain( //this function will chech if the terrain is suitable for the structure and taht it is not occupied by another structure
  position: { x: number; y: number },
  structure: number | null
): boolean {
  return true;
}

function addStructureToDB(
  position: { x: number; y: number }, 
  structure: any, 
  userId: number,
  lastCollected: Date
) {
  postUserBuildings(
    structure,
    userId,
    lastCollected,
    position
  )
}
