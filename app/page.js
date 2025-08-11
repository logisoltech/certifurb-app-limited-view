import Image from "next/image";
import Navbar from "./Components/Layout/Navbar";
import Hero from "./Components/Layout/Hero";
import QualitiesBar from "./Components/BasicCx/QualitiesBar";
import CertifiedRenewed from "./Components/Layout/CertifiedRenewed";
import Promotion from "./Components/Layout/Promotion";
import Iphone from "./Components/Layout/Iphone";
import Samsung from "./Components/Layout/Samsung";
import Laptop from "./Components/Layout/Laptop";
import MobileBanner from "./Components/Layout/MobileBanner";
import Community from "./Components/Layout/Community";
import Testimonials from "./Components/Layout/Testimonials";
import Footer from "./Components/Layout/Footer";
import Goat from "./Components/Layout/Goat";
import AppDownload from "./Components/Layout/AppDownload";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <QualitiesBar/>
      <CertifiedRenewed/>
      <Promotion/>
      <div className="bg-white dark:bg-white dark:text-black">
      <Goat />
      </div>
      <Samsung/>
      <AppDownload/>
      <Iphone/>
      {/* <Laptop/> */}
      <MobileBanner/>
      <Community/>
      <Testimonials/>
      <Footer/>
    </div>
  );
}
