import React from "react";
import Link from "next/link";


const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-bottom">
        <div className="footer-logo"></div>
        <div className="footer-nav-container">
          <ul className="footer-nav">
            <li className="t-link">
              <Link href="/privacy">Privacy</Link>
            </li>
            <li className="t-link">
              <a href="https://github.com/gerarjon" target="_blank"><span>Gerar</span></a>
            </li>
            <li className="">
              <a href="https://github.com/gerarjon/photobooth" target="_blank">
                <span className="github-icon"></span>
              </a> 
            </li>
            <li>
              <Link href="/"><span className="logo-small"></span></Link>
            </li>
          </ul>

        </div>
      </div>
      {/* <div className="">
      </div> */}
    </footer>
  )
}

export default Footer;