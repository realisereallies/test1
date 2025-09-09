import React from 'react'
import './Footer.css'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__links">
          <a href="#" className="footer__link">Log In</a>
          <a href="#" className="footer__link">About Us</a>
          <a href="#" className="footer__link">Publishers</a>
          <a href="#" className="footer__link">Sitemap</a>
        </div>
        <div className="footer__powered">
          <span className="footer__powered-text">Powered by</span>
          <img src="/news api.png" alt="News API" className="footer__api-logo" />
        </div>
        <div className="footer__copyright">
          © 2023 Besider. Inspired by Insider
        </div>
      </div>
    </footer>
  )
}

export default Footer
