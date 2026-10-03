import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/Card";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border-zinc-200/80 dark:border-zinc-800">
      <CardHeader className="text-center pb-4 pt-8">
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {title}
        </CardTitle>
        {subtitle && (
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            {subtitle}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-6 pb-8 pt-2">
        {children}
      </CardContent>
    </Card>
  );
}
