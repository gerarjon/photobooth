import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
          <Link href="/">
          <div className="logo"></div>
          </Link>
      </div>
    </nav>
  )
}

export default Navbar;
