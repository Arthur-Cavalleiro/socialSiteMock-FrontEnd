"use client";

import { useState } from "react";
import { Roboto } from "next/font/google";
import { useUser } from "@/context/UserContext";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";

const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export function SignUpModal() {
  const { setUsername } = useUser();
  const [value, setValue] = useState("");
  const isEmpty = value.trim() === "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEmpty) return;
    setUsername(value.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#DDDDDD] p-4 transition-opacity dark:bg-zinc-900/95">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div
        className={`w-full max-w-[500px] rounded-lg border border-zinc-200 bg-white p-6 shadow-lg transition-all duration-200 dark:border-zinc-600 dark:bg-zinc-800 ${roboto.className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
      >
        <h2
          id="signup-title"
          className="text-[22px] font-bold leading-[100%] text-[#000000] dark:text-zinc-100"
        >
          Welcome to CodeLeap network!
        </h2>
        <p className="mt-4 text-base font-normal leading-[100%] text-[#000000] dark:text-zinc-200">
          Please enter your username
        </p>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="John doe"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-[#000000] placeholder:text-zinc-400 focus:border-[#7695EC] focus:outline-none focus:ring-1 focus:ring-[#7695EC] dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400"
            autoFocus
          />
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isEmpty}
              size="fixedSm"
              uppercase
            >
              ENTER
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
