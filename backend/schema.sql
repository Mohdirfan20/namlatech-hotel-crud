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
);
