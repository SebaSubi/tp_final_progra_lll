import {
  useState,
  useEffect,
  memo,
  MutableRefObject,
  useContext,
  useRef,
  use,
} from "react";
import Image from "next/image";
import { mapPlace, DefaultMap } from "./mapData";
import { useBuldingContext } from "./BuildingContext";
import Building from "./building";
import { getUserBuildings, postUserBuildings } from "../server/userBuilding";
import { useSession } from "next-auth/react";
import { getUserInstanceById } from "../server/userInstance";
import { useBuildingsStore } from "../store/userBuildings";
import { UserBuildings } from "../types";
import { useUserStore } from "../store/user";
import { updateData } from "../logic/production";
import dayjs from "dayjs";
import { useBoostStore } from "../store/boosts";

// interface BuildingType {
//   name: string;
//   prod_per_hour: number;
//   workers: number;
//   capacity: number;
//   maxCapacity: number;
// }

function Place({
  mapPlace,
  position,
}: {
  mapPlace: mapPlace;
  position: { row: number; column: number };
}) {
  const [isOccupied, setIsOccupied] = useState(mapPlace.occupied);
  const [hover, setHover] = useState(false);
  const [buildingMenu, setBuildingMenu] = useState<boolean>(false); // State to control the building menu visibility
  const [upgradeScreen, setUpgradeScreen] = useState<boolean>(false); // State to control the upgrade screen visibility
  // const [building, setBuilding] = useState<any>(null); // State to store the selected building data
  const building = useRef<UserBuildings>();
  const userBuilding = useBuildingsStore(state => state.userBuilding);
  const userBuildings = useBuildingsStore((state) => state.userBuildings);
  const user = useUserStore((state) => state.user);
  const updateMaterials = useUserStore(state => state.updateMaterials);
  const boost = useBoostStore(state => state.boost);
  const fetchBuilding = useBuildingsStore(state => state.fetchBuilding);
  const updateBuilding = useBuildingsStore(state => state.updateProduction);

  // console.log(user.materials.lumber)

  function updateBuildingData() {
    // console.log(building.current!._id)
    // fetchBuilding(building.current!._id); Remeber you commented this line
    // console.log(userBuilding);
    const newData = updateData(userBuilding, boost);
    updateBuilding(newData, false);
    setBuildingMenu(!buildingMenu);
  }

  function handleCollected() { 
    // console.log(userBuilding)
    const materialName = userBuilding.name.split(' ');
    // console.log(materialName[0])
    updateMaterials(materialName[0], userBuilding.capacity);
    // updateMaterials();
    updateBuilding(0, true)

  }


  const context = useBuldingContext(); //this is great, it imports states from other components

  const StructureType = context.StructureType;
  const BuildMode = context.placing;

  const handleClick = async () => {
    if (BuildMode.current && !isOccupied) {
      DefaultMap[position.row][position.column].occupied = true;
      DefaultMap[position.row][position.column].structureType =
        StructureType.current.name;

      try {
        const currentDay = dayjs();
        const createdBuilding = await postUserBuildings(
          StructureType.current,
          user.userId,
          currentDay.toDate(),
          { x: position.row, y: position.column }
        );

        // Update building.current with the created building
        building.current = createdBuilding;

        BuildMode.current = false;
        setIsOccupied(true);
        setHover(false);
      } catch (error) {
        console.error("Algo paso", error);
      }
    }
  };

  useEffect(() => {
    userBuildings.forEach((buildingItem) => {
      if (
        position.row === buildingItem.position.x &&
        position.column === buildingItem.position.y
      ) {
        DefaultMap[position.row][position.column].occupied = true;
        DefaultMap[position.row][position.column].structureType =
          buildingItem.name;
        building.current = buildingItem;
        setIsOccupied(true);
      }
    });
  }, []);

  

  // alreadyOccupied()

  return (
    <div className="min-h-10 min-w-10 flex">
      <div
        className={`min-h-10 min-w-10 ${
          BuildMode.current
            ? hover
              ? isOccupied
                ? "bg-red-500"
                : "bg-green-500"
              : ""
            : ""
        } flex items-center justify-center select-none z-10`}
        onClick={() => {
          handleClick();
          if (isOccupied) {
            fetchBuilding(building.current!._id);
            updateBuildingData();
            // console.log("Building clicked", building.current);
          }
        }}
        onMouseOver={() => {
          BuildMode.current ? setHover(true) : null;
        }}
        onMouseLeave={() => (BuildMode.current ? setHover(false) : null)}
      >
        {/* <Building buildingName={StructureType.current} /> */}
        {hover && <Building buildingName={StructureType.current.name} />}
      </div>
      {buildingMenu && building.current && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center w-[330px] h-[250px] bg-[#f7cd8d] border-[3px] border-[#b7632b]">
          <div className="flex flex-row items-center justify-center">
            <Image
              key={building.current.name}
              src={building.current.img}
              width={120}
              height={130}
              alt={building.current.name}
            />
            <div className="ml-4 flex flex-col">
              <h2 className="text-[#6a1e07] font-comic mt1">
                {userBuilding.name}
              </h2>
              <h2 className="text-[#6a1e07] font-comic mt1">
                Level: {userBuilding.level}
              </h2>
              <h2 className="text-[#6a1e07] font-comic mt1">
                {userBuilding.prod_per_hour
                  ? `Production: ${userBuilding.prod_per_hour}ph`
                  : null}{" "}
                {/*//We should check here if it is a barrac or a building   */}
              </h2>
              <h2 className="text-[#6a1e07] font-comic mt1">
                {userBuilding.capacity} / {userBuilding.maxCapacity}
              </h2>
              <h2 className="text-[#6a1e07] font-comic mt1">
                Upgrade cost: {userBuilding.cost * 2}
              </h2>
            </div>
          </div>
          <div className="flex flex-row">
            <div
              className="relative flex items-center pr-2 justify-center hover:brightness-75 active:transition-none active:scale-90 mt-10"
              onClick={() => {
                // StructureType.current = selectedItem;
                // BuildMode.current = true;
                // setBuildingMenu(false);
                console.log("Upgrade building");
              }}
            >
              <p className="absolute inset-0 flex items-center justify-center text-[#6a1e07] font-comic">
                Upgrade
              </p>
              <Image
                src="/BuildButton.png"
                width={80}
                height={80}
                alt="buildingButton"
                className="hover:brightness-75"
              />
            </div>
            <div
              className="relative flex items-center justify-center hover:brightness-75 active:transition-none active:scale-90 mt-10"
              onClick={() => {
                handleCollected();
                setBuildingMenu(false);

                console.log("collected");
              }}
            >
              <p className="absolute inset-0 flex items-center justify-center text-[#6a1e07] font-comic">
                Collect
              </p>
              <Image
                src="/BuildButton.png"
                width={80}
                height={80}
                alt="buildingButton"
                className="hover:brightness-75"
              />
            </div>
          </div>
        </div>
      )}

      <Image
        className="absolute z-[9]"
        src={"/grassTop.jpg"}
        width={40}
        height={40}
        alt="minecraft_grass_top"
      />
      {isOccupied && (
        <div className="z-[9] absolute">
          <Building
            buildingName={
              DefaultMap[position.row][position.column].structureType
            }
          />
        </div>
      )}
    </div>
  );
}

export default memo(Place);

// <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center w-[330px] h-[250px] bg-[#f7cd8d] border-[3px] border-[#b7632b]">
//         {building.current.name}< br />
//         Production per minute: {building.current.prod_per_hour}<br />
//         Workers: {building.current.workers} <br />
//         capacity: {building.current.capacity} / {building.current.maxCapacity}
//       </div>
