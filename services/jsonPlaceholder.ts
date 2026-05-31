import { API_URLS } from "@/lib/constants";
import type { User } from "@/types/user";
import type { Post, Todo, Comment } from "@/types/post";

const BASE = API_URLS.jsonPlaceholder;

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/users`);
  return res.json();
}

export async function getUser(id: number): Promise<User> {
  const res = await fetch(`${BASE}/users/${id}`);
  return res.json();
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE}/posts`);
  return res.json();
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE}/posts/${id}`);
  return res.json();
}

export async function getPostsByUser(userId: number): Promise<Post[]> {
  const res = await fetch(`${BASE}/users/${userId}/posts`);
  return res.json();
}

export async function createPost(post: Omit<Post, "id">): Promise<Post> {
  const res = await fetch(`${BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return res.json();
}

export async function updatePost(id: number, post: Partial<Post>): Promise<Post> {
  const res = await fetch(`${BASE}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  await fetch(`${BASE}/posts/${id}`, { method: "DELETE" });
}

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${BASE}/todos`);
  return res.json();
}

export async function getTodosByUser(userId: number): Promise<Todo[]> {
  const res = await fetch(`${BASE}/users/${userId}/todos`);
  return res.json();
}

export async function createTodo(todo: Omit<Todo, "id">): Promise<Todo> {
  const res = await fetch(`${BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return res.json();
}

export async function getComments(postId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE}/posts/${postId}/comments`);
  return res.json();
}
