
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---
interface CardProps {
  title: string;
  description: string;
  image?: string;
  year?: string;
  cta?: string;
  onClick?: () => void;
}

interface ReadoutProps {
  title: string;
  subtitle: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  mediaPoster?: string;
  reverse?: boolean;
  cta?: string;
  overline?: string;
  onCtaClick?: () => void;
}

interface GemDetail {
  id: string;
  overline: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  readoutImage: string;
}

// --- CONSTANTS & BRANDING ---
const LOGO_URL = "https://media.riyadhair.com/is/content/aviationservices/rx-riyadh_air-logo_vector-white-12082025";

const RX_CONCIERGE_CONTEXT = `You are the Riyadh Air Digital Concierge, a sophisticated AI ambassador for Riyadh Air.
Riyadh Air is Saudi Arabia's new national carrier launching in 2025, owned by PIF.
Tony Douglas is the CEO. Sfeer is our loyalty program.
Tone: Premium, elegant, professional.`;

// --- RX DIGITAL AI SERVICE ---
const getRXConciergeResponse = async (userMessage: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: { systemInstruction: RX_CONCIERGE_CONTEXT, temperature: 0.7 },
    });
    return response.text;
  } catch (error) {
    console.error("RX Concierge Error:", error);
    return "Our premium concierge services are currently high in demand. Please try again soon.";
  }
};

// --- GLOBAL COMPONENTS ---

const NotificationModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; message: string }> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 bg-rx-purple rounded-full flex items-center justify-center mx-auto text-rx-gold">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-3xl font-bold text-rx-purple">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{message}</p>
        <button onClick={onClose} className="w-full bg-rx-purple text-white py-4 rounded-full font-bold hover:bg-rx-gold transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
};

const Header: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#2d114db3] backdrop-blur-lg py-3 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/"><img src={LOGO_URL} alt="Riyadh Air" className="w-32 md:w-40" /></Link>
        <nav className="hidden lg:flex items-center space-x-10">
          <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-rx-gold' : 'text-white'}`}>Home</Link>
          <Link to="/about" className={`text-sm font-medium ${location.pathname === '/about' ? 'text-rx-gold' : 'text-white'}`}>About Us</Link>
          <Link to="/experience" className={`text-sm font-medium ${location.pathname === '/experience' ? 'text-rx-gold' : 'text-white'}`}>Experience</Link>
          <Link to="/discover" className={`text-sm font-medium ${location.pathname === '/discover' ? 'text-rx-gold' : 'text-white'}`}>Discover Riyadh</Link>
          <Link to="/login" className={`text-sm font-medium ${location.pathname === '/login' ? 'text-rx-gold' : 'text-white/80'} hover:text-rx-gold transition-colors`}>Login</Link>
          <button onClick={onBookClick} className="bg-rx-gold text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-105 transition-transform active:scale-95">Book Now</button>
        </nav>
      </div>
    </header>
  );
};

const Banner: React.FC<{
  title: string;
  subtitle?: string;
  videoUrl?: string;
  imageUrl?: string;
  ctaText?: string;
  onClick?: () => void;
  fullHeight?: boolean;
}> = ({ title, subtitle, videoUrl, imageUrl, ctaText, onClick, fullHeight = true }) => (
  <section className={`relative w-full overflow-hidden ${fullHeight ? 'h-screen' : 'h-[60vh]'} flex items-center justify-center bg-rx-purple`}>
    <div className="absolute inset-0 z-0">
      {videoUrl ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster={imageUrl}
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="application/x-mpegURL" />
          {/* Fallback for browsers that don't support video or the formats */}
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        </video>
      ) : (
        <img src={imageUrl || 'https://media.riyadhair.com/is/image/aviationservices/rx-home-hero-banner-sound-v1'} alt="" className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-rx-purple/40" />
    </div>
    <div className="relative z-10 container mx-auto px-6 text-center text-white">
      <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-2xl max-w-5xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-10 duration-1000">
        {title}
      </h1>
      {subtitle && <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto font-light leading-relaxed animate-in fade-in duration-1000 delay-300">{subtitle}</p>}
      {ctaText && (
        <button onClick={onClick} className="bg-white text-rx-purple px-10 py-4 rounded-full text-lg font-bold hover:bg-rx-gold hover:text-white transition-all transform hover:scale-105 shadow-2xl">
          {ctaText}
        </button>
      )}
    </div>
    {fullHeight && (
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-8 h-8 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth={2} /></svg>
      </div>
    )}
  </section>
);

const ContentCard: React.FC<CardProps> = ({ title, description, image, year, cta, onClick }) => (
  <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-100">
    <div className="relative h-72 overflow-hidden">
      {image && <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
      {year && <div className="absolute top-6 left-6 bg-white/30 backdrop-blur-md px-4 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">{year}</div>}
    </div>
    <div className="p-8 flex flex-col flex-grow">
      <h3 className="text-2xl font-bold text-rx-purple mb-4 group-hover:text-rx-gold transition-colors leading-tight">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">{description}</p>
      {cta && (
        <button onClick={onClick} className="flex items-center space-x-2 text-rx-purple font-bold text-sm group/cta">
          <span className="border-b-2 border-transparent group-hover/cta:border-rx-gold transition-all">{cta}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth={2} /></svg>
        </button>
      )}
    </div>
  </div>
);

const ReadoutSection: React.FC<ReadoutProps> = ({ title, subtitle, mediaType, mediaUrl, reverse, cta, overline, onCtaClick }) => (
  <section className="py-24">
    <div className={`container mx-auto px-6 flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20`}>
      <div className="w-full lg:w-1/2 space-y-8">
        {overline && <small className="text-rx-gold uppercase tracking-[0.2em] font-bold text-xs">{overline}</small>}
        <h2 className="text-4xl md:text-5xl font-bold text-rx-purple leading-tight">{title}</h2>
        <p className="text-lg text-gray-700 font-light leading-relaxed italic border-l-4 border-rx-gold pl-6">{subtitle}</p>
        {cta && <button onClick={onCtaClick} className="bg-rx-purple text-white px-10 py-4 rounded-full text-sm font-bold hover:bg-rx-gold transition-all">{cta}</button>}
      </div>
      <div className="w-full lg:w-1/2">
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-square bg-gray-100">
          {mediaType === 'video' ? <video autoPlay loop muted playsInline className="w-full h-full object-cover"><source src={mediaUrl} type="video/mp4" /></video> : <img src={mediaUrl} className="w-full h-full object-cover" alt="" />}
        </div>
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="bg-rx-purple text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 border-b border-white/10 pb-20">
          <div className="space-y-8">
            <img src={LOGO_URL} alt="Riyadh Air" className="w-44" />
            <p className="text-white/60 text-sm leading-relaxed font-light">Setting a new standard in global aviation. Born in Riyadh, inspired by the world.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-8 text-rx-gold">Company</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/discover" className="hover:text-white transition-colors">Destinations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-8 text-rx-gold">Loyalty</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/sfeer" className="hover:text-white transition-colors">Join Sfeer</Link></li>
              <li><Link to="/sfeer" className="hover:text-white transition-colors">Rewards</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-8 text-rx-gold">Stay Informed</h4>
            {subscribed ? (
              <div className="bg-white/10 p-4 rounded-2xl animate-in zoom-in duration-300">
                <p className="text-rx-gold font-bold text-sm">Thank you for joining our journey.</p>
              </div>
            ) : (
              <div className="flex border-b border-white/20 pb-3">
                <input type="email" placeholder="Email address" className="bg-transparent border-none focus:ring-0 text-sm flex-grow outline-none placeholder:text-white/30" />
                <button onClick={() => setSubscribed(true)} className="text-rx-gold font-bold hover:text-white px-4 transition-colors">Join</button>
              </div>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-white/40">© 2024 Riyadh Air. Wholly owned by the Public Investment Fund.</p>
      </div>
    </footer>
  );
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([{ role: 'ai', text: "Welcome. I am your RX Digital Concierge. How may I assist you today?" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsLoading(true);
    const res = await getRXConciergeResponse(msg);
    setMessages(prev => [...prev, { role: 'ai', text: res }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-rx-purple rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white hover:scale-110 transition-transform">
        {isOpen ? <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
      </button>
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in slide-in-from-bottom-5">
          <div className="bg-rx-purple p-6 text-white"><h4 className="font-bold">RX Digital Concierge</h4><p className="text-xs opacity-60">Always at your service</p></div>
          <div ref={scrollRef} className="flex-grow p-6 space-y-4 max-h-[400px] overflow-y-auto bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-rx-gold text-white rounded-tr-none' : 'bg-white shadow-sm text-rx-purple rounded-tl-none'}`}>{m.text}</div>
              </div>
            ))}
            {isLoading && <div className="text-[10px] text-gray-400 p-4">Thinking...</div>}
          </div>
          <div className="p-4 bg-white border-t flex items-center space-x-3">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="flex-grow text-sm outline-none" />
            <button onClick={handleSend} className="text-rx-purple font-bold">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- PAGES ---

const HomePage: React.FC<{ onBook: () => void }> = ({ onBook }) => (
  <div className="bg-[#fcfaff]">
    <Banner 
      title="Pathway to perfect" 
      subtitle="Setting a new standard in global aviation from day one." 
      imageUrl="https://media.riyadhair.com/is/image/aviationservices/rx-homepage-hero-thumb-26012026"
      videoUrl="https://media.riyadhair.com/is/content/aviationservices/rx-homepage-hero-26012026-AVS" 
      ctaText="Book Your Journey" 
      onClick={onBook} 
    />
    <section className="py-32 container mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-bold text-rx-purple">Elevating every journey</h2>
        <p className="text-xl text-gray-500 font-light">Saudi hospitality meets the cutting edge of digital innovation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <ContentCard onClick={onBook} title="The Sfeer Experience" description="A new world of points and lifestyle rewards with Riyadh Air." image="https://media.riyadhair.com/is/image/aviationservices/sfeer-content-7-en-v4-120102025" cta="Join Program" />
        <ContentCard title="Luxury Refined" description="Saudi craftsmanship meets the future of air travel in every detail." image="https://media.riyadhair.com/is/image/aviationservices/rx3.0_riyadh-air-and-kayanee_content-card-08102025" cta="Explore" />
        <ContentCard title="The Art of Comfort" description="Rest and rejuvenate in our thoughtfully curated premium cabins." image="https://media.riyadhair.com/is/image/aviationservices/Elevated-comfort" cta="Discover" />
      </div>
    </section>
  </div>
);

const DiscoverPage: React.FC = () => {
  const [selectedGem, setSelectedGem] = useState<GemDetail | null>(null);

  const gems: GemDetail[] = [
    {
      id: "masmak",
      overline: "Enduring the symbol of Riyadh's heritage and unity",
      title: "Al Masmak Palace",
      subtitle: "Riyadh’s historic fortress, where the city’s story began",
      description: "Step inside Al Masmak Palace, the storied fortress where King Abdulaziz launched the historic 1902 raid to reclaim Riyadh. Built in 1865, this clay and mud-brick fortress ranks among the most memorable Riyadh places to visit. At its gate, the mark of Prince Fahad bin Jiluwi’s spear remains, a lasting symbol of bravery and determination.",
      heroImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-masmak_palace-hero_banner-v2-06082025",
      readoutImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-masmak_palace-readout_card_2-06082025"
    },
    {
      id: "diriyah",
      overline: "Where heritage inspires the future",
      title: "Diriyah",
      subtitle: "A legacy shaped by land and echoes",
      description: "Explore the historic birthplace of the Saudi state. Stroll through restored mudbrick alleyways, dine at Bujairi Terrace with views of Al-Turaif (a UNESCO site), and visit the creative JAX District. Diriyah is where authentic flavors meet timeless charm and cultural energy.",
      heroImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-diriyah-hero-v2-06082025",
      readoutImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-diriyah-card_1-06082025"
    },
    {
      id: "edge",
      overline: "An ideal escape for hiking",
      title: "Edge of the World",
      subtitle: "Sunsets glow brighter from Riyadh’s breathtaking cliffs",
      description: "Venture beyond the city to Jebel Fihrayn, the Edge of the World. Reach the summit to see vistas stretching to the infinite horizon. Perfect for day trips, sunrise meditation, or weekend camping, these dramatic cliffs glow with golden light at twilight.",
      heroImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-edge_of_the_world-hero-06082025",
      readoutImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-edge_of_the_world-readout_card_1-06082025"
    },
    {
      id: "souk",
      overline: "A living thread of Riyadh heritage",
      title: "Souk Al-Zal",
      subtitle: "Where every stall shares culture and crafts",
      description: "One of Riyadh’s oldest markets, known for antiques, handwoven carpets, and traditional goods. Walk tiled paths smelling of oud and incense. Savor Arabic coffee and dates while browsing rare archival-quality crafts that reveal the roots of Saudi identity.",
      heroImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-souk_al_zal-hero_banner-07082025",
      readoutImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-souk_al_zal-card_3-31072025"
    },
    {
      id: "kafd",
      overline: "Step into the rhythm of modern Riyadh",
      title: "KAFD",
      subtitle: "The city within the city, Riyadh’s jewel architectural masterpiece",
      description: "The King Abdullah Financial District (KAFD) is the city's architectural jewel. Offering designer shopping, chic cafes, and some of the best fine dining in Riyadh, it is the ultimate destination for those seeking the finer things in a digitally-native environment.",
      heroImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-kafd-hero-06082025",
      readoutImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-kafd-card_1-06082025"
    },
    {
      id: "blvd",
      overline: "The face of modern Riyadh",
      title: "Boulevard City",
      subtitle: "The ultimate hub for entertainment, dining, and culture",
      description: "Inspired by global entertainment hubs like Times Square, Boulevard City features nine themed zones. With over 200 shops and incredible live performances, it is the face of modern Riyadh's vibrant leisure culture.",
      heroImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-boulevard-hero_banner-06082025",
      readoutImage: "https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-boulevard-readout_card_2-06082025"
    }
  ];

  return (
    <div className="bg-[#fcfaff]">
      <Banner 
        title="Discover Riyadh" 
        subtitle="Riyadh is where timeless culture inspires the future. Explore the soul of Saudi Arabia."
        imageUrl="https://media.riyadhair.com/is/image/aviationservices/rx-discover_riyadh-diriyah-hero-v2-06082025"
        videoUrl="https://media.riyadhair.com/is/content/aviationservices/rx-discover_riyadh-readout_1-07082025-AVS.m3u8?packagedstreaming=true" 
      />
      
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <small className="text-rx-gold uppercase tracking-[0.3em] font-bold text-xs">Explore the Kingdom</small>
          <h2 className="text-4xl md:text-5xl font-bold text-rx-purple">Crafting beautiful journeys together</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">From historic alleyways to gleaming skylines, Riyadh is a city of infinite discovery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {gems.map((gem) => (
            <ContentCard 
              key={gem.id}
              title={gem.title} 
              description={gem.subtitle} 
              image={gem.heroImage} 
              cta="Explore Gem"
              onClick={() => setSelectedGem(gem)}
            />
          ))}
        </div>
      </section>

      {/* Detail Modal Overlay */}
      {selectedGem && (
        <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-md overflow-y-auto pt-10 pb-20 px-6 animate-in fade-in duration-300">
          <div className="max-w-6xl mx-auto bg-white rounded-[4rem] overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedGem(null)}
              className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/20 hover:bg-rx-purple hover:text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} /></svg>
            </button>
            
            <div className="h-[50vh] relative">
              <img src={selectedGem.heroImage} alt={selectedGem.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 md:left-20">
                <small className="text-rx-gold uppercase tracking-[0.2em] font-bold mb-2 block">{selectedGem.overline}</small>
                <h2 className="text-5xl md:text-7xl font-bold text-rx-purple">{selectedGem.title}</h2>
              </div>
            </div>

            <div className="p-10 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-rx-purple italic leading-relaxed border-l-8 border-rx-gold pl-8">
                  "{selectedGem.subtitle}"
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed font-light">
                  {selectedGem.description}
                </p>
                <button 
                  onClick={() => setSelectedGem(null)}
                  className="bg-rx-purple text-white px-10 py-4 rounded-full font-bold hover:bg-rx-gold transition-colors"
                >
                  Return to Discovery
                </button>
              </div>
              <div className="rounded-[3rem] overflow-hidden shadow-xl aspect-square bg-gray-50">
                <img src={selectedGem.readoutImage} alt="Details" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-rx-purple flex items-center justify-center p-6 relative overflow-hidden pt-20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rx-gold/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
      
      <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl relative z-10 space-y-10 animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <Link to="/"><img src={LOGO_URL} alt="Riyadh Air" className="w-32 mx-auto invert" /></Link>
          <h2 className="text-4xl font-bold text-rx-purple">Welcome Back</h2>
          <p className="text-gray-500 font-light">Login to manage your journey and Sfeer rewards.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-rx-purple ml-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-rx-gold transition-colors"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-rx-purple ml-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-rx-gold transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-rx-purple text-white py-5 rounded-full font-bold hover:bg-rx-gold transition-colors shadow-lg active:scale-95">Sign In</button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Don't have an account? <Link to="/sfeer" className="text-rx-purple font-bold hover:text-rx-gold underline">Join Sfeer</Link>
        </div>
      </div>
    </div>
  );
};

const AboutPage: React.FC<{ onCta: () => void }> = ({ onCta }) => {
  const [modal, setModal] = useState({ open: false, title: "", message: "" });
  const handleDownload = () => setModal({ open: true, title: "Report Ready", message: "Your 2024 Annual Report download has started. Thank you for your interest." });

  return (
    <div className="bg-[#fcfaff]">
      <Banner title="A new era is in the sky" subtitle="Digitally native airline driven by a pioneering spirit." imageUrl="https://media.riyadhair.com/is/image/aviationservices/rx-experience-fleet-hero_banner-sound-020220206-AVS" />
      <section className="py-24 container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold text-rx-purple mb-8">Our journey</h2>
          <p className="text-xl text-gray-700 leading-relaxed font-light italic">
            "Our journey is inspired by Saudi spirit and driven by innovation, where ambition meets design to shape a global airline."
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          <ContentCard year="2023" title="The first amazing year" description="Setting the foundation for a global vision." image="https://media.riyadhair.com/is/image/aviationservices/rx-ourstory-ourjourney-card1-06082025" />
          <ContentCard year="2024" title="The year of readiness" description="Pushing boundaries and cultivating a fleet." image="https://media.riyadhair.com/is/image/aviationservices/rx-ourstory-ourjourney-card2-06082025" />
          <ContentCard year="2025" title="The year of takeoff" description="Ready to transcend modern flying." image="https://media.riyadhair.com/is/image/aviationservices/rx-ourstory-ourjourney-card3-06082025" />
        </div>
        <ReadoutSection 
          overline="Tony Douglas, CEO"
          title="Message from our CEO"
          subtitle="Riyadh Air will be a digitally native airline, driven by a pioneering spirit with an obsessive focus on innovation."
          mediaType="image"
          mediaUrl="https://media.riyadhair.com/is/image/aviationservices/rx-our_story-ceo-tony_douglas-29072025"
          reverse={true}
        />
        <div className="bg-rx-purple text-white p-12 md:p-24 rounded-[4rem] text-center space-y-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-5xl font-bold">Annual Report</h2>
            <p className="text-xl opacity-70 max-w-2xl mx-auto font-light">Download the full vision of Riyadh Air.</p>
            <button onClick={handleDownload} className="bg-rx-gold text-white px-12 py-5 rounded-full font-bold hover:scale-105 transition-transform">Download PDF</button>
          </div>
        </div>
      </section>
      <NotificationModal isOpen={modal.open} onClose={() => setModal({ ...modal, open: false })} title={modal.title} message={modal.message} />
    </div>
  );
};

const ExperiencePage: React.FC = () => (
  <div className="bg-[#fcfaff]">
    <Banner title="The art of travel" subtitle="Where Saudi craftsmanship meets the future." imageUrl="https://media.riyadhair.com/is/image/aviationservices/rx-experience-cabin-hero_banner-thumb-sound" fullHeight={false} />
    <ReadoutSection title="Cabin Interiors" subtitle="Thoughtfully curated for every part of your journey." mediaType="video" mediaUrl="https://media.riyadhair.com/is/content/aviationservices/rx-experience-cabin-hero_banner-sound-AVS.m3u8?packagedstreaming=true" />
  </div>
);

const CareersPage: React.FC = () => (
  <div className="bg-white">
    <Banner title="Join our team" subtitle="Your career takes off here." imageUrl="https://picsum.photos/1920/1080?people" fullHeight={false} />
    <section className="py-32 text-center px-6"><h2 className="text-4xl font-bold text-rx-purple mb-12">Search Openings</h2><button className="bg-rx-purple text-white px-12 py-5 rounded-full font-bold hover:bg-rx-gold transition-colors shadow-xl">Apply Now</button></section>
  </div>
);

const SfeerPage: React.FC<{ onJoin: () => void }> = ({ onJoin }) => (
  <div className="bg-[#fcfaff]">
    <Banner title="Welcome to Sfeer" subtitle="Rewards designed around you." imageUrl="https://media.riyadhair.com/is/image/aviationservices/sfeer-content-7-en-v2-080102025" ctaText="Log in | Join" onClick={onJoin} />
    <section className="py-32 text-center px-6"><h2 className="text-4xl font-bold text-rx-purple mb-8">Join Sfeer</h2><button onClick={onJoin} className="bg-rx-purple text-white px-12 py-5 rounded-full font-bold shadow-xl hover:bg-rx-gold transition-colors">Join Now</button></section>
  </div>
);

// --- MAIN APP ---

const App: React.FC = () => {
  const [modal, setModal] = useState({ open: false, title: "", message: "" });
  const handleBook = () => setModal({ open: true, title: "Launching Soon", message: "Bookings for Riyadh Air will officially open in early 2025. Stay tuned for our inaugural flight schedule." });
  const handleJoin = () => setModal({ open: true, title: "Registration", message: "Sfeer membership registration is opening soon. Leave your email in our newsletter to be the first to know." });

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header onBookClick={handleBook} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage onBook={handleBook} />} />
            <Route path="/about" element={<AboutPage onCta={handleBook} />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/sfeer" element={<SfeerPage onJoin={handleJoin} />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
        <NotificationModal 
          isOpen={modal.open} 
          onClose={() => setModal({ ...modal, open: false })} 
          title={modal.title} 
          message={modal.message} 
        />
      </div>
    </Router>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>);
}
