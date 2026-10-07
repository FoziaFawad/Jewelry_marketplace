import React from "react";
import { Navbar } from "@/components/marketplace/Navbar";
import { Footer } from "@/components/marketplace/Footer";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
