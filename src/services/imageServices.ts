/**
 * TODO A uploadImage, with a bucket for transforme image of ImagePicker for base64 and send for supabase
 */

import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '../utils/supabase';
import { Platform } from 'react-native';

export interface ImageCompressionOptions {
  quality?: number; // 0.1 to 1.0
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp';
  progressive?: boolean;
}

export interface CompressedImageResult {
  uri: string;
  base64?: string;
  size: number;
  width: number;
  height: number;
  format: string;
}

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  originalSize: number;
  compressionRatio: number;
}

/**
 * Decodes base64 image and returns buffer
 */
export const decoderImage = async (image: string): Promise<Buffer> => {
  const base64Image = image.split(",")[1];
  const imageBuffer = Buffer.from(base64Image, "base64");
  return imageBuffer;
};

/**
 * Gets image information without loading the full image
 */
export const getImageInfo = async (uri: string): Promise<{ width: number; height: number; size?: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = reject;
    img.src = uri;
  });
};

/**
 * Calculates optimal compression settings based on image size and type
 */
const calculateOptimalCompression = (
  originalWidth: number,
  originalHeight: number,
  originalSize: number,
  targetMaxSize: number = 1024 * 1024 // 1MB default
): ImageCompressionOptions => {
  const aspectRatio = originalWidth / originalHeight;
  
  // Determine optimal dimensions
  let maxWidth = 1920; // Max width for web/mobile
  let maxHeight = 1080; // Max height for web/mobile
  
  // If image is very large, scale down more aggressively
  if (originalWidth > 3000 || originalHeight > 3000) {
    maxWidth = 1200;
    maxHeight = 800;
  }
  
  // Maintain aspect ratio
  if (aspectRatio > 1) {
    maxHeight = maxWidth / aspectRatio;
  } else {
    maxWidth = maxHeight * aspectRatio;
  }
  
  // Calculate quality based on original size
  let quality = 0.8; // Default quality
  
  if (originalSize > 5 * 1024 * 1024) { // > 5MB
    quality = 0.6;
  } else if (originalSize > 2 * 1024 * 1024) { // > 2MB
    quality = 0.7;
  } else if (originalSize < 500 * 1024) { // < 500KB
    quality = 0.9;
  }
  
  // Choose format based on image characteristics
  let format: 'jpeg' | 'png' | 'webp' = 'jpeg';
  
  // Use WebP for better compression if supported
  if (Platform.OS === 'web' || Platform.OS === 'android') {
    format = 'webp';
  }
  
  return {
    quality,
    maxWidth: Math.round(maxWidth),
    maxHeight: Math.round(maxHeight),
    format,
    progressive: true,
  };
};

/**
 * Compresses image with multiple strategies to minimize file size
 */
export const compressImage = async (
  uri: string,
  options?: ImageCompressionOptions
): Promise<CompressedImageResult> => {
  try {
    // Get original image info
    const originalInfo = await getImageInfo(uri);
    
    // Calculate optimal compression if no options provided
    const compressionOptions = options || calculateOptimalCompression(
      originalInfo.width,
      originalInfo.height,
      0 // We don't have size info here
    );
    
    // First pass: resize and compress
    const firstPass = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: compressionOptions.maxWidth || 1920,
            height: compressionOptions.maxHeight || 1080,
          },
        },
      ],
      {
        compress: compressionOptions.quality || 0.8,
        format: ImageManipulator.SaveFormat[compressionOptions.format?.toUpperCase() || 'JPEG'],
      }
    );
    
    // Second pass: further compression if still too large
    let finalResult = firstPass;
    
    // If first pass is still large, try more aggressive compression
    if (firstPass.width > 1200 || firstPass.height > 800) {
      const secondPass = await ImageManipulator.manipulateAsync(
        firstPass.uri,
        [
          {
            resize: {
              width: 1200,
              height: 800,
            },
          },
        ],
        {
          compress: Math.max(0.5, (compressionOptions.quality || 0.8) - 0.1),
          format: ImageManipulator.SaveFormat[compressionOptions.format?.toUpperCase() || 'JPEG'],
        }
      );
      finalResult = secondPass;
    }
    
    // Convert to base64 for storage
    const base64 = await convertUriToBase64(finalResult.uri);
    
    return {
      uri: finalResult.uri,
      base64,
      size: base64.length * 0.75, // Approximate size in bytes
      width: finalResult.width,
      height: finalResult.height,
      format: compressionOptions.format || 'jpeg',
    };
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
};

/**
 * Converts image URI to base64
 */
const convertUriToBase64 = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting to base64:', error);
    throw new Error('Failed to convert image to base64');
  }
};

/**
 * Uploads compressed image to Supabase storage
 */
export const uploadCompressedImage = async (
  imageUri: string,
  bucketName: string = 'images',
  fileName?: string,
  compressionOptions?: ImageCompressionOptions
): Promise<UploadResult> => {
  try {
    // Compress the image
    const compressedImage = await compressImage(imageUri, compressionOptions);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const finalFileName = fileName || `image_${timestamp}_${randomId}.${compressedImage.format}`;
    
    // Convert base64 to buffer for upload
    const imageBuffer = await decoderImage(compressedImage.base64!);
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(finalFileName, imageBuffer, {
        contentType: `image/${compressedImage.format}`,
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(finalFileName);
    
    // Calculate compression ratio
    const originalSize = compressedImage.size; // This is approximate
    const compressionRatio = ((originalSize - compressedImage.size) / originalSize) * 100;
    
    return {
      url: urlData.publicUrl,
      path: finalFileName,
      size: compressedImage.size,
      originalSize,
      compressionRatio,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Batch upload multiple images with compression
 */
export const uploadMultipleImages = async (
  imageUris: string[],
  bucketName: string = 'images',
  compressionOptions?: ImageCompressionOptions
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (const uri of imageUris) {
    try {
      const result = await uploadCompressedImage(uri, bucketName, undefined, compressionOptions);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload image ${uri}:`, error);
      // Continue with other images
    }
  }
  
  return results;
};

/**
 * Creates a thumbnail version of an image
 */
export const createThumbnail = async (
  uri: string,
  size: number = 200
): Promise<CompressedImageResult> => {
  const thumbnail = await ImageManipulator.manipulateAsync(
    uri,
    [
      {
        resize: {
          width: size,
          height: size,
        },
      },
    ],
    {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );
  
  const base64 = await convertUriToBase64(thumbnail.uri);
  
  return {
    uri: thumbnail.uri,
    base64,
    size: base64.length * 0.75,
    width: thumbnail.width,
    height: thumbnail.height,
    format: 'jpeg',
  };
};

/**
 * Optimizes image for different use cases
 */
export const optimizeImageForUseCase = async (
  uri: string,
  useCase: 'profile' | 'article' | 'thumbnail' | 'banner'
): Promise<CompressedImageResult> => {
  const useCaseOptions: Record<string, ImageCompressionOptions> = {
    profile: {
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.8,
      format: 'jpeg',
    },
    article: {
      maxWidth: 1200,
      maxHeight: 800,
      quality: 0.7,
      format: 'webp',
    },
    thumbnail: {
      maxWidth: 300,
      maxHeight: 200,
      quality: 0.6,
      format: 'jpeg',
    },
    banner: {
      maxWidth: 1920,
      maxHeight: 600,
      quality: 0.8,
      format: 'webp',
    },
  };
  
  return await compressImage(uri, useCaseOptions[useCase]);
};