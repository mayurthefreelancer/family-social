"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Camera,
  Cake,
  Calendar,
  Users,
  Clock,
  ChevronRight,
  MapPin,
  Sun,
  Moon,
  ArrowLeft,
  Sparkles,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Compass,
  KeyRound,
  QrCode,
  Smartphone,
  Layers,
  Fish,
  HelpCircle,
  Share2,
  Image as ImageIcon,
  Check,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";

// =========================================================================
// MOCK MARATHI FAMILY DATA (Kadam Family - Girgaon, Mumbai & Pune)
// English Wording with Authentic Marathi Cultural Kinship Context
// =========================================================================

const INITIAL_POSTS = [
  {
    id: "p1",
    author: "Supriya Kadam",
    relationship: "Aai (Mother)",
    category: "photos",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    timeAgo: "2 hours ago",
    badge: "Big Milestone",
    content: "Aryan mastered riding his two-wheeler bicycle without training wheels today at Shivaji Park! 🚲 Two weeks of scraped knees and determination finally paid off. Suman Aaji and Anand Baba couldn't stop cheering him on!",
    images: [
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
    ],
    likes: 18,
    hasLiked: false,
    comments: [
      { id: "c1", author: "Suman Kadam (Aaji)", text: "My sweet grandson! Reminds me so much of Anand learning to ride his bicycle at that very same age." },
      { id: "c2", author: "Rajesh Kadam (Kaka)", text: "Proud of you, Aryan! Bringing you a shiny new bicycle bell and helmet when I visit Girgaon this Sunday." },
      { id: "c3", author: "Amit Kadam (Dada)", text: "No more borrowing my cycle now! Super proud of you, little champ." },
    ],
  },
  {
    id: "p2",
    author: "Suman Kadam",
    relationship: "Aaji (Matriarch)",
    category: "moments",
    avatar: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=160&q=80",
    timeAgo: "Yesterday evening",
    badge: "Family Tradition",
    content: "Made freshly steamed Ukadiche Modak and crispy multigrain Thalipeeth for Ashwin Shuddha Dwadashi today. 🥟 Packed two lunchboxes for Amit and Tanya when they return from classes. The hearth doors are always open for anyone dropping by!",
    images: [
      "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=1000&q=80",
    ],
    likes: 24,
    hasLiked: true,
    comments: [
      { id: "c4", author: "Amit Kadam (Dada)", text: "Aaji, I'm heading home straight from college! Please keep four modaks set aside for me." },
      { id: "c5", author: "Anjali Kadam (Kaku)", text: "Aaji, the pleats on your modaks are perfection! You must teach me the secret technique tomorrow." },
    ],
  },
  {
    id: "p3",
    author: "Anand Kadam",
    relationship: "Baba (Organizer)",
    category: "gatherings",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    timeAgo: "2 days ago",
    badge: "Trip Planner",
    content: "Bookings are confirmed for our Alibaug Beach Farmhouse getaway next weekend! All family members, please check the 'Family Trips & Events' tab to review the essentials checklist and claim what you're bringing.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80",
    ],
    likes: 15,
    hasLiked: true,
    comments: [
      { id: "c6", author: "Rajesh Kadam (Kaka)", text: "I've booked the Mandwa Ro-Ro ferry tickets. We can all drive down together." },
    ],
  },
];

const CELEBRATIONS = [
  {
    id: "m1",
    title: "Suman Aaji's 76th Birthday 🎂",
    date: "In 4 Days",
    exactDate: "Oct 8",
    type: "Birthday",
    pill: "Secret Greeting Card Open",
    note: "Digital card is open for Suman Aaji. 5 relatives have already written secret birthday wishes!",
  },
  {
    id: "m2",
    title: "Anand & Supriya's 20th Anniversary 💐",
    date: "Oct 24",
    exactDate: "Oct 24",
    type: "Anniversary",
    pill: "Family Surprise",
    note: "Coordinating a private family celebration dinner during the Alibaug beach getaway.",
  },
];

const FAMILY_MEMBERS = [
  { name: "Suman Kadam", role: "Aaji (Matriarch)", img: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=160&q=80" },
  { name: "Anand Kadam", role: "Baba (Organizer)", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
  { name: "Supriya Kadam", role: "Aai (Mother)", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80" },
  { name: "Rajesh Kadam", role: "Kaka (Uncle)", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
  { name: "Anjali Kadam", role: "Kaku (Aunt)", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80" },
  { name: "Amit Kadam", role: "Dada (Elder Son)", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80" },
  { name: "Tanya Kadam", role: "Tai (Daughter)", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80" },
  { name: "Aryan Kadam", role: "Natu (Grandson)", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80" },
];

const MARATHI_FAMILY_TREE = [
  {
    generation: "1st Generation • Founders & Grandparents",
    members: [
      { name: "Late Bhalchandra Kadam †", relation: "Ajoba (Grandfather)", lifespan: "1942–2020", pill: "Founding Patriarch", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
      { name: "Suman Bhalchandra Kadam", relation: "Aaji (Grandmother)", lifespan: "Born 1949", pill: "Family Matriarch", avatar: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=120&q=80" },
    ],
  },
  {
    generation: "2nd Generation • Parents & Uncles",
    members: [
      { name: "Anand Bhalchandra Kadam", relation: "Baba (Father / Eldest)", lifespan: "Born 1975", pill: "Family Organizer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" },
      { name: "Supriya Anand Kadam", relation: "Aai (Mother)", lifespan: "Born 1978", pill: "Core Anchor", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" },
      { name: "Rajesh Bhalchandra Kadam", relation: "Kaka (Uncle / Youngest)", lifespan: "Born 1980", pill: "Trip Coordinator", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
      { name: "Anjali Rajesh Kadam", relation: "Kaku (Aunt)", lifespan: "Born 1983", pill: "Family Member", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" },
    ],
  },
  {
    generation: "3rd Generation • Grandchildren & Youth",
    members: [
      { name: "Amit Anand Kadam", relation: "Dada (Elder Son / College)", lifespan: "Born 2005", pill: "Youth Circle", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" },
      { name: "Tanya Anand Kadam", relation: "Tai (Sister / High School)", lifespan: "Born 2010", pill: "Youth Circle", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" },
      { name: "Aryan Rajesh Kadam", relation: "Natu (Youngest Cyclist)", lifespan: "Born 2017", pill: "Little Champ", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80" },
    ],
  },
];

export default function KinshipPrototype() {
  const [activeTab, setActiveTab] = useState<"feed" | "trips" | "tree" | "gamification" | "auth">("feed");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [rsvpStatus, setRsvpStatus] = useState<"going" | "tentative" | "cant">("going");
  const [activePackingItems, setActivePackingItems] = useState<Record<string, boolean>>({
    speaker: false,
    faral: false,
  });

  // Gamification States
  const [hearthLogs, setHearthLogs] = useState(21);
  const [hasTossedLog, setHasTossedLog] = useState(false);
  const [babyPollVote, setBabyPollVote] = useState<string | null>(null);
  const [isFishing, setIsFishing] = useState(false);
  const [caughtKeepsake, setCaughtKeepsake] = useState<string | null>(null);

  // Mobile Shell Preview Toggle
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Auth Demo States
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinSuccess, setPinSuccess] = useState(false);

  // High-contrast Monochrome Tokens
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
            comments: [...p.comments, { id: `c-${Date.now()}`, author: "Anand (Baba)", text }],
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
      author: "Anand Kadam",
      relationship: "Baba (Organizer)",
      category: "all",
      badge: "Family Note",
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

  const handleTossLog = () => {
    if (!hasTossedLog) {
      setHearthLogs((prev) => prev + 1);
      setHasTossedLog(true);
    }
  };

  const handleFish = () => {
    setIsFishing(true);
    setCaughtKeepsake(null);
    setTimeout(() => {
      setIsFishing(false);
      const keepsakes = [
        "📜 Aaji's Keepsake: 'In the Diwali of 1975, we stitched Anand's very first Balmohan school uniform right at home.'",
        "📜 Ajoba's Wisdom: 'A tree and a family that sink deep roots stand tall through every passing storm.'",
        "📜 Throwback Humor: 'During the 1988 Ganpati festival, Kaka quietly polished off five steamed modaks before lunch!'",
      ];
      setCaughtKeepsake(keepsakes[Math.floor(Math.random() * keepsakes.length)]);
    }, 1800);
  };

  const handlePinInput = (num: string) => {
    if (enteredPin.length < 6) {
      const nextPin = enteredPin + num;
      setEnteredPin(nextPin);
      if (nextPin === "240819") {
        setPinSuccess(true);
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.canvas,
        color: theme.textPrimary,
        minHeight: "100vh",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
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
            <span style={{ color: theme.border }} className="text-sm">/</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                The Kadam Hearth &bull; Marathi Family Prototype
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile View Toggle */}
            <button
              onClick={() => setIsMobilePreview(!isMobilePreview)}
              style={{
                backgroundColor: isMobilePreview ? theme.btnPrimaryBg : theme.subtle,
                color: isMobilePreview ? theme.btnPrimaryText : theme.textSecondary,
                borderColor: theme.border,
              }}
              className="h-8 px-3 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isMobilePreview ? "Mobile Shell (Active)" : "Preview Mobile Shell"}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                backgroundColor: theme.subtle,
                color: theme.textPrimary,
                borderColor: theme.border,
              }}
              className="w-8 h-8 rounded-full border flex items-center justify-center transition hover:opacity-80 cursor-pointer"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Supports Desktop or Mobile Container */}
      <div className={`mx-auto transition-all duration-300 ${isMobilePreview ? "max-w-md py-4 px-2" : "max-w-6xl px-4 sm:px-6 py-6"}`}>
        
        {/* ========================================================================= */}
        {/* PANORAMIC HEARTH CANOPY (The Kadam Family Hearth)                         */}
        {/* ========================================================================= */}
        <div
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
          className="rounded-[32px] border shadow-sm overflow-hidden mb-6 relative"
        >
          {/* Cover Panorama */}
          <div className="h-36 sm:h-48 w-full bg-linear-to-r from-amber-900/30 via-zinc-800/40 to-stone-900/40 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
              alt="Konkan Landscape"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Girgaon, Mumbai &bull; Roots: Sangameshwar, Ratnagiri</span>
            </div>
          </div>

          {/* Canopy Profile Content */}
          <div className="px-6 pb-6 pt-0 relative -mt-12 sm:-mt-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex items-end gap-4 sm:gap-5">
              {/* Crest Monogram */}
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
                  K
                  <span className="text-[8px] font-mono tracking-widest uppercase font-semibold opacity-70 leading-none mt-0.5">
                    KADAM
                  </span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-900" />
                </span>
              </div>

              {/* Title & Family Motto */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1
                    style={{ color: theme.textPrimary }}
                    className="font-bold text-2xl sm:text-3xl tracking-tight leading-tight"
                  >
                    The Kadam Family Hearth
                  </h1>
                  <span
                    style={{
                      backgroundColor: theme.subtle,
                      borderColor: theme.border,
                      color: theme.textSecondary,
                    }}
                    className="text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Private Sanctuary</span>
                  </span>
                </div>
                <p
                  style={{ color: theme.textSecondary, fontFamily: 'Georgia, Cambria, serif' }}
                  className="text-xs sm:text-sm font-normal italic leading-relaxed"
                >
                  “Cherishing small moments, holding close across every distance, rooted in our generational bonds.”
                </p>
              </div>
            </div>

            {/* Member Facepile & Fire Streak Counter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
                <span>Hearth burning for {hearthLogs} consecutive days</span>
              </div>

              <div className="flex -space-x-2 overflow-hidden py-1">
                {FAMILY_MEMBERS.map((m, idx) => (
                  <img
                    key={idx}
                    src={m.img}
                    alt={m.name}
                    title={`${m.name} (${m.role})`}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-zinc-900 shadow-xs"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Vitals Tray */}
          <div
            style={{ borderColor: theme.border }}
            className="border-t px-6 py-3 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-wrap items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">46</span>
                <span style={{ color: theme.textSecondary }}>Preserved Moments</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">3</span>
                <span style={{ color: theme.textSecondary }}>Connected Generations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">Oct 8</span>
                <span style={{ color: theme.textSecondary }}>Suman Aaji's 76th Birthday</span>
              </div>
            </div>
            <div className="text-zinc-400 font-mono text-[11px]">
              Est. 1942 &bull; Founded by Late Bhalchandra Ajoba
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TACTILE PROPOSAL TABS (English Wording)                                    */}
        {/* ========================================================================= */}
        <div
          style={{
            backgroundColor: theme.subtle,
            borderColor: theme.border,
          }}
          className="p-1 rounded-2xl border flex items-center gap-1 overflow-x-auto scrollbar-none mb-6 text-xs sm:text-sm font-semibold select-none"
        >
          <button
            onClick={() => setActiveTab("feed")}
            style={{
              backgroundColor: activeTab === "feed" ? theme.surface : "transparent",
              color: activeTab === "feed" ? theme.textPrimary : theme.textSecondary,
              boxShadow: activeTab === "feed" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            }}
            className="flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Layers className="w-4 h-4 stroke-[2]" />
            <span>Living Room Feed</span>
          </button>

          <button
            onClick={() => setActiveTab("trips")}
            style={{
              backgroundColor: activeTab === "trips" ? theme.surface : "transparent",
              color: activeTab === "trips" ? theme.textPrimary : theme.textSecondary,
              boxShadow: activeTab === "trips" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            }}
            className="flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4 stroke-[2]" />
            <span>Family Trips & Events</span>
          </button>

          <button
            onClick={() => setActiveTab("tree")}
            style={{
              backgroundColor: activeTab === "tree" ? theme.surface : "transparent",
              color: activeTab === "tree" ? theme.textPrimary : theme.textSecondary,
              boxShadow: activeTab === "tree" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            }}
            className="flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Users className="w-4 h-4 stroke-[2]" />
            <span>Family Tree & Roots</span>
          </button>

          <button
            onClick={() => setActiveTab("gamification")}
            style={{
              backgroundColor: activeTab === "gamification" ? theme.surface : "transparent",
              color: activeTab === "gamification" ? theme.textPrimary : theme.textSecondary,
              boxShadow: activeTab === "gamification" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            }}
            className="flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Flame className="w-4 h-4 stroke-[2] text-amber-500" />
            <span>Living Hearth & Games</span>
          </button>

          <button
            onClick={() => setActiveTab("auth")}
            style={{
              backgroundColor: activeTab === "auth" ? theme.surface : "transparent",
              color: activeTab === "auth" ? theme.textPrimary : theme.textSecondary,
              boxShadow: activeTab === "auth" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            }}
            className="flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 stroke-[2]" />
            <span>Frictionless Auth (PIN/QR)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: LIVING ROOM FEED (ASYMMETRICAL 7:5 EDITORIAL CANVAS)               */}
        {/* ========================================================================= */}
        {activeTab === "feed" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Columns: Memory Stream */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Hearth Composer */}
              <div
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
                className="p-5 rounded-[28px] border shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                    alt="Current user"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-800"
                  />
                  <input
                    type="text"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Anand, what family memory or moment would you like to share today?"
                    className="w-full bg-zinc-100 dark:bg-zinc-850 px-4 py-2.5 rounded-full text-xs sm:text-sm border-none focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer">
                      <Camera className="w-4 h-4 text-emerald-500" />
                      <span>Attach Photos (Mosaic)</span>
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Milestone</span>
                    </span>
                  </div>

                  <button
                    onClick={handleCreatePost}
                    style={{
                      backgroundColor: theme.btnPrimaryBg,
                      color: theme.btnPrimaryText,
                    }}
                    className="px-5 py-2 rounded-full text-xs font-semibold shadow-xs hover:opacity-90 transition cursor-pointer"
                  >
                    Post to Hearth
                  </button>
                </div>
              </div>

              {/* Feed Post List */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    }}
                    className="p-5 sm:p-6 rounded-[28px] border shadow-xs space-y-4"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{post.author}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                              {post.relationship}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-400">{post.timeAgo}</span>
                        </div>
                      </div>

                      <span className="text-xs font-medium px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300">
                        {post.badge}
                      </span>
                    </div>

                    {/* Post Body Content */}
                    <p className="text-sm sm:text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                      {post.content}
                    </p>

                    {/* Adaptive Multi-Photo Mosaic Grid (Proposal 1) */}
                    {post.images && post.images.length > 0 && (
                      <div className="pt-1">
                        {post.images.length === 1 ? (
                          <div className="rounded-2xl overflow-hidden max-h-96 bg-zinc-100 dark:bg-zinc-800">
                            <img src={post.images[0]} alt="Post visual" className="w-full h-full object-cover hover:scale-102 transition duration-300" />
                          </div>
                        ) : post.images.length === 2 ? (
                          <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden max-h-80">
                            {post.images.map((img, i) => (
                              <img key={i} src={img} alt="Post visual" className="w-full h-72 object-cover hover:scale-102 transition duration-300" />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
                            <img src={post.images[0]} alt="Hero visual" className="w-full h-72 object-cover col-span-1 rounded-xl" />
                            <div className="grid grid-rows-2 gap-2 h-72">
                              <img src={post.images[1]} alt="Sub visual" className="w-full h-35 object-cover rounded-xl" />
                              <div className="relative rounded-xl overflow-hidden h-35">
                                <img src={post.images[2]} alt="Sub visual" className="w-full h-full object-cover" />
                                {post.images.length > 3 && (
                                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm">
                                    +{post.images.length - 3} more photos
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reactions Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition cursor-pointer ${
                            post.hasLiked
                              ? "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold"
                              : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                          <span>Love ({post.likes})</span>
                        </button>

                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Comments ({post.comments.length})</span>
                        </span>
                      </div>

                      <span className="text-[11px] text-zinc-400 font-mono">The Kadam Sanctuary</span>
                    </div>

                    {/* Comment Thread */}
                    {post.comments.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                        {post.comments.map((c) => (
                          <div key={c.id} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-850/60 text-xs space-y-0.5">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{c.author}: </span>
                            <span className="text-zinc-700 dark:text-zinc-300">{c.text}</span>
                          </div>
                        ))}

                        {/* Add Comment Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ""}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                            placeholder="Write a comment for the family..."
                            className="flex-1 bg-zinc-100 dark:bg-zinc-850 px-3 py-2 rounded-full text-xs border-none focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="p-2 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 text-xs cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Columns: The Living Room Shelf */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* 1. On This Day Polaroid (Nostalgic Keepsake) */}
              <div
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
                className="p-5 rounded-[28px] border shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    On This Day &bull; 2023
                  </span>
                  <span className="text-xs text-zinc-400">3 Years Ago Today</span>
                </div>

                <div className="p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800 space-y-2">
                  <img
                    src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80"
                    alt="Throwback"
                    className="w-full h-44 object-cover rounded-xl"
                  />
                  <p
                    style={{ fontFamily: 'Georgia, Cambria, serif' }}
                    className="text-xs italic text-zinc-700 dark:text-zinc-300 px-1 py-0.5"
                  >
                    “The whole family gathered at Girgaon Chowpatty during the Ganpati Visarjan procession.”
                  </p>
                </div>
                <div className="text-center text-xs text-zinc-400">Preserved in Kadam Heritage Vault</div>
              </div>

              {/* 2. Celebration Radar */}
              <div
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
                className="p-5 rounded-[28px] border shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5">
                    <Cake className="w-4 h-4 text-rose-500" />
                    <span>Celebration Radar</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">October</span>
                </div>

                <div className="space-y-2.5">
                  {CELEBRATIONS.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{c.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 font-bold">
                          {c.date}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">{c.note}</p>
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                          ✨ {c.pill}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Upcoming Family Trip Card */}
              <div
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
                className="p-5 rounded-[28px] border shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>Upcoming Family Trip</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold">In 8 Days</span>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Alibaug Beach Farmhouse Getaway 🌴</p>
                  <p className="text-xs text-zinc-500">Oct 24–26 &bull; Near Mandwa Jetty &amp; Kihim Beach</p>
                </div>

                <button
                  onClick={() => setActiveTab("trips")}
                  className="w-full py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <span>View Trip Details &amp; Packing List</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FAMILY TRIPS & EVENTS PLANNER (PROPOSAL 5)                         */}
        {/* ========================================================================= */}
        {activeTab === "trips" && (
          <div
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
            className="p-6 sm:p-8 rounded-[32px] border shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold font-mono">
                    Family Trip 2026
                  </span>
                  <span className="text-xs text-zinc-400">Starting in 8 Days</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                  Alibaug Beach &amp; Coconut Farmhouse Getaway 🌴
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  Friday Oct 24 to Sunday Oct 26 &bull; Kihim Beach Road, Mandwa Jetty, Alibaug
                </p>
              </div>

              {/* Attendance RSVP Toggle */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-500 block">Your Attendance (RSVP):</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setRsvpStatus("going")}
                    className={`h-9 px-4 rounded-full text-xs font-bold border transition cursor-pointer ${
                      rsvpStatus === "going"
                        ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600"
                    }`}
                  >
                    ✓ We are 4 Going
                  </button>
                  <button
                    onClick={() => setRsvpStatus("tentative")}
                    className={`h-9 px-4 rounded-full text-xs font-bold border transition cursor-pointer ${
                      rsvpStatus === "tentative"
                        ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600"
                    }`}
                  >
                    Maybe (2)
                  </button>
                  <button
                    onClick={() => setRsvpStatus("cant")}
                    className={`h-9 px-4 rounded-full text-xs font-bold border transition cursor-pointer ${
                      rsvpStatus === "cant"
                        ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600"
                    }`}
                  >
                    Can't Go
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Collaborative Packing & Essentials Checklist */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Collaborative Packing &amp; Supplies Checklist</span>
                  </h3>
                  <span className="text-xs text-zinc-400">2 of 4 items claimed</span>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-850/50 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">First-aid kit, Odomos &amp; travel medicine</span>
                      <span className="text-xs text-zinc-500">Essential health &amp; safety supplies</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                      ✓ Claimed by Anjali Kaku
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-850/50 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Badminton racquets, volleyball &amp; carrom board</span>
                      <span className="text-xs text-zinc-500">Outdoor games for beach &amp; lawn</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                      ✓ Claimed by Amit Dada
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-850/50 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Bluetooth speaker &amp; vintage songs playlist</span>
                      <span className="text-xs text-zinc-500">For Saturday evening campfire stories</span>
                    </div>
                    {activePackingItems.speaker ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                        ✓ Claimed by Anand Baba
                      </span>
                    ) : (
                      <button
                        onClick={() => setActivePackingItems({ ...activePackingItems, speaker: true })}
                        className="text-xs font-semibold px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition"
                      >
                        Claim this item +
                      </button>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-850/50 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Homemade travel snacks: Poha Chivda &amp; Besan Ladoos</span>
                      <span className="text-xs text-zinc-500">For Saturday morning tea by the beach</span>
                    </div>
                    {activePackingItems.faral ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                        ✓ Claimed by Supriya Aai
                      </span>
                    ) : (
                      <button
                        onClick={() => setActivePackingItems({ ...activePackingItems, faral: true })}
                        className="text-xs font-semibold px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition"
                      >
                        Claim this item +
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Trip Itinerary Highlights */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Daily Itinerary Highlights</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-850/50 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">Friday 5:00 PM</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800">Mandwa Jetty</span>
                    </div>
                    <p className="text-xs text-zinc-500">Ro-Ro ferry arrival, fresh tender coconut water &amp; farmhouse check-in.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-850/50 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">Saturday 8:30 AM</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800">Kihim Beach</span>
                    </div>
                    <p className="text-xs text-zinc-500">Morning beach walk, volleyball, sandcastles &amp; annual family photograph.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-850/50 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">Saturday 8:00 PM</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800">Campfire Ring</span>
                    </div>
                    <p className="text-xs text-zinc-500">Living Hearth campfire stories, Antakshari singing &amp; Aaji's childhood tales.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: GENERATIONAL FAMILY TREE & ROOTS (PROPOSAL 2)                      */}
        {/* ========================================================================= */}
        {activeTab === "tree" && (
          <div
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
            className="p-6 sm:p-8 rounded-[32px] border shadow-sm space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
              <div>
                <span className="px-3 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-mono">
                  Generational Heritage Tree
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                  The Kadam Family Tree &amp; Roots
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  Spanning 3 connected generations from Sangameshwar (Ratnagiri) to Mumbai and Pune.
                </p>
              </div>

              {/* Onboarding Lineage Discovery Prompt (Proposal 2) */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs max-w-sm">
                <span className="font-bold block">💡 Lineage Discovery Questionnaire:</span>
                <span>When new relatives join, 3 quick prompts capture: Parents' Names, Partner's Name, and Birth Year to automatically build the tree without missing links.</span>
              </div>
            </div>

            {/* Generational Tree Tiers */}
            <div className="space-y-8 relative">
              {MARATHI_FAMILY_TREE.map((tier, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wide font-mono">
                      {tier.generation}
                    </h3>
                    <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tier.members.map((member, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-850/40 space-y-3 hover:border-zinc-400 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-xs"
                          />
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-zinc-950 dark:text-zinc-50 block">
                              {member.name}
                            </span>
                            <span className="text-[11px] text-zinc-500 block">{member.relation}</span>
                            <span className="text-[10px] font-mono text-zinc-400">{member.lifespan}</span>
                          </div>
                        </div>

                        <div className="pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                            {member.pill}
                          </span>
                          <span className="text-[10px] text-zinc-400">View Roots ↗</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: LIVING HEARTH & MINI-GAMES (PROPOSAL 6)                            */}
        {/* ========================================================================= */}
        {activeTab === "gamification" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 6 Columns: The Living Hearth Fire */}
            <div
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
              }}
              className="lg:col-span-6 p-6 sm:p-8 rounded-[32px] border shadow-sm space-y-6"
            >
              <div className="space-y-1">
                <span className="px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold font-mono">
                  Daily Family Hearth Ritual
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  The Living Hearth Fire
                </h2>
                <p className="text-xs text-zinc-500">
                  Any family member can toss a log on the fire once a day. Each log extends the collective family warmth streak!
                </p>
              </div>

              {/* Animated Fireplace HUD */}
              <div className="p-8 rounded-3xl bg-linear-to-b from-zinc-900 to-black text-center space-y-4 border border-zinc-800 relative overflow-hidden">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center relative">
                  <Flame className="w-12 h-12 text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-ping" />
                </div>

                <div className="space-y-1 text-white">
                  <span className="text-3xl font-extrabold tracking-tight font-mono">{hearthLogs} Days</span>
                  <p className="text-xs text-zinc-400">The Kadam family hearth has been burning continuously</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleTossLog}
                    disabled={hasTossedLog}
                    className={`px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 mx-auto transition cursor-pointer ${
                      hasTossedLog
                        ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700"
                        : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20"
                    }`}
                  >
                    <Flame className="w-4 h-4 fill-current" />
                    <span>{hasTossedLog ? "You tossed a log today! ✓" : "Toss a Log on the Fire 🔥"}</span>
                  </button>
                </div>

                <div className="text-[11px] text-zinc-500 pt-2">
                  Suman Aaji, Anand Baba, and Anjali Kaku kept the hearth alive today.
                </div>
              </div>

              {/* Sunday Fishing Pond Mini-Game */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Fish className="w-4 h-4 text-cyan-500" />
                    <span>Sunday Morning Fishing Pond</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600">Peaceful Minigame</span>
                </div>

                <p className="text-xs text-zinc-500">
                  A tranquil 2-minute minigame for grandparents and grandchildren. Cast a bobber into the lake and reel in vintage family keepsake bottles!
                </p>

                <div className="pt-1">
                  <button
                    onClick={handleFish}
                    disabled={isFishing}
                    className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{isFishing ? "Casting line... waiting for a tug..." : "Cast Line into Pond 🎣"}</span>
                  </button>
                </div>

                {caughtKeepsake && (
                  <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-950 dark:text-cyan-200 animate-fadeIn">
                    <span className="font-bold block mb-1">🎉 You reeled in a Family Keepsake Bottle!</span>
                    <p style={{ fontFamily: 'Georgia, Cambria, serif' }} className="italic text-sm">{caughtKeepsake}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right 6 Columns: Guess the Baby Challenge */}
            <div
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
              }}
              className="lg:col-span-6 p-6 sm:p-8 rounded-[32px] border shadow-sm space-y-6"
            >
              <div className="space-y-1">
                <span className="px-3 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-xs font-bold font-mono">
                  Weekly Family Nostalgia
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Guess the Baby Challenge
                </h2>
                <p className="text-xs text-zinc-500">
                  Every Sunday, a vintage childhood photo of a relative is posted. Cast your vote and see if you guessed right before the weekend reveal!
                </p>
              </div>

              {/* Mystery Photo Frame */}
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="h-64 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 relative">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
                    alt="Mystery baby"
                    className="w-full h-full object-cover filter sepia-60"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-xs">
                    Year: 1984 &bull; Location: Girgaon
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                    Who is this chubby baby in the vintage photo?
                  </h4>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {[
                      { id: "anand", label: "Anand Kadam (Baba)", pct: "64% Votes" },
                      { id: "rajesh", label: "Rajesh Kadam (Kaka)", pct: "28% Votes" },
                      { id: "amit", label: "Amit Kadam (Dada)", pct: "8% Votes" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setBabyPollVote(opt.id)}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                          babyPollVote === opt.id
                            ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900"
                            : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {babyPollVote && <span className="font-mono text-xs opacity-75">{opt.pct}</span>}
                      </button>
                    ))}
                  </div>

                  {babyPollVote && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs">
                      ✓ Vote recorded! Suman Aaji will reveal the real story behind this picture on Sunday evening.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: FRICTIONLESS FAMILY AUTH DEMO (PROPOSAL 3)                         */}
        {/* ========================================================================= */}
        {activeTab === "auth" && (
          <div
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
            className="p-6 sm:p-8 rounded-[32px] border shadow-sm space-y-6 max-w-2xl mx-auto"
          >
            <div className="text-center space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-5">
              <span className="px-3 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-mono">
                Proposal 3 &bull; Frictionless Access
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Farewell to Passwords: 6-Digit PIN &amp; WhatsApp-Style QR
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                Typing complex emails and 12-character passwords is intimidating for grandparents and children. We propose two frictionless alternatives:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Option A: 6-Digit PIN Keypad Demo */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">Option 1: 6-Digit PIN</span>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex justify-center gap-2 py-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 transition ${
                          enteredPin.length > i ? "bg-zinc-900 dark:bg-zinc-100" : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>

                  {pinSuccess ? (
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                      ✓ Welcome, Anand Baba! (Authenticated)
                    </div>
                  ) : (
                    <span className="text-[11px] text-zinc-400 block font-mono">Test PIN: 240819</span>
                  )}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-1.5 max-w-48 mx-auto font-mono">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "←"].map((btn) => (
                    <button
                      key={btn}
                      onClick={() => {
                        if (btn === "C") {
                          setEnteredPin("");
                          setPinSuccess(false);
                        } else if (btn === "←") {
                          setEnteredPin(enteredPin.slice(0, -1));
                          setPinSuccess(false);
                        } else {
                          handlePinInput(btn);
                        }
                      }}
                      className="h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-100 transition cursor-pointer select-none"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option B: WhatsApp-Style QR Device Pairing */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800 space-y-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4 text-cyan-500" />
                  <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">Option 2: QR Device Pairing</span>
                </div>

                <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-40 h-40 mx-auto flex items-center justify-center shadow-xs">
                  <div className="w-32 h-32 border-4 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-zinc-400 gap-1">
                    <QrCode className="w-12 h-12 text-zinc-800 dark:text-zinc-200" />
                    <span className="text-[9px] font-mono">Scan QR</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  Scan this code from an already logged-in phone to instantly enter the living room on a new tablet without typing anything.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
