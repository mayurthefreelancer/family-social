import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/app/components/ui/Card";
import { buttonVariants } from "@/app/components/ui/Button";

export function InvalidInvite() {
  return (
    <Card className="text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border-zinc-200/80 dark:border-zinc-800">
      <CardHeader className="pt-8 pb-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl mb-3 select-none">
          ⏳
        </div>
        <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
          Invite Expired or Invalid
        </CardTitle>
        <CardDescription className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">
          This family invitation link has expired or has already been used. Please ask your family organizer to send you a fresh invite.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center pb-8 pt-2">
        <Link
          href="/login"
          className={buttonVariants({ variant: "outline", className: "rounded-full text-xs" })}
        >
          Return to Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

export function AlreadyJoined() {
  return (
    <Card className="text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border-zinc-200/80 dark:border-zinc-800">
      <CardHeader className="pt-8 pb-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl mb-3 select-none">
          🏡
        </div>
        <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
          Already in the Family
        </CardTitle>
        <CardDescription className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">
          You are already an active member of this family sanctuary. Your living room is open!
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center pb-8 pt-2">
        <Link
          href="/feed"
          className={buttonVariants({ variant: "default", className: "rounded-full text-xs" })}
        >
          Enter Family Living Room →
        </Link>
      </CardFooter>
    </Card>
  );
}

export function WrongFamily() {
  return (
    <Card className="text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border-zinc-200/80 dark:border-zinc-800">
      <CardHeader className="pt-8 pb-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl mb-3 select-none">
          🔒
        </div>
        <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
          Different Family Space
        </CardTitle>
        <CardDescription className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">
          You are currently signed in under another family. To join this family, please sign out first or switch accounts.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center pb-8 pt-2">
        <Link
          href="/feed"
          className={buttonVariants({ variant: "outline", className: "rounded-full text-xs" })}
        >
          Return to Your Family Feed
        </Link>
      </CardFooter>
    </Card>
  );
}