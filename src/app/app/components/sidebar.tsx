"use client"

import {
  SquaresUniteIcon,
  Package,
  BarChart2,
  CreditCard,
  ShoppingCart,
  Settings,
  Menu,
  X,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const items = [
  { title: "Dashboard", url: "/app/dashboard", icon: <SquaresUniteIcon size={20} /> },
  { title: "Products", url: "/app/products", icon: <Package size={20} /> },
  { title: "Sales", url: "/app/sales", icon: <BarChart2 size={20} /> },
  { title: "Credit Customers", url: "/app/credit", icon: <CreditCard size={20} /> },
  { title: "Checkout", url: "/app/checkout", icon: <ShoppingCart size={20} /> },
  { title: "Settings", url: "/app/settings", icon: <Settings size={20} /> },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const closeSidebar = () => setIsOpen(false)

  // Reusable menu
  const renderMenu = () => (
    <SidebarMenu>
      {items.map((item) => {
        const isActive =
          pathname === item.url ||
          (item.title === "Dashboard" && pathname === "/app/dashboard")

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              className={`text-md transition-all duration-200 h-10 rounded-lg px-3 flex items-center gap-2
                ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-gray-50 text-black hover:bg-black hover:text-white"
                }`}
              asChild
              onClick={closeSidebar} // closes mobile drawer
            >
              <a href={item.url}>
                {item.icon}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )

  return (
    <>
      {/* ===== Mobile Hamburger ===== */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ===== Mobile Overlay ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ===== Mobile Sidebar Drawer ===== */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gray-50 p-4 z-50 transform transition-transform duration-300 md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Link href="/" className="text-2xl mb-5 mx-2 text-gray-900 mt-3 cursor-pointer">StorMate</Link>
        {renderMenu()}
      </div>

      {/* ===== Desktop Sidebar ===== */}
      <Sidebar className="hidden md:flex w-72 h-screen sticky top-0 left-0 bg-gray-50 p-4">
        <SidebarGroupLabel className="text-2xl mb-5 mx-2 text-gray-900 mt-3 cursor-pointer">
          <Link href="/">StorMate</Link>
        </SidebarGroupLabel>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>{renderMenu()}</SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
