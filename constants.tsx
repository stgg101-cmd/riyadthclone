
import React from 'react';
import { NavItem } from './types';

export const BRAND_COLORS = {
  purple: '#2d114d',
  gold: '#c29b40',
  lightPurple: '#4a1c7d',
  surface: '#fcfaff',
  card: '#ffffff',
};

export const LOGO_URL = "https://media.riyadhair.com/is/content/aviationservices/rx-riyadh_air-logo_vector-white-12082025";

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Experience', path: '/experience' },
  { label: 'Discover Riyadh', path: '/discover' },
  { label: 'Careers', path: '/careers' },
  { label: 'Sfeer', path: '/sfeer' },
];

export const SYSTEM_PROMPT = `You are the Riyadh Air Concierge, a helpful and sophisticated AI assistant. 
Use the following information to answer questions:
- Riyadh Air is Saudi Arabia's new world-class national carrier, launching in 2025.
- It is wholly owned by the Public Investment Fund (PIF) and aligned with Saudi Vision 2030.
- Sfeer is the loyalty program designed for rewards, connections, and opportunities.
- The airline focuses on digital innovation, Saudi hospitality, and sustainability.
- Key attractions in Riyadh include Diriyah (UNESCO site), world-class museums, and natural escapes.
- Cabin crew fashion was unveiled at Paris Haute Couture Week in June 2024.
Be elegant, warm, and professional in your responses.`;
