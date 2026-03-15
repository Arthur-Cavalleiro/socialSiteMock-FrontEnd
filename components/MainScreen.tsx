"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { getPosts, createPost, updatePost, deletePost } from "@/lib/api";
import type { Post } from "@/lib/types";
import { PostCard } from "./PostCard";
import { DeleteModal } from "./DeleteModal";
import { EditModal } from "./EditModal";
import { LogoutConfirmModal } from "./LogoutConfirmModal";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";

const POSTS_QUERY_KEY = ["posts"];

export function MainScreen() {
  const { username, logout } = useUser();
  const queryClient = useQueryClient();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: getPosts,
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      setTitle("");
      setContent("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title: t, content: c }: { id: number; title: string; content: string }) =>
      updatePost(id, { title: t, content: c }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      setPostToEdit(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      setPostToDelete(null);
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !title.trim() || !content.trim()) return;
    createMutation.mutate({ username, title: title.trim(), content: content.trim() });
  };

  const canCreate = title.trim() !== "" && content.trim() !== "";

  return (
    <div className="flex min-h-screen justify-center bg-[#DDDDDD] dark:bg-zinc-900">
      <div className="flex h-screen w-full max-w-[800px] flex-col overflow-hidden border-x border-[#999999] bg-white dark:border-zinc-600 dark:bg-zinc-800">
        <header className="flex h-20 shrink-0 items-center justify-between bg-[#7695EC] px-4 dark:bg-[#6b87e0]">
          <h1 className="text-2xl font-bold text-white">CodeLeap Network</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="cursor-pointer rounded px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Exit
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <section className="rounded-xl border border-[#999999] bg-white p-6 dark:border-zinc-600 dark:bg-zinc-800">
            <h2 className="text-[22px] font-bold leading-[100%] text-[#000000] dark:text-zinc-100">
              What&apos;s on your mind?
            </h2>
            <form onSubmit={handleCreate} className="mt-4">
              <label htmlFor="main-title" className="block text-base font-normal text-[#000000] dark:text-zinc-200">
                Title
              </label>
              <input
                id="main-title"
                type="text"
                placeholder="Hello world"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#777777] bg-white px-3 py-2 text-base text-[#000000] placeholder:text-zinc-400 focus:border-[#7695EC] focus:outline-none focus:ring-1 focus:ring-[#7695EC] dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400"
              />
              <label htmlFor="main-content" className="mt-4 block text-base font-normal text-[#000000] dark:text-zinc-200">
                Content
              </label>
              <textarea
                id="main-content"
                placeholder="Content here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="mt-2 w-full resize-none rounded-lg border border-[#777777] bg-white px-3 py-2 text-base text-[#000000] placeholder:text-zinc-400 focus:border-[#7695EC] focus:outline-none focus:ring-1 focus:ring-[#7695EC] dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400"
              />
              <div className="mt-4 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!canCreate || createMutation.isPending}
                >
                  Create
                </Button>
              </div>
            </form>
          </section>

          <ul className="mt-6 flex flex-col gap-6">
            {isLoading ? (
              <li className="text-center text-[#777777] dark:text-zinc-400">Loading...</li>
            ) : (
              posts.map((post) => (
                <li key={post.id}>
                  <PostCard
                    post={post}
                    currentUsername={username ?? ""}
                    onEdit={setPostToEdit}
                    onDelete={setPostToDelete}
                  />
                </li>
              ))
            )}
          </ul>
        </main>
      </div>

      <DeleteModal
        post={postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => {
          if (postToDelete) deleteMutation.mutate(postToDelete.id);
        }}
        isDeleting={deleteMutation.isPending}
      />

      <EditModal
        post={postToEdit}
        onClose={() => setPostToEdit(null)}
        onSave={async (id, t, c) => {
          await updateMutation.mutateAsync({ id, title: t, content: c });
        }}
        isSaving={updateMutation.isPending}
      />

      <LogoutConfirmModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
      />
    </div>
  );
}
