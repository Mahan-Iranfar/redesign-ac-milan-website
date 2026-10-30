import "./globals.css";
import { sitePath } from "../lib/paths";
export const metadata = {
  title: {
    default: "ClubSphere — AC Milan Edition",
    template: "%s · ClubSphere",
  },
  description: "Independent football design concept inspired by AC Milan.",
  icons: { icon: sitePath("assets/favicon.svg") },
};
export const viewport = { themeColor: "#08090B" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={sitePath("assets/style.css")} />
      </head>
      <body>{children}</body>
    </html>
  );
}
