"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"

// ✅ Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>({})
  const [store, setStore] = useState<any>({})

  // ✅ Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Example: fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .single() // assuming one profile per user

      // Example: fetch store
      const { data: storeData } = await supabase
        .from("stores")
        .select("*")
        .single() // assuming one store per user

      setProfile(profileData || {})
      setStore(storeData || {})
      setLoading(false)
    }

    fetchData()
  }, [])

  // ✅ Update profile
  const handleSaveProfile = async () => {
    await supabase.from("profiles").update(profile).eq("id", profile.id)
    alert("Profile updated ✅")
  }

  // ✅ Update store
  const handleSaveStore = async () => {
    await supabase.from("stores").update(store).eq("id", store.id)
    alert("Store updated ✅")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-10">
      <h1 className="text-4xl font-bold mb-10">⚙️ Settings</h1>

      {/* ✅ Profile Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full mt-1 p-3 border rounded-md bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full mt-1 p-3 border rounded-md bg-background"
            />
          </div>
        </div>
        <Button className="mt-6" onClick={handleSaveProfile}>
          Save Profile
        </Button>
      </section>

      {/* ✅ Store Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Store Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Store Name</label>
            <input
              type="text"
              value={store.name || ""}
              onChange={(e) => setStore({ ...store, name: e.target.value })}
              className="w-full mt-1 p-3 border rounded-md bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Store Description</label>
            <textarea
              value={store.description || ""}
              onChange={(e) =>
                setStore({ ...store, description: e.target.value })
              }
              className="w-full mt-1 p-3 border rounded-md bg-background"
            />
          </div>
        </div>
        <Button className="mt-6" onClick={handleSaveStore}>
          Save Store
        </Button>
      </section>
    </div>
  )
}

export default Settings
