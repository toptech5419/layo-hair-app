-- LAYO HAIR Seed Data (Final - handles all duplicates)
-- Run this in Supabase Dashboard > SQL Editor

-- ============================================
-- CLEAR ALL EXISTING SEED DATA
-- ============================================
DELETE FROM "Availability";
DELETE FROM "Settings";
DELETE FROM "Style" WHERE "slug" IN ('knotless-braids', 'fulani-braids', 'short-boho-braids', 'french-curls', 'classic-cornrows', 'goddess-locs', 'passion-twists', 'butterfly-locs', 'box-braids', 'senegalese-twists', 'tribal-braids', 'soft-locs');
DELETE FROM "User" WHERE "email" = 'admin@layohair.com';

-- ============================================
-- ADMIN USER
-- Password: admin123 (bcrypt hashed)
-- ============================================
INSERT INTO "User" ("id", "email", "name", "password", "phone", "role", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'admin@layohair.com',
    'Layo Admin',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYv.Kj5S5K8e',
    '+44 7700 900000',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ============================================
-- STYLES (Prices in GBP)
-- ============================================
INSERT INTO "Style" ("id", "name", "slug", "description", "category", "price", "duration", "images", "isActive", "isFeatured", "createdAt", "updatedAt")
VALUES
    (gen_random_uuid()::text, 'Knotless Braids', 'knotless-braids', 'Lightweight, natural-looking braids that start with your natural hair. Knotless braids are a protective style that reduces tension on your scalp and edges. Perfect for those who want a seamless, natural look that lasts 6-8 weeks.', 'BRAIDS', 120.00, 240, ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=1000&fit=crop'], true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Fulani Braids', 'fulani-braids', 'Traditional African style with beads and unique patterns. Fulani braids are inspired by the Fulani people of West Africa and feature intricate designs with beads and cowrie shells. A statement style that celebrates African heritage.', 'BRAIDS', 150.00, 300, ARRAY['https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=800&h=1000&fit=crop'], true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Short Boho Braids', 'short-boho-braids', 'Trendy bohemian style with curly ends for a carefree look. Perfect for those who want the beauty of braids with a playful, effortless vibe. Low-maintenance and stylish.', 'BRAIDS', 140.00, 270, ARRAY['https://images.unsplash.com/photo-1594369908155-60ced2a37e59?w=800&h=1000&fit=crop'], true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'French Curls', 'french-curls', 'Elegant curly braids with a sophisticated French twist. This style combines the elegance of French braiding techniques with beautiful curly extensions for a romantic, sophisticated look.', 'BRAIDS', 160.00, 300, ARRAY['https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?w=800&h=1000&fit=crop'], true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Classic Cornrows', 'classic-cornrows', 'Timeless cornrow patterns that never go out of style. Classic cornrows are braided close to the scalp in straight lines or intricate designs. Versatile and perfect for any occasion.', 'CORNROWS', 80.00, 180, ARRAY['https://images.unsplash.com/photo-1611077544695-e0e15a56077f?w=800&h=1000&fit=crop'], true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Goddess Locs', 'goddess-locs', 'Beautiful faux locs with curly accents for a goddess look. These locs feature soft, wavy hair wrapped around for a romantic, bohemian aesthetic. Stunning for any occasion.', 'LOCS', 180.00, 360, ARRAY['https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=800&h=1000&fit=crop'], true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Passion Twists', 'passion-twists', 'Soft, romantic twists perfect for any occasion. Passion twists use water wave hair for a fluffy, textured look that is both stylish and protective.', 'TWISTS', 135.00, 240, ARRAY['https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800&h=1000&fit=crop'], true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Butterfly Locs', 'butterfly-locs', 'Distressed locs with a unique, textured appearance. Butterfly locs have a naturally distressed look that gives them character and dimension. A trendy statement style.', 'LOCS', 165.00, 300, ARRAY['https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=800&h=1000&fit=crop'], true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Box Braids', 'box-braids', 'Classic box braids in various lengths and sizes. A timeless protective style that has been popular for generations. Versatile and can be styled in countless ways.', 'BRAIDS', 130.00, 300, ARRAY['https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop'], true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Senegalese Twists', 'senegalese-twists', 'Sleek, rope-like twists for a polished appearance. These twists are smooth and shiny, giving a sophisticated and put-together look. Easy to maintain.', 'TWISTS', 125.00, 270, ARRAY['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop'], true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Tribal Braids', 'tribal-braids', 'Bold patterns inspired by traditional African designs. These braids feature creative patterns that make a statement and celebrate African heritage.', 'BRAIDS', 140.00, 240, ARRAY['https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&h=1000&fit=crop'], true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Soft Locs', 'soft-locs', 'Lightweight, natural-looking faux locs. Soft locs offer the look of traditional locs without the commitment or weight. Comfortable to wear and beautiful to see.', 'LOCS', 150.00, 300, ARRAY['https://images.unsplash.com/photo-1580501170888-80668882ca0c?w=800&h=1000&fit=crop'], true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- DEFAULT AVAILABILITY (Mon-Sat 9am-6pm)
-- ============================================
INSERT INTO "Availability" ("id", "stylistId", "dayOfWeek", "startTime", "endTime", "isAvailable", "updatedAt")
VALUES
    (gen_random_uuid()::text, NULL, 0, '09:00', '09:00', false, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, NULL, 1, '09:00', '18:00', true, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, NULL, 2, '09:00', '18:00', true, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, NULL, 3, '09:00', '18:00', true, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, NULL, 4, '09:00', '18:00', true, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, NULL, 5, '09:00', '18:00', true, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, NULL, 6, '09:00', '17:00', true, CURRENT_TIMESTAMP);

-- ============================================
-- SALON SETTINGS
-- ============================================
INSERT INTO "Settings" ("id", "salonName", "salonEmail", "salonPhone", "salonAddress", "bookingBuffer", "maxAdvanceBooking", "minAdvanceBooking", "updatedAt")
VALUES (
    'default',
    'LAYO HAIR',
    'hello@layohair.com',
    '+44 7700 900000',
    '123 High Street, London, UK',
    30,
    30,
    2,
    CURRENT_TIMESTAMP
);

-- ============================================
-- VERIFY
-- ============================================
SELECT 'Seed completed!' as status,
       (SELECT COUNT(*) FROM "Style") as styles,
       (SELECT COUNT(*) FROM "User") as users,
       (SELECT COUNT(*) FROM "Availability") as availability_slots;
