"use client";
import { useEffect } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FavoritesDrawer from "@/components/FavoritesDrawer";

function InnerWrapper({ children }: { children: React.ReactNode }) {
  const { t } = useApp();
  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = t.lang;
  }, [t]);
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <CartDrawer />
      <FavoritesDrawer />
    </div>
  );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <InnerWrapper>{children}</InnerWrapper>
    </AppProvider>
  );
}
