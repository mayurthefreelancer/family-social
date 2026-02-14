export const runtime = "nodejs";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import "./globals.css";
import "./styles/tokens.css";

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
    <html lang="en" data-theme="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  if (stored) {
                    document.documentElement.setAttribute('data-theme', stored);
                  } else {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                  }
                } catch (e) {}
              })();
    `,
          }}
        />

      </head>
      <body>
        <ThemeProvider>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
