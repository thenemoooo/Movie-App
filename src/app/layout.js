import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Movie Z",
  description: "Movie database app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavigationBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}