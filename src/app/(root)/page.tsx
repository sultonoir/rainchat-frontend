import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
};

const Page = () => {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image src="/chat.png" alt="chat" width={500} height={500} priority />
        <p>Chatting with your friends</p>
      </div>
    </div>
  );
};

export default Page;
