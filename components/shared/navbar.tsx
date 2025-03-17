import React from "react";
import { ModeToggle } from "../toggle";
import Link from "next/link";
import Image from "next/image";

const navbar = () => {
  const navElements = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  return (
    <div className="sticky top-0  border-b md:w-2/3 w-full mx-auto p-4 flex justify-between bg-bg items-center">
      <div className="w-1/2 space-x-4 flex items-center">
        <Image src="/logo.png" width={50} height={50} alt="logo" />
        {navElements.map((item) => (
          <Link className="text-blue-200" href={item.href} key={item.name}>
            {item.name}
          </Link>
        ))}
      </div>
      <ModeToggle />
    </div>
  );
};

export default navbar;
