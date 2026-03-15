"use client";

import { useState } from "react";
import { Roboto } from "next/font/google";
import type { Post } from "@/lib/types";
import { Button } from "./Button";

const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

type EditModalProps = {
  post: Post | null;
  onClose: () => void;
  onSave: (id: number, title: string, content: string) => Promise<void>;
  isSaving: boolean;
};

function EditModalForm({
  post,
  onClose,
  onSave,
  isSaving,
}: {
  post: Post;
  onClose: () => void;
  onSave: (id: number, title: string, content: string) => Promise<void>;
  isSaving: boolean;
}) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(post.id, title, content);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-title"
    >
      <div
        className={`w-full max-w-[660px] rounded-2xl border border-[#999999] bg-white p-6 shadow-lg transition-all duration-200 dark:border-zinc-600 dark:bg-zinc-800 ${roboto.className}`}
      >
        <h2
          id="edit-title"
          className="text-[22px] font-bold leading-[100%] text-[#000000] dark:text-zinc-100"
        >
          Edit item
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor="edit-title-input" className="block text-base font-normal leading-[100%] text-[#000000] dark:text-zinc-200">
            Title
          </label>
          <input
            id="edit-title-input"
            type="text"
            placeholder="Hello world"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#777777] bg-white px-3 py-2 text-base text-[#000000] placeholder:text-zinc-400 focus:border-[#7695EC] focus:outline-none focus:ring-1 focus:ring-[#7695EC] dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400"
          />
          <label htmlFor="edit-content-input" className="mt-4 block text-base font-normal leading-[100%] text-[#000000] dark:text-zinc-200">
            Content
          </label>
          <textarea
            id="edit-content-input"
            placeholder="Content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-2 w-full resize-none rounded-lg border border-[#777777] bg-white px-3 py-2 text-base text-[#000000] placeholder:text-zinc-400 focus:border-[#7695EC] focus:outline-none focus:ring-1 focus:ring-[#7695EC] dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400"
          />
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="fixed"
              disabled={isSaving}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success" size="fixed" disabled={isSaving}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditModal({
  post,
  onClose,
  onSave,
  isSaving,
}: EditModalProps) {
  if (!post) return null;
  return (
    <EditModalForm
      key={post.id}
      post={post}
      onClose={onClose}
      onSave={onSave}
      isSaving={isSaving}
    />
  );
}
