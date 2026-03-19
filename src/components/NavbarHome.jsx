import "../styles/home.css";

function NavbarHome() {
  const scrollToHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToContact = () => {
    const section = document.getElementById("contact");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <i className="fa-solid fa-graduation-cap"></i>
        CamPass
      </div>

      <ul className="nav-links">
        <li onClick={scrollToHome} style={{ cursor: "pointer" }}>Home</li>
        <li onClick={scrollToHome} style={{ cursor: "pointer" }}>How to Apply</li>
        <li onClick={scrollToContact}>Contact Us</li>
      </ul>
    </nav>
  );
}

export default NavbarHome;