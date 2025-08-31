"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { withAuth } from "@/hooks/useAuth";

const DashboardPage = () => {
  const [time, setTime] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    todayRevenue: 0,
    monthRevenue: 0,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  // Greeting logic
  useEffect(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour < 12) setTime("Morning");
    else if (hour < 18) setTime("Afternoon");
    else setTime("Evening");
  }, []);

  // Fetch stats + products + revenue
  useEffect(() => {
    async function fetchDashboard() {
      // Products
      const { data: productsData } = await supabase.from("products").select("*");
      setProducts(productsData || []);

      // Sales
      const { data: salesData } = await supabase.from("sales").select("*, created_at");
      if (!salesData) return;

      const totalSales = salesData.length;
      const today = new Date().toDateString();
      const month = new Date().getMonth();

      let todayRevenue = 0;
      let monthRevenue = 0;

      salesData.forEach((s) => {
        const d = new Date(s.created_at);
        if (d.toDateString() === today) {
          todayRevenue += s.total_amount;
        }
        if (d.getMonth() === month) {
          monthRevenue += s.total_amount;
        }
      });

      // Revenue chart (last 7 days)
      const last7Days: any[] = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        const dayStr = day.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        const dailyRevenue = salesData
          .filter(
            (s) => new Date(s.created_at).toDateString() === day.toDateString()
          )
          .reduce((sum, s) => sum + s.total_amount, 0);

        last7Days.push({ date: dayStr, revenue: dailyRevenue });
      }

      setStats({
        totalProducts: productsData?.length || 0,
        totalSales,
        todayRevenue,
        monthRevenue,
      });
      setRevenueData(last7Days);
    }

    fetchDashboard();
  }, []);

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{`Good ${time}`}</h1>
        {/* <Bell className="w-6 h-6 text-gray-600 cursor-pointer" /> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalSales}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today’s Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₦{stats.todayRevenue.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₦{stats.monthRevenue.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* Products + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle>Products (Low Stock)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Selling Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products
                  .filter((p) => p.quantity < 10)
                  .map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.quantity}</TableCell>
                      <TableCell>₦{p.selling_price}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Revenue chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
