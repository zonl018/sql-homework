import "../app/styles/globals.css"; // <== 加這一行在最上面

export const metadata = {
  title: "SQL 爆擊測驗",
  description: "每日練習 10 題，強化 MS SQL 實戰力",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
