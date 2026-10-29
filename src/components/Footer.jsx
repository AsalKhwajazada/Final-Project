import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-copyright">
        © 2026 GraphicDesignHUB. Made with <i className="fa-solid fa-heart footer-heart"></i> for creative learners worldwide.
      </div>
      <div className="footer-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/find-academy">Academies</Link>
        <Link to="/asset-marketplace">Marketplace</Link>
        <Link to="/preferences">Preferences</Link>
      </div>
    </footer>
  );
}
