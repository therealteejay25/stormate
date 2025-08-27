import {
  SquaresUniteIcon,
  Package,
  BarChart2,
  CreditCard,
  ShoppingCart,
  Settings,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const items = [
  {
    title: "Dashboard",
    url: "/dashboard/dashboard",
    icon: <SquaresUniteIcon size={24} />,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: <Package size={12} />,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <BarChart2 size={12} />,
  },
  {
    title: "Credit Customers",
    url: "/dashboard/credit",
    icon: <CreditCard size={12} />,
  },
  {
    title: "Checkout",
    url: "/dashboard/checkout",
    icon: <ShoppingCart size={12} />,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <Settings size={12} />,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-72 h-screen sticky top-0 left-0 bg-gray-50 p-4">
     <SidebarGroupLabel className="text-2xl mb-5 mx-2 text-gray-900 mt-3">StorMate</SidebarGroupLabel>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton  className="text-md hover:bg-gray-900 transition-all duration-200 hover:text-gray-50 focus:text-gray-50 hover:bg-black focus:bg-black h-10 text-black bg-gray-50 rounded-lg px-3" asChild>
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
