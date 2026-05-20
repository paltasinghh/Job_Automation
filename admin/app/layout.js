export const metadata = {
    title: "Job Dashboard",
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body style={{ fontFamily: "Arial" }}>{children}</body>
      </html>
    );
  }