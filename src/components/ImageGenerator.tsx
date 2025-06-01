import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Move, Layers } from 'lucide-react';
import { detectHumanInBackground, getOptimalTextPosition, detectHumanInBackgroundAuto, detectHumanMaskInImage } from '../src/utils/humanDetection.js';
import { toast } from 'sonner';

import { TextStyle, TextLayout } from '@/types';

interface ImageGeneratorProps {
  quote: string;
  textStyle: TextStyle;
  textLayout: TextLayout;
  textPosition: { x: number; y: number };
  onTextPositionChange: (position: { x: number; y: number }) => void;
  selectedBackground: string;
  textBehindImage?: boolean;
  customImage?: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  quote,
  textStyle,
  textLayout,
  textPosition,
  onTextPositionChange,
  selectedBackground,
  textBehindImage,
  customImage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [textBehindMode, setTextBehindMode] = useState<'behind' | 'front' | 'auto'>('auto');
  const [detectionResult, setDetectionResult] = useState<ReturnType<typeof detectHumanInBackground> | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [humanMask, setHumanMask] = useState<ImageData | null>(null);

  const backgroundImages = {
    // Football
    'football-action': 'https://s.france24.com/media/display/451ed2b8-eed6-11ea-afdd-005056bf87d6/w:1280/p:16x9/messi-1805.jpg',
    // Tech (renamed)
    'elon-musk': '/images-all/elon musk.webp',
    'mark-zuckerberg': '/images-all/mark zuckerberg..webp',
    'steve-jobs': '/images-all/young-steve-jobs-1_0.jpg',
    // Basketball
    'lebron-james': '/images-all/lebron james.webp',
    // Movies
    'batman': '/images-all/batman.jpg',
    'fight-club': '/images-all/fight club.jpg',
    'fight-club-1': '/images-all/fight club 1.jpg',
    'wolf-of-wall-street': '/images-all/wolf of the wall street.jpg',
    'wolf-of-wall-street-1': '/images-all/wolf of the wall street 1.jpg',
    'wolf-of-wall-street-2': '/images-all/wolf of wall street 2.jpg',
    // Gym/Workout
    'gym-beast': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&crop=face',
    'deadlift-power': 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&h=800&fit=crop&crop=face',
    'crossfit-athlete': 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=800&fit=crop&crop=face',
    // Legacy/other backgrounds
    'football-celebration': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop&crop=face',
    'football-speed': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=800&fit=crop&crop=face',
    'runner-determination': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop&crop=face',
    'boxing-fighter': 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=800&h=800&fit=crop&crop=face',
    'gym-grind': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=800&fit=crop&crop=face',
    'athlete-boxer': 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&h=800&fit=crop&crop=face',
    'focused-athlete': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&crop=face',
    'determined-man': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face',
    'strong-woman': 'https://images.unsplash.com/photo-1494790108755-2616c9ae8645?w=800&h=800&fit=crop&crop=face',
    'warrior-spirit': 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=800&h=800&fit=crop&crop=face',
    'success-mindset': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop&crop=face',
    'business-leader': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop&crop=face',
    'confident-woman': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop&crop=face',
    'urban-athlete': 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=800&fit=crop&crop=face',
    'fitness-model': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&crop=face',
    'entrepreneur': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop&crop=face',
    'focused-woman': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop&crop=face',
    // Gradients for fallback
    'red-fire': '',
    'purple-dream': '',
    'dark-ocean': ''
  };

  useEffect(() => {
    if (typeof textBehindImage === 'boolean') {
      setTextBehindMode(textBehindImage ? 'behind' : 'front');
    } else {
      setTextBehindMode('auto');
    }
  }, [textBehindImage]);

  useEffect(() => {
    let isMounted = true;
    const runDetection = async () => {
      // Only run detection if textBehindMode is 'behind'
      if (textBehindMode !== 'behind') {
        if (customImage) {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            if (isMounted) {
              setBackgroundImage(img);
              setDetectionResult(null);
              setHumanMask(null);
              setIsDetecting(false);
            }
          };
          img.src = customImage;
        } else if (backgroundImages[selectedBackground as keyof typeof backgroundImages]) {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            if (isMounted) {
              setBackgroundImage(img);
              setDetectionResult(null);
              setHumanMask(null);
              setIsDetecting(false);
            }
          };
          img.src = backgroundImages[selectedBackground as keyof typeof backgroundImages];
        } else {
          setBackgroundImage(null);
          setDetectionResult(null);
          setHumanMask(null);
          setIsDetecting(false);
        }
        return;
      }

      setIsDetecting(true);
      setHumanMask(null);
      // Always try BodyPix for pixel-perfect masking
      if (customImage) {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          if (isMounted) setBackgroundImage(img);
          // Try BodyPix mask first
          const mask = await detectHumanMaskInImage(img);
          if (isMounted) setHumanMask(mask);
          // Use coco-ssd for bounding box and fallback
          const autoResult = await detectHumanInBackgroundAuto('custom-upload', img);
          if (isMounted) {
            setDetectionResult(autoResult);
            setIsDetecting(false);
          }
        };
        img.src = customImage;
      } else if (backgroundImages[selectedBackground as keyof typeof backgroundImages]) {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          if (isMounted) setBackgroundImage(img);
          // Try BodyPix mask first
          const mask = await detectHumanMaskInImage(img);
          if (isMounted) setHumanMask(mask);
          // Use coco-ssd for bounding box and fallback
          const autoResult = await detectHumanInBackgroundAuto(selectedBackground, img);
          if (isMounted) {
            setDetectionResult(autoResult);
            setIsDetecting(false);
          }
        };
        img.src = backgroundImages[selectedBackground as keyof typeof backgroundImages];
      } else {
        // No image, fallback
        const legacy = detectHumanInBackground(selectedBackground);
        setDetectionResult(legacy);
        setBackgroundImage(null);
        setIsDetecting(false);
      }
    };
    runDetection();
    return () => { isMounted = false; };
  }, [selectedBackground, customImage, textBehindMode]);

  useEffect(() => {
    drawCanvas();
  }, [quote, textStyle, textLayout, textPosition, backgroundImage, textBehindMode]);

  useEffect(() => {
    if (textBehindMode === 'behind' && !detectionResult?.hasHuman && textBehindImage === true) {
      toast.info('No human or living object detected in this background. Text will be placed in front.');
    }
  }, [textBehindMode, detectionResult, textBehindImage]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;

    // Draw background
    if (backgroundImage) {
      const detection = detectionResult;
      const optimalPosition = getOptimalTextPosition(selectedBackground, 300, 100, textBehindMode);
      // Draw image with aspect ratio preserved and centered
      const imgW = backgroundImage.width;
      const imgH = backgroundImage.height;
      const canvasW = canvas.width;
      const canvasH = canvas.height;
      const imgRatio = imgW / imgH;
      const canvasRatio = canvasW / canvasH;
      let drawW, drawH, offsetX, offsetY;
      if (imgRatio > canvasRatio) {
        drawH = canvasH;
        drawW = imgW * (canvasH / imgH);
        offsetX = (canvasW - drawW) / 2;
        offsetY = 0;
      } else {
        drawW = canvasW;
        drawH = imgH * (canvasW / imgW);
        offsetX = 0;
        offsetY = (canvasH - drawH) / 2;
      }

      // First draw the background image
      ctx.drawImage(backgroundImage, offsetX, offsetY, drawW, drawH);

      // Then draw the text and human masking
      if (textBehindMode === 'behind' && detection?.hasHuman && humanMask) {
        // 1. Draw text only where NOT person (invert mask)
        const textCanvas = document.createElement('canvas');
        textCanvas.width = canvas.width;
        textCanvas.height = canvas.height;
        const textCtx = textCanvas.getContext('2d');
        if (textCtx) {
          drawEnhancedText(textCtx, quote, textStyle, textLayout, textPosition, true);
          const maskCanvas = document.createElement('canvas');
          maskCanvas.width = humanMask.width;
          maskCanvas.height = humanMask.height;
          const maskCtx = maskCanvas.getContext('2d');
          if (maskCtx) {
            maskCtx.putImageData(humanMask, 0, 0);
            const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
            for (let i = 0; i < maskData.data.length; i += 4) {
              maskData.data[i + 3] = 255 - maskData.data[i + 3];
            }
            maskCtx.putImageData(maskData, 0, 0);
            textCtx.globalCompositeOperation = 'destination-in';
            textCtx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
            textCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(textCanvas, 0, 0);
          }
        }
        // 2. Draw the person using the mask
        const personCanvas = document.createElement('canvas');
        personCanvas.width = canvas.width;
        personCanvas.height = canvas.height;
        const personCtx = personCanvas.getContext('2d');
        if (personCtx) {
          personCtx.drawImage(backgroundImage, offsetX, offsetY, drawW, drawH);
          personCtx.globalCompositeOperation = 'destination-in';
          personCtx.drawImage(
            (() => {
              if (humanMask.width !== canvas.width || humanMask.height !== canvas.height) {
                const scaled = document.createElement('canvas');
                scaled.width = canvas.width;
                scaled.height = canvas.height;
                const scaledCtx = scaled.getContext('2d');
                if (scaledCtx) scaledCtx.putImageData(humanMask, 0, 0);
                return scaled;
              }
              const maskC = document.createElement('canvas');
              maskC.width = humanMask.width;
              maskC.height = humanMask.height;
              maskC.getContext('2d')?.putImageData(humanMask, 0, 0);
              return maskC;
            })(),
            0, 0, canvas.width, canvas.height
          );
          personCtx.globalCompositeOperation = 'source-over';
          ctx.drawImage(personCanvas, 0, 0);
        }
      } else if (textBehindMode === 'behind' && detection?.hasHuman && detection.humanBounds) {
        // Fallback: bounding box
        ctx.save();
        const hb = detection.humanBounds;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.rect(hb.x, hb.y, hb.width, hb.height);
        ctx.closePath();
        ctx.clip('evenodd');
        drawEnhancedText(ctx, quote, textStyle, textLayout, textPosition, true);
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.rect(hb.x, hb.y, hb.width, hb.height);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(backgroundImage, offsetX, offsetY, drawW, drawH);
        ctx.restore();
      } else {
        // Standard image with text in front (or fallback)
        drawEnhancedText(ctx, quote, textStyle, textLayout, textPosition, false);
      }

      // Draw dark overlay
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.restore();

      // Add grain texture on top of everything
      addEnhancedGrainTexture(ctx, canvas.width, canvas.height);
    } else {
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      switch (selectedBackground) {
        case 'red-fire':
          gradient.addColorStop(0, '#ff0000');
          gradient.addColorStop(0.5, '#cc0000');
          gradient.addColorStop(1, '#990000');
          break;
        case 'purple-dream':
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          break;
        case 'dark-ocean':
          gradient.addColorStop(0, '#0c0c0c');
          gradient.addColorStop(0.5, '#1e3c72');
          gradient.addColorStop(1, '#2a5298');
          break;
        default:
          gradient.addColorStop(0, '#1a1a2e');
          gradient.addColorStop(0.5, '#16213e');
          gradient.addColorStop(1, '#0f3460');
          break;
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      drawEnhancedText(ctx, quote, textStyle, textLayout, textPosition, false);

      // Draw dark overlay
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.restore();

      // Add grain texture on top of everything
      addEnhancedGrainTexture(ctx, canvas.width, canvas.height);
    }
  };

  const drawEnhancedText = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    style: TextStyle, 
    layout: TextLayout, 
    position: { x: number; y: number },
    isBehindHuman: boolean = false
  ) => {
    const fontWeight = style.fontWeight >= 700 ? '900' : style.fontWeight.toString();
    ctx.font = `${fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    ctx.textAlign = style.textAlign;

    // Apply blur effect if specified
    if (style.blur && style.blur > 0) {
      ctx.filter = `blur(${style.blur}px)`;
    } else {
      ctx.filter = 'none';
    }

    // Enhanced shadow for text behind humans
    if (isBehindHuman) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
    } else {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    let lines: string[] = [];

    switch (layout.mode) {
      case 'single-line':
        lines = [text.replace(/\n/g, ' ')];
        break;
      case 'multi-line':
        lines = text.split('\n');
        break;
      case 'auto-wrap':
        lines = wrapText(ctx, text, layout.maxWidth);
        break;
    }

    const lineHeight = style.fontSize * style.lineHeight;
    const totalTextHeight = lines.length * lineHeight + (lines.length - 1) * layout.lineSpacing;
    
    let startY = position.y;
    if (style.textAlign === 'center') {
      startY = position.y - totalTextHeight / 2;
    }

    lines.forEach((line, index) => {
      const y = startY + (index * (lineHeight + layout.lineSpacing));
      
      // Apply gradient or solid color with opacity
      if (style.gradient.enabled) {
        const angle = style.gradient.angle;
        const radians = (angle * Math.PI) / 180;
        const x1 = 0;
        const y1 = 0;
        const x2 = Math.cos(radians) * 800;
        const y2 = Math.sin(radians) * 800;
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, style.gradient.colors[0]);
        gradient.addColorStop(1, style.gradient.colors[1]);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = style.color;
      }
      
      // Apply opacity
      ctx.globalAlpha = style.opacity;
      
      if (style.letterSpacing !== 0) {
        drawTextWithLetterSpacing(ctx, line, position.x, y, style.letterSpacing);
      } else {
        ctx.fillText(line, position.x, y);
      }
    });
    
    // Reset opacity, shadow, and filter
    ctx.globalAlpha = 1;
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.filter = 'none';
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const drawTextWithLetterSpacing = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    letterSpacing: number
  ) => {
    let currentX = x;
    
    if (ctx.textAlign === 'center') {
      const totalWidth = Array.from(text).reduce((width, char) => {
        return width + ctx.measureText(char).width + letterSpacing;
      }, 0) - letterSpacing;
      currentX = x - totalWidth / 2;
    } else if (ctx.textAlign === 'right') {
      const totalWidth = Array.from(text).reduce((width, char) => {
        return width + ctx.measureText(char).width + letterSpacing;
      }, 0) - letterSpacing;
      currentX = x - totalWidth;
    }

    Array.from(text).forEach((char) => {
      ctx.fillText(char, currentX, y);
      currentX += ctx.measureText(char).width + letterSpacing;
    });
  };

  const addEnhancedGrainTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
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
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) * (800 / rect.width);
    const y = (e.clientY - rect.top) * (800 / rect.height);

    setIsDragging(true);
    setDragOffset({ x: x - textPosition.x, y: y - textPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) * (800 / rect.width);
    const y = (e.clientY - rect.top) * (800 / rect.height);

    onTextPositionChange({
      x: Math.max(50, Math.min(750, x - dragOffset.x)),
      y: Math.max(50, Math.min(750, y - dragOffset.y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jeta-creation.png';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Downloaded successfully');
      }
    });
  };

  const hasHuman = detectionResult?.hasHuman;

  return (
    <div className="space-y-8">
      <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center mb-2">
                <span style={{
                  background: 'linear-gradient(90deg, #ff5f6d 0%, #ffc371 100%)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  borderRadius: '1.5rem',
                  padding: '0.3em 1.2em',
                  letterSpacing: '0.15em',
                  marginRight: '1em',
                  boxShadow: '0 2px 12px 0 rgba(255,95,109,0.15)'
                }}>BETA</span>
                <span className="text-sm text-black/60 font-medium">Drag to reposition text</span>
              </div>
              <div className="flex items-center gap-3">
                <Label className="text-sm font-semibold text-black">Text Depth:</Label>
                <Select value={textBehindMode} onValueChange={(value: 'behind' | 'front' | 'auto') => setTextBehindMode(value)}>
                  <SelectTrigger className="w-32 h-8 bg-white border-black/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black/10">
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="behind">Behind</SelectItem>
                    <SelectItem value="front">Front</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 p-3 bg-black/5 rounded-xl border border-black/10 flex items-center gap-3">
                <span 
                  className="text-[10px] font-black tracking-wider uppercase bg-black/10 text-black/60 px-2 py-0.5 rounded-full"
                  title="This feature is currently in beta and may not work perfectly."
                >
                  BETA
                </span>
                <span className="text-xs text-black/60 font-medium">
                  Note: This feature may not work perfectly on all images.
                </span>
              </div>
            </div>
          </div>
          <Button 
            onClick={downloadImage}
            className="bg-black text-white hover:bg-black/80 px-6 py-3 rounded-2xl font-bold transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
        
        <div 
          ref={containerRef}
          className="relative bg-black/5 rounded-3xl overflow-hidden border border-black/10"
          style={{ aspectRatio: '1/1' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move transition-all"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          {isDetecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <span className="text-lg font-bold text-black/60 animate-pulse">Detecting subject...</span>
            </div>
          )}
          {isDragging && (
            <div className="absolute top-4 right-4 bg-black/90 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm font-medium">
              Positioning...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
