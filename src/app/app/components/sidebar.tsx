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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: <SquaresUniteIcon size={24} />,
  },
  {
    title: "Products",
    url: "/app/products",
    icon: <Package size={12} />,
  },
  {
    title: "Analytics",
    url: "/app/analytics",
    icon: <BarChart2 size={12} />,
  },
  {
    title: "Credit Customers",
    url: "/app/credit",
    icon: <CreditCard size={12} />,
  },
  {
    title: "Checkout",
    url: "/app/checkout",
    icon: <ShoppingCart size={12} />,
  },
  {
    title: "Settings",
    url: "/app/settings",
    icon: <Settings size={12} />,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
     <SidebarGroupLabel className="text-xl mb-5 mx-2 text-gray-900 mt-3">StorMate</SidebarGroupLabel>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10">
                  Select Store
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton  className="text-md hover:bg-gray-900 transition-all duration-300 hover:text-gray-50 h-10" asChild>
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
