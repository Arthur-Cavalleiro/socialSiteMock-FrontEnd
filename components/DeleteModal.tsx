"use client";

import { Roboto } from "next/font/google";
import type { Post } from "@/lib/types";
import { Button } from "./Button";

const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

type DeleteModalProps = {
  post: Post | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export function DeleteModal({
  post,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteModalProps) {
  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div
        className={`w-full max-w-[660px] rounded-2xl border border-[#999999] bg-white p-6 shadow-lg transition-all duration-200 dark:border-zinc-600 dark:bg-zinc-800 ${roboto.className}`}
      >
        <h2
          id="delete-title"
          className="text-[22px] font-bold leading-[100%] text-[#000000] dark:text-zinc-100"
        >
          Are you sure you want to delete this item?
        </h2>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="fixed"
            disabled={isDeleting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="fixed"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
