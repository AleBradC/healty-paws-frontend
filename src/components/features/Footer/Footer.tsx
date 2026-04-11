import { type FC } from "react";
import "./styles.css";
import { aboutPath, contactPath, privacyPath } from "../../../utils/path";

export const Footer: FC = () => (
  <footer className="site-footer" role="contentinfo">
    <div className="footer__container">
      <nav className="footer__nav" aria-label="Footer">
        <a className="footer__link" href={aboutPath}>
          About
        </a>
        <a className="footer__link" href={contactPath}>
          Contact
        </a>
        <a className="footer__link" href={privacyPath}>
          Privacy Policy
        </a>
      </nav>
      <p className="footer__copy">© {new Date().getFullYear()} HealthyPaws</p>
    </div>
  </footer>
);
