import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LanguageModal } from "./components/LanguageModal";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { ServiceDetail } from "./pages/ServiceDetail";
import { Portfolio } from "./pages/Portfolio";
import { Gallery } from "./pages/Gallery";
import { Contact } from "./pages/Contact";
import { SolarSubsidy } from "./pages/SolarSubsidy";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Admin Routes - No Header/Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminLogin />} />
            
            {/* Public Routes - With Header/Footer */}
            <Route path="/" element={
              <>
                <LanguageModal />
                <Header />
                <main className="min-h-screen">
                  <Home />
                </main>
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <LanguageModal />
                <Header />
                <main className="min-h-screen">
                  <About />
                </main>
                <Footer />
              </>
            } />
            <Route path="/services" element={
              <>
                <LanguageModal />
                <Header />
                <main className="min-h-screen">
                  <Services />
                </main>
                <Footer />
              </>
            } />
            <Route path="/services/:slug" element={
              <>
                <LanguageModal />
                <Header />
                <main className="min-h-screen">
                  <ServiceDetail />
                </main>
                <Footer />
              </>
            } />
            <Route path="/portfolio" element={
              <>
                <LanguageModal />
                <Header />
                <main className="min-h-screen">
                  <Portfolio />
                </main>
                <Footer />
              </>
            } />
            <Route path="/gallery" element={
              <>
                <LanguageModal />
                <Header />
                <main className="min-h-screen">
                  <Gallery />
                </main>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <LanguageModal />
                <Header />
                <main className="min-h-screen">
                  <Contact />
                </main>
                <Footer />
              </>
            } />
            <Route path="/solar-subsidy" element={
              <>
                <LanguageModal />
                <Header />
                <main className="min-h-screen">
                  <SolarSubsidy />
                </main>
                <Footer />
              </>
            } />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;