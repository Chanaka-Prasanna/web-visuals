import React from "react";
import { Button } from "../ui/button";

const HeroBanner = () => {
  return (
    <div
      className="w-8/10 mx-auto  flex flex-row py-10 items-center justify-between"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div className="flex items-start flex-col w-2/3 space-y-4">
        <h1 className="text-8xl  font-bold  mb-10">
          Turn Your Data into Visuals Instantly!
        </h1>
        <h2 className="mb-10 text-muted-foreground ">
          Transform raw data into stunning visualizations and uncover hidden
          patterns effortlessly. Simply upload your files, generate interactive
          charts, and get detailed statistical insights—all in just a few
          clicks!
        </h2>
        <Button>Try Now for Free</Button>
      </div>
      <div className=""></div>
    </div>
  );
};

export default HeroBanner;
