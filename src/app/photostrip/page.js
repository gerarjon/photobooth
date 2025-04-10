import PhotoStrip from "@/components/PhotoStrip";

export const metadata = {
  title: "PicturanClub | Customize",
  description: "Customize your photostrip with various colors and overlays. Free Photobooth Web Application made by Gerar.",
};

const Preview = () => {
  return (
    <div className="container">
      <main className="main">
        <h1>Customize Your PhotoStrip</h1>

        <PhotoStrip />
      </main>
    </div>
  )
}

export default Preview;
