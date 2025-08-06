// src/Components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaEnvelope, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-nav">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>

      <div className="footer-credits">
        <p>&copy; {new Date().getFullYear()} Quiz App™</p>
        <p>Made with 💻 by <strong>Mansi Kanchan</strong></p>
      </div>

      <div className="footer-contact">
        <a href="https://wa.me/919120658865" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
        <a href="https://www.instagram.com/__mansi_kanchan__" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com/in/mansi-kanchan-7924b0196/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="mailto:kanchan.mansi2003@gmail.com">
          <FaEnvelope />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
