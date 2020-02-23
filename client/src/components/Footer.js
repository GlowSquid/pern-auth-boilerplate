import Link from "next/link";

const Footer = () => (
  <div className="footer">
    <p>
      &copy; Copyright{" "}
      <Link href="https://glowsquid.com/">
        <a target="_blank" rel="noopener noreferrer">
          GlowSquid.com
        </a>
      </Link>{" "}
      {new Date().getFullYear()}
    </p>
  </div>
);

export default Footer;
