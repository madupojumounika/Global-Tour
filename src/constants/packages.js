// src/constants/packages.js
export const PACKAGES = [
  // Asia
  { id: 'p1', title: 'Grand Japan Cherry Blossom', location: 'Tokyo, Osaka, Kyoto', category: 'International', type: 'Culture', days: '8 Days', price: 1499, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', rating: 4.9, coordinates: [139.65, 35.67] },
  { id: 'p3', title: 'Bali Luxury Villa Escape', location: 'Bali, Indonesia', category: 'International', type: 'Leisure', days: '7 Days', price: 920, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', rating: 4.7, coordinates: [115.18, -8.40] },
  { id: 'p4', title: 'Desert Safari & Skyscraper', location: 'Dubai, UAE', category: 'International', type: 'Luxury', days: '5 Days', price: 1150, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', rating: 4.6, coordinates: [55.27, 25.20] },
  { id: 'p8', title: 'Ancient Wonders of China', location: 'Beijing & Xian', category: 'International', type: 'History', days: '10 Days', price: 1599, image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80', rating: 4.8, coordinates: [116.40, 39.90] },
  { id: 'p9', title: 'Vietnam Heritage Trail', location: 'Ha Long Bay', category: 'International', type: 'Nature', days: '9 Days', price: 850, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80', rating: 4.7, coordinates: [107.18, 20.98] },

  // Europe
  { id: 'p2', title: 'Swiss Panorama Express', location: 'Lucerne, Switzerland', category: 'International', type: 'Adventure', days: '6 Days', price: 1850, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', rating: 4.8, coordinates: [8.54, 47.37] },
  { id: 'p10', title: 'Romantic Paris & Provence', location: 'Paris, France', category: 'International', type: 'Luxury', days: '7 Days', price: 2100, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', rating: 4.9, coordinates: [2.35, 48.85] },
  { id: 'p11', title: 'Greek Island Hopping', location: 'Santorini & Mykonos', category: 'International', type: 'Leisure', days: '8 Days', price: 1450, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80', rating: 4.8, coordinates: [25.43, 36.39] },
  { id: 'p12', title: 'Italian Art & Gelato', location: 'Rome & Florence', category: 'International', type: 'Culture', days: '10 Days', price: 1750, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', rating: 4.9, coordinates: [12.49, 41.89] },
  { id: 'p13', title: 'Icelandic Northern Lights', location: 'Reykjavik', category: 'International', type: 'Adventure', days: '5 Days', price: 1999, image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80', rating: 4.7, coordinates: [-21.94, 64.14] },

  // Americas
  { id: 'p14', title: 'New York City Lights', location: 'New York, USA', category: 'International', type: 'Luxury', days: '6 Days', price: 1600, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', rating: 4.6, coordinates: [-74.0, 40.71] },
  { id: 'p15', title: 'Peruvian Amazon & Machu Picchu', location: 'Cusco, Peru', category: 'International', type: 'Adventure', days: '12 Days', price: 2400, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80', rating: 4.9, coordinates: [-71.96, -13.53] },
  { id: 'p16', title: 'Rio Carnival Experience', location: 'Rio, Brazil', category: 'International', type: 'Culture', days: '7 Days', price: 1800, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80', rating: 4.5, coordinates: [-43.17, -22.9] },

  // Africa & Oceania
  { id: 'p17', title: 'Serengeti Wildlife Safari', location: 'Tanzania', category: 'International', type: 'Nature', days: '8 Days', price: 3200, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80', rating: 4.9, coordinates: [34.83, -2.33] },
  { id: 'p18', title: 'Egyptian Pyramids Tour', location: 'Cairo, Egypt', category: 'International', type: 'History', days: '7 Days', price: 1200, image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80', rating: 4.7, coordinates: [31.23, 30.04] },
  { id: 'p19', title: 'Sydney Harbor & Reef', location: 'Sydney, Australia', category: 'International', type: 'Adventure', days: '10 Days', price: 2800, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80', rating: 4.8, coordinates: [151.2, -33.86] },

  // India 
  { id: 'p5', title: 'Majestic Manali Heights', location: 'Himachal, India', category: 'Domestic', type: 'Adventure', days: '5 Days', price: 350, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', rating: 4.9, coordinates: [77.18, 32.24] },
  { id: 'p6', title: 'Royal Rajasthan Heritage', location: 'Jaipur, India', category: 'Domestic', type: 'History', days: '6 Days', price: 480, image: 'https://images.unsplash.com/photo-1524492707947-2f85a6e50311?auto=format&fit=crop&w=800&q=80', rating: 4.8, coordinates: [75.78, 26.91] },
  { id: 'p7', title: 'Kerala Backwater Serenity', location: 'Alleppey, India', category: 'Domestic', type: 'Nature', days: '4 Days', price: 299, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', rating: 4.7, coordinates: [76.33, 9.49] },
  { id: 'p20', title: 'Ladakh High Pass Trek', location: 'Ladakh, India', category: 'Domestic', type: 'Adventure', days: '7 Days', price: 550, image: 'https://images.unsplash.com/photo-1581791534721-e599df4417f7?auto=format&fit=crop&w=800&q=80', rating: 4.9, coordinates: [77.57, 34.15] }
];
