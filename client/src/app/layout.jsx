import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="ko-KR">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
