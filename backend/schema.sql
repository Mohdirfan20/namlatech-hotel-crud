-- Hotel List & CRUD Database Schema for PostgreSQL
-- Drop table if exists
DROP TABLE IF EXISTS hotels;

-- Create hotels table
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching and price filtering performance
CREATE INDEX IF NOT EXISTS idx_hotels_title ON hotels(title);
CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels(price);

-- Realistic Seed Data (10 sample hotels across popular global destinations)
INSERT INTO hotels (title, description, image_path, latitude, longitude, price) VALUES
(
    'The Grand Parisian Palace',
    'Luxury 5-star hotel in the heart of Paris offering breathtaking views of the Eiffel Tower, Michelin-starred French cuisine, heated rooftop pool, and classical European architecture.',
    '/uploads/hotel-1.jpg',
    48.858400,
    2.294500,
    450.00
),
(
    'Manhattan Skyline Boutique Hotel',
    'Chic contemporary boutique hotel located in Midtown Manhattan. Steps away from Central Park, Broadway theatres, and luxury shopping on 5th Avenue with high-speed fiber internet and rooftop lounge.',
    '/uploads/hotel-2.jpg',
    40.758000,
    -73.985500,
    320.00
),
(
    'Kyoto Zen Garden Ryokan & Spa',
    'Traditional Japanese luxury inn featuring authentic tatami rooms, natural volcanic hot spring onsen, private cedar wood baths, and peaceful Zen bamboo rock gardens in historic Kyoto.',
    '/uploads/hotel-3.jpg',
    35.011600,
    135.768100,
    280.00
),
(
    'Burj Marina Palm Resort & Suites',
    'Iconic waterfront sanctuary situated on the Arabian Gulf coastline. Includes private sandy white beaches, infinity edge pools, personal butler service, and lavish world-class suites.',
    '/uploads/hotel-4.jpg',
    25.132500,
    55.117200,
    550.00
),
(
    'Westminster Riverside Heritage Hotel',
    'Stately Victorian riverside hotel perched on the south bank of River Thames with premier panoramic vistas of Big Ben and the Houses of Parliament. Features traditional British afternoon tea service.',
    '/uploads/hotel-5.jpg',
    51.500700,
    -0.124600,
    380.00
),
(
    'Sydney Harbour View Luxury Haven',
    'Waterfront luxury hotel overlooking the world-famous Sydney Opera House and Harbour Bridge. Features harbor cruise bookings, open-air sun deck, cocktail bars, and state-of-the-art fitness center.',
    '/uploads/hotel-6.jpg',
    -33.856800,
    151.215300,
    340.00
),
(
    'Colosseum Grand Imperial Rome',
    'Historical Roman retreat walking distance from the ancient Colosseum and Roman Forum. Italian marble furnishings, panoramic terrace dining, fine wine cellars, and vintage Vespa rentals.',
    '/uploads/hotel-7.jpg',
    41.890200,
    12.492200,
    260.00
),
(
    'Bali Tropical Rainforest Villa',
    'Eco-luxury wellness villa nestled in the lush tropical rainforest of Ubud, Bali. Private plunge pools, daily yoga sessions, organic farm-to-table dining, and holistic Ayurvedic spa treatments.',
    '/uploads/hotel-8.jpg',
    -8.506900,
    115.262500,
    195.00
),
(
    'Barcelona Mediterranean Beachfront Hotel',
    'Vibrant seaside hotel along Barceloneta Beach. Modern Catalan architecture, tapas bar, rooftop solarium with Mediterranean sea breezes, and proximity to Gothic Quarter and Las Ramblas.',
    '/uploads/hotel-9.jpg',
    41.385100,
    2.173400,
    220.00
),
(
    'Marina Bay Horizon Hotel Singapore',
    'Futuristic high-rise hotel soaring above Marina Bay. Boasts the world-renowned rooftop skypark, cantilevered observation decks, multi-cultural culinary pavilions, and garden by the bay access.',
    '/uploads/hotel-10.jpg',
    1.283800,
    103.859100,
    490.00
),
(
    'Santorini Caldera Cliffside Suites',
    'Whitewashed luxury suites perched over the Aegean Sea with private infinity plunge pools, sunset cocktail terraces, and authentic Cycladic Greek architecture.',
    '/uploads/hotel-11.jpg',
    36.461800,
    25.375300,
    420.00
),
(
    'Swiss Alpine Chalet & Ski Resort',
    'Charming wooden alpine retreat facing the Matterhorn with ski-in/ski-out access, heated indoor mineral pools, Swiss fondue dining, and mountain wellness.',
    '/uploads/hotel-12.jpg',
    45.976500,
    7.749100,
    480.00
),
(
    'Maldives Overwater Turquoise Villa',
    'Luxury overwater bungalows directly above crystalline turquoise lagoons. Features glass floor viewports, personal catamaran charters, and private deck dining.',
    '/uploads/hotel-13.jpg',
    4.175500,
    73.509300,
    780.00
),
(
    'The Royal Windsor Castle Lodge',
    'Regal English countryside manor located moments from Windsor Castle. Traditional afternoon tea gardens, equestrian trails, and classic British hospitality.',
    '/uploads/hotel-14.jpg',
    51.483900,
    -0.604400,
    290.00
),
(
    'Taj Heritage Gateway Hotel',
    'Historical palace hotel overlooking the iconic Taj Mahal. Features Mughal-inspired courtyards, marble fountains, classical sitar evenings, and royal Indian dining.',
    '/uploads/hotel-15.jpg',
    27.175100,
    78.042100,
    185.00
),
(
    'Venetian Grand Canal Luxury Palace',
    'Renaissance Venetian palazzo along the Grand Canal with private gondola dock, Murano glass chandeliers, frescoed ceilings, and Italian espresso terrace.',
    '/uploads/hotel-16.jpg',
    45.440800,
    12.315500,
    510.00
),
(
    'Cape Town Atlantic Oceanfront Haven',
    'Modern oceanfront retreat nestled between Table Mountain and the Atlantic ocean with private sea-view balconies, wine tasting cellars, and safari booking.',
    '/uploads/hotel-17.jpg',
    -33.924900,
    18.424100,
    275.00
),
(
    'Banff Rocky Mountain Forest Lodge',
    'Rustic cedar lodge nestled in Banff National Park with roaring stone fireplaces, geothermal outdoor hot tubs, and panoramic views of snow-capped peaks.',
    '/uploads/hotel-18.jpg',
    51.178400,
    -115.570800,
    310.00
),
(
    'Seoul Gangnam Skyview Tower Hotel',
    'Sleek futuristic high-rise in Seoul vibrant Gangnam district with cutting-edge smart room controls, 24-hour skyline fitness center, and Korean fusion bistro.',
    '/uploads/hotel-19.jpg',
    37.497900,
    127.027600,
    240.00
),
(
    'Rio Copacabana Golden Beach Resort',
    'Energetic oceanfront hotel overlooking Copacabana beach with rooftop caipirinha bar, samba dance lounge, infinity pool, and vibrant Brazilian hospitality.',
    '/uploads/hotel-20.jpg',
    -22.969800,
    -43.186800,
    195.00
),
(
    'Amsterdam Canal Heritage Townhouse',
    'Charming 17th-century canal house hotel with vintage Dutch bicycles, tranquil courtyard garden, and walking distance to the Rijksmuseum and Anne Frank House.',
    '/uploads/hotel-21.jpg',
    52.367600,
    4.904100,
    330.00
),
(
    'Prague Old Town Historical Boutique',
    'Gothic and Baroque styled luxury boutique hotel in Prague historical square with cobblestone lane views, Bohemian crystal decor, and artisan bakery.',
    '/uploads/hotel-22.jpg',
    50.075500,
    14.437800,
    170.00
),
(
    'Reykjavik Northern Lights Glass Lodge',
    'Geothermal Nordic retreat featuring glass-roofed bedrooms for watching the Aurora Borealis, outdoor volcanic hot springs, and Icelandic glacier tours.',
    '/uploads/hotel-23.jpg',
    64.146600,
    -21.942600,
    460.00
),
(
    'Goa Sunset Palm Beachfront Resort',
    'Relaxed coastal paradise surrounded by swaying coconut palms and Arabian Sea waves. Features seafood shacks, yoga cabanas, and sunbed cocktail service.',
    '/uploads/hotel-24.jpg',
    15.299300,
    74.124000,
    140.00
),
(
    'Honolulu Waikiki Surf & Sun Resort',
    'Tropical Hawaiian resort right on Waikiki Beach with private surf lessons, Polynesian luau dinners, tiki cocktail bar, and breathtaking Pacific sunsets.',
    '/uploads/hotel-25.jpg',
    21.306900,
    -157.858300,
    390.00
);
