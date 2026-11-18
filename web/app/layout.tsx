import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Кадровый ассистент",
  description: "Подсистема отпусков",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}