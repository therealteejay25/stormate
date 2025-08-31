"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Package, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[100vh]">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black leading-tight text-white">
                  Streamline Your Store{" "}
                  <span className="text-blue-500">Management</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Transform your retail operations with our cutting-edge platform. 
                  Manage inventory, track sales, and grow your business with 
                  unprecedented efficiency.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 group bg-white text-black hover:bg-gray-200"
                >
                  <Link href="/auth/login">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/_.jpeg" 
                alt="Store Management Dashboard"
                className="rounded-2xl shadow-2xl w-[600px] h-[70vh] border border-gray-800 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-6xl font-black">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to scale with your business
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold">Inventory Control</h3>
                <p className="text-gray-300 leading-relaxed">
                  Real-time tracking, automated reordering, and smart analytics to keep your shelves stocked.
                </p>
              </div>
            </div>

            <div className="p-8 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold">Sales Analytics</h3>
                <p className="text-gray-300 leading-relaxed">
                  Deep insights into your performance with beautiful dashboards and actionable reports.
                </p>
              </div>
            </div>

            <div className="p-8 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold">Credit Management</h3>
                <p className="text-gray-300 leading-relaxed">
                  Keep track of debtors with precise, secure records in your store database.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 space-y-8">
            <h3 className="text-4xl lg:text-5xl font-black">
              Ready to Transform Your Business?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join retailers who have revolutionized their operations with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-12 py-6 group bg-black text-white hover:bg-gray-800"
              >
                <Link href="/auth/login">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
