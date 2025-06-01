export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  fontWeight: number;
  opacity: number;
  blur: number;
  gradient: {
    enabled: boolean;
    colors: string[];
    angle: number;
  };
  textBehindImage: boolean;
}

export interface TextLayout {
  mode: 'single-line' | 'multi-line' | 'auto-wrap';
  lineSpacing: number;
  maxWidth: number;
} 