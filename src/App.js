import Header from "./Components/Header";
import LeftNav from "./Components/LeftNav";
import MapViewer from "./Components/MapViewer";
import searchCity from "./Utilities/SearchCity";
import { useState } from "react";
export default function App() {
  const [leftCord, setLeftCord] = useState();
  const [rightCord, setRightCord] = useState();
  const [value, setValue] = useState();

  const ClickHandler = (searchCord) => {
    const find = searchCity.find(
      (item) => item.name.toUpperCase() === searchCord.toUpperCase()
    );
    console.log("find", find);
    setLeftCord(find.lat);
    setRightCord(find.lon);
  };

  const setThroughPutMethod= (val)=>{

    setValue(val)
  }
  return (
    <>
      <Header clickHandler={ClickHandler} setThroughPutValue={setThroughPutMethod}/>
      <LeftNav />
      <MapViewer leftCord={leftCord} rightCord={rightCord}   value={value} />
    </>
  );
}
