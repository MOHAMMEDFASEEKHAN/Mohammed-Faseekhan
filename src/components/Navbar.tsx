import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";

const Navbar = () => {
  return (
    <>
      <div className="header">
        <a href="#landingDiv" className="navbar-title" data-cursor="disable">
          <img
            src="/images/profile.jpeg"
            alt="Portrait of Mohammed Fasee Khan"
            className="profile-logo"
          />
        </a>
        <a
          href="mailto:faseekhans2007@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          faseekhans2007@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
