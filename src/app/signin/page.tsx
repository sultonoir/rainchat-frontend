import { TabAuth } from "@/components/auth/tab-auth";
import { getSession } from "@/server/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Signin",
};

const Page = async () => {
  const user = await getSession();
  if (user) {
    redirect("/");
  }
  return (
    <div className="grid min-h-screen place-items-center">
      <TabAuth />
    </div>
  );
};

export default Page;
