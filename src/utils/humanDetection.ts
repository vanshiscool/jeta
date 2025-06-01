import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';

let cocoModel: cocoSsd.ObjectDetection | null = null;
let bodyPixModel: bodyPix.BodyPix | null = null;

// Utility for detecting human positions in images to place text behind them
export interface HumanDetectionResult {
  hasHuman: boolean;
  humanBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  safeTextAreas: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

// Enhanced human detection for curated background images
export const detectHumanInBackground = (backgroundKey: string): HumanDetectionResult => {
  const humanBackgrounds = {
    // Footballers
    'football-action': {
      hasHuman: true,
      humanBounds: { x: 280, y: 120, width: 240, height: 560 },
      safeTextAreas: [
        { x: 50, y: 80, width: 220, height: 300 },
        { x: 530, y: 200, width: 220, height: 400 }
      ]
    },
    'messi-action': {
      hasHuman: true,
      humanBounds: { x: 280, y: 120, width: 240, height: 560 },
      safeTextAreas: [
        { x: 50, y: 80, width: 220, height: 300 },
        { x: 530, y: 200, width: 220, height: 400 }
      ]
    },
    'elon-musk': {
      hasHuman: true,
      humanBounds: { x: 250, y: 120, width: 300, height: 580 },
      safeTextAreas: [
        { x: 50, y: 80, width: 190, height: 280 },
        { x: 560, y: 200, width: 190, height: 380 }
      ]
    },
    'elon-young': {
      hasHuman: true,
      humanBounds: { x: 250, y: 120, width: 300, height: 580 },
      safeTextAreas: [
        { x: 50, y: 80, width: 190, height: 280 },
        { x: 560, y: 200, width: 190, height: 380 }
      ]
    },
    'mark-zuckerberg': {
      hasHuman: false, safeTextAreas: [{ x: 50, y: 100, width: 700, height: 600 }] },
    'steve-jobs': {
      hasHuman: true,
      humanBounds: { x: 180, y: 80, width: 440, height: 720 },
      safeTextAreas: [
        { x: 50, y: 60, width: 120, height: 280 },
        { x: 630, y: 200, width: 120, height: 400 }
      ]
    },
    'lebron-james': {
      hasHuman: false, safeTextAreas: [{ x: 50, y: 100, width: 700, height: 600 }] },
    'batman': {
      hasHuman: false, safeTextAreas: [{ x: 50, y: 100, width: 700, height: 600 }] },
    'fight-club': {
      hasHuman: false, safeTextAreas: [{ x: 50, y: 100, width: 700, height: 600 }] },
    'fight-club-1': {
      hasHuman: false, safeTextAreas: [{ x: 50, y: 100, width: 700, height: 600 }] },
    'wolf-of-wall-street': {
      hasHuman: false, safeTextAreas: [{ x: 50, y: 100, width: 700, height: 600 }] },
    'wolf-of-wall-street-1': {
      hasHuman: false, safeTextAreas: [{ x: 50, y: 100, width: 700, height: 600 }] },
    'wolf-of-wall-street-2': {
      hasHuman: false, safeTextAreas: [{ x: 50, y: 100, width: 700, height: 600 }] },
    'gym-beast': {
      hasHuman: true,
      humanBounds: { x: 220, y: 70, width: 360, height: 730 },
      safeTextAreas: [
        { x: 50, y: 50, width: 170, height: 320 },
        { x: 580, y: 180, width: 170, height: 380 }
      ]
    },
    'deadlift-power': {
      hasHuman: true,
      humanBounds: { x: 200, y: 100, width: 400, height: 600 },
      safeTextAreas: [
        { x: 50, y: 50, width: 150, height: 300 },
        { x: 600, y: 200, width: 150, height: 400 }
      ]
    },
    'crossfit-athlete': {
      hasHuman: true,
      humanBounds: { x: 180, y: 100, width: 440, height: 700 },
      safeTextAreas: [
        { x: 50, y: 80, width: 130, height: 280 },
        { x: 620, y: 200, width: 130, height: 350 }
      ]
    },
    'ronaldo-celebration': {
      hasHuman: true,
      humanBounds: { x: 300, y: 80, width: 200, height: 640 },
      safeTextAreas: [
        { x: 50, y: 50, width: 240, height: 350 },
        { x: 510, y: 180, width: 240, height: 420 }
      ]
    },
    'mbappe-speed': {
      hasHuman: true,
      humanBounds: { x: 250, y: 100, width: 300, height: 600 },
      safeTextAreas: [
        { x: 50, y: 60, width: 190, height: 320 },
        { x: 560, y: 220, width: 190, height: 380 }
      ]
    },
    'footballer-focused': {
      hasHuman: true,
      humanBounds: { x: 200, y: 90, width: 400, height: 710 },
      safeTextAreas: [
        { x: 50, y: 50, width: 140, height: 300 },
        { x: 610, y: 180, width: 140, height: 420 }
      ]
    },
    'football-celebration': {
      hasHuman: true,
      humanBounds: { x: 250, y: 110, width: 300, height: 590 },
      safeTextAreas: [
        { x: 50, y: 70, width: 190, height: 300 },
        { x: 560, y: 190, width: 190, height: 410 }
      ]
    },
    'football-intensity': {
      hasHuman: true,
      humanBounds: { x: 200, y: 100, width: 400, height: 600 },
      safeTextAreas: [
        { x: 50, y: 80, width: 140, height: 280 },
        { x: 610, y: 200, width: 140, height: 400 }
      ]
    },
    'jobs-presenting': {
      hasHuman: true,
      humanBounds: { x: 180, y: 80, width: 440, height: 720 },
      safeTextAreas: [
        { x: 50, y: 60, width: 120, height: 280 },
        { x: 630, y: 200, width: 120, height: 400 }
      ]
    },
    'sundar-confident': {
      hasHuman: true,
      humanBounds: { x: 220, y: 100, width: 360, height: 600 },
      safeTextAreas: [
        { x: 50, y: 50, width: 160, height: 300 },
        { x: 590, y: 180, width: 160, height: 420 }
      ]
    },
    'bezos-confident': {
      hasHuman: true,
      humanBounds: { x: 200, y: 90, width: 400, height: 710 },
      safeTextAreas: [
        { x: 50, y: 50, width: 140, height: 320 },
        { x: 610, y: 220, width: 140, height: 380 }
      ]
    },
    'gates-young': {
      hasHuman: true,
      humanBounds: { x: 240, y: 110, width: 320, height: 590 },
      safeTextAreas: [
        { x: 50, y: 70, width: 180, height: 300 },
        { x: 570, y: 190, width: 180, height: 410 }
      ]
    },
    'tech-visionary': {
      hasHuman: true,
      humanBounds: { x: 220, y: 100, width: 360, height: 600 },
      safeTextAreas: [
        { x: 50, y: 60, width: 160, height: 300 },
        { x: 590, y: 200, width: 160, height: 400 }
      ]
    },
    'runner-determination': {
      hasHuman: true,
      humanBounds: { x: 250, y: 90, width: 300, height: 620 },
      safeTextAreas: [
        { x: 50, y: 70, width: 190, height: 300 },
        { x: 560, y: 190, width: 190, height: 420 }
      ]
    },
    'boxing-fighter': {
      hasHuman: true,
      humanBounds: { x: 180, y: 60, width: 440, height: 740 },
      safeTextAreas: [
        { x: 50, y: 80, width: 130, height: 250 },
        { x: 620, y: 150, width: 130, height: 350 }
      ]
    },
    'gym-grind': {
      hasHuman: true,
      humanBounds: { x: 240, y: 80, width: 320, height: 640 },
      safeTextAreas: [
        { x: 50, y: 60, width: 180, height: 320 },
        { x: 570, y: 180, width: 180, height: 400 }
      ]
    },
    'athlete-boxer': {
      hasHuman: true,
      humanBounds: { x: 200, y: 100, width: 400, height: 600 },
      safeTextAreas: [
        { x: 50, y: 50, width: 150, height: 300 },
        { x: 600, y: 200, width: 150, height: 400 }
      ]
    },
    'focused-athlete': {
      hasHuman: true,
      humanBounds: { x: 150, y: 80, width: 500, height: 720 },
      safeTextAreas: [
        { x: 50, y: 50, width: 100, height: 200 },
        { x: 650, y: 100, width: 100, height: 300 }
      ]
    },
    'determined-man': {
      hasHuman: true,
      humanBounds: { x: 250, y: 50, width: 300, height: 750 },
      safeTextAreas: [
        { x: 50, y: 100, width: 200, height: 400 },
        { x: 550, y: 150, width: 200, height: 350 }
      ]
    },
    'strong-woman': {
      hasHuman: true,
      humanBounds: { x: 200, y: 80, width: 400, height: 720 },
      safeTextAreas: [
        { x: 50, y: 50, width: 150, height: 300 },
        { x: 600, y: 200, width: 150, height: 400 }
      ]
    },
    'warrior-spirit': {
      hasHuman: true,
      humanBounds: { x: 180, y: 60, width: 440, height: 740 },
      safeTextAreas: [
        { x: 50, y: 80, width: 130, height: 250 },
        { x: 620, y: 150, width: 130, height: 350 }
      ]
    },
    'success-mindset': {
      hasHuman: true,
      humanBounds: { x: 220, y: 100, width: 360, height: 600 },
      safeTextAreas: [
        { x: 50, y: 50, width: 170, height: 300 },
        { x: 580, y: 200, width: 170, height: 400 }
      ]
    },
    'business-leader': {
      hasHuman: true,
      humanBounds: { x: 200, y: 80, width: 400, height: 720 },
      safeTextAreas: [
        { x: 50, y: 100, width: 150, height: 300 },
        { x: 600, y: 200, width: 150, height: 400 }
      ]
    },
    'confident-woman': {
      hasHuman: true,
      humanBounds: { x: 250, y: 60, width: 300, height: 740 },
      safeTextAreas: [
        { x: 50, y: 50, width: 200, height: 350 },
        { x: 550, y: 150, width: 200, height: 400 }
      ]
    },
    'urban-athlete': {
      hasHuman: true,
      humanBounds: { x: 180, y: 100, width: 440, height: 700 },
      safeTextAreas: [
        { x: 50, y: 80, width: 130, height: 280 },
        { x: 620, y: 200, width: 130, height: 350 }
      ]
    },
    'fitness-model': {
      hasHuman: true,
      humanBounds: { x: 220, y: 70, width: 360, height: 730 },
      safeTextAreas: [
        { x: 50, y: 50, width: 170, height: 320 },
        { x: 580, y: 180, width: 170, height: 380 }
      ]
    },
    'entrepreneur': {
      hasHuman: true,
      humanBounds: { x: 200, y: 90, width: 400, height: 710 },
      safeTextAreas: [
        { x: 50, y: 50, width: 140, height: 320 },
        { x: 610, y: 220, width: 140, height: 380 }
      ]
    },
    'focused-woman': {
      hasHuman: true,
      humanBounds: { x: 240, y: 80, width: 320, height: 640 },
      safeTextAreas: [
        { x: 50, y: 60, width: 180, height: 320 },
        { x: 570, y: 180, width: 180, height: 400 }
      ]
    }
  };

  return humanBackgrounds[backgroundKey as keyof typeof humanBackgrounds] || {
    hasHuman: false,
    safeTextAreas: [{ x: 50, y: 100, width: 700, height: 600 }]
  };
};

export const getOptimalTextPosition = (
  backgroundKey: string,
  textWidth: number,
  textHeight: number,
  userPreference: 'behind' | 'front' | 'auto' = 'auto'
): { x: number; y: number; zIndex: number; behind: boolean } => {
  const detection = detectHumanInBackground(backgroundKey);
  
  if (!detection.hasHuman || userPreference === 'front') {
    return { x: 60, y: 180, zIndex: 2, behind: false };
  }

  if (userPreference === 'behind' || userPreference === 'auto') {
    // Find the best safe area for text placement behind human
    const bestArea = detection.safeTextAreas.find(area => 
      area.width >= textWidth && area.height >= textHeight
    ) || detection.safeTextAreas[0];

    return {
      x: bestArea.x + 20,
      y: bestArea.y + 50,
      zIndex: 0, // Behind human
      behind: true
    };
  }

  return { x: 60, y: 180, zIndex: 1, behind: false };
};

export async function detectHumanInBackgroundAuto(backgroundKey: string, image: HTMLImageElement): Promise<HumanDetectionResult> {
  // Use legacy map if available
  const legacy = detectHumanInBackground(backgroundKey);
  if (legacy.hasHuman) return legacy;

  // Otherwise, run coco-ssd
  if (!cocoModel) {
    cocoModel = await cocoSsd.load();
  }
  const predictions = await cocoModel.detect(image);
  // Find the first person or animal
  const person = predictions.find(
    p => p.class === 'person' || p.class === 'cat' || p.class === 'dog' || p.class === 'bird'
  );
  if (person) {
    const [x, y, width, height] = person.bbox;
    return {
      hasHuman: true,
      humanBounds: { x, y, width, height },
      safeTextAreas: [
        { x: 0, y: 0, width: x, height: image.height },
        { x: x + width, y: 0, width: image.width - (x + width), height: image.height }
      ]
    };
  }
  return {
    hasHuman: false,
    safeTextAreas: [{ x: 50, y: 100, width: image.width - 100, height: image.height - 200 }]
  };
}

export async function detectHumanMaskInImage(image: HTMLImageElement): Promise<ImageData | null> {
  if (!bodyPixModel) {
    bodyPixModel = await bodyPix.load();
  }
  // Run segmentation
  const segmentation = await bodyPixModel.segmentPerson(image, {
    internalResolution: 'medium',
    segmentationThreshold: 0.7,
  });
  if (!segmentation) return null;
  // Create a mask ImageData (white where person, black elsewhere)
  const { width, height, data } = segmentation;
  const mask = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    if (segmentation.data[i] === 1) {
      mask[i * 4 + 0] = 255; // R
      mask[i * 4 + 1] = 255; // G
      mask[i * 4 + 2] = 255; // B
      mask[i * 4 + 3] = 255; // A
    } else {
      mask[i * 4 + 0] = 0;
      mask[i * 4 + 1] = 0;
      mask[i * 4 + 2] = 0;
      mask[i * 4 + 3] = 0;
    }
  }
  return new ImageData(mask, width, height);
}

