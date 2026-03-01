import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css";

export const metadata: Metadata = {
  title: "ZenFlow | AI Agentic Workflow Sandbox",
  description: "Test Sequential and Supervisor AI agent workflows powered by Google Gemini. Compare model responses across multi-agent pipelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0 }}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
