import { Feed } from "@/app/components/feed/Feed";
import { requireUser } from "@/app/lib/auth";
import { getFamilyFeed } from "@/app/lib/feed";

export default async function FeedPage() {
  const user = await requireUser();
  const posts = await getFamilyFeed(user.familyId);

  return <Feed posts={posts} />;
}
