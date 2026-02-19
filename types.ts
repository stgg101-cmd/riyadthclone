
export interface NavItem {
  label: string;
  path: string;
}

export interface CardProps {
  title: string;
  description: string;
  image?: string;
  video?: string;
  tag?: string;
  cta?: string;
  year?: string;
  onClick?: () => void;
}

export interface ReadoutProps {
  title: string;
  subtitle: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  mediaPoster?: string;
  reverse?: boolean;
  cta?: string;
}

export interface FeatureTile {
  title: string;
  description: string;
  icon: string;
}
