import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
          <Link href="/">
            <Image 
              src="/assets/logo2.png"
              alt="Logo" 
              fill
              style={{
                objectFit: "cover",
                height: "100%"
              }}
            />
          </Link>
      </div>
    </nav>
  )
}

export default Navbar;
