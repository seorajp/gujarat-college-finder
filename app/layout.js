export const metadata = {
  title: "Gujarat College Finder",
  description: "Find the best universities and institutes in Gujarat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f9fafb" }}>
        {children}
      </body>
    </html>
  );
}
