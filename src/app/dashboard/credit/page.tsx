"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/client";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Credit {
  id: string;
  customer_name: string;
  phone: string;
  total: number;
  amount_paid: number;
  balance: number;
  status: string;
  due_date: string | null;
  notes: string | null;
}

export default function CreditsPage() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCredit, setEditingCredit] = useState<Credit | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<Credit>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("credits").select("*");
    if (error) console.error(error.message);
    else setCredits(data || []);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!form.customer_name || !form.total) return;
    setIsSaving(true);

    if (editingCredit) {
      const { data, error } = await supabase
        .from("credits")
        .update({
          customer_name: form.customer_name,
          phone: form.phone,
          total: form.total,
          amount_paid: form.amount_paid || 0,
          balance: (form.total || 0) - (form.amount_paid || 0),
          due_date: form.due_date,
          notes: form.notes,
        })
        .eq("id", editingCredit.id)
        .select();

      if (error) console.error(error.message);
      else {
        setCredits((prev) =>
          prev.map((c) => (c.id === editingCredit.id ? data![0] : c))
        );
      }
    } else {
      const { data, error } = await supabase
        .from("credits")
        .insert({
          customer_name: form.customer_name,
          phone: form.phone,
          total: form.total,
          amount_paid: form.amount_paid || 0,
          balance: (form.total || 0) - (form.amount_paid || 0),
          status: "pending",
          due_date: form.due_date,
          notes: form.notes,
        })
        .select();

      if (error) console.error(error.message);
      else setCredits((prev) => [...prev, data![0]]);
    }

    setIsSaving(false);
    setEditingCredit(null);
    setForm({});
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("credits").delete().eq("id", id);
    if (error) console.error(error.message);
    else setCredits((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <Input
          placeholder="Search customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-2xl"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} /> Add Credit
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-4">
            <h2 className="text-lg font-semibold">
              {editingCredit ? "Edit Credit" : "Add Credit"}
            </h2>
            <Input
              placeholder="Customer Name"
              value={form.customer_name || ""}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Total"
              value={form.total || ""}
              onChange={(e) => setForm({ ...form, total: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Amount Paid"
              value={form.amount_paid || ""}
              onChange={(e) => setForm({ ...form, amount_paid: Number(e.target.value) })}
            />
            <Input
              type="date"
              placeholder="Due Date"
              value={form.due_date || ""}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
            <Input
              placeholder="Notes"
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="animate-spin mr-2" size={16} />}
              Save
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credits
              .filter((c) =>
                c.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.customer_name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.total}</TableCell>
                  <TableCell>{c.amount_paid}</TableCell>
                  <TableCell>{c.balance}</TableCell>
                  <TableCell>{c.status}</TableCell>
                  <TableCell>{c.due_date || "-"}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCredit(c);
                        setForm(c);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
