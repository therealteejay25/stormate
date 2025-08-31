import type { Metadata } from "next";
import "@/styles/app.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/sidebar"

export const metadata: Metadata = {
  title: "Stormate Dashboard",
  description: "Storemate admin dashboard",
   icons: {
    icon: "/_.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-6 w-full">
        {/* <SidebarTrigger /> */}
        {children}
      </main>
    </SidebarProvider>
  );
}
