import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Quote {
  id: string;
  text: string;
  font: string;
  fontWeight: string;
  fontSize: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
}

interface PosterConfig {
  quotes: Quote[];
  [key: string]: any;
}

interface Poster {
  id: string;
  title: string;
  config: PosterConfig;
  user_id: string;
  created_at: string;
  updated_at: string;
  thumbnail_url: string;
}

// Font categories and their respective fonts
const FONT_CATEGORIES = {
  'Sans Serif': [
    { name: 'Inter', value: 'Inter', weights: ['400', '500', '600', '700'] },
    { name: 'Roboto', value: 'Roboto', weights: ['400', '500', '700'] },
    { name: 'Open Sans', value: 'Open Sans', weights: ['400', '600', '700'] },
    { name: 'Lato', value: 'Lato', weights: ['400', '700'] },
    { name: 'Montserrat', value: 'Montserrat', weights: ['400', '500', '600', '700'] },
    { name: 'Poppins', value: 'Poppins', weights: ['400', '500', '600', '700'] },
  ],
  'Serif': [
    { name: 'Playfair Display', value: 'Playfair Display', weights: ['400', '500', '600', '700'] },
    { name: 'Merriweather', value: 'Merriweather', weights: ['400', '700'] },
    { name: 'Source Serif Pro', value: 'Source Serif Pro', weights: ['400', '600', '700'] },
    { name: 'Noto Serif', value: 'Noto Serif', weights: ['400', '700'] },
  ],
  'Display': [
    { name: 'Oswald', value: 'Oswald', weights: ['400', '500', '600', '700'] },
    { name: 'Raleway', value: 'Raleway', weights: ['400', '500', '600', '700'] },
    { name: 'Quicksand', value: 'Quicksand', weights: ['400', '500', '600', '700'] },
  ],
  'Monospace': [
    { name: 'Roboto Mono', value: 'Roboto Mono', weights: ['400', '500', '700'] },
    { name: 'Source Code Pro', value: 'Source Code Pro', weights: ['400', '500', '600', '700'] },
    { name: 'Ubuntu Mono', value: 'Ubuntu Mono', weights: ['400', '700'] },
  ],
};

const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px'
];

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
];

const ALIGNMENTS = [
  { name: 'Left', value: 'left' },
  { name: 'Center', value: 'center' },
  { name: 'Right', value: 'right' },
];

const SingleCreation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [creation, setCreation] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [fontSearch, setFontSearch] = useState('');

  const filteredCategories = Object.entries(FONT_CATEGORIES).reduce((acc, [category, fonts]) => {
    const filteredFonts = fonts.filter(font => 
      font.name.toLowerCase().includes(fontSearch.toLowerCase())
    );
    if (filteredFonts.length > 0) {
      acc[category] = filteredFonts;
    }
    return acc;
  }, {} as typeof FONT_CATEGORIES);

  useEffect(() => {
    const fetchCreation = async () => {
      try {
        const { data, error } = await supabase
          .from('posters')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const poster = data as unknown as Poster;
          setCreation(poster);
          setQuotes(poster.config?.quotes || [{
            id: crypto.randomUUID(),
            text: '',
            font: 'Inter',
            fontWeight: '400',
            fontSize: '24px',
            color: '#000000',
            alignment: 'left'
          }]);
        }
      } catch (error) {
        console.error('Error fetching creation:', error);
        toast.error('Failed to load creation');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCreation();
    }
  }, [id]);

  const handleSave = async () => {
    if (!creation) return;

    try {
      const { error } = await supabase
        .from('posters')
        .update({
          config: {
            ...creation.config,
            quotes
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setCreation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          config: {
            ...prev.config,
            quotes
          }
        };
      });
      setIsEditing(false);
      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    }
  };

  const addQuote = () => {
    setQuotes(prev => [...prev, {
      id: crypto.randomUUID(),
      text: '',
      font: 'Inter',
      fontWeight: '400',
      fontSize: '24px',
      color: '#000000',
      alignment: 'left'
    }]);
  };

  const removeQuote = (id: string) => {
    setQuotes(prev => prev.filter(quote => quote.id !== id));
  };

  const moveQuote = (id: string, direction: 'up' | 'down') => {
    setQuotes(prev => {
      const index = prev.findIndex(quote => quote.id === id);
      if (index === -1) return prev;
      
      const newQuotes = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= newQuotes.length) return prev;
      
      [newQuotes[index], newQuotes[newIndex]] = [newQuotes[newIndex], newQuotes[index]];
      return newQuotes;
    });
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === id ? { ...quote, ...updates } : quote
    ));
  };

  const getCurrentFontWeights = (font: string) => {
    for (const fonts of Object.values(FONT_CATEGORIES)) {
      const fontObj = fonts.find(f => f.value === font);
      if (fontObj) return fontObj.weights;
    }
    return ['400'];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : creation ? (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{creation.title}</h1>
            {user?.id === creation.user_id && (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                {isEditing && (
                  <Button onClick={handleSave}>Save Changes</Button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Quotes</h2>
                  <Button onClick={addQuote} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quote
                  </Button>
                </div>
                <div className="space-y-4">
                  {quotes.map((quote, index) => (
                    <Card key={quote.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Quote {index + 1}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveQuote(quote.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveQuote(quote.id, 'down')}
                            disabled={index === quotes.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuote(quote.id)}
                            disabled={quotes.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Text</Label>
                          <textarea
                            className="w-full p-2 border rounded-md"
                            value={quote.text}
                            onChange={(e) => updateQuote(quote.id, { text: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Font Family</Label>
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search fonts..."
                                className="pl-8"
                                value={fontSearch}
                                onChange={(e) => setFontSearch(e.target.value)}
                              />
                            </div>
                            <ScrollArea className="h-[200px] rounded-md border p-4">
                              <Accordion type="single" collapsible className="w-full">
                                {Object.entries(filteredCategories).map(([category, fonts]) => (
                                  <AccordionItem key={category} value={category}>
                                    <AccordionTrigger className="text-sm font-medium">
                                      {category}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="grid grid-cols-2 gap-2 pt-2">
                                        {fonts.map((font) => (
                                          <div
                                            key={font.value}
                                            className={`flex cursor-pointer items-center space-x-2 rounded-md border p-2 transition-colors hover:bg-accent ${
                                              quote.font === font.value ? 'border-primary bg-accent' : ''
                                            }`}
                                            onClick={() => updateQuote(quote.id, { font: font.value })}
                                          >
                                            <div className="flex-1">
                                              <p 
                                                className="text-sm font-medium" 
                                                style={{ 
                                                  fontFamily: font.value,
                                                  fontWeight: quote.fontWeight
                                                }}
                                              >
                                                {font.name}
                                              </p>
                                              <p 
                                                className="text-xs text-muted-foreground" 
                                                style={{ 
                                                  fontFamily: font.value,
                                                  fontWeight: quote.fontWeight
                                                }}
                                              >
                                                The quick brown fox jumps over the lazy dog
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </ScrollArea>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Font Weight</Label>
                              <Select
                                value={quote.fontWeight}
                                onValueChange={(value) => updateQuote(quote.id, { fontWeight: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select weight" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getCurrentFontWeights(quote.font).map((weight) => (
                                    <SelectItem key={weight} value={weight}>
                                      {weight}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Font Size</Label>
                              <Select
                                value={quote.fontSize}
                                onValueChange={(value) => updateQuote(quote.id, { fontSize: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                  {FONT_SIZES.map((size) => (
                                    <SelectItem key={size} value={size}>
                                      {size}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Color</Label>
                              <Select
                                value={quote.color}
                                onValueChange={(value) => updateQuote(quote.id, { color: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                  {COLORS.map((color) => (
                                    <SelectItem key={color.value} value={color.value}>
                                      <div className="flex items-center space-x-2">
                                        <div 
                                          className="w-4 h-4 rounded-full border" 
                                          style={{ backgroundColor: color.value }}
                                        />
                                        <span>{color.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Alignment</Label>
                              <Select
                                value={quote.alignment}
                                onValueChange={(value: 'left' | 'center' | 'right') => 
                                  updateQuote(quote.id, { alignment: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select alignment" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ALIGNMENTS.map((alignment) => (
                                    <SelectItem key={alignment.value} value={alignment.value}>
                                      {alignment.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Preview</Label>
                          <div 
                            className="p-4 border rounded-md"
                            style={{
                              fontFamily: quote.font,
                              fontWeight: quote.fontWeight,
                              fontSize: quote.fontSize,
                              color: quote.color,
                              textAlign: quote.alignment
                            }}
                          >
                            {quote.text || 'Preview text will appear here...'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="prose max-w-none"
                  style={{
                    fontFamily: quote.font,
                    fontWeight: quote.fontWeight,
                    fontSize: quote.fontSize,
                    color: quote.color,
                    textAlign: quote.alignment
                  }}
                >
                  {quote.text}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Creation not found</p>
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Go back home
          </Button>
        </div>
      )}
    </div>
  );
};

export default SingleCreation; 