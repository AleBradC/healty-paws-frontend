import { type FC } from "react";
import "./styles.css";

interface TestimonialCardProps {
  text: string;
  author: string;
}

export const TestimonialCard: FC<TestimonialCardProps> = ({ text, author }) => (
  <article className="testimonial-card">
    <p className="testimonial-text">{text}</p>
    <p className="testimonial-author">— {author}</p>
  </article>
);
