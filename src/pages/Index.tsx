import React, { useState, useEffect, useRef } from 'react';
import { ImageGenerator } from '@/components/ImageGenerator';
import { CustomizationPanel } from '@/components/CustomizationPanel';
import { MassGeneration } from '@/components/MassGeneration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Image, Zap, ArrowRight, Play, Grid3X3, Star, Users, Layers, Instagram, Twitter, Github, Code, Heart, Sparkles as SparklesIcon, Settings } from 'lucide-react';
import { Gallery } from '@/components/Gallery';
import { Contact } from '@/components/Contact';
import { TextStyle, TextLayout } from '@/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import LoginPopup from '@/components/LoginPopup';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import UserMenu from '@/components/UserMenu';

const Index = () => {
  const [currentQuote, setCurrentQuote] = useState("trust the process");
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontSize: 48,
    fontFamily: 'Poppins',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 1.2,
    fontWeight: 700,
    opacity: 1,
    blur: 0,
    gradient: {
      enabled: false,
      colors: ['#ffffff', '#ffffff'],
      angle: 90
    },
    textBehindImage: false
  });
  const [textLayout, setTextLayout] = useState({
    mode: 'multi-line' as 'single-line' | 'multi-line' | 'auto-wrap',
    lineSpacing: 8,
    maxWidth: 600
  });
  const [textPosition, setTextPosition] = useState({ x: 60, y: 180 });
  const [selectedBackground, setSelectedBackground] = useState('red-fire');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'generate' | 'gallery' | 'contact'>('generate');
  const [activeTab, setActiveTab] = useState<'single' | 'mass'>('single');
  const [galleryImages, setGalleryImages] = useState([
    {
      id: '1',
      url: '/carousel images/jeta-poster-1.jpg',
      quote: "i got my own back",
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      url: '/carousel images/jeta-poster-2.jpg',
      quote: "to be the star\nyou must burn",
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      url: '/carousel images/jeta-poster-3.jpg',
      quote: "God's plan\nover mine",
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      url: '/carousel images/jeta-poster-4.jpg',
      quote: "Hustle in silence,\nlet your success make the noise.",
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      url: '/carousel images/jeta-poster-5.jpg',
      quote: "Your only limit\nis your mind.",
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      url: '/carousel images/jeta-poster-6.jpg',
      quote: "Don't stop when you're tired.\nStop when you're done.",
      createdAt: new Date().toISOString()
    },
    {
      id: '7',
      url: '/carousel images/jeta-poster-7.jpg',
      quote: "Success is not final,\nfailure is not fatal.",
      createdAt: new Date().toISOString()
    },
    {
      id: '8',
      url: '/carousel images/jeta-poster-8.jpg',
      quote: "The only way to do great work\nis to love what you do.",
      createdAt: new Date().toISOString()
    },
    {
      id: '9',
      url: '/carousel images/jeta-poster-9.jpg',
      quote: "Dream big,\nwork hard.",
      createdAt: new Date().toISOString()
    }
  ]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const generateRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: 'generate' | 'gallery' | 'contact') => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTextStyleChange = (style: TextStyle) => {
    setTextStyle(style);
  };

  const handleFeatureAccess = () => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return false;
    }
    return true;
  };

  const handleTabChange = (value: 'single' | 'mass') => {
    if (value === 'mass' && !handleFeatureAccess()) {
      return;
    }
    setActiveTab(value);
  };

  const handleGenerateClick = () => {
    if (!handleFeatureAccess()) {
      return;
    }
    const generateSection = document.getElementById('generate');
    if (generateSection) {
      generateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-black/5">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link to="/" className="inline-flex items-center gap-2">
                  <div className="w-9 h-9 bg-black rounded-lg rotate-12 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded rotate-12" />
                  </div>
                  <span className="text-2xl font-black">JETA</span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                  {isAuthenticated ? (
                    <UserMenu />
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" className="sm:text-base" onClick={() => setShowLoginPopup(true)}>Login</Button>
                      <Button variant="default" size="sm" className="sm:text-base" onClick={() => setShowLoginPopup(true)}>Sign up</Button>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </header>

          <main className="pt-16 sm:pt-24">
            <style>{`
              body {
                font-weight: 300;
                font-family: 'Inter', sans-serif; /* Changed font family for body text */
              }
              h1, h2, h3, h4, h5, h6, strong, b {
                font-weight: inherit;
                font-family: 'Inter', sans-serif; /* Changed font family for headings */
              }
              .font-light { font-weight: 300; }
              .font-medium { font-weight: 500; }
              .font-semibold { font-weight: 600; }
              .font-bold { font-weight: 700; }
              .font-black { font-weight: 900; }

              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }

              .animate-pulse {
                animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              }
            `}</style>
            <section id="generate" className="min-h-screen">
              {/* Hero Section with Background */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10"></div>
                <div 
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=1600&h=1200&fit=crop&crop=face')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-32">
                  <div className="max-w-5xl">
                    <div className="flex items-center gap-4 mb-8 sm:mb-12">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="h-px w-24 sm:w-32 bg-black/20"></div>
                      <span className="text-xs sm:text-sm font-bold text-black/50 tracking-[0.2em] uppercase">
                        Viral Content Studio
                      </span>
                    </div>
                    
                    <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-[-0.03em] leading-[0.85] mb-8 sm:mb-16">
                      Create
                      <br />
                      <span className="text-gray-600 italic font-light">Viral</span>
                      <br />
                      Content
                    </h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-end">
                      <div className="space-y-6 sm:space-y-8">
                        <p className="text-lg sm:text-2xl text-black/60 leading-relaxed font-light max-w-xl">
                          Professional motivational content that captures attention and drives engagement. 
                          <span className="font-semibold text-black"> Built for creators who demand excellence.</span>
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs sm:text-sm text-black/40">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full"></div>
                            <span className="font-medium">10M+ views generated</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full"></div>
                            <span className="font-medium">50K+ creators</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full"></div>
                            <span className="font-medium">5s generation</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-black/5 to-transparent rounded-2xl sm:rounded-3xl"></div>
                        <div className="relative bg-white/60 backdrop-blur-xl border border-black/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8">
                          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center">
                              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-black">Premium Quality</h3>
                              <p className="text-xs sm:text-sm text-black/50">Professional grade output</p>
                            </div>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black/40" />
                              <span className="text-xs sm:text-sm text-black/60">Viral-ready templates</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black/40" />
                              <span className="text-xs sm:text-sm text-black/60">Advanced customization</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black/40" />
                              <span className="text-xs sm:text-sm text-black/60">Instant generation</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Interface */}
              <div className="relative bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-32">
                  <Tabs defaultValue="single" className="w-full" onValueChange={(value) => handleTabChange(value as 'single' | 'mass')}>
                    <div className="mb-12 sm:mb-24 mt-24 sm:mt-48">
                      <div className="text-center mb-8 sm:mb-16">
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 sm:mb-6">Choose Your Flow</h2>
                        <p className="text-base sm:text-xl text-black/50 font-light">Single masterpiece or batch production</p>
                      </div>
                      
                      <TabsList className="bg-black/5 border border-black/10 h-12 sm:h-16 p-1 sm:p-2 rounded-2xl sm:rounded-3xl mx-auto">
                        <TabsTrigger 
                          value="single" 
                          className="flex items-center gap-2 sm:gap-4 data-[state=active]:bg-white data-[state=active]:shadow-lg px-4 sm:px-10 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all text-sm sm:text-base"
                        >
                          <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Single Creation</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="mass" 
                          className="flex items-center gap-2 sm:gap-4 data-[state=active]:bg-white data-[state=active]:shadow-lg px-4 sm:px-10 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all text-sm sm:text-base"
                        >
                          <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Batch Production</span>
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="single" className="space-y-12 sm:space-y-24">
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 sm:gap-16">
                        {/* Canvas Area */}
                        <div className="xl:col-span-2">
                          <div className="mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-4">Live Canvas</h2>
                            <p className="text-base sm:text-lg text-black/50 font-light">Drag to position • Real-time updates • Professional output</p>
                          </div>
                          <ImageGenerator
                            quote={currentQuote}
                            textStyle={textStyle}
                            textLayout={textLayout}
                            textPosition={textPosition}
                            onTextPositionChange={setTextPosition}
                            selectedBackground={selectedBackground}
                            textBehindImage={textStyle.textBehindImage}
                            customImage={selectedBackground === 'custom-upload' ? customImage : undefined}
                          />
                        </div>

                        {/* Customization Panel */}
                        <div className="xl:col-span-1">
                          <div className="mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-4">Controls</h2>
                            <p className="text-base sm:text-lg text-black/50 font-light">Fine-tune every detail</p>
                          </div>
                          <CustomizationPanel
                            quote={currentQuote}
                            onQuoteChange={setCurrentQuote}
                            textStyle={textStyle}
                            onTextStyleChange={handleTextStyleChange}
                            textLayout={textLayout}
                            onTextLayoutChange={setTextLayout}
                            selectedBackground={selectedBackground}
                            onBackgroundChange={setSelectedBackground}
                            onCustomImageChange={setCustomImage}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="mass" className="mt-6">
                      {isAuthenticated ? (
                        <MassGeneration />
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-base sm:text-lg text-muted-foreground">
                            Please sign in to access batch generation
                          </p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setShowLoginPopup(true)}
                          >
                            Sign In
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </section>

            {activeTab === 'single' && (
              <>
                <section id="gallery" className="min-h-screen">
                  <Gallery images={galleryImages} />
                </section>

                <section id="contact" className="min-h-screen">
                  <Contact />
                </section>
              </>
            )}
          </main>

          {/* Footer */}
          <footer className="relative border-t border-black/5 bg-white">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center rotate-12">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded rotate-12" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Vansh Jain</h3>
                      <p className="text-xs sm:text-sm text-black/40 font-medium mt-1">Full Stack Developer</p>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-black/60 font-light leading-relaxed max-w-xl">
                    A 14-year-old developer passionate about creating tools that help people express their creativity. 
                    Building products that make a difference, one line of code at a time.
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <a 
                      href="https://instagram.com/vnshx_jain" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-black/5 hover:bg-black/10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black/60" />
                    </a>
                    <a 
                      href="https://twitter.com/vanshjainx" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-black/5 hover:bg-black/10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300"
                      title="Twitter"
                    >
                      <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black/60" />
                    </a>
                    <a 
                      href="https://github.com/VANSHJAIN-exe" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-black/5 hover:bg-black/10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black/60" />
                    </a>
                  </div>
                </div>
                
                <div className="lg:text-right space-y-6 sm:space-y-8">
                  <div className="flex flex-wrap justify-start lg:justify-end items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-black/40 bg-black/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-xs font-medium">AI Powered</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-black/40 bg-black/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-xs font-medium">Viral Ready</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-black/40 bg-black/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-xs font-medium">Premium Quality</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-2xl sm:text-4xl font-black tracking-tight text-black">
                      BUILT BY VANSH JAIN
                    </p>
                    <p className="text-[10px] sm:text-xs text-black/20 font-medium tracking-wider">
                      TURNING IDEAS INTO REALITY SINCE 2010
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      <LoginPopup 
        isOpen={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)}
        onSuccess={() => {
          // Handle successful login
          if (activeSection === 'generate') {
            setActiveTab('single');
          } else {
            setActiveTab('mass');
          }
        }}
      />
    </div>
  );
};

export default Index;
