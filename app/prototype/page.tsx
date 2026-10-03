"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Camera,
  Mic,
  Cake,
  Calendar,
  Users,
  Clock,
  ChevronRight,
  MapPin,
  Utensils,
  Sun,
  Moon,
  ArrowLeft,
  Sparkles,
  Volume2,
  Bookmark,
  Layers,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Plus,
} from "lucide-react";
import Link from "next/link";

// Mock Family Data
const INITIAL_POSTS = [
  {
    id: "p1",
    author: "Sarah Miller",
    relationship: "Mother",
    category: "photos",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    timeAgo: "2h ago",
    badge: "Milestone",
    content: "Lucas finally mastered riding his bicycle without training wheels today at the park! Two weeks of skinned knees and persistence paid off. 🚲",
    images: [
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=1000&q=80",
    ],
    likes: 8,
    hasLiked: false,
    comments: [
      { id: "c1", author: "Rose Miller (Grandma)", text: "Look at my big boy! Reminds me so much of your brother at that age." },
      { id: "c2", author: "Uncle Dave", text: "Big milestone! Bringing him a classic bell this Sunday." },
    ],
  },
  {
    id: "p2",
    author: "Rose Miller",
    relationship: "Grandmother",
    category: "audio",
    avatar: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=160&q=80",
    timeAgo: "Yesterday",
    badge: "Family Recipe",
    content: "Made the traditional cinnamon apple skillet tart from our 1954 family cookbook. Leaving two fresh slices in the fridge for whoever drops by this afternoon.",
    images: [
      "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=1000&q=80",
    ],
    hasAudioMemo: true,
    audioDuration: "1:42",
    likes: 12,
    hasLiked: true,
    comments: [
      { id: "c3", author: "Lucas", text: "Dibs on the bigger slice! Coming over right after practice." },
    ],
  },
];

const CELEBRATIONS = [
  {
    id: "m1",
    title: "Rose's 78th Birthday",
    date: "In 4 Days",
    exactDate: "Oct 6",
    type: "Birthday",
    pill: "Birthday Card Open",
    note: "Digital card is open. 5 relatives have written secret messages.",
  },
  {
    id: "m2",
    title: "David & Clara's 15th Anniversary",
    date: "Oct 24",
    exactDate: "Oct 24",
    type: "Anniversary",
    pill: "Coordination",
    note: "Coordinating a private family anniversary dinner.",
  },
];

const FAMILY_MEMBERS = [
  { name: "Rose Miller (Grandma)", role: "Matriarch", img: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=160&q=80" },
  { name: "Mark Miller (Dad)", role: "Father", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
  { name: "Sarah Miller (Mom)", role: "Mother", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80" },
  { name: "Clara Vance (Aunt)", role: "Aunt", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80" },
  { name: "David Vance (Uncle)", role: "Uncle", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
  { name: "Lucas Miller (Son)", role: "Son", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80" },
];

const FAMILY_TREE_NODES = [
  {
    generation: "1st Generation &bull; Grandparents",
    members: [
      { name: "Arthur Miller †", relation: "Grandfather", lifespan: "1942–2021", pill: "Patriarch", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
      { name: "Rose Miller", relation: "Grandmother", lifespan: "Born 1948", pill: "Matriarch", avatar: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=120&q=80" },
    ],
  },
  {
    generation: "2nd Generation &bull; Parents & Relatives",
    members: [
      { name: "Mark Miller", relation: "Father", lifespan: "Born 1976", pill: "Organizer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" },
      { name: "Sarah Miller", relation: "Mother", lifespan: "Born 1978", pill: "Editor", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" },
      { name: "Clara Vance", relation: "Aunt", lifespan: "Born 1982", pill: "Member", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" },
      { name: "David Vance", relation: "Uncle", lifespan: "Born 1980", pill: "Member", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
    ],
  },
  {
    generation: "3rd Generation &bull; Children & Cousins",
    members: [
      { name: "Maya Miller", relation: "Daughter", lifespan: "Born 2012", pill: "Youth", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" },
      { name: "Lucas Miller", relation: "Son", lifespan: "Born 2015", pill: "Youth", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" },
      { name: "Leo Vance", relation: "Cousin", lifespan: "Born 2018", pill: "Youth", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80" },
    ],
  },
];

export default function KinshipPrototype() {
  const [activeTab, setActiveTab] = useState<"feed" | "moments" | "gatherings" | "tree">("feed");
  const [feedFilter, setFeedFilter] = useState<"all" | "photos" | "audio">("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"going" | "tentative" | null>("going");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [invitedRelative, setInvitedRelative] = useState(false);

  // High-Contrast Monochrome Tokens with Guaranteed Legibility
  const theme = {
    canvas: isDarkMode ? "#09090b" : "#fbfbfd",
    surface: isDarkMode ? "#141417" : "#ffffff",
    surfaceElevated: isDarkMode ? "#1c1c21" : "#ffffff",
    subtle: isDarkMode ? "#1f1f24" : "#f4f4f6",
    subtleHover: isDarkMode ? "#27272e" : "#eaeaea",
    border: isDarkMode ? "#282830" : "#e6e6ec",
    borderSubtle: isDarkMode ? "#1f1f26" : "#f0f0f4",
    textPrimary: isDarkMode ? "#fafafa" : "#09090b",
    textBody: isDarkMode ? "#e4e4e7" : "#18181b",
    textSecondary: isDarkMode ? "#a1a1aa" : "#52525b",
    textMuted: isDarkMode ? "#71717a" : "#71717a",
    btnPrimaryBg: isDarkMode ? "#fafafa" : "#09090b",
    btnPrimaryText: isDarkMode ? "#09090b" : "#fafafa",
    pillActiveBg: isDarkMode ? "#fafafa" : "#09090b",
    pillActiveText: isDarkMode ? "#09090b" : "#fafafa",
    pillInactiveBg: isDarkMode ? "#1f1f24" : "#f0f0f3",
    pillInactiveText: isDarkMode ? "#a1a1aa" : "#52525b",
    pillBorder: isDarkMode ? "#282830" : "#e4e4e7",
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const nextState = !post.hasLiked;
          return {
            ...post,
            hasLiked: nextState,
            likes: nextState ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, { id: `c-${Date.now()}`, author: "Mark (Dad)", text }],
          };
        }
        return p;
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: `p-${Date.now()}`,
      author: "Mark Miller",
      relationship: "Father",
      category: "all",
      badge: "Quick Note",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
      timeAgo: "Just now",
      content: newPostText,
      images: [],
      likes: 1,
      hasLiked: true,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  // Filter posts based on active quick filter pill
  const filteredPosts = posts.filter((p) => {
    if (feedFilter === "photos") return p.images && p.images.length > 0;
    if (feedFilter === "audio") return p.hasAudioMemo;
    return true;
  });

  return (
    <div
      style={{
        backgroundColor: theme.canvas,
        color: theme.textPrimary,
        minHeight: "100vh",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      className={`antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900 transition-colors duration-200 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/feed"
              style={{ color: theme.textSecondary }}
              className="hover:opacity-80 flex items-center gap-1.5 text-xs font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </Link>
            <span style={{ color: theme.border }} className="hidden sm:inline">|</span>
            <span
              style={{
                backgroundColor: theme.subtle,
                color: theme.textPrimary,
                borderColor: theme.border,
              }}
              className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-semibold tracking-wider hidden sm:inline"
            >
              Prototype Sandbox
            </span>
          </div>

          {/* Theme & Profile Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                backgroundColor: theme.subtle,
                borderColor: theme.border,
                color: theme.textPrimary,
              }}
              className="h-8 px-3.5 rounded-full border text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-zinc-100 stroke-[1.8]" />
                  <span className="text-[11px] font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-zinc-800 stroke-[1.8]" />
                  <span className="text-[11px] font-medium">Dark</span>
                </>
              )}
            </button>

            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="You"
              style={{ borderColor: theme.border }}
              className="w-8 h-8 rounded-full object-cover border"
            />
          </div>
        </div>
      </header>

      {/* Main Living Room Canvas */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24">
        {/* REFINED ARCHITECTURAL FAMILY LIVING ROOM BANNER */}
        <section
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
          className="border rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.25)] mb-8 overflow-hidden relative"
        >
          {/* Subtle Panoramic Hearth Cover */}
          <div className="relative h-32 sm:h-44 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=80"
              alt="Family Lake Scenery"
              className="w-full h-full object-cover object-center filter grayscale-[35%] dark:grayscale-[50%] brightness-[94%] dark:brightness-[55%]"
            />
            {/* Seamless Gradient Fade to Card Surface */}
            <div
              className="absolute inset-0"
              style={{
                background: isDarkMode
                  ? "linear-gradient(to top, #141417 0%, rgba(20,20,23,0.7) 45%, rgba(20,20,23,0.1) 100%)"
                  : "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0.1) 100%)",
              }}
            />

            {/* Top Right Location & Heritage Pill */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-6 flex items-center gap-2">
              <span
                style={{
                  backgroundColor: isDarkMode ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.85)",
                  borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
                  color: theme.textPrimary,
                }}
                className="backdrop-blur-md border px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>Oakridge Estate &bull; Established 2010</span>
              </span>
            </div>
          </div>

          {/* Main Content Area Overlapping the Cover */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-7 -mt-12 sm:-mt-14 relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            {/* Monogram Seal & Family Identity */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
              {/* Double-Ring Seal Monogram */}
              <div
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-[26px] border-2 shadow-xl p-1.5 shrink-0 flex items-center justify-center relative select-none"
              >
                <div
                  style={{
                    backgroundColor: theme.btnPrimaryBg,
                    color: theme.btnPrimaryText,
                  }}
                  className="w-full h-full rounded-[20px] flex flex-col items-center justify-center font-bold text-2xl sm:text-3xl tracking-tight shadow-sm"
                >
                  M
                  <span className="text-[8px] font-mono tracking-widest uppercase font-semibold opacity-70 leading-none mt-0.5">
                    MILLER
                  </span>
                </div>

                {/* Pulsing Active Indicator */}
                <span
                  title="Sanctuary Active &bull; 6 Members Online"
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-900" />
                </span>
              </div>

              {/* Title & Family Motto */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1
                    style={{ color: theme.textPrimary }}
                    className="font-bold text-2xl sm:text-3xl tracking-[-0.03em] leading-tight"
                  >
                    The Miller Family
                  </h1>
                  <span
                    style={{
                      backgroundColor: theme.subtle,
                      borderColor: theme.border,
                      color: theme.textSecondary,
                    }}
                    className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Private Sanctuary</span>
                  </span>
                </div>
                <p
                  style={{ color: theme.textSecondary }}
                  className="text-[13px] sm:text-[14px] font-normal italic leading-relaxed"
                >
                  “Cherishing small moments, holding close across every distance.”
                </p>
              </div>
            </div>

            {/* Member Facepile & Interactive Invite Button */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0 pt-2 lg:pt-0">
              <div className="flex items-center gap-2">
                <span style={{ color: theme.textSecondary }} className="text-xs font-medium hidden sm:inline">
                  Circle:
                </span>
                <div className="flex -space-x-2.5 overflow-hidden py-1">
                  {FAMILY_MEMBERS.map((m, idx) => (
                    <img
                      key={idx}
                      src={m.img}
                      alt={m.name}
                      title={`${m.name} (${m.role})`}
                      style={{ borderColor: theme.surface }}
                      className="w-8 h-8 rounded-full object-cover border-2 shadow-sm hover:-translate-y-1 transition duration-150 cursor-pointer"
                    />
                  ))}
                </div>

                {/* Invite Relative Action Pill */}
                <button
                  onClick={() => {
                    setInvitedRelative(true);
                    setTimeout(() => setInvitedRelative(false), 2500);
                  }}
                  style={{
                    backgroundColor: invitedRelative ? "#10b981" : theme.subtle,
                    borderColor: theme.border,
                    color: invitedRelative ? "#ffffff" : theme.textPrimary,
                  }}
                  className="h-8 px-3 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 hover:opacity-80 transition ml-1 shadow-sm"
                >
                  {invitedRelative ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2]" />
                      <span>Invite</span>
                    </>
                  )}
                </button>
              </div>
              <span style={{ color: theme.textMuted }} className="text-[11px]">
                6 Family Members Connected &bull; 0 Outsiders
              </span>
            </div>
          </div>

          {/* Lower Architectural Vitals Tray */}
          <div
            style={{
              backgroundColor: theme.subtle,
              borderColor: theme.border,
            }}
            className="border-t px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs"
          >
            {/* 3 Metric Clusters */}
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[11px] font-bold">01</span>
                <div>
                  <span
                    style={{ color: theme.textPrimary }}
                    className="font-bold block text-sm leading-none"
                  >
                    324
                  </span>
                  <span style={{ color: theme.textSecondary }} className="text-[11px]">
                    Memories Shared
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[11px] font-bold">02</span>
                <div>
                  <span
                    style={{ color: theme.textPrimary }}
                    className="font-bold block text-sm leading-none"
                  >
                    3
                  </span>
                  <span style={{ color: theme.textSecondary }} className="text-[11px]">
                    Generations
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[11px] font-bold">03</span>
                <div>
                  <span
                    style={{ color: theme.textPrimary }}
                    className="font-bold block text-sm leading-none"
                  >
                    Oct 6
                  </span>
                  <span style={{ color: theme.textSecondary }} className="text-[11px]">
                    Rose's 78th Birthday
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Event Pill */}
            <div className="flex items-center gap-2">
              <span style={{ color: theme.textSecondary }} className="text-[11px] font-medium hidden md:inline">
                Next gathering:
              </span>
              <span
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
                className="text-[11px] font-semibold px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Sunday Lawn Roast &bull; Oct 12</span>
              </span>
            </div>
          </div>
        </section>

        {/* Dynamic Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* PRIMARY COLUMN: Activity Stream & Modules (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* UPGRADED PROMINENT TAB BAR WITH MATCHING FONT, SIZES & PILLS */}
            <nav
              style={{
                backgroundColor: theme.subtle,
                borderColor: theme.border,
              }}
              className="p-1.5 rounded-full border flex items-center shadow-sm gap-1"
            >
              <button
                onClick={() => setActiveTab("feed")}
                style={{
                  backgroundColor: activeTab === "feed" ? theme.surface : "transparent",
                  color: activeTab === "feed" ? theme.textPrimary : theme.textSecondary,
                  boxShadow: activeTab === "feed" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}
                className="flex-1 h-10 px-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em]"
              >
                <Layers className="w-4 h-4 stroke-[1.8]" />
                <span>Stream</span>
                <span
                  style={{
                    backgroundColor: activeTab === "feed" ? theme.subtle : "transparent",
                    color: theme.textSecondary,
                  }}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10 hidden sm:inline"
                >
                  {posts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("moments")}
                style={{
                  backgroundColor: activeTab === "moments" ? theme.surface : "transparent",
                  color: activeTab === "moments" ? theme.textPrimary : theme.textSecondary,
                  boxShadow: activeTab === "moments" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}
                className="flex-1 h-10 px-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em]"
              >
                <Cake className="w-4 h-4 stroke-[1.8]" />
                <span>Milestones</span>
                <span
                  style={{
                    backgroundColor: activeTab === "moments" ? theme.subtle : "transparent",
                    color: theme.textSecondary,
                  }}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10 hidden sm:inline"
                >
                  {CELEBRATIONS.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("gatherings")}
                style={{
                  backgroundColor: activeTab === "gatherings" ? theme.surface : "transparent",
                  color: activeTab === "gatherings" ? theme.textPrimary : theme.textSecondary,
                  boxShadow: activeTab === "gatherings" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}
                className="flex-1 h-10 px-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em]"
              >
                <Calendar className="w-4 h-4 stroke-[1.8]" />
                <span>Gatherings</span>
                <span
                  style={{
                    backgroundColor: activeTab === "gatherings" ? theme.subtle : "transparent",
                    color: theme.textSecondary,
                  }}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10 hidden sm:inline"
                >
                  1
                </span>
              </button>

              <button
                onClick={() => setActiveTab("tree")}
                style={{
                  backgroundColor: activeTab === "tree" ? theme.surface : "transparent",
                  color: activeTab === "tree" ? theme.textPrimary : theme.textSecondary,
                  boxShadow: activeTab === "tree" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}
                className="flex-1 h-10 px-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em]"
              >
                <Users className="w-4 h-4 stroke-[1.8]" />
                <span>Roots</span>
                <span
                  style={{
                    backgroundColor: activeTab === "tree" ? theme.subtle : "transparent",
                    color: theme.textSecondary,
                  }}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10 hidden sm:inline"
                >
                  3G
                </span>
              </button>
            </nav>

            {/* TAB: STREAM / FEED */}
            {activeTab === "feed" && (
              <div className="space-y-6">
                {/* INTERACTIVE TOPIC FILTER PILLS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                  <span
                    style={{ color: theme.textSecondary }}
                    className="text-xs font-medium mr-1 uppercase tracking-wider text-[11px] shrink-0"
                  >
                    Filter:
                  </span>
                  <button
                    onClick={() => setFeedFilter("all")}
                    style={{
                      backgroundColor:
                        feedFilter === "all" ? theme.pillActiveBg : theme.pillInactiveBg,
                      color:
                        feedFilter === "all" ? theme.pillActiveText : theme.pillInactiveText,
                      borderColor: theme.pillBorder,
                    }}
                    className="h-7 px-3.5 rounded-full border text-xs font-semibold tracking-tight transition-all duration-150 flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Flame className="w-3 h-3" />
                    <span>All Moments</span>
                  </button>

                  <button
                    onClick={() => setFeedFilter("photos")}
                    style={{
                      backgroundColor:
                        feedFilter === "photos" ? theme.pillActiveBg : theme.pillInactiveBg,
                      color:
                        feedFilter === "photos" ? theme.pillActiveText : theme.pillInactiveText,
                      borderColor: theme.pillBorder,
                    }}
                    className="h-7 px-3.5 rounded-full border text-xs font-semibold tracking-tight transition-all duration-150 flex items-center gap-1.5 shrink-0"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Photos Only</span>
                  </button>

                  <button
                    onClick={() => setFeedFilter("audio")}
                    style={{
                      backgroundColor:
                        feedFilter === "audio" ? theme.pillActiveBg : theme.pillInactiveBg,
                      color:
                        feedFilter === "audio" ? theme.pillActiveText : theme.pillInactiveText,
                      borderColor: theme.pillBorder,
                    }}
                    className="h-7 px-3.5 rounded-full border text-xs font-semibold tracking-tight transition-all duration-150 flex items-center gap-1.5 shrink-0"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Voice Stories</span>
                  </button>
                </div>

                {/* Clean Floating Post Composer */}
                <div
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }}
                  className="border rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                >
                  <form onSubmit={handleCreatePost}>
                    <div className="flex gap-3.5">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        alt="Mark Miller"
                        style={{ borderColor: theme.border }}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newPostText}
                          onChange={(e) => setNewPostText(e.target.value)}
                          placeholder="Share a thought, school win, or family story..."
                          rows={2}
                          style={{ color: theme.textPrimary }}
                          className="w-full bg-transparent resize-none text-[14px] leading-relaxed placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div
                      style={{ borderColor: theme.borderSubtle }}
                      className="flex items-center justify-between pt-3 mt-2 border-t"
                    >
                      {/* COMPOSER PILLS */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          style={{
                            color: theme.textSecondary,
                            backgroundColor: theme.subtle,
                            borderColor: theme.border,
                          }}
                          className="h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition"
                        >
                          <Camera className="w-3.5 h-3.5 stroke-[1.8]" />
                          <span>Photos</span>
                        </button>
                        <button
                          type="button"
                          style={{
                            color: theme.textSecondary,
                            backgroundColor: theme.subtle,
                            borderColor: theme.border,
                          }}
                          className="h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition"
                        >
                          <Mic className="w-3.5 h-3.5 stroke-[1.8]" />
                          <span>Voice</span>
                        </button>
                        <button
                          type="button"
                          style={{
                            color: theme.textSecondary,
                            backgroundColor: theme.subtle,
                            borderColor: theme.border,
                          }}
                          className="h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition hidden sm:flex"
                        >
                          <Utensils className="w-3.5 h-3.5 stroke-[1.8]" />
                          <span>Recipe</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={!newPostText.trim()}
                        style={{
                          backgroundColor: newPostText.trim()
                            ? theme.btnPrimaryBg
                            : theme.subtle,
                          color: newPostText.trim()
                            ? theme.btnPrimaryText
                            : theme.textSecondary,
                        }}
                        className="h-8 px-4 rounded-full text-xs font-semibold tracking-tight transition disabled:cursor-not-allowed shadow-sm"
                      >
                        Publish
                      </button>
                    </div>
                  </form>
                </div>

                {/* Filtered Stream Posts */}
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    }}
                    className="border rounded-[24px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4"
                  >
                    {/* Post Header with Badge Pill */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          style={{ borderColor: theme.border }}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              style={{ color: theme.textPrimary }}
                              className="font-semibold text-[14px] tracking-tight"
                            >
                              {post.author}
                            </span>
                            <span
                              style={{
                                backgroundColor: theme.subtle,
                                color: theme.textSecondary,
                                borderColor: theme.border,
                              }}
                              className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                            >
                              {post.relationship}
                            </span>
                          </div>
                          <span
                            style={{ color: theme.textSecondary }}
                            className="text-xs font-normal"
                          >
                            {post.timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* Pill Badge */}
                      <span
                        style={{
                          backgroundColor: theme.subtle,
                          borderColor: theme.border,
                          color: theme.textPrimary,
                        }}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border"
                      >
                        {post.badge}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p
                      style={{ color: theme.textBody }}
                      className="text-[15px] leading-[1.65] font-normal tracking-[-0.005em]"
                    >
                      {post.content}
                    </p>

                    {/* Audio Player Card if Present */}
                    {post.hasAudioMemo && (
                      <div
                        style={{
                          backgroundColor: theme.subtle,
                          borderColor: theme.border,
                        }}
                        className="border rounded-2xl p-3.5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            style={{
                              backgroundColor: theme.btnPrimaryBg,
                              color: theme.btnPrimaryText,
                            }}
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 transition"
                            aria-label="Play audio memo"
                          >
                            {isPlayingAudio ? "⏸" : "▶"}
                          </button>
                          <div>
                            <span
                              style={{ color: theme.textPrimary }}
                              className="font-semibold text-xs block"
                            >
                              Rose's Apple Pie Recipe Story
                            </span>
                            <span
                              style={{ color: theme.textSecondary }}
                              className="text-[11px]"
                            >
                              Recorded voice note &bull; {post.audioDuration}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Waveform Visualizer */}
                        <div className="flex items-center gap-1 px-3">
                          {[30, 60, 90, 45, 80, 100, 60, 40, 75, 50, 30].map(
                            (h, idx) => (
                              <div
                                key={idx}
                                style={{
                                  height: `${h * 0.22}px`,
                                  backgroundColor: isPlayingAudio
                                    ? theme.textPrimary
                                    : theme.textSecondary,
                                }}
                                className="w-1 rounded-full transition-all duration-300"
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Magazine Photo Display */}
                    {post.images.length > 0 && (
                      <div
                        className={`grid gap-2.5 rounded-2xl overflow-hidden ${
                          post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        {post.images.map((src, i) => (
                          <div
                            key={i}
                            className="relative overflow-hidden group rounded-xl"
                          >
                            <img
                              src={src}
                              alt="Family moment"
                              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Bar with Tactile Reaction Pills */}
                    <div
                      style={{ borderColor: theme.borderSubtle }}
                      className="flex items-center justify-between pt-3 border-t text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(post.id)}
                          style={{
                            backgroundColor: post.hasLiked
                              ? theme.subtle
                              : "transparent",
                            borderColor: post.hasLiked
                              ? theme.border
                              : "transparent",
                            color: post.hasLiked
                              ? theme.textPrimary
                              : theme.textSecondary,
                          }}
                          className="flex items-center gap-1.5 h-8 px-3 rounded-full border transition font-medium text-xs hover:bg-zinc-500/5"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              post.hasLiked
                                ? "fill-current text-rose-500"
                                : ""
                            }`}
                          />
                          <span>{post.likes}</span>
                        </button>

                        <button
                          style={{ color: theme.textSecondary }}
                          className="flex items-center gap-1.5 h-8 px-3 rounded-full hover:bg-zinc-500/5 font-medium transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.comments.length}</span>
                        </button>
                      </div>

                      <span
                        style={{ color: theme.textMuted }}
                        className="text-[11px] font-medium"
                      >
                        Miller Family circle
                      </span>
                    </div>

                    {/* Discussion Thread */}
                    <div
                      style={{ backgroundColor: theme.subtle }}
                      className="rounded-2xl p-4 space-y-3 text-[13px]"
                    >
                      {post.comments.map((c) => (
                        <div key={c.id} className="leading-snug">
                          <span
                            style={{ color: theme.textPrimary }}
                            className="font-semibold mr-1.5"
                          >
                            {c.author}:
                          </span>
                          <span style={{ color: theme.textSecondary }}>
                            {c.text}
                          </span>
                        </div>
                      ))}

                      {/* Inline Reply Input */}
                      <div className="flex items-center gap-2 pt-1.5">
                        <input
                          type="text"
                          placeholder="Write a warm note..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs({
                              ...commentInputs,
                              [post.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(post.id);
                          }}
                          style={{
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                            color: theme.textPrimary,
                          }}
                          className="flex-1 h-9 rounded-full border px-4 text-xs placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          style={{
                            backgroundColor: theme.btnPrimaryBg,
                            color: theme.btnPrimaryText,
                          }}
                          className="h-9 px-4 rounded-full text-xs font-semibold tracking-tight transition"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* TAB: MILESTONES */}
            {activeTab === "moments" && (
              <div
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
                className="border rounded-[24px] p-6 shadow-sm space-y-4"
              >
                <div>
                  <h2
                    style={{ color: theme.textPrimary }}
                    className="text-base font-semibold tracking-tight"
                  >
                    Family Celebrations & Milestones
                  </h2>
                  <p
                    style={{ color: theme.textSecondary }}
                    className="text-xs leading-relaxed mt-1"
                  >
                    Perpetual calendar tracking birthdays, anniversaries, and collective greeting cards.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {CELEBRATIONS.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                      }}
                      className="border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            style={{ color: theme.textPrimary }}
                            className="font-semibold text-sm"
                          >
                            {c.title}
                          </span>
                          <span
                            style={{
                              backgroundColor: theme.surface,
                              borderColor: theme.border,
                              color: theme.textPrimary,
                            }}
                            className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border"
                          >
                            {c.date}
                          </span>
                        </div>
                        <p
                          style={{ color: theme.textSecondary }}
                          className="mt-1 leading-normal text-xs"
                        >
                          {c.note}
                        </p>
                      </div>

                      <button
                        style={{
                          backgroundColor: theme.btnPrimaryBg,
                          color: theme.btnPrimaryText,
                        }}
                        className="h-8 px-4 rounded-full text-xs font-semibold tracking-tight self-start sm:self-auto shrink-0 shadow-sm transition"
                      >
                        Sign Card ✍️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: GATHERINGS */}
            {activeTab === "gatherings" && (
              <div
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
                className="border rounded-[24px] p-6 shadow-sm space-y-5"
              >
                <div>
                  <span
                    style={{
                      backgroundColor: theme.subtle,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                    className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border inline-block"
                  >
                    Upcoming Reunion
                  </span>
                  <h2
                    style={{ color: theme.textPrimary }}
                    className="text-lg font-bold tracking-tight mt-2"
                  >
                    Sunday Family Roast & Lawn Games
                  </h2>
                  <div
                    style={{ color: theme.textSecondary }}
                    className="flex flex-wrap items-center gap-4 text-xs mt-1.5"
                  >
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Sunday, Oct 12 &bull; 4:00 PM
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Grandma Rose's Backyard
                    </span>
                  </div>
                </div>

                {/* Attendance RSVP Pill Card */}
                <div
                  style={{
                    backgroundColor: theme.subtle,
                    borderColor: theme.border,
                  }}
                  className="border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span
                      style={{ color: theme.textPrimary }}
                      className="font-semibold block"
                    >
                      Your Family RSVP
                    </span>
                    <span
                      style={{ color: theme.textSecondary }}
                      className="text-[11px]"
                    >
                      {rsvpStatus === "going"
                        ? "Attending with 4 family members"
                        : "Not attending"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRsvpStatus("going")}
                      style={{
                        backgroundColor:
                          rsvpStatus === "going"
                            ? theme.btnPrimaryBg
                            : theme.surface,
                        color:
                          rsvpStatus === "going"
                            ? theme.btnPrimaryText
                            : theme.textPrimary,
                        borderColor: theme.border,
                      }}
                      className="h-8 px-4 rounded-full border font-semibold text-xs tracking-tight transition"
                    >
                      ✓ Coming (4)
                    </button>
                    <button
                      onClick={() => setRsvpStatus(null)}
                      style={{
                        backgroundColor:
                          rsvpStatus === null
                            ? theme.btnPrimaryBg
                            : theme.surface,
                        color:
                          rsvpStatus === null
                            ? theme.btnPrimaryText
                            : theme.textPrimary,
                        borderColor: theme.border,
                      }}
                      className="h-8 px-4 rounded-full border font-semibold text-xs tracking-tight transition"
                    >
                      Can't Go
                    </button>
                  </div>
                </div>

                {/* Potluck Coordination */}
                <div>
                  <h3
                    style={{ color: theme.textSecondary }}
                    className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-2.5"
                  >
                    Potluck & Supplies List
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                      }}
                      className="flex items-center justify-between p-3 rounded-xl border"
                    >
                      <span style={{ color: theme.textPrimary }}>
                        Apple skillet tart & fresh cream
                      </span>
                      <span
                        style={{ color: theme.textSecondary }}
                        className="font-medium text-[11px]"
                      >
                        ✓ Rose Miller
                      </span>
                    </div>
                    <div
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                      }}
                      className="flex items-center justify-between p-3 rounded-xl border"
                    >
                      <span style={{ color: theme.textPrimary }}>
                        Marinated brisket & grill tongs
                      </span>
                      <span
                        style={{ color: theme.textSecondary }}
                        className="font-medium text-[11px]"
                      >
                        ✓ Mark Miller
                      </span>
                    </div>
                    <div
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                      }}
                      className="flex items-center justify-between p-3 rounded-xl border"
                    >
                      <span style={{ color: theme.textPrimary }}>
                        Roasted corn salad & cold lemonade
                      </span>
                      <button
                        style={{ color: theme.textPrimary }}
                        className="font-semibold hover:underline text-xs"
                      >
                        Claim item +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FAMILY TREE / ROOTS */}
            {activeTab === "tree" && (
              <div
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
                className="border rounded-[24px] p-6 shadow-sm space-y-5"
              >
                <div>
                  <h2
                    style={{ color: theme.textPrimary }}
                    className="text-base font-semibold tracking-tight"
                  >
                    Generational Lineage Tree
                  </h2>
                  <p
                    style={{ color: theme.textSecondary }}
                    className="text-xs leading-relaxed mt-1"
                  >
                    3 Generations preserved in the family archives.
                  </p>
                </div>

                <div className="space-y-5 pt-2">
                  {FAMILY_TREE_NODES.map((tier, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <div
                        style={{ color: theme.textSecondary }}
                        className="text-[11px] font-mono uppercase tracking-[0.06em] font-semibold"
                        dangerouslySetInnerHTML={{ __html: tier.generation }}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {tier.members.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            style={{
                              backgroundColor: theme.subtle,
                              borderColor: theme.border,
                            }}
                            className="border rounded-2xl p-3 flex items-center gap-3 text-xs"
                          >
                            <img
                              src={m.avatar}
                              alt={m.name}
                              style={{ borderColor: theme.border }}
                              className="w-10 h-10 rounded-full object-cover border shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  style={{ color: theme.textPrimary }}
                                  className="font-semibold block truncate"
                                >
                                  {m.name}
                                </span>
                                <span
                                  style={{
                                    backgroundColor: theme.surface,
                                    borderColor: theme.border,
                                    color: theme.textSecondary,
                                  }}
                                  className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border uppercase"
                                >
                                  {m.pill}
                                </span>
                              </div>
                              <span
                                style={{ color: theme.textSecondary }}
                                className="text-[11px] block"
                              >
                                {m.relation} &bull; {m.lifespan}
                              </span>
                            </div>
                            <button
                              style={{
                                backgroundColor: theme.surface,
                                borderColor: theme.border,
                                color: theme.textPrimary,
                              }}
                              className="px-2.5 py-1 rounded-full border text-[11px] font-medium hover:opacity-80 transition"
                            >
                              Bio
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECONDARY COLUMN: The Living Room Shelf (5 cols) */}
          <aside className="lg:col-span-5 space-y-6">
            {/* "On This Day" Archival Polaroid Card with Pills */}
            <div
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
              }}
              className="border rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    backgroundColor: theme.subtle,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  }}
                  className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full border"
                >
                  On This Day &bull; 2023
                </span>
                <span
                  style={{ color: theme.textSecondary }}
                  className="text-xs"
                >
                  3 Years Ago
                </span>
              </div>

              {/* Polaroid Photo Frame */}
              <div
                style={{
                  backgroundColor: theme.subtle,
                  borderColor: theme.border,
                }}
                className="border p-2 rounded-2xl shadow-sm"
              >
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  alt="Archival memory"
                  className="w-full h-44 object-cover rounded-xl"
                />
                <p
                  style={{ color: theme.textPrimary }}
                  className="text-xs font-medium p-2 leading-relaxed"
                >
                  "Family weekend camping at Whispering Pines Lake. Arthur made the bonfire pancakes."
                </p>
              </div>

              <button
                style={{
                  color: theme.textPrimary,
                }}
                className="w-full text-center text-xs font-semibold hover:underline flex items-center justify-center gap-1 pt-1"
              >
                Open Archival Album <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Milestones Mini-Shelf with Pills */}
            <div
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
              }}
              className="border rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3
                  style={{ color: theme.textPrimary }}
                  className="font-semibold text-sm tracking-tight flex items-center gap-1.5"
                >
                  <Cake className="w-4 h-4 text-zinc-500" />
                  <span>Celebration Radar</span>
                </h3>
                <span
                  style={{
                    backgroundColor: theme.subtle,
                    borderColor: theme.border,
                    color: theme.textSecondary,
                  }}
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border"
                >
                  October
                </span>
              </div>

              <div className="space-y-3">
                <div
                  style={{
                    backgroundColor: theme.subtle,
                    borderColor: theme.border,
                  }}
                  className="border rounded-2xl p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span
                      style={{ color: theme.textPrimary }}
                      className="font-semibold block"
                    >
                      Rose Miller (78th)
                    </span>
                    <span
                      style={{ color: theme.textSecondary }}
                      className="text-[11px]"
                    >
                      Grandmother &bull; In 4 days
                    </span>
                  </div>
                  <span
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-medium"
                  >
                    Oct 6
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: theme.subtle,
                    borderColor: theme.border,
                  }}
                  className="border rounded-2xl p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span
                      style={{ color: theme.textPrimary }}
                      className="font-semibold block"
                    >
                      David & Clara (15th)
                    </span>
                    <span
                      style={{ color: theme.textSecondary }}
                      className="text-[11px]"
                    >
                      Anniversary &bull; 3 weeks
                    </span>
                  </div>
                  <span
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-medium"
                  >
                    Oct 24
                  </span>
                </div>
              </div>
            </div>

            {/* Living Room Gathering Widget with Attendee Overlap Pills */}
            <div
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
              }}
              className="border rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3
                  style={{ color: theme.textPrimary }}
                  className="font-semibold text-sm tracking-tight flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span>Sunday Dinner</span>
                </h3>
                <span
                  style={{
                    backgroundColor: theme.subtle,
                    borderColor: theme.border,
                    color: theme.textSecondary,
                  }}
                  className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border"
                >
                  Oct 12
                </span>
              </div>
              <p
                style={{ color: theme.textSecondary }}
                className="text-xs leading-relaxed"
              >
                Backyard grill at Grandma's house. 5 of 6 relatives attending.
              </p>
              <div className="flex -space-x-2 overflow-hidden pt-1">
                {[
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
                  "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=120&q=80",
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Attendee"
                    style={{ borderColor: theme.surface }}
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-800 object-cover"
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
