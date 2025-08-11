import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import { font } from "../Components/Font/font";

export default function Help() {
  return (
    <div className={`${font.className} min-h-screen bg-white`}>
      <Navbar />
      <div className="max-w-6xl flex justify-center mx-auto px-2 py-6">
        <h1 className="text-4xl uppercase font-bold">Coming Soon</h1>
      </div>
      <Footer />
    </div>
  );
}
