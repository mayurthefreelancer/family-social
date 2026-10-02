import { getMyProfile } from "@/app/lib/profile";
import { LivingRoomSidebar } from "./LivingRoomSidebar";
import { FeedStreamView } from "./FeedStreamView";

type FeedProps = {
  posts: any[];
};

export async function Feed({ posts }: FeedProps) {
  const profile = await getMyProfile();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Primary Column (7 cols): Activity Stream & Floating Composer */}
      <section className="lg:col-span-7 space-y-6">
        <FeedStreamView posts={posts} profile={profile} />
      </section>

      {/* Secondary Column (5 cols): The Living Room Hearth Sidebar */}
      <div className="lg:col-span-5">
        <LivingRoomSidebar />
      </div>
    </div>
  );
}
