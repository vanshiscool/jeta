import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Download, Zap, Grid3X3, Image } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import JSZip from 'jszip';

const backgrounds = [
  {
    id: 'mountain-lake',
    name: 'Mountain Lake',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'city-lights',
    name: 'City Lights',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'forest-path',
    name: 'Forest Path',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'abstract-paint',
    name: 'Abstract Paint',
    category: 'Abstract',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'desert-dunes',
    name: 'Desert Dunes',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'night-sky',
    name: 'Night Sky',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'urban-bridge',
    name: 'Urban Bridge',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'colorful-waves',
    name: 'Colorful Waves',
    category: 'Abstract',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'misty-mountains',
    name: 'Misty Mountains',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'messi',
    name: 'Messi',
    category: 'Sport',
    image: '/images-all/messi.webp'
  },
  {
    id: 'batman',
    name: 'Batman',
    category: 'Movies',
    image: '/images-all/batman.jpg'
  },
  {
    id: 'wolf-of-wall-street',
    name: 'Wolf of Wall Street',
    category: 'Movies',
    image: '/images-all/wolf of the wall street.jpg'
  },
  {
    id: 'fight-club',
    name: 'Fight Club',
    category: 'Movies',
    image: '/images-all/fight club.jpg'
  },
  {
    id: 'lebron-james',
    name: 'LeBron James',
    category: 'Sport',
    image: '/images-all/lebron james.webp'
  },
  {
    id: 'elon-musk',
    name: 'Elon Musk',
    category: 'Tech',
    image: '/images-all/elon musk.webp'
  },
  {
    id: 'mark-zuckerberg',
    name: 'Mark Zuckerberg',
    category: 'Tech',
    image: '/images-all/mark zuckerberg..webp'
  },
  {
    id: 'steve-jobs',
    name: 'Steve Jobs',
    category: 'Tech',
    image: '/images-all/young-steve-jobs-1_0.jpg'
  },
  {
    id: 'wolf-of-wall-street-1',
    name: 'Wolf of Wall Street 1',
    category: 'Movies',
    image: '/images-all/wolf of the wall street 1.jpg'
  },
  {
    id: 'wolf-of-wall-street-2',
    name: 'Wolf of Wall Street 2',
    category: 'Movies',
    image: '/images-all/wolf of wall street 2.jpg'
  }
];

// Add a list of professional, viral, motivational quotes
const viralQuotes = [
  "Success is not for the lazy.",
  "Dream big. Work hard. Stay focused.",
  "Hustle in silence, let your success make the noise.",
  "Winners are not people who never fail, but people who never quit.",
  "Discipline is the bridge between goals and accomplishment.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Your only limit is your mind.",
  "Don't stop when you're tired. Stop when you're done.",
  "The harder you work for something, the greater you'll feel when you achieve it."
];

// Fetch a quote from the LLM API if needed
const fetchLLMQuote = async (): Promise<string> => {
  try {
    const response = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Write a short, viral, motivational quote for a poster. No hashtags.' }]
      })
    });
    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    }
    return viralQuotes[Math.floor(Math.random() * viralQuotes.length)];
  } catch {
    return viralQuotes[Math.floor(Math.random() * viralQuotes.length)];
  }
};

// Add a function to apply a grainy filter
function addEnhancedGrainTexture(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 60;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 2;
    ctx.fillRect(x, y, size, size);
  }
  ctx.globalAlpha = 1;
}

// Reference-style quotes for two-line split
const referenceQuotes = [
  { top: "i'm doing this", bottom: "for me." },
  { top: "i got my", bottom: "own back" },
  { top: "God's plan", bottom: "over mine" },
  { top: "love yourself,", bottom: "not me." },
  { top: "i'll make it", bottom: "on my own" },
  { top: "trust the", bottom: "process" },
  { top: "no one else", bottom: "but me" },
  { top: "i choose", bottom: "myself" },
  { top: "stay true", bottom: "to you" },
  { top: "keep moving", bottom: "forward" }
];

export const MassGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [style, setStyle] = useState('gradient');
  const [customQuote, setCustomQuote] = useState('');
  const [numImages, setNumImages] = useState(10);

  const generateVariations = async () => {
    setIsGenerating(true);
    setGeneratedImages([]);
    try {
      const variations = [];
      // Shuffle backgrounds for uniqueness
      const shuffledBackgrounds = backgrounds.slice().sort(() => Math.random() - 0.5);
      
      // Use reference quotes for the two-line style, extending the list if needed
      // For now, cycle through existing referenceQuotes if numImages > referenceQuotes.length
      const quotesToUse = Array.from({ length: numImages }).map((_, i) => 
        referenceQuotes[i % referenceQuotes.length]
      );

      for (let i = 0; i < numImages && i < shuffledBackgrounds.length; i++) {
        const background = shuffledBackgrounds[i];
        const quote = quotesToUse[i]; // Use the two-line quote object
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 800;
        tempCanvas.height = 800;
        const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) { continue; }

        // Load background image
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve(undefined);
          img.onerror = () => resolve(undefined);
          img.src = background.image;
        });
        if (!img.complete || img.naturalWidth === 0) { continue; }

        // Draw background image with object-fit: cover
        const imgRatio = img.width / img.height;
        const canvasRatio = tempCanvas.width / tempCanvas.height;
        let drawW, drawH, offsetX, offsetY;
        if (imgRatio > canvasRatio) {
          drawH = tempCanvas.height;
          drawW = img.width * (tempCanvas.height / img.height);
          offsetX = (tempCanvas.width - drawW) / 2;
          offsetY = 0;
        } else {
          drawW = tempCanvas.width;
          drawH = img.height * (tempCanvas.width / img.width);
          offsetX = 0;
          offsetY = (tempCanvas.height - drawH) / 2;
        }
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

        // Slightly desaturate background
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.globalCompositeOperation = 'saturation';
        ctx.fillStyle = '#888';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();

        // Add dark overlay (40% black)
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.globalAlpha = 1;
        ctx.restore();

        // Top line: regular, lowercase, smaller
        const topFontSize = 54;
        ctx.save();
        ctx.font = `700 ${topFontSize}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.9;
        ctx.filter = 'blur(2px)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#fff';
        ctx.fillText(quote.top.toLowerCase(), 400, 370); // Use quote.top and original position
        ctx.restore();

        // Bottom line: bold, larger, lowercase
        const bottomFontSize = 86;
        ctx.save();
        ctx.font = `900 ${bottomFontSize}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.9;
        ctx.filter = 'blur(2px)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#fff';
        ctx.fillText(quote.bottom.toLowerCase(), 400, 470); // Use quote.bottom and original position
        ctx.restore();

        // Add grainy filter on top
        addEnhancedGrainTexture(ctx, tempCanvas.width, tempCanvas.height);
        const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
        variations.push(dataUrl);
        setGeneratedImages([...variations]);
      }
    } catch (error) {
      alert('Generation failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.download = `jeta-poster-${index + 1}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  // Add Download All button
  const downloadAll = async () => {
    const zip = new JSZip();
    generatedImages.forEach((dataUrl, idx) => {
      const base64 = dataUrl.split(',')[1];
      zip.file(`jeta-poster-${idx + 1}.jpg`, base64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'jeta-posters.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Input Section */}
      <Card className="bg-white border border-black/10 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="pb-8 pt-16 px-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-4xl font-black tracking-tight text-black">
                Batch Generation Studio
              </CardTitle>
              <p className="text-lg text-black/50 font-light mt-2">
                Create multiple poster variations instantly
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-16 pb-16">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <Label className="text-black text-xl font-bold">Poster Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="w-full h-12 bg-white border-black/20 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black/10 rounded-2xl">
                    <SelectItem value="gradient">White-Black Gradient (Recommended)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-black/40">Choose your preferred style for the batch</p>
              </div>
              <div className="space-y-4">
                <Label className="text-black text-xl font-bold">Number of Images</Label>
                <Select value={numImages.toString()} onValueChange={(value) => setNumImages(parseInt(value))}>
                  <SelectTrigger className="w-full h-12 bg-white border-black/20 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black/10 rounded-2xl">
                    {[5, 10, 15, 20].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Images
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-black/40">Select how many variations to generate</p>
              </div>
              <div className="space-y-4">
                <Label className="text-black text-xl font-bold">Custom Quote (optional)</Label>
                <Textarea
                  value={customQuote}
                  onChange={e => setCustomQuote(e.target.value)}
                  placeholder="Enter your quote or leave blank for AI-generated quotes..."
                  className="bg-white border-black/20 text-black placeholder:text-black/40 rounded-2xl min-h-12 text-lg leading-relaxed resize-none"
                  style={{ resize: 'none' }}
                />
                <p className="text-sm text-black/40">Leave empty to use AI-generated viral quotes</p>
              </div>
            </div>
            <Button
              onClick={generateVariations}
              disabled={isGenerating}
              className="w-full bg-black hover:bg-black/90 text-white font-bold py-6 text-lg rounded-2xl transition-all duration-300 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating Variations...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  Generate {numImages} Variations
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      {generatedImages.length > 0 && (
        <Card className="bg-white border border-black/10 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="pb-8 pt-16 px-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black tracking-tight text-black">
                  Generated Variations
                </CardTitle>
                <p className="text-lg text-black/50 font-light mt-2">
                  {generatedImages.length} of {numImages} variations ready
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-16 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="group relative">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-black/5 border border-black/10 relative">
                    <img
                      src={imageUrl}
                      alt={`Generated variation ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      onClick={() => downloadImage(imageUrl, index)}
                      className="absolute top-3 right-3 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-opacity duration-200 flex items-center justify-center"
                      title="Download"
                      tabIndex={0}
                      aria-label="Download poster"
                      type="button"
                    >
                      <Download className="w-5 h-5 text-black" />
                    </button>
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold z-20">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading placeholders */}
              {isGenerating && Array.from({ length: numImages - generatedImages.length }).map((_, index) => (
                <div key={`loading-${index}`} className="aspect-square rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    <span className="text-black/40 font-medium">Generating...</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {generatedImages.length > 0 && (
        <Button
          onClick={downloadAll}
          className="w-full bg-black hover:bg-black/90 text-white font-bold py-4 text-lg rounded-2xl transition-all duration-300 mb-8"
        >
          Download All as ZIP
        </Button>
      )}
    </div>
  );
};
