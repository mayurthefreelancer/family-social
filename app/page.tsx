import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Users,
  Calendar,
  ChevronRight,
  Cake,
  GitFork,
  Lock,
  Layers,
  ArrowRight,
  Clock,
  EyeOff,
} from "lucide-react";
import { buttonVariants } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // If already authenticated, direct to their family feed or superadmin console
  if (session) {
    if (session.user.isSuperadmin && !session.user.familyId) {
      redirect("/admin");
    }
    if (!session.user.familyId) {
      redirect("/create-family");
    }
    redirect("/feed");
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 flex flex-col justify-between transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#fbfbfd]/80 dark:bg-[#09090b]/80 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-transparent dark:border-zinc-700 flex items-center justify-center text-zinc-50 dark:text-zinc-100 font-bold text-sm shadow-sm ring-2 ring-zinc-200 dark:ring-zinc-800 ring-offset-2 ring-offset-[#fbfbfd] dark:ring-offset-[#09090b] transition-transform group-hover:scale-105">
              K
            </div>
            <div>
              <div className="font-semibold text-lg tracking-tight leading-none">Kinship</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">The Digital Living Room</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/prototype"
              className="text-sm font-medium px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors hidden sm:inline-flex"
            >
              Preview Prototype ↗
            </Link>

            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className={buttonVariants({
                variant: "default",
                className: "rounded-full text-sm font-semibold h-9 px-5 shadow-sm",
              })}
            >
              Create Family
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Pill Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 shadow-sm text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Private Family Sanctuary &bull; Zero Data Profiling &bull; 0 Outsiders</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.12]">
              A Private Living Room for the People Who Matter Most.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Step away from algorithmic feeds, public broadcasting, and advertiser surveillance.
              Kinship is an intimate digital sanctuary built for multi-generational families to share memories, celebrate milestones, and coordinate life together.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto h-12 px-7 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-sm sm:text-base font-semibold shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Your Family Sanctuary</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </Link>

              <Link
                href="/prototype"
                className="w-full sm:w-auto h-12 px-7 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm sm:text-base font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Explore Live Prototype</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Micro-Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Isolated Family Sanctuary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-zinc-500" />
                <span>No Ads, Algorithms, or Tracking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Generational Accessibility</span>
              </div>
            </div>
          </div>

          {/* Visual Living Room Canvas Preview */}
          <div className="max-w-5xl mx-auto mt-14 rounded-[32px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {/* Mock Panoramic Hearth Canopy */}
            <div className="rounded-[24px] border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 p-5 sm:p-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-transparent dark:border-zinc-700 text-zinc-50 dark:text-zinc-100 flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                      The Miller Family
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                      Private Sanctuary
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 italic">
                    &ldquo;Holding close across every distance, cherishing small moments.&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <div>
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">324</span> Memories
                </div>
                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                <div>
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">3</span> Generations
                </div>
                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                <div>
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">8</span> Kin Active
                </div>
              </div>
            </div>

            {/* Split Living Room Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Column: Sample Memory Post */}
              <div className="md:col-span-7 space-y-4">
                <div className="rounded-[20px] border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm">
                        R
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base">Rose Miller</div>
                        <div className="text-xs text-zinc-500">2 hours ago &bull; Family Only</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      🍲 Recipe
                    </Badge>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    Baked the traditional apple skillet tart Arthur used to make for autumn Sunday dinners. Grandma&apos;s handwritten recipe card is now preserved in the Family Vault!
                  </p>

                  <div className="h-44 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80"
                      alt="Family tart moment"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2 text-xs sm:text-sm text-zinc-500">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 font-medium">
                      ❤️ 7 Kin Reactions
                    </span>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 font-medium">
                      💬 4 Notes
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Living Room Shelf Snapshot */}
              <div className="md:col-span-5 space-y-4">
                {/* Polaroid Throwback */}
                <div className="rounded-[20px] border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono uppercase font-bold text-zinc-500">On This Day &bull; 2023</span>
                    <span className="text-zinc-400">3 Years Ago</span>
                  </div>
                  <div className="h-32 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                      alt="Archival throwback"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 italic">
                    Bonfire pancakes at Whispering Pines Lake.
                  </p>
                </div>

                {/* Celebration Radar */}
                <div className="rounded-[20px] border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                      <Cake className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Celebration Radar</span>
                    </div>
                    <span className="font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 border border-transparent dark:border-zinc-700 text-[11px] font-bold">
                      In 4 Days
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Rose&apos;s 78th Birthday
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Digital card is open. 5 relatives have signed secret messages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Pillars Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Engineered for Family Intimacy, Not Public Consumption.
              </h2>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
                Built specifically to solve the emotional and technical problems modern families face online.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-[24px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                  <Layers className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50">
                  The Panoramic Hearth
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  A dignified canopy that celebrates family identity, tracks milestones, and honors connected generations.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-[24px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                  <Clock className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50">
                  Chronological Stream
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  No algorithms deciding who you see. Every candid photo, note, recipe, and voice story appears in pure chronological order.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-[24px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                  <Calendar className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50">
                  The Living Room Shelf
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Nostalgic &ldquo;On This Day&rdquo; polaroids, celebration radars for birthdays, and potluck coordination in one tactile shelf.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-[24px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                  <GitFork className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50">
                  Generational Tree
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Connect branches across grandparents, parents, and grandchildren with clear kinship roles and verified directories.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900 dark:bg-zinc-950 text-zinc-50 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Gather Your Family in Your Own Sanctuary.
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Create your family space in less than 2 minutes. Free, private, and isolated forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-sm sm:text-base font-semibold shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <span>Create Family Space</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto h-12 px-7 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm sm:text-base font-medium transition-colors"
              >
                Sign In to Existing Family
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="w-full py-8 text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/40 dark:border-zinc-800/40 bg-[#fbfbfd] dark:bg-[#09090b]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-transparent dark:border-zinc-700 text-zinc-50 dark:text-zinc-100 font-bold text-xs flex items-center justify-center">
              K
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Kinship</span>
            <span className="text-zinc-400">&bull; The Digital Living Room</span>
          </div>
          <div>Private &bull; End-to-End Family Sanctuary &bull; Zero Data Profiling</div>
          <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
            <Link href="/prototype" className="hover:underline">Prototype</Link>
            <Link href="/login" className="hover:underline">Sign In</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
