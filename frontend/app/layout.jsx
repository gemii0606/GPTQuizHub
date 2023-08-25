import "../styles/global.css";
import StyledComponentsRegistry from "../lib/registry";

export const metadata = {
  title: "GPTQuizHub",
  description: "A quiz website that turns articles into interactive quizzes for solo or competitive play.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
