"use client";

import { useUser } from "@/context/UserContext";
import { MainScreen } from "@/components/MainScreen";
import { SignUpModal } from "@/components/SignUpModal";

export default function Home() {
  const { username } = useUser();

  if (username === null) return <SignUpModal />;
  return <MainScreen />;
}
