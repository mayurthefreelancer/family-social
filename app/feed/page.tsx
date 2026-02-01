// app/feed/page.tsx

import { InviteButton } from "../components/InviteButton";
import { NewPostForm } from "../components/posts/NewPostForm";
import { PostCard } from "../components/posts/PostCard";
import { requireUser } from "../lib/auth";
import { getUserFamily } from "../lib/family";
import { getFeed } from "../lib/feed";

export default async function FeedPage() {
  const userId = await requireUser();
  const familyId = await getUserFamily(userId);

  if (!familyId) {
    return <p>Create or join a family</p>;
  }

  const posts = await getFeed(familyId);

  return (
    <div>
      <h1>Family Feed</h1>

      {/* add invote button */}
      <InviteButton />

      <div>create new post</div>
      <NewPostForm />

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
