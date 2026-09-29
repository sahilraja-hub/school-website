import React, { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  canonicalUrl?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'R.B.S Residential Public School, RBSRPS Mahua, Best CBSE school in Mahua, Top School in Vaishali, Bihar CBSE school, school with hostel Mahua',
  ogType = 'website',
  ogImage = '/images/campus-hero.jpg',
  canonicalUrl,
}) => {
  useEffect(() => {
    // Update Title
    const fullTitle = `${title} | R.B.S Residential Public School, Mahua`;
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    if (canonicalUrl) {
      setMetaTag('property', 'og:url', canonicalUrl);
    }

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
  }, [title, description, keywords, ogType, ogImage, canonicalUrl]);

  return null;
};
