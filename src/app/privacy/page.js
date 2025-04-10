export const metadata = {
  title: "Picturan Club | Privacy Policy",
  description: "Privacy policy. Customize your photostrip with various colors and overlays. Photobooth Web Application made by Gerar.",
};

const Privacy = () => {
  return (
    <main className="main">
      <h1>Privacy Policy</h1>
      <div className="privacy-policy">
        <b>Effective Date:</b> April 8, 2025
        <hr></hr>
        <ol>
          <li>
            <h3>Introduction</h3>

            <p>Welcome to <b>PicturanClub</b>. We are committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our web application (the <b>&quot;Service&quot;</b>).</p>
            
            <p>Our core privacy commitment is simple: We do not store your photos or related personal data generated through the photobooth features of our Service.</p>
          </li>

          <li>
            <h3>Information We Do NOT Collect or Store</h3>

            <p>
              User Images: <b>We do not store the photos</b> you take or upload using our photobooth application on our servers. Images are processed temporarily (in your browser or briefly on our server only if technically necessary for applying effects) solely to provide the photobooth functionality (e.g., applying filters, creating layouts) and allow you to download or share them directly. Once your session ends, the image processing is complete, or you close the browser tab/window, these temporary image files are discarded and are not retained by us.
            </p>
          
            <p>
              Personal Data from Images: We do not analyze images for biometric data or attempt to identify individuals from the photos processed through the Service.
            </p>
          </li>

          <li>
            <h3>How We Share Information</h3>

            <p>
              We do not share, sell, rent, or trade your personal information or photos with third parties because we do not store them.
            </p>
          </li>

          <li>
            <h3>Changes to This Privacy Policy</h3>

            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Effective Date&quot; at the top. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </li>
        </ol>
      </div>
    </main>
  )
}

export default Privacy;
