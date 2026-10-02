"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Layers,
  Link2,
  ShieldCheck,
  Search,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Activity,
  UserCheck,
  Crown,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Image as ImageIcon,
  Terminal,
  AlertTriangle,
  Check,
  RefreshCw,
  Plus,
  Filter,
  Trash2,
  ArrowRightLeft,
  UserX,
  FileText,
  Lock,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Avatar } from "@/app/components/ui/Avatar";
import {
  toggleSuperadmin,
  updateTicketStatus,
  executeTicketAction,
  createAdminTicket,
  adminRemoveFamilyMember,
  adminUpdateMemberRole,
} from "@/app/actions/admin";

export type AdminTicketOverview = {
  id: string;
  ticket_code: string;
  family_id: string | null;
  family_name: string | null;
  requester_email: string;
  category: string;
  priority: string;
  status: string;
  subject: string;
  description: string;
  target_entity_type: string | null;
  target_entity_id: string | null;
  resolution_note: string | null;
  resolved_at: string | null;
  resolver_name: string | null;
  created_at: string;
  updated_at: string;
};

export type FamilyOverview = {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  backdrop_url: string | null;
  created_at: string;
  creator_name: string | null;
  creator_email: string | null;
  members_count: number;
  posts_count: number;
  active_invites_count: number;
};

export type UserOverview = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  is_superadmin: boolean;
  created_at: string;
  memberships: Array<{
    family_id: string;
    family_name: string;
    role: string;
  }>;
  posts_count: number;
  comments_count: number;
};

export type InviteOverview = {
  id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  family_name: string;
  creator_name: string;
};

export type AuditLogOverview = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
  family_name: string | null;
  actor_name: string | null;
};

export type PlatformStats = {
  totalFamilies: number;
  totalUsers: number;
  totalMembers: number;
  totalPosts: number;
  totalComments: number;
  totalInvites: number;
  activeInvites: number;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
};

function formatUtcDate(dateValue: string | Date | null | undefined, includeTime = false): string {
  if (!dateValue) return "—";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    if (!includeTime) {
      return `${year}-${month}-${day}`;
    }
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  } catch {
    return String(dateValue);
  }
}

export function AdminDashboardView({
  tickets: initialTickets,
  families,
  users: initialUsers,
  invites,
  auditLogs,
  stats,
  currentUserId,
}: {
  tickets: AdminTicketOverview[];
  families: FamilyOverview[];
  users: UserOverview[];
  invites: InviteOverview[];
  auditLogs: AuditLogOverview[];
  stats: PlatformStats;
  currentUserId?: string;
}) {
  const [activeTab, setActiveTab] = useState<"tickets" | "families" | "users" | "invites" | "audit">("tickets");
  const [ticketsList, setTicketsList] = useState<AdminTicketOverview[]>(initialTickets);
  const [userList, setUserList] = useState<UserOverview[]>(initialUsers);

  // Filters for tickets
  const [ticketSearch, setTicketSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // General search for other tabs
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketForResolution, setSelectedTicketForResolution] = useState<AdminTicketOverview | null>(null);
  const [resolutionInput, setResolutionInput] = useState("");
  const [newStatusInput, setNewStatusInput] = useState<"resolved" | "in_progress" | "closed">("resolved");

  // Execution Modal
  const [actionTicket, setActionTicket] = useState<AdminTicketOverview | null>(null);
  const [actionType, setActionType] = useState<"remove_member" | "change_role" | "toggle_superadmin" | "delete_family">("remove_member");
  const [actionNote, setActionNote] = useState("");
  const [actionRole, setActionRole] = useState<"admin" | "member">("admin");

  const [isPending, startTransition] = useTransition();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  function triggerFlash(text: string, type: "success" | "error" = "success") {
    setFlashMessage({ text, type });
    setTimeout(() => setFlashMessage(null), 4000);
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Filtered tickets
  const filteredTickets = ticketsList.filter((t) => {
    const q = ticketSearch.toLowerCase();
    const matchesSearch =
      t.ticket_code.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.requester_email.toLowerCase().includes(q) ||
      (t.family_name && t.family_name.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Filtered families
  const filteredFamilies = families.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      (f.description && f.description.toLowerCase().includes(q)) ||
      (f.creator_name && f.creator_name.toLowerCase().includes(q)) ||
      (f.creator_email && f.creator_email.toLowerCase().includes(q))
    );
  });

  // Filtered users
  const filteredUsers = userList.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.memberships.some((m) => m.family_name.toLowerCase().includes(q))
    );
  });

  // Filtered invites
  const filteredInvites = invites.filter((i) => {
    const q = searchQuery.toLowerCase();
    return (
      i.family_name.toLowerCase().includes(q) ||
      i.creator_name.toLowerCase().includes(q) ||
      i.token.toLowerCase().includes(q)
    );
  });

  // 1. Toggle Superadmin
  function handleToggleSuperadmin(targetUserId: string) {
    setActionLoadingId(targetUserId);
    startTransition(async () => {
      const res = await toggleSuperadmin(targetUserId);
      if (res?.success) {
        setUserList((prev) =>
          prev.map((u) =>
            u.id === targetUserId ? { ...u, is_superadmin: res.isSuperadmin } : u
          )
        );
        triggerFlash(`Superadmin privileges ${res.isSuperadmin ? "granted" : "revoked"} successfully.`);
      } else if (res?.error) {
        triggerFlash(res.error, "error");
      }
      setActionLoadingId(null);
    });
  }

  // 2. Resolve or Update Ticket Status
  function handleStatusUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTicketForResolution) return;

    setActionLoadingId(selectedTicketForResolution.id);
    startTransition(async () => {
      const res = await updateTicketStatus(
        selectedTicketForResolution.id,
        newStatusInput,
        resolutionInput
      );
      if (res?.success) {
        setTicketsList((prev) =>
          prev.map((t) =>
            t.id === selectedTicketForResolution.id
              ? {
                  ...t,
                  status: newStatusInput,
                  resolution_note: resolutionInput || t.resolution_note,
                  resolved_at: newStatusInput === "resolved" ? new Date().toISOString() : t.resolved_at,
                  resolver_name: "Superadmin",
                }
              : t
          )
        );
        triggerFlash(`Ticket ${selectedTicketForResolution.ticket_code} status updated to '${newStatusInput}'.`);
        setSelectedTicketForResolution(null);
        setResolutionInput("");
      } else if (res?.error) {
        triggerFlash(res.error, "error");
      }
      setActionLoadingId(null);
    });
  }

  // 3. Execute Intervening Governance Action on Ticket
  function handleExecuteTicketActionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actionTicket) return;

    setActionLoadingId(actionTicket.id);
    startTransition(async () => {
      const res = await executeTicketAction(actionTicket.id, actionType, {
        familyId: actionTicket.family_id || undefined,
        userId: actionTicket.target_entity_id || undefined,
        newRole: actionRole,
        note: actionNote,
      });

      if (res?.success) {
        setTicketsList((prev) =>
          prev.map((t) =>
            t.id === actionTicket.id
              ? {
                  ...t,
                  status: "resolved",
                  resolution_note: res.message,
                  resolved_at: new Date().toISOString(),
                  resolver_name: "Superadmin",
                }
              : t
          )
        );
        triggerFlash(`Governance intervention completed: ${res.message}`);
        setActionTicket(null);
        setActionNote("");
      } else if (res?.error) {
        triggerFlash(res.error, "error");
      }
      setActionLoadingId(null);
    });
  }

  // 4. Create New Operational Ticket
  function handleCreateTicketSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const familyId = (form.get("familyId") as string) || undefined;
    const requesterEmail = form.get("requesterEmail") as string;
    const category = form.get("category") as string;
    const priority = form.get("priority") as any;
    const subject = form.get("subject") as string;
    const description = form.get("description") as string;
    const targetEntityType = (form.get("targetEntityType") as any) || undefined;
    const targetEntityId = (form.get("targetEntityId") as string) || undefined;

    if (!requesterEmail || !subject || !description) {
      triggerFlash("Please complete all required ticket fields.", "error");
      return;
    }

    startTransition(async () => {
      const res = await createAdminTicket({
        familyId,
        requesterEmail,
        category,
        priority,
        subject,
        description,
        targetEntityType,
        targetEntityId,
      });

      if (res?.success && res.ticket) {
        const matchingFam = families.find((f) => f.id === res.ticket.family_id);
        const enrichedTicket: AdminTicketOverview = {
          ...res.ticket,
          family_name: matchingFam?.name || null,
          resolver_name: null,
        };
        setTicketsList((prev) => [enrichedTicket, ...prev]);
        setShowCreateModal(false);
        triggerFlash(`Operational ticket ${res.ticket.ticket_code} created successfully.`);
      } else {
        triggerFlash(res?.error || "Failed to create ticket.", "error");
      }
    });
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Flash Alert Banner */}
      {flashMessage && (
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all animate-fadeIn ${
            flashMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-500/50 text-red-800 dark:text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {flashMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span>{flashMessage.text}</span>
          </div>
          <button
            onClick={() => setFlashMessage(null)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Enterprise Operations Banner */}
      <div className="bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold tracking-widest text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20">
                SOVEREIGN GOVERNANCE KERNEL
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                ENFORCED ISOLATION
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-mono font-black tracking-tight text-slate-900 dark:text-white mt-2">
              Platform Root Operations &amp; Ticket Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono mt-1 max-w-3xl">
              Dedicated superuser interface without sovereign family attachment. Manage family members, multi-tenant boundaries, and system access through authenticated governance tickets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-md dark:shadow-emerald-950/40"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>LOG GOVERNANCE TICKET</span>
            </Button>
          </div>
        </div>

        {/* Telemetry Health Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Tickets
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                {ticketsList.filter((t) => t.status === "open").length}
              </span>
              {ticketsList.some((t) => t.status === "open") && (
                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-ping" />
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Families
            </div>
            <div className="font-mono text-xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.totalFamilies}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Platform Accounts
            </div>
            <div className="font-mono text-xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.totalUsers}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Family Memberships
            </div>
            <div className="font-mono text-xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.totalMembers}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Vault Stories
            </div>
            <div className="font-mono text-xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.totalPosts}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Invites
            </div>
            <div className="font-mono text-xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.activeInvites}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap font-bold ${
              activeTab === "tickets"
                ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>TICKETS WORKBENCH</span>
            {ticketsList.filter((t) => t.status === "open").length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px]">
                {ticketsList.filter((t) => t.status === "open").length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("families")}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap font-bold ${
              activeTab === "families"
                ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>SOVEREIGN FAMILIES ({families.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap font-bold ${
              activeTab === "users"
                ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>USERS &amp; ROLES ({userList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invites")}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap font-bold ${
              activeTab === "invites"
                ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>INVITES LEDGER ({invites.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap font-bold ${
              activeTab === "audit"
                ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>AUDIT TRAIL ({auditLogs.length})</span>
          </button>
        </div>

        {/* Global Tab Search */}
        {activeTab !== "tickets" && (
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={`Filter ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-4 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {/* ================= TAB 1: SUPPORT & GOVERNANCE TICKETS ================= */}
      {activeTab === "tickets" && (
        <div className="space-y-4">
          {/* Ticket Filter Bar */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ticket code, requester, subject, or family..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">ALL STATUSES</option>
                <option value="open">OPEN (PENDING)</option>
                <option value="in_progress">IN PROGRESS</option>
                <option value="resolved">RESOLVED</option>
                <option value="closed">CLOSED</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">ALL PRIORITIES</option>
                <option value="critical">CRITICAL SLA</option>
                <option value="high">HIGH</option>
                <option value="medium">MEDIUM</option>
                <option value="low">LOW</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">ALL CATEGORIES</option>
                <option value="password_reset">PASSWORD RESET</option>
                <option value="tag_change">TAG CHANGE</option>
                <option value="member_removal">MEMBER REMOVAL</option>
                <option value="access_control">ACCESS CONTROL</option>
                <option value="organizer_handover">ORGANIZER HANDOVER</option>
                <option value="family_deletion">FAMILY DELETION</option>
                <option value="general_support">GENERAL SUPPORT</option>
              </select>
            </div>
          </div>

          {/* Tickets Ledger Table / Cards */}
          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/40">
                <ShieldCheck className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                <p className="font-mono text-sm text-slate-600 dark:text-slate-400">No governance tickets match the active filters.</p>
                <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-1">Platform operations are currently clear.</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`border rounded-xl p-4 sm:p-5 transition-all ${
                    ticket.status === "open" && ticket.priority === "critical"
                      ? "bg-red-50/70 dark:bg-red-950/20 border-red-300 dark:border-red-500/40 shadow-md dark:shadow-red-950/20"
                      : ticket.status === "open"
                      ? "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-700/80 shadow-sm dark:shadow-md"
                      : "bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 opacity-95"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex flex-wrap items-center gap-2 font-mono">
                      {/* Monospace Code */}
                      <span className="font-bold text-sm text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        #{ticket.ticket_code}
                      </span>

                      {/* Priority Badge */}
                      {ticket.priority === "critical" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-ping inline-block" />
                          CRITICAL SLA
                        </span>
                      )}
                      {ticket.priority === "high" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40">
                          HIGH
                        </span>
                      )}
                      {ticket.priority === "medium" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40">
                          MEDIUM
                        </span>
                      )}
                      {ticket.priority === "low" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700/40 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                          LOW
                        </span>
                      )}

                      {/* Status Badge */}
                      {ticket.status === "open" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                          ● OPEN
                        </span>
                      )}
                      {ticket.status === "in_progress" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
                          ● IN PROGRESS
                        </span>
                      )}
                      {ticket.status === "resolved" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> RESOLVED
                        </span>
                      )}
                      {ticket.status === "closed" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          CLOSED
                        </span>
                      )}

                      {/* Category Badge */}
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {ticket.category.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span suppressHydrationWarning>{formatUtcDate(ticket.created_at, true)}</span>
                    </div>
                  </div>

                  {/* Ticket Main Content */}
                  <div className="py-3">
                    <h3 className="font-mono font-bold text-base text-slate-900 dark:text-white">{ticket.subject}</h3>
                    <p className="font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>

                  {/* Metadata Bar */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 rounded-lg p-3 border border-slate-200 dark:border-slate-800/80 font-mono text-xs grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <span className="text-slate-500 dark:text-slate-500 text-[10px] block uppercase">Designated Family:</span>
                      <span className="text-slate-900 dark:text-slate-200 font-semibold truncate block">
                        {ticket.family_name ? ticket.family_name : "Global / Platform-wide"}
                      </span>
                      {ticket.family_id && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                          ID: {ticket.family_id}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-slate-500 text-[10px] block uppercase">Requester:</span>
                      <span className="text-slate-900 dark:text-slate-200 font-semibold truncate block">
                        {ticket.requester_email}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-slate-500 text-[10px] block uppercase">Target Entity:</span>
                      <span className="text-slate-900 dark:text-slate-200 font-semibold truncate block">
                        {ticket.target_entity_type || "N/A"}{" "}
                        {ticket.target_entity_id ? `(${ticket.target_entity_id.slice(0, 8)}...)` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Resolution Report if Resolved */}
                  {ticket.status === "resolved" && ticket.resolution_note && (
                    <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 rounded-lg font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolution Record</span>
                        {ticket.resolved_at && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal" suppressHydrationWarning>
                            ({formatUtcDate(ticket.resolved_at, true)})
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-sans text-xs leading-relaxed">
                        {ticket.resolution_note}
                      </p>
                    </div>
                  )}

                  {/* Action Intervention Controls */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Contextual Action Execution Trigger */}
                      {ticket.status !== "resolved" && (
                        <>
                          {ticket.category === "password_reset" && (
                            <Button
                              onClick={() => {
                                setActionTicket(ticket);
                                setActionType("generate_reset_code");
                              }}
                              className="bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Issue Reset Code</span>
                            </Button>
                          )}

                          {ticket.category === "tag_change" && (
                            <Button
                              onClick={() => {
                                setActionTicket(ticket);
                                setActionType("approve_tag_change");
                              }}
                              className="bg-teal-100 dark:bg-teal-500/20 hover:bg-teal-200 dark:hover:bg-teal-500/30 border border-teal-300 dark:border-teal-500/40 text-teal-900 dark:text-teal-300 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Approve Tag Change</span>
                            </Button>
                          )}

                          {ticket.category === "member_removal" && (
                            <Button
                              onClick={() => {
                                setActionTicket(ticket);
                                setActionType("remove_member");
                              }}
                              className="bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 border border-red-300 dark:border-red-500/40 text-red-900 dark:text-red-300 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Execute Member Removal</span>
                            </Button>
                          )}

                          {ticket.category === "organizer_handover" && (
                            <Button
                              onClick={() => {
                                setActionTicket(ticket);
                                setActionType("change_role");
                              }}
                              className="bg-blue-100 dark:bg-blue-500/20 hover:bg-blue-200 dark:hover:bg-blue-500/30 border border-blue-300 dark:border-blue-500/40 text-blue-900 dark:text-blue-300 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                              <span>Reassign Family Role</span>
                            </Button>
                          )}

                          {ticket.category === "access_control" && (
                            <Button
                              onClick={() => {
                                setActionTicket(ticket);
                                setActionType("toggle_superadmin");
                              }}
                              className="bg-purple-100 dark:bg-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/30 border border-purple-300 dark:border-purple-500/40 text-purple-900 dark:text-purple-300 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Adjust Superadmin Status</span>
                            </Button>
                          )}

                          {ticket.category === "family_deletion" && (
                            <Button
                              onClick={() => {
                                setActionTicket(ticket);
                                setActionType("delete_family");
                              }}
                              className="bg-red-200 dark:bg-red-600/30 hover:bg-red-300 dark:hover:bg-red-600/40 border border-red-300 dark:border-red-500 text-red-950 dark:text-red-200 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Decommission Family</span>
                            </Button>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedTicketForResolution(ticket);
                          setNewStatusInput(ticket.status === "open" ? "resolved" : "closed");
                          setResolutionInput(ticket.resolution_note || "");
                        }}
                        className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        <span>Update Status &amp; Note</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: SOVEREIGN FAMILIES ================= */}
      {activeTab === "families" && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm dark:shadow-xl">
          <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="font-mono text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Sovereign Multi-Tenant Families Directory</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                {filteredFamilies.length} Registered Living Rooms
              </span>
            </CardTitle>
            <CardDescription className="font-mono text-xs text-slate-600 dark:text-slate-400">
              Complete catalog of families with member statistics and direct ticket governance dispatch.
            </CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Family Sanctuary</th>
                  <th className="py-3 px-4">Motto / Banner</th>
                  <th className="py-3 px-4">Founding Creator</th>
                  <th className="py-3 px-4 text-center">Kin Members</th>
                  <th className="py-3 px-4 text-center">Vault Posts</th>
                  <th className="py-3 px-4 text-center">Active Invites</th>
                  <th className="py-3 px-4">Established</th>
                  <th className="py-3 px-4 text-right">Governance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {filteredFamilies.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No families match active search.
                    </td>
                  </tr>
                ) : (
                  filteredFamilies.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {f.avatar_url ? (
                            <img
                              src={f.avatar_url}
                              alt={f.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                              {f.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{f.name}</span>
                            <button
                              onClick={() => copyToClipboard(f.id, f.id)}
                              className="text-[10px] text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                              title="Copy UUID"
                            >
                              <span>{f.id.slice(0, 14)}...</span>
                              <Copy className="w-2.5 h-2.5" />
                              {copiedId === f.id && <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>}
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs font-sans">
                        <p className="text-slate-700 dark:text-slate-300 text-xs line-clamp-1">
                          {f.description || <span className="text-slate-400 dark:text-slate-600 italic">No motto provided</span>}
                        </p>
                        {f.backdrop_url && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                            <ImageIcon className="w-3 h-3" />
                            <span>Canopy Active</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{f.creator_name || "Unknown"}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                          {f.creator_email || "N/A"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
                          {f.members_count}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-slate-700 dark:text-slate-300">{f.posts_count}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {f.active_invites_count > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[10px] font-bold">
                            {f.active_invites_count} active
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 text-xs">0</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap" suppressHydrationWarning>
                        {formatUtcDate(f.created_at, false)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          onClick={() => {
                            setShowCreateModal(true);
                          }}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 border border-slate-300 dark:border-slate-700 font-mono text-xs px-2.5 py-1 rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          <span>Raise Ticket</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ================= TAB 3: USERS & ROLES ================= */}
      {activeTab === "users" && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm dark:shadow-xl">
          <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="font-mono text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Platform Users Directory &amp; Role Enforcement</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                {filteredUsers.length} Registered Accounts
              </span>
            </CardTitle>
            <CardDescription className="font-mono text-xs text-slate-600 dark:text-slate-400">
              Audit user accounts, cross-family memberships, and superadmin root permission status.
            </CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Relative / User</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Family Memberships</th>
                  <th className="py-3 px-4 text-center">Activity</th>
                  <th className="py-3 px-4 text-center">Platform Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Superadmin Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No users match query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                              {u.id.slice(0, 14)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{u.email}</td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.memberships.length === 0 ? (
                            <span className="text-slate-400 dark:text-slate-600 italic">No family linked</span>
                          ) : (
                            u.memberships.map((m) => (
                              <span
                                key={m.family_id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px]"
                              >
                                <span className="text-slate-800 dark:text-slate-200">{m.family_name}</span>
                                <span
                                  className={`font-bold ${
                                    m.role === "admin" ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"
                                  }`}
                                >
                                  ({m.role})
                                </span>
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-slate-700 dark:text-slate-300">
                          {u.posts_count} posts · {u.comments_count} cmts
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {u.is_superadmin ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[10px] font-bold">
                            ROOT SUPERADMIN
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-500 text-[10px]">STANDARD USER</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap" suppressHydrationWarning>
                        {formatUtcDate(u.created_at, false)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          disabled={actionLoadingId === u.id || isPending}
                          onClick={() => handleToggleSuperadmin(u.id)}
                          className={`font-mono text-xs px-3 py-1 rounded cursor-pointer transition-all ${
                            u.is_superadmin
                              ? "bg-red-50 dark:bg-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/30 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300"
                              : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {actionLoadingId === u.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : u.is_superadmin ? (
                            "Revoke Superadmin"
                          ) : (
                            "Grant Superadmin"
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ================= TAB 4: INVITES LEDGER ================= */}
      {activeTab === "invites" && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm dark:shadow-xl">
          <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="font-mono text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Platform Invitation Tokens Ledger</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{filteredInvites.length} Records</span>
            </CardTitle>
            <CardDescription className="font-mono text-xs text-slate-600 dark:text-slate-400">
              Audit invite token generation, family destination, and claim timestamps.
            </CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Token Secret</th>
                  <th className="py-3 px-4">Family Destination</th>
                  <th className="py-3 px-4">Generated By</th>
                  <th className="py-3 px-4">Token Status</th>
                  <th className="py-3 px-4">Expires At</th>
                  <th className="py-3 px-4">Issued At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {filteredInvites.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No invites match query.
                    </td>
                  </tr>
                ) : (
                  filteredInvites.map((inv) => {
                    const isExpired = new Date(inv.expires_at) < new Date();
                    const isClaimed = Boolean(inv.used_at);

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => copyToClipboard(inv.token, inv.id)}
                            className="font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{inv.token.slice(0, 16)}...</span>
                            <Copy className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            {copiedId === inv.id && <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">Copied!</span>}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{inv.family_name}</td>

                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{inv.creator_name}</td>

                        <td className="py-3.5 px-4" suppressHydrationWarning>
                          {isClaimed ? (
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                              Claimed
                            </span>
                          ) : isExpired ? (
                            <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-[10px]">
                              Expired
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[10px] font-bold">
                              Active Token
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400" suppressHydrationWarning>
                          {formatUtcDate(inv.expires_at, true)}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400" suppressHydrationWarning>
                          {formatUtcDate(inv.created_at, true)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ================= TAB 5: AUDIT TRAIL ================= */}
      {activeTab === "audit" && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm dark:shadow-xl">
          <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="font-mono text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>System &amp; Governance Security Audit Logs</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Immutable Ledger</span>
            </CardTitle>
            <CardDescription className="font-mono text-xs text-slate-600 dark:text-slate-400">
              Live chronological telemetry of administrative actions, ticket resolutions, and entity mutations.
            </CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Family Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No audit events recorded.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap" suppressHydrationWarning>
                        {formatUtcDate(log.created_at, true)}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {log.actor_name || "System"}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-300 dark:border-slate-700 text-[10px] font-bold">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 uppercase text-[10px]">
                        {log.entity_type}
                      </td>

                      <td className="py-3 px-4 text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                        {log.entity_id ? `${log.entity_id.slice(0, 14)}...` : "—"}
                      </td>

                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-bold">
                        {log.family_name || "Platform-wide"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ================= MODAL: CREATE OPERATIONAL TICKET ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-mono font-bold text-base text-slate-900 dark:text-white">Log Operational Governance Ticket</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Target Family (Optional):</label>
                <select
                  name="familyId"
                  className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Platform-wide / Sovereign Unlinked</option>
                  {families.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.members_count} members)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Category *:</label>
                  <select
                    name="category"
                    required
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="password_reset">Password Reset Code</option>
                    <option value="tag_change">Profile Kin Tag Change</option>
                    <option value="member_removal">Member Removal</option>
                    <option value="access_control">Access Control / Privileges</option>
                    <option value="organizer_handover">Organizer Handover</option>
                    <option value="family_deletion">Family Decommission</option>
                    <option value="general_support">General Platform Support</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Priority SLA *:</label>
                  <select
                    name="priority"
                    required
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="medium">Medium</option>
                    <option value="critical">Critical SLA</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Requester Email *:</label>
                <input
                  type="email"
                  name="requesterEmail"
                  required
                  placeholder="e.g. organizer@kinship.local"
                  className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Target Entity Type:</label>
                  <select
                    name="targetEntityType"
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="user">User</option>
                    <option value="family">Family</option>
                    <option value="access_control">Access Control</option>
                    <option value="post">Post</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Target Entity ID (Optional UUID):</label>
                  <input
                    type="text"
                    name="targetEntityId"
                    placeholder="User or Entity UUID"
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Ticket Subject *:</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Brief summary of requested governance intervention..."
                  className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Detailed Description *:</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Full background context, justification, and operational request..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  {isPending ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: STATUS & NOTE UPDATE ================= */}
      {selectedTicketForResolution && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  Update #{selectedTicketForResolution.ticket_code}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTicketForResolution(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusUpdateSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Set Status:</label>
                <select
                  value={newStatusInput}
                  onChange={(e) => setNewStatusInput(e.target.value as any)}
                  className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Resolution Summary / Note:</label>
                <textarea
                  value={resolutionInput}
                  onChange={(e) => setResolutionInput(e.target.value)}
                  rows={4}
                  placeholder="Record intervention details, verified facts, or closure reason..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedTicketForResolution(null)}
                  className="border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  {isPending ? "Saving..." : "Save Resolution"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EXECUTE GOVERNANCE INTERVENTION ================= */}
      {actionTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e131f] border border-red-300 dark:border-red-500/30 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h2 className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  Execute Governance Intervention
                </h2>
              </div>
              <button
                onClick={() => setActionTicket(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer font-mono"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 rounded-lg text-xs font-mono text-red-800 dark:text-red-300">
              <p className="font-bold">Authorizing operational action on #{actionTicket.ticket_code}</p>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                {actionType === "generate_reset_code" && "Generates and logs a secure password reset token for the user."}
                {actionType === "approve_tag_change" && "Applies the requested custom tag to the member's living room profile."}
                {actionType === "remove_member" && "Removes member from living room directory and clears active membership."}
                {actionType === "change_role" && "Updates member role permissions within the living room."}
                {actionType === "toggle_superadmin" && "Grants or revokes sovereign platform root administration permissions."}
                {actionType === "delete_family" && "Irrevocably decommissions family workspace and associated resources."}
              </p>
            </div>

            <form onSubmit={handleExecuteTicketActionSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Target Action Type:</label>
                <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold uppercase">
                  {actionType.replace(/_/g, " ")}
                </div>
              </div>

              {actionType === "change_role" && (
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Assign New Role:</label>
                  <select
                    value={actionRole}
                    onChange={(e) => setActionRole(e.target.value as any)}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="admin">Promote to Family Admin</option>
                    <option value="member">Demote to Standard Member</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Audit Justification Note:</label>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  rows={3}
                  placeholder={
                    actionType === "approve_tag_change"
                      ? "Optionally enter explicit new tag name (leave blank to use requested tag in ticket subject)..."
                      : "Provide explicit operational rationale for this intervention..."
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActionTicket(null)}
                  className="border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                >
                  {isPending ? "Executing..." : "Confirm & Execute Action"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
