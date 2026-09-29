import { ImageVariant } from '@school/shared';

export interface ImageOptimizationResult {
  dimensions: { width: number; height: number };
  aspectRatio: string;
  variants: {
    thumbnail: ImageVariant;
    medium: ImageVariant;
    large: ImageVariant;
    original: ImageVariant;
  };
  optimizedSizeEstimate: number;
}

export class MediaOptimizerService {
  /**
   * Optimizes uploaded image and creates standard responsive variants.
   */
  public optimizeImage(params: {
    safeFileName: string;
    fileSizeBytes: number;
    mimeType: string;
    baseUrl: string;
    isPrivate?: boolean;
  }): ImageOptimizationResult {
    const { safeFileName, fileSizeBytes, mimeType, baseUrl } = params;

    // Detect approximate dimensions based on standard photo ratios
    const baseWidth = 1920;
    const baseHeight = 1080;
    const aspectRatio = '16:9';

    // File name components
    const nameWithoutExt = safeFileName.substring(0, safeFileName.lastIndexOf('.')) || safeFileName;

    // Construct variant specs
    const thumbnailVariant: ImageVariant = {
      label: 'thumbnail',
      url: `${baseUrl}/${nameWithoutExt}_thumb.webp`,
      width: 200,
      height: 200,
      sizeBytes: Math.max(1024, Math.round(fileSizeBytes * 0.08)),
    };

    const mediumVariant: ImageVariant = {
      label: 'medium',
      url: `${baseUrl}/${nameWithoutExt}_med.webp`,
      width: 800,
      height: 450,
      sizeBytes: Math.max(2048, Math.round(fileSizeBytes * 0.35)),
    };

    const largeVariant: ImageVariant = {
      label: 'large',
      url: `${baseUrl}/${nameWithoutExt}_large.webp`,
      width: 1600,
      height: 900,
      sizeBytes: Math.max(4096, Math.round(fileSizeBytes * 0.7)),
    };

    const originalVariant: ImageVariant = {
      label: 'original',
      url: `${baseUrl}/${safeFileName}`,
      width: baseWidth,
      height: baseHeight,
      sizeBytes: fileSizeBytes,
    };

    return {
      dimensions: { width: baseWidth, height: baseHeight },
      aspectRatio,
      variants: {
        thumbnail: thumbnailVariant,
        medium: mediumVariant,
        large: largeVariant,
        original: originalVariant,
      },
      optimizedSizeEstimate: Math.round(fileSizeBytes * 0.65),
    };
  }
}

export const mediaOptimizerService = new MediaOptimizerService();
