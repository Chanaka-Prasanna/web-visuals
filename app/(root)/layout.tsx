import Navbar from "@/components/shared/navbar";
import React from "react";

const RootLayOut = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default RootLayOut;
