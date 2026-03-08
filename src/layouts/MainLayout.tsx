import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TechneticsInfo from '../components/TechneticsInfo'
import Events from '../components/Events'
import InfoSections from '../components/InfoSections'
import Sponsors from '../components/Sponsors'
import SponsorBanner from '../components/SponsorBanner'
import ContactUs from '../components/ContactUs'
import ApparateHere from '../components/ApparateHere'
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <TechneticsInfo />
      <Events />
      <InfoSections />
      <Sponsors />
      <SponsorBanner />
      <ContactUs />
      <ApparateHere />
      <Footer />
    </>
  );
}

export default MainLayout