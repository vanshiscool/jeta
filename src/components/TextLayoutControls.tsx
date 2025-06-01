import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Type, Palette, Eye, Focus } from 'lucide-react';
import { TextStyle, TextLayout } from '@/types';

interface TextLayoutControlsProps {
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
  textLayout: TextLayout;
  onTextLayoutChange: (layout: TextLayout) => void;
}

export const TextLayoutControls: React.FC<TextLayoutControlsProps> = ({
  textStyle,
  onTextStyleChange,
  textLayout,
  onTextLayoutChange
}) => {
  return (
    <div className="space-y-8">
      {/* Typography Controls */}
      <Card className="bg-white border border-black/10 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-6 pt-12 px-12">
          <CardTitle className="text-3xl font-black tracking-tight text-black flex items-center gap-4">
            <Type className="w-8 h-8 text-black/40" />
            Typography
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-12 pb-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Font Size</Label>
              <Slider
                value={[textStyle.fontSize]}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, fontSize: value[0] })}
                min={12}
                max={120}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-black/50 font-medium text-center">
                {textStyle.fontSize}px
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Font Weight</Label>
              <Slider
                value={[textStyle.fontWeight]}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, fontWeight: value[0] })}
                min={100}
                max={900}
                step={100}
                className="w-full"
              />
              <div className="text-sm text-black/50 font-medium text-center">
                {textStyle.fontWeight}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Letter Spacing</Label>
              <Slider
                value={[textStyle.letterSpacing]}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, letterSpacing: value[0] })}
                min={-5}
                max={10}
                step={0.1}
                className="w-full"
              />
              <div className="text-sm text-black/50 font-medium text-center">
                {textStyle.letterSpacing}px
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Line Height</Label>
              <Slider
                value={[textStyle.lineHeight]}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, lineHeight: value[0] })}
                min={0.8}
                max={3}
                step={0.1}
                className="w-full"
              />
              <div className="text-sm text-black/50 font-medium text-center">
                {textStyle.lineHeight}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Text Opacity</Label>
              <Slider
                value={[textStyle.opacity]}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, opacity: value[0] })}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <div className="text-sm text-black/50 font-medium text-center">
                {Math.round(textStyle.opacity * 100)}%
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Text Blur</Label>
              <Slider
                value={[textStyle.blur]}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, blur: value[0] })}
                min={0}
                max={10}
                step={0.5}
                className="w-full"
              />
              <div className="text-sm text-black/50 font-medium text-center">
                {textStyle.blur}px
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Font Family</Label>
              <Select value={textStyle.fontFamily} onValueChange={(value) => onTextStyleChange({ ...textStyle, fontFamily: value })}>
                <SelectTrigger className="bg-white border-black/20 rounded-2xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-black/10">
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Bebas Neue">Bebas Neue</SelectItem>
                  <SelectItem value="Oswald">Oswald</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Text Alignment</Label>
              <Select value={textStyle.textAlign} onValueChange={(value: 'left' | 'center' | 'right') => onTextStyleChange({ ...textStyle, textAlign: value })}>
                <SelectTrigger className="bg-white border-black/20 rounded-2xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-black/10">
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color & Effects */}
      <Card className="bg-white border border-black/10 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-6 pt-12 px-12">
          <CardTitle className="text-3xl font-black tracking-tight text-black flex items-center gap-4">
            <Palette className="w-8 h-8 text-black/40" />
            Color & Effects
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-12 pb-12 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-black/5 rounded-2xl">
              <div>
                <Label className="text-black font-bold text-lg">Gradient Text</Label>
                <p className="text-black/60 text-sm mt-1">Apply gradient colors to text</p>
              </div>
              <Switch
                checked={textStyle.gradient.enabled}
                onCheckedChange={(checked) => 
                  onTextStyleChange({ 
                    ...textStyle, 
                    gradient: { ...textStyle.gradient, enabled: checked } 
                  })
                }
              />
            </div>

            {textStyle.gradient.enabled && (
              <div className="space-y-6 p-6 bg-black/5 rounded-2xl">
                <div className="space-y-4">
                  <Label className="text-black text-lg font-bold">Gradient Angle</Label>
                  <Slider
                    value={[textStyle.gradient.angle]}
                    onValueChange={(value) => 
                      onTextStyleChange({ 
                        ...textStyle, 
                        gradient: { ...textStyle.gradient, angle: value[0] } 
                      })
                    }
                    min={0}
                    max={360}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-black/50 font-medium text-center">
                    {textStyle.gradient.angle}°
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Label className="text-black text-lg font-bold">Start Color</Label>
                    <Input
                      type="color"
                      value={textStyle.gradient.colors[0]}
                      onChange={(e) => 
                        onTextStyleChange({ 
                          ...textStyle, 
                          gradient: { 
                            ...textStyle.gradient, 
                            colors: [e.target.value, textStyle.gradient.colors[1]] 
                          } 
                        })
                      }
                      className="h-12 rounded-2xl border-black/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-black text-lg font-bold">End Color</Label>
                    <Input
                      type="color"
                      value={textStyle.gradient.colors[1]}
                      onChange={(e) => 
                        onTextStyleChange({ 
                          ...textStyle, 
                          gradient: { 
                            ...textStyle.gradient, 
                            colors: [textStyle.gradient.colors[0], e.target.value] 
                          } 
                        })
                      }
                      className="h-12 rounded-2xl border-black/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {!textStyle.gradient.enabled && (
              <div className="space-y-4">
                <Label className="text-black text-lg font-bold">Text Color</Label>
                <Input
                  type="color"
                  value={textStyle.color}
                  onChange={(e) => onTextStyleChange({ ...textStyle, color: e.target.value })}
                  className="h-12 rounded-2xl border-black/20"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Layout Settings */}
      <Card className="bg-white border border-black/10 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-6 pt-12 px-12">
          <CardTitle className="text-3xl font-black tracking-tight text-black flex items-center gap-4">
            <Eye className="w-8 h-8 text-black/40" />
            Layout Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-12 pb-12 space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-black text-lg font-bold">Text Layout Mode</Label>
              <Select value={textLayout.mode} onValueChange={(value: 'single-line' | 'multi-line' | 'auto-wrap') => onTextLayoutChange({ ...textLayout, mode: value })}>
                <SelectTrigger className="bg-white border-black/20 rounded-2xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-black/10">
                  <SelectItem value="single-line">Single Line</SelectItem>
                  <SelectItem value="multi-line">Multi Line</SelectItem>
                  <SelectItem value="auto-wrap">Auto Wrap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {textLayout.mode !== 'single-line' && (
              <div className="space-y-4">
                <Label className="text-black text-lg font-bold">Line Spacing</Label>
                <Slider
                  value={[textLayout.lineSpacing]}
                  onValueChange={(value) => onTextLayoutChange({ ...textLayout, lineSpacing: value[0] })}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-black/50 font-medium text-center">
                  {textLayout.lineSpacing}px
                </div>
              </div>
            )}

            {textLayout.mode === 'auto-wrap' && (
              <div className="space-y-4">
                <Label className="text-black text-lg font-bold">Max Width</Label>
                <Slider
                  value={[textLayout.maxWidth]}
                  onValueChange={(value) => onTextLayoutChange({ ...textLayout, maxWidth: value[0] })}
                  min={200}
                  max={800}
                  step={10}
                  className="w-full"
                />
                <div className="text-sm text-black/50 font-medium text-center">
                  {textLayout.maxWidth}px
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
