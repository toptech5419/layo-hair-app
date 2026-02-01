-- Seed Admin User
-- Email: admin@layohair.com
-- Password: Admin123!

INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  'admin-user-001',
  'admin@layohair.com',
  '$2b$12$q1PucmkauxCeewUt.Eh82OqDrDRtlQnTSsYsFyX8SNGuHP6oa8obK',
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email)
DO UPDATE SET
  password = '$2b$12$q1PucmkauxCeewUt.Eh82OqDrDRtlQnTSsYsFyX8SNGuHP6oa8obK',
  role = 'ADMIN',
  "updatedAt" = NOW();
