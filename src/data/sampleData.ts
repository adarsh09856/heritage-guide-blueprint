import { Destination, VirtualTour, Story, Experience } from '@/types/heritage';

export const sampleDestinations: Destination[] = [
  {
    id: '1',
    title: 'Angkor Wat Temple Complex',
    slug: 'angkor-wat',
    region: 'Asia',
    country: 'Cambodia',
    heritageType: 'Cultural',
    era: 'Medieval (12th Century)',
    description: 'The largest religious monument in the world, originally constructed as a Hindu temple dedicated to Vishnu, gradually transforming into a Buddhist temple.',
    history: 'Built in the early 12th century by King Suryavarman II, Angkor Wat represents the peak of classical Khmer architecture. The temple complex spans over 400 acres and took approximately 30 years to complete.',
    images: [
      'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=800',
      'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800'
    ],
    coordinates: { lat: 13.4125, lng: 103.8670 },
    features: ['UNESCO World Heritage Site', '360° Virtual Tour', 'Audio Guide', 'Expert Commentary'],
    bestTimeToVisit: 'November to February',
    rating: 4.9,
    reviewCount: 12453,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Machu Picchu Citadel',
    slug: 'machu-picchu',
    region: 'South America',
    country: 'Peru',
    heritageType: 'Mixed',
    era: 'Pre-Columbian (15th Century)',
    description: 'An ancient Incan citadel set high in the Andes Mountains, renowned for its sophisticated dry-stone walls and panoramic views.',
    history: 'Built around 1450 CE as an estate for the Inca emperor Pachacuti, Machu Picchu was abandoned during the Spanish Conquest and remained largely unknown until 1911.',
    images: [
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800'
    ],
    coordinates: { lat: -13.1631, lng: -72.5450 },
    features: ['UNESCO World Heritage Site', 'Drone Footage', 'Interactive Map', 'Local Guide Stories'],
    bestTimeToVisit: 'April to October',
    rating: 4.8,
    reviewCount: 9876,
    isFeatured: true
  },
  {
    id: '3',
    title: 'Petra Rose City',
    slug: 'petra',
    region: 'Middle East',
    country: 'Jordan',
    heritageType: 'Cultural',
    era: 'Ancient (4th Century BCE)',
    description: 'A historical and archaeological city famous for its rock-cut architecture and water conduit system, earning it the nickname "Rose City."',
    history: 'Established possibly as early as 312 BCE as the capital of the Nabataean Kingdom, Petra prospered as a major trading hub.',
    images: [
      'https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=800',
      'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800'
    ],
    coordinates: { lat: 30.3285, lng: 35.4444 },
    features: ['UNESCO World Heritage Site', 'Night Tour Experience', '3D Reconstruction', 'Archaeological Insights'],
    bestTimeToVisit: 'March to May, September to November',
    rating: 4.7,
    reviewCount: 7654,
    isFeatured: true
  },
  {
    id: '4',
    title: 'Great Barrier Reef',
    slug: 'great-barrier-reef',
    region: 'Oceania',
    country: 'Australia',
    heritageType: 'Natural',
    era: 'Natural Formation',
    description: 'The world\'s largest coral reef system, home to thousands of species of marine life and visible from outer space.',
    history: 'The reef began forming approximately 20,000 years ago and continues to grow. It has been protected as a World Heritage Site since 1981.',
    images: [
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
    ],
    coordinates: { lat: -18.2871, lng: 147.6992 },
    features: ['UNESCO World Heritage Site', 'Underwater VR Experience', 'Marine Life Database', 'Conservation Updates'],
    bestTimeToVisit: 'June to October',
    rating: 4.9,
    reviewCount: 5432,
    isFeatured: false
  },
  {
    id: '5',
    title: 'Colosseum of Rome',
    slug: 'colosseum',
    region: 'Europe',
    country: 'Italy',
    heritageType: 'Cultural',
    era: 'Ancient Rome (1st Century CE)',
    description: 'The largest ancient amphitheater ever built, a symbol of Imperial Rome\'s architectural and engineering prowess.',
    history: 'Construction began under Emperor Vespasian in 72 CE and was completed in 80 CE under Titus. It could hold up to 80,000 spectators.',
    images: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
      'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=800'
    ],
    coordinates: { lat: 41.8902, lng: 12.4922 },
    features: ['UNESCO World Heritage Site', 'Time-Lapse Reconstruction', 'Gladiator Stories', 'Underground Access Tour'],
    bestTimeToVisit: 'April to June, September to October',
    rating: 4.6,
    reviewCount: 15234,
    isFeatured: true
  },
  {
    id: '6',
    title: 'Taj Mahal',
    slug: 'taj-mahal',
    region: 'Asia',
    country: 'India',
    heritageType: 'Cultural',
    era: 'Mughal Empire (17th Century)',
    description: 'An ivory-white marble mausoleum, widely considered the finest example of Mughal architecture and a symbol of eternal love.',
    history: 'Commissioned in 1632 by Emperor Shah Jahan in memory of his wife Mumtaz Mahal, it took 22 years and 20,000 artisans to complete.',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800'
    ],
    coordinates: { lat: 27.1751, lng: 78.0421 },
    features: ['UNESCO World Heritage Site', 'Sunrise Experience', 'Architectural Details Tour', 'Love Story Narration'],
    bestTimeToVisit: 'October to March',
    rating: 4.8,
    reviewCount: 18765,
    isFeatured: false
  }
];

export const sampleVirtualTours: VirtualTour[] = [
  {
    id: 'vt1',
    destinationId: '1',
    title: 'Sunrise at Angkor Wat',
    description: 'Experience the magical sunrise over the temple complex in immersive 360°',
    thumbnailUrl: 'https://images.unsplash.com/photo-1569060708400-2b0f1d024648?w=400',
    tourType: '360',
    duration: '15 min'
  },
  {
    id: 'vt2',
    destinationId: '2',
    title: 'Machu Picchu Aerial Journey',
    description: 'Soar over the ancient citadel with stunning drone footage',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400',
    tourType: 'video',
    duration: '20 min'
  },
  {
    id: 'vt3',
    destinationId: '3',
    title: 'Walk Through the Treasury',
    description: 'Step inside Petra\'s most iconic monument in full 3D',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=400',
    tourType: '3d',
    duration: '25 min'
  }
];

export const sampleStories: Story[] = [
  {
    id: 's1',
    title: 'The Hidden Chambers of Angkor',
    excerpt: 'Archaeologists recently discovered previously unknown chambers beneath the main temple, revealing secrets of ancient Khmer civilization.',
    content: 'Full article content here...',
    author: 'Dr. Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    imageUrl: 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=600',
    publishedAt: '2024-01-15',
    tags: ['archaeology', 'discovery', 'cambodia'],
    destinationId: '1'
  },
  {
    id: 's2',
    title: 'Preserving Petra for Future Generations',
    excerpt: 'New conservation efforts combine traditional techniques with modern technology to protect the ancient rose-red city.',
    content: 'Full article content here...',
    author: 'Ahmed Al-Rashid',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    imageUrl: 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=600',
    publishedAt: '2024-01-10',
    tags: ['conservation', 'technology', 'jordan'],
    destinationId: '3'
  },
  {
    id: 's3',
    title: 'The Astronomical Secrets of Machu Picchu',
    excerpt: 'How the Incas used celestial alignments in their architectural masterpiece.',
    content: 'Full article content here...',
    author: 'Prof. Maria Santos',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    publishedAt: '2024-01-05',
    tags: ['astronomy', 'architecture', 'peru'],
    destinationId: '2'
  }
];

export const sampleExperiences: Experience[] = [
  {
    id: 'e1',
    destinationId: '1',
    title: 'Traditional Khmer Cooking Class',
    description: 'Learn to prepare authentic Cambodian dishes with local ingredients',
    type: 'culinary',
    duration: '3 hours',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400'
  },
  {
    id: 'e2',
    destinationId: '3',
    title: 'Petra by Night Experience',
    description: 'Walk through the Siq to the Treasury illuminated by thousands of candles',
    type: 'guided-tour',
    duration: '2 hours',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=400'
  },
  {
    id: 'e3',
    destinationId: '5',
    title: 'Gladiator for a Day',
    description: 'Train like an ancient Roman warrior in an authentic gladiator school',
    type: 'workshop',
    duration: '4 hours',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400'
  }
];

export const regions = ['All Regions', 'Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania', 'Middle East'];
export const heritageTypes = ['All Types', 'Cultural', 'Natural', 'Mixed'];
export const eras = ['All Eras', 'Ancient', 'Medieval', 'Pre-Columbian', 'Modern', 'Natural Formation'];
