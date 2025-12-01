import React, { type FC } from "react";
import { cx } from "../../utils/cx";
import "./styles.css";

type ButtonColor = "primary" | "secondary" | "accent" | "neutral" | "default";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color?: ButtonColor;
  size?: ButtonSize;
  as?: "button" | "a";
  href?: string;
}

const colorClass: Record<ButtonColor, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  accent: "btn--accent",
  neutral: "btn--neutral",
  default: "btn--neutral",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "btn--sm",
  md: "btn--md",
  lg: "btn--lg",
};

export const Button: FC<ButtonProps> = ({
  text,
  color,
  size,
  as = "button",
  href,
  className,
  ...rest
}) => {
  const classes = cx(
    "btn",
    color ? colorClass[color] : "",
    size ? sizeClass[size] : "",
    className
  );

  if (as === "a") {
    return (
      <a
        className={classes}
        href={href}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {text}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {text}
    </button>
  );
};
