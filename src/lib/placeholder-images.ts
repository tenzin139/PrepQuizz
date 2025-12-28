import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export function getPlaceholderImage(id: string): ImagePlaceholder | undefined {
  return placeholderImages.find(img => img.id === id);
}

export function getAvatarPlaceholders(): ImagePlaceholder[] {
    return placeholderImages.filter(img => img.id.startsWith('avatar-'));
}
