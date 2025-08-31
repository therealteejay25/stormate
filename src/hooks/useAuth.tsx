"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/client"
import { Loader } from "lucide-react"

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function Protected(props: P) {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const checkAuth = async () => {
        const { data } = await supabase.auth.getUser()
        if (!data.user) {
          router.push("/auth") // redirect if not logged in
        } else {
          setUser(data.user)
        }
        setLoading(false)
      }
      checkAuth()
    }, [router])

    if (loading) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      )
    }

    if (!user) return null

    return <Component {...props} user={user} />
  }
}
