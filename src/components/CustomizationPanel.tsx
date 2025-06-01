import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Image, Lightbulb, Layers, Type, Palette, Eye } from 'lucide-react';
import { TextLayoutControls } from '@/components/TextLayoutControls';
import { TextStyle, TextLayout } from '@/types';

interface CustomizationPanelProps {
  quote: string;
  onQuoteChange: (quote: string) => void;
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
  textLayout: TextLayout;
  onTextLayoutChange: (layout: TextLayout) => void;
  selectedBackground: string;
  onBackgroundChange: (background: string) => void;
  onCustomImageChange?: (dataUrl: string) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  quote,
  onQuoteChange,
  textStyle,
  onTextStyleChange,
  textLayout,
  onTextLayoutChange,
  selectedBackground,
  onBackgroundChange,
  onCustomImageChange
}) => {
  const backgrounds = [
    // Football
    {
      id: 'football-action',
      name: 'Football Action',
      category: 'Sport',
      image: '/images-all/messi.webp'
    },
    // Tech (renamed)
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
    // Basketball
    {
      id: 'lebron-james',
      name: 'LeBron James',
      category: 'Sport',
      image: '/images-all/lebron james.webp'
    },
    // Movies
    {
      id: 'batman',
      name: 'Batman',
      category: 'Movies',
      image: '/images-all/batman.jpg'
    },
    {
      id: 'fight-club',
      name: 'Fight Club',
      category: 'Movies',
      image: '/images-all/fight club.jpg'
    },
    {
      id: 'fight-club-1',
      name: 'Fight Club 1',
      category: 'Movies',
      image: '/images-all/fight club 1.jpg'
    },
    // Wolf of Wall Street
    {
      id: 'wolf-of-wall-street',
      name: 'Wolf of Wall Street',
      category: 'Movies',
      image: '/images-all/wolf of the wall street.jpg'
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
    },
    // Gym
    {
      id: 'gym-beast',
      name: 'Gym Beast',
      category: 'Gym Bro',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: 'deadlift-power',
      name: 'Deadlift Power',
      category: 'Gym Bro',
      image: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: 'crossfit-athlete',
      name: 'Crossfit Athlete',
      category: 'Gym Bro',
      image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=400&fit=crop&crop=face'
    },
    // Existing backgrounds
    {
      id: 'green-nature',
      name: 'Green Nature',
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5'
    }
  ];

  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCustomImage(dataUrl);
      onBackgroundChange && onBackgroundChange('custom-upload');
      onCustomImageChange && onCustomImageChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* Quote Input */}
      <Card className="bg-white border border-black/10 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-6 pt-12 px-12">
          <CardTitle className="text-3xl font-black tracking-tight text-black flex items-center gap-4">
            <MessageSquare className="w-8 h-8 text-black/40" />
            Your Quote
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-12 pb-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Quote Text</Label>
              <Textarea
                value={quote}
                onChange={(e) => onQuoteChange(e.target.value)}
                placeholder="Enter your motivational quote here..."
                className="bg-white border-black/20 text-black placeholder:text-black/40 rounded-2xl min-h-32 text-lg leading-relaxed resize-none"
              />
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-black/5 rounded-2xl">
              <Lightbulb className="w-5 h-5 text-black/40" />
              <p className="text-sm text-black/60 font-medium">
                Keep it short and impactful for best results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background Selection */}
      <Card className="bg-white border border-black/10 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-6 pt-12 px-12">
          <CardTitle className="text-3xl font-black tracking-tight text-black flex items-center gap-4">
            <Image className="w-8 h-8 text-black/40" />
            Background Style
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-12 pb-12">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {backgrounds.map((bg) => (
              <div
                key={bg.id}
                onClick={() => onBackgroundChange(bg.id)}
                className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${
                  selectedBackground === bg.id
                    ? 'ring-4 ring-black shadow-2xl scale-105'
                    : 'ring-2 ring-black/10 hover:ring-black/30 hover:scale-102'
                }`}
              >
                <img
                  src={bg.image}
                  alt={bg.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-sm truncate">{bg.name}</h3>
                  <p className="text-white/70 text-xs truncate">{bg.category}</p>
                </div>
                {selectedBackground === bg.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Custom upload preview */}
            {customImage && (
              <div
                className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${
                  selectedBackground === 'custom-upload'
                    ? 'ring-4 ring-black shadow-2xl scale-105'
                    : 'ring-2 ring-black/10 hover:ring-black/30 hover:scale-102'
                }`}
                onClick={() => onBackgroundChange('custom-upload')}
              >
                <img src={customImage} alt="Custom Upload" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-sm truncate">Custom Upload</h3>
                  <p className="text-white/70 text-xs truncate">Your Image</p>
                </div>
                {selectedBackground === 'custom-upload' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              className="bg-black text-white hover:bg-black/80 px-4 py-2 rounded-xl font-semibold"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Image
            </Button>
            <span className="text-sm text-black/50">Recommended: 800x800px</span>
          </div>
        </CardContent>
      </Card>

      {/* Text Layout Controls */}
      <TextLayoutControls
        textStyle={textStyle}
        onTextStyleChange={onTextStyleChange}
        textLayout={textLayout}
        onTextLayoutChange={onTextLayoutChange}
      />

      {/* Text Behind Image Toggle */}
      {/* Removed Layer Settings toggle for Text Behind Image (now only controlled by dropdown in ImageGenerator) */}
    </div>
  );
};
