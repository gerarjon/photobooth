/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";


const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="">
        <div className="footer-bottom">
          <ul>
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
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer;