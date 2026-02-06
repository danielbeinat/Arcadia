import React from "react";
import { Slider } from "../../Components/HomePage/Slider";
import { Academy } from "../../Components/HomePage/Academy";
import { Map } from "../../Components/HomePage/Map";
import { Contact } from "../../Components/HomePage/Contact";
import { Institution } from "../../Components/HomePage/Institution";
export const Home: React.FC = () => {
  return (
    <>
      <Slider />
      <Contact />
      <Academy />
      <Institution />
      <Map />
    </>
  );
};
