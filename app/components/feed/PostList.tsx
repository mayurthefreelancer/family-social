import { PostCard } from "./PostCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card";
import { Sparkles } from "lucide-react";

export function PostList({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <Card className="rounded-[24px] border-zinc-200/80 dark:border-zinc-800 p-8 text-center bg-white dark:bg-zinc-900/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-zinc-500">
          <Sparkles className="w-5 h-5" />
        </div>
        <CardHeader className="p-0">
          <CardTitle className="text-base font-bold text-zinc-950 dark:text-zinc-50">
            Your Living Room is Quiet
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Be the first relative to share a photo, tell a family story, or post a Sunday recipe above.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
