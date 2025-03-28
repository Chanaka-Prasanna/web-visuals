import React from "react";
import { ModeToggle } from "../toggle";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const navbar = () => {
  const navElements = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  return (
    <div className=" w-full mx-auto h-[80px] py-4 flex justify-between bg-background items-center">
      <Image src="/logo.png" width={50} height={50} alt="logo" />
      <div className="w-1/2 space-x-4 flex items-center">
        {navElements.map((item) => (
          <Link
            className="text-primary text-xl"
            href={item.href}
            key={item.name}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <div className="space-x-2">
          <Button size="lg" className="bg-primary text-primary-foreground">
            Sign Up
          </Button>
          <Button size="lg" className="bg-primary text-primary-foreground">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default navbar;
