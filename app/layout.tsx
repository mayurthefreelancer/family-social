export const runtime = "nodejs";
import "./globals.css";
import "./styles/tokens.css";
import { inter } from "./font";

export const metadata = {
  title: "Family Social",
  description: "Private family space",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable}
          font-sans
          bg-[var(--color-bg)]
          text-[var(--color-text-primary)]
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
