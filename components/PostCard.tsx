"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Post } from "@/lib/types";
import { Button } from "./Button";

type PostCardProps = {
  post: Post;
  currentUsername: string;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
};

export function PostCard({
  post,
  currentUsername,
  onEdit,
  onDelete,
}: PostCardProps) {
  const isOwner = post.username === currentUsername;
  const timeAgo = formatDistanceToNow(new Date(post.created_datetime), {
    addSuffix: true,
    locale: enUS,
  });

  const paddingX = "px-6";

  return (
    <article className="overflow-hidden rounded-2xl">
      <header
        className={
          "flex items-center justify-between rounded-t-2xl bg-[#7695EC] py-4 dark:bg-[#6b87e0] " +
          paddingX
        }
      >
        <h3 className="text-[22px] font-bold leading-[100%] text-white">
          {post.title}
        </h3>
        {isOwner && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="icon"
              onClick={() => onEdit(post)}
              aria-label="Edit post"
            >
              <Image
                src="/bx_edit.svg"
                alt=""
                width={24}
                height={22}
                className="h-6 w-auto"
                style={{ width: "auto" }}
              />
            </Button>
            <Button
              type="button"
              variant="icon"
              onClick={() => onDelete(post)}
              aria-label="Delete post"
            >
              <Image
                src="/delete_forever.svg"
                alt=""
                width={24}
                height={22}
                className="h-6 w-auto"
                style={{ width: "auto" }}
              />
            </Button>
          </div>
        )}
      </header>
      <div className="rounded-b-2xl border border-[#999999] border-t-0 bg-white dark:border-zinc-600 dark:bg-zinc-800">
        <div className={"flex justify-between py-2 " + paddingX}>
          <span className="text-lg font-bold leading-[100%] text-[#777777] dark:text-zinc-400">
            @{post.username}
          </span>
          <span className="text-base text-[#777777] dark:text-zinc-400">
            {timeAgo}
          </span>
        </div>
        <div className={"py-4 " + paddingX}>
          <p className="whitespace-pre-wrap text-base text-[#000000] dark:text-zinc-100">
            {post.content}
          </p>
        </div>
      </div>
    </article>
  );
}
