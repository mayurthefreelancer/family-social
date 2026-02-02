import { CreatePost } from "../posts/NewPostForm";
import { PostList } from "./PostList";

type FeedProps = {
  posts: any[];
};

export function Feed({ posts }: FeedProps) {
  return (
    <section className="space-y-6">
      <CreatePost />

      <PostList posts={posts} />
    </section>
  );
}
