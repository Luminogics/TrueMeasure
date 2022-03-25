import Header from "./Components/Header";
import LeftNav from "./Components/LeftNav";
import MapViewer from "./Components/MapViewer";
import searchCity from "./Utilities/SearchCity";
import { useState } from "react";
export default function App() {
  const [leftCord, setLeftCord] = useState();
  const [rightCord, setRightCord] = useState();
  const ClickHandler = (searchCord) => {
    const find = searchCity.find(
      (item) => item.name.toUpperCase() === searchCord.toUpperCase()
    );
    console.log("find", find);
    setLeftCord(find.lat);
    setRightCord(find.lon);
  };
  return (
    <>
      <Header clickHandler={ClickHandler} />
      <LeftNav />
      <MapViewer leftCord={leftCord} rightCord={rightCord} />
    </>
  );
}
