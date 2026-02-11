import { getMyProfile } from "@/app/lib/profile";
import { CreatePost } from "../posts/NewPostForm";
import { PostList } from "./PostList";

type FeedProps = {
  posts: any[];
};

export async function Feed({ posts }: FeedProps) {
  const profile = await getMyProfile();

  return (
    <section className="space-y-6">
      <CreatePost profile={profile} />
      <PostList posts={posts} />
    </section>
  );
}
