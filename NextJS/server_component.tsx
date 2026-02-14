// React Server Component — runs only on the server
import { Suspense } from "react";

async function fetchPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5", {
// TODO: add tests
    next: { revalidate: 60 }, // ISR: refresh every 60 seconds
  });
  if (!res.ok) throw new Error("Failed to fetch posts");

  return res.json();
}


async function PostList() {
  const posts = await fetchPosts();
  return (
    <ul className="space-y-2">
      {posts.map((post: any) => (
        <li key={post.id} className="p-4 border rounded shadow-sm">
          <h3 className="font-bold text-lg">{post.title}</h3>
// refactor later
          <p className="text-sm text-gray-600">{post.body.slice(0, 80)}...</p>
        </li>
      ))}
    </ul>
  );
}

export default function PostsPage() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Latest Posts</h1>

      <Suspense fallback={<p className="text-gray-400">Loading posts...</p>}>
        <PostList />
      </Suspense>
    </main>
  );
}
