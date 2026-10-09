"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  UserPlus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Store,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  SlidersHorizontal,
  X,
  UserCheck,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: "BUYER" | "VENDOR" | "ADMIN";
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  shop?: {
    id: string;
    name: string;
    slug: string;
    status: string;
    logoUrl: string | null;
    _count?: {
      products: number;
    };
  } | null;
  _count?: {
    orders: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Role updating state
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER" as "BUYER" | "VENDOR" | "ADMIN",
  });

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to load users" });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error loading users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  // Change user role
  const handleRoleChange = async (userId: string, newRole: "BUYER" | "VENDOR" | "ADMIN", userEmail: string) => {
    try {
      setUpdatingUserId(userId);
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setFeedback({
          type: "success",
          message: `Permissions updated: ${userEmail} is now ${newRole}.`,
        });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to change user role." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error updating user role." });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Toggle user ban
  const handleToggleBan = async (user: AdminUser) => {
    const isMasterAdmin = user.email.toLowerCase() === "muhammadsohaib.19477@gmail.com";
    if (isMasterAdmin) {
      alert("Primary Master Admin account cannot be banned.");
      return;
    }

    const nextState = !user.isBanned;
    if (
      nextState &&
      !confirm(`Are you sure you want to ban ${user.name || user.email}? They will not be able to trade or place orders.`)
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: nextState }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isBanned: nextState } : u))
        );
        setFeedback({
          type: "success",
          message: nextState
            ? `User ${user.email} has been suspended.`
            : `User ${user.email} has been unbanned.`,
        });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to update ban status." });
      }
    } catch {
      setFeedback({ type: "error", message: "Error changing user status." });
    }
  };

  // Delete user
  const handleDeleteUser = async (user: AdminUser) => {
    const isMasterAdmin = user.email.toLowerCase() === "muhammadsohaib.19477@gmail.com";
    if (isMasterAdmin) {
      alert("Primary Master Admin account cannot be deleted.");
      return;
    }

    if (!confirm(`Permanently delete user ${user.name || user.email} and all their linked atelier/order data?`)) {
      return;
    }

    try {
      setDeletingId(user.id);
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: `Account "${user.email}" deleted successfully.` });
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to delete user." });
      }
    } catch {
      setFeedback({ type: "error", message: "Error deleting user account." });
    } finally {
      setDeletingId(null);
    }
  };

  // Create new user form submission
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: data.message });
        setShowCreateModal(false);
        setNewUserForm({ name: "", email: "", password: "", role: "BUYER" });
        fetchUsers();
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to create user" });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error creating user" });
    } finally {
      setCreating(false);
    }
  };

  // Counters
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const vendorCount = users.filter((u) => u.role === "VENDOR").length;
  const buyerCount = users.filter((u) => u.role === "BUYER").length;
  const bannedCount = users.filter((u) => u.isBanned).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              User Accounts & Role Permissions
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#b48c48]/15 text-[#8a6828] font-bold">
              Access Control
            </span>
          </div>
          <p className="text-xs text-[#78716c] mt-1">
            Super Admin power to appoint Admins, elevate Sellers, verify Artisan accounts, or suspend bad actors.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchUsers}
            className="p-2 rounded-full bg-white hover:bg-[#f5f0ea] border border-[#ede5dc] text-stone-600 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Users"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="gold-btn px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add User or Admin</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-stone-400 hover:text-stone-600 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Total Users</span>
            <Users className="w-4 h-4 text-stone-500" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 mt-2 block">
            {totalCount}
          </span>
          <span className="text-[11px] text-[#a8a29e]">Registered platform members</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Administrators</span>
            <ShieldCheck className="w-4 h-4 text-[#b48c48]" />
          </div>
          <span className="text-2xl font-serif font-bold text-[#b48c48] mt-2 block">
            {adminCount}
          </span>
          <span className="text-[11px] text-[#a8a29e]">Super Admin governance</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Artisan Vendors</span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-emerald-700 mt-2 block">
            {vendorCount}
          </span>
          <span className="text-[11px] text-[#a8a29e]">Boutique shop owners</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Fine Jewelry Buyers</span>
            <ShoppingBag className="w-4 h-4 text-stone-500" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-700 mt-2 block">
            {buyerCount}
          </span>
          <span className="text-[11px] text-[#a8a29e]">Active jewelry collectors</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#ede5dc] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by legal name, display name, or email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#faf8f5] border border-[#ede5dc] text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#b48c48] placeholder:text-stone-400"
            />
          </form>

          {/* Quick Role Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#faf8f5] border border-[#ede5dc]">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                roleFilter === "ALL"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              All Roles ({totalCount})
            </button>
            <button
              onClick={() => setRoleFilter("ADMIN")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                roleFilter === "ADMIN"
                  ? "bg-[#faf5ed] text-[#826229] border border-[#ecd8b0] shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Admins ({adminCount})
            </button>
            <button
              onClick={() => setRoleFilter("VENDOR")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                roleFilter === "VENDOR"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Vendors ({vendorCount})
            </button>
            <button
              onClick={() => setRoleFilter("BUYER")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                roleFilter === "BUYER"
                  ? "bg-stone-100 text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Buyers ({buyerCount})
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-16 text-center text-xs text-stone-500 bg-white rounded-2xl border border-[#ede5dc]">
          <RefreshCw className="w-6 h-6 animate-spin text-[#b48c48] mx-auto mb-2" />
          Loading user database and access control permissions...
        </div>
      ) : users.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-[#ede5dc] text-center space-y-3">
          <Users className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-sm font-serif font-semibold text-stone-900">No users found</h3>
          <p className="text-xs text-stone-500">
            No accounts matched your search criteria. Try modifying your query.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
              <tr>
                <th className="py-3.5 px-4">User / Email</th>
                <th className="py-3.5 px-4">Assign Role (Power to elevate)</th>
                <th className="py-3.5 px-4">Atelier Boutique</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede5dc] font-medium">
              {users.map((u) => {
                const isMaster = u.email.toLowerCase() === "muhammadsohaib.19477@gmail.com";
                const isUpdating = updatingUserId === u.id;

                return (
                  <tr
                    key={u.id}
                    className={`transition-colors ${
                      isMaster
                        ? "bg-[#faf5ed]/60 hover:bg-[#faf5ed]"
                        : u.isBanned
                        ? "bg-rose-50/30 hover:bg-rose-50/50"
                        : "hover:bg-[#faf8f5]/60"
                    }`}
                  >
                    {/* User Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isMaster
                              ? "bg-gradient-to-br from-[#d4af37] to-[#8a6828] text-white shadow-2xs"
                              : u.role === "ADMIN"
                              ? "bg-[#b48c48]/15 text-[#8a6828]"
                              : u.role === "VENDOR"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {(u.name?.[0] || u.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-stone-900 block">
                              {u.name || "Collector"}
                            </span>
                            {isMaster && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#b48c48] text-white font-bold">
                                ROOT ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 font-normal block font-mono">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {isMaster ? (
                          <Badge variant="gold" className="text-[11px] font-bold">
                            ROOT SUPER ADMIN
                          </Badge>
                        ) : (
                          <select
                            disabled={isUpdating}
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(
                                u.id,
                                e.target.value as "BUYER" | "VENDOR" | "ADMIN",
                                u.email
                              )
                            }
                            className={`px-3 py-1 rounded-xl text-xs font-semibold border focus:outline-hidden cursor-pointer transition-all ${
                              u.role === "ADMIN"
                                ? "bg-[#faf5ed] text-[#826229] border-[#ecd8b0]"
                                : u.role === "VENDOR"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-white text-stone-700 border-stone-300"
                            }`}
                          >
                            <option value="BUYER">BUYER (Shopper)</option>
                            <option value="VENDOR">VENDOR (Artisan Seller)</option>
                            <option value="ADMIN">ADMIN (Super Powers)</option>
                          </select>
                        )}
                        {isUpdating && <RefreshCw className="w-3 h-3 animate-spin text-[#b48c48]" />}
                      </div>
                    </td>

                    {/* Shop Info */}
                    <td className="py-3.5 px-4">
                      {u.shop ? (
                        <div>
                          <span className="font-semibold text-stone-900 block flex items-center gap-1">
                            <Store className="w-3 h-3 text-[#b48c48]" />
                            {u.shop.name}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            {u.shop._count?.products ?? 0} pieces • {u.shop.status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">No shop provisioned</span>
                      )}
                    </td>

                    {/* Join Date */}
                    <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {u.isBanned ? (
                        <Badge variant="ruby" className="text-[10px] font-bold">
                          SUSPENDED
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Active
                        </Badge>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isMaster && (
                          <>
                            {/* Ban / Unban Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleBan(u)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                                u.isBanned
                                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300"
                                  : "bg-rose-50 text-rose-800 hover:bg-rose-100 border-rose-300"
                              }`}
                            >
                              {u.isBanned ? "Unban" : "Ban"}
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              disabled={deletingId === u.id}
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors border border-[#e8ded4] hover:border-rose-200 cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#ede5dc] max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede5dc]">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Create Platform Account
                </h3>
                <p className="text-xs text-stone-500">
                  Provision a new user with any assigned role.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Master Goldsmith Tariq"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="artisan@atelier.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Designated Role & Authority
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm({
                      ...newUserForm,
                      role: e.target.value as "BUYER" | "VENDOR" | "ADMIN",
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] font-semibold text-stone-800 focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                >
                  <option value="BUYER">BUYER (Regular Jewelry Shopper)</option>
                  <option value="VENDOR">VENDOR (Artisan Atelier Seller)</option>
                  <option value="ADMIN">ADMIN (Full Governance Permissions)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ede5dc]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="gold-btn px-6 py-2 rounded-full text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {creating ? "Creating..." : "Establish Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
