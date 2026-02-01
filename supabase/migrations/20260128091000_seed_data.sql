-- LAYO HAIR - Seed Data

-- Admin user (password: admin123 - bcrypt hash)
INSERT INTO "User" ("id", "email", "name", "password", "role", "phone", "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@layohair.com',
  'Layo Admin',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G5HH5z5p5p5p5q',
  'ADMIN',
  '+234 XXX XXX XXXX',
  NOW(),
  NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Styles
INSERT INTO "Style" ("id", "name", "slug", "description", "category", "price", "duration", "images", "isActive", "isFeatured", "createdAt", "updatedAt")
VALUES
  ('style-001', 'Knotless Braids', 'knotless-braids', 'Beautiful knotless box braids that are gentle on your edges. These braids start with your natural hair and gradually add extensions for a seamless, natural look. Perfect for protective styling that lasts 6-8 weeks.', 'BRAIDS', 25000, 240, ARRAY['/images/styles/knotless-braids/1.jpg'], true, true, NOW(), NOW()),
  ('style-002', 'Fulani Braids', 'fulani-braids', 'Traditional Fulani-inspired braids with beautiful patterns and beads. Features a unique center part with side braids and elegant accessories. A statement style that celebrates African heritage.', 'BRAIDS', 30000, 300, ARRAY['/images/styles/fulani-braids/1.jpg'], true, true, NOW(), NOW()),
  ('style-003', 'Short Boho Braids', 'short-boho-braids', 'Trendy bohemian-style braids with curly ends for a free-spirited look. Perfect for those who want a stylish, low-maintenance option that combines braids with beautiful curly textures.', 'BRAIDS', 28000, 270, ARRAY['/images/styles/short-boho-braids/1.jpg'], true, true, NOW(), NOW()),
  ('style-004', 'French Curls', 'french-curls', 'Elegant French curl braids with bouncy, defined curls at the ends. A sophisticated style that adds volume and movement to your look while keeping your natural hair protected.', 'BRAIDS', 32000, 300, ARRAY['/images/styles/french-curls/1.jpg'], true, true, NOW(), NOW()),
  ('style-005', 'Classic Cornrows', 'classic-cornrows', 'Timeless cornrow braids in various patterns. From simple straight-back styles to intricate designs, cornrows are versatile and perfect for any occasion.', 'CORNROWS', 15000, 180, ARRAY['/images/styles/cornrows/1.jpg'], true, false, NOW(), NOW()),
  ('style-006', 'Goddess Locs', 'goddess-locs', 'Soft, bohemian-style faux locs with curly accents. These goddess locs give you the loc look without the commitment, featuring beautiful wavy pieces throughout for added texture.', 'LOCS', 35000, 360, ARRAY['/images/styles/goddess-locs/1.jpg'], true, true, NOW(), NOW()),
  ('style-007', 'Passion Twists', 'passion-twists', 'Trendy passion twists with a soft, romantic texture. These twists use water wave hair for a beautiful, bohemian finish that is perfect for any season.', 'TWISTS', 27000, 240, ARRAY['/images/styles/passion-twists/1.jpg'], true, false, NOW(), NOW()),
  ('style-008', 'Senegalese Twists', 'senegalese-twists', 'Sleek, rope-like twists that are elegant and versatile. Senegalese twists can be styled in numerous ways and last for weeks with proper care.', 'TWISTS', 25000, 270, ARRAY['/images/styles/senegalese-twists/1.jpg'], true, false, NOW(), NOW()),
  ('style-009', 'Box Braids', 'box-braids', 'Classic box braids in your choice of size - from micro to jumbo. A timeless protective style that has been loved for generations and can be accessorized endlessly.', 'BRAIDS', 22000, 300, ARRAY['/images/styles/box-braids/1.jpg'], true, false, NOW(), NOW()),
  ('style-010', 'Butterfly Locs', 'butterfly-locs', 'Distressed faux locs with a unique, textured appearance. Butterfly locs have a beautiful, messy-on-purpose look that is incredibly trendy and eye-catching.', 'LOCS', 33000, 330, ARRAY['/images/styles/butterfly-locs/1.jpg'], true, true, NOW(), NOW()),
  ('style-011', 'Natural Hair Styling', 'natural-styling', 'Expert styling for your natural hair. Includes wash, deep condition, detangle, and style. Perfect for twist-outs, braid-outs, or wash-and-go styles.', 'NATURAL', 12000, 120, ARRAY['/images/styles/natural/1.jpg'], true, false, NOW(), NOW()),
  ('style-012', 'Deep Conditioning Treatment', 'deep-conditioning', 'Intensive hair treatment to restore moisture and strength. Includes protein treatment, deep conditioning mask, and scalp massage. Essential for healthy hair maintenance.', 'TREATMENTS', 8000, 60, ARRAY['/images/styles/treatments/1.jpg'], true, false, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Default availability (Mon-Sat)
INSERT INTO "Availability" ("id", "stylistId", "dayOfWeek", "startTime", "endTime", "isAvailable", "updatedAt")
VALUES
  ('avail-sun', NULL, 0, '09:00', '09:00', false, NOW()),
  ('avail-mon', NULL, 1, '09:00', '18:00', true, NOW()),
  ('avail-tue', NULL, 2, '09:00', '18:00', true, NOW()),
  ('avail-wed', NULL, 3, '09:00', '18:00', true, NOW()),
  ('avail-thu', NULL, 4, '09:00', '18:00', true, NOW()),
  ('avail-fri', NULL, 5, '09:00', '18:00', true, NOW()),
  ('avail-sat', NULL, 6, '09:00', '17:00', true, NOW())
ON CONFLICT ("stylistId", "dayOfWeek") DO NOTHING;

-- Salon settings
INSERT INTO "Settings" ("id", "salonName", "salonEmail", "salonPhone", "salonAddress", "bookingBuffer", "maxAdvanceBooking", "minAdvanceBooking", "updatedAt")
VALUES (
  'default',
  'LAYO HAIR',
  'hello@layohair.com',
  '+234 XXX XXX XXXX',
  'Lagos, Nigeria',
  30,
  30,
  2,
  NOW()
) ON CONFLICT ("id") DO NOTHING;
