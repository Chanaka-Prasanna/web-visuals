import Footer from "@/components/Footer";
import Navbar from "@/components/navigation/Navbar";
import React from "react";

const RootLayOut = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default RootLayOut;
