-- SQL to insert ApiActions extracted from controllers
-- Each action is unique by key. 
-- IDs are generated deterministically from the key for repeatability.

INSERT INTO "ApiAction" ("id", "key", "description", "enabled", "mode", "createdAt", "updatedAt")
VALUES
  ('cl' || substr(md5('amenities.create'), 1, 23), 'amenities.create', 'Create new amenity', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('amenities.list'), 1, 23), 'amenities.list', 'List amenities', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('amenities.detail.read'), 1, 23), 'amenities.detail.read', 'View amenity detail', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('amenities.update'), 1, 23), 'amenities.update', 'Update amenity', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('amenities.delete'), 1, 23), 'amenities.delete', 'Delete amenity', true, 'ANY', NOW(), NOW()),

  ('cl' || substr(md5('bookings.list'), 1, 23), 'bookings.list', 'List bookings', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('bookings.detail.read'), 1, 23), 'bookings.detail.read', 'View booking detail', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('bookings.cancel'), 1, 23), 'bookings.cancel', 'Cancel booking', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('bookings.status.update'), 1, 23), 'bookings.status.update', 'Update booking status', true, 'ANY', NOW(), NOW()),

  ('cl' || substr(md5('commission-packages.list'), 1, 23), 'commission-packages.list', 'List commission packages', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('commission-packages.revenue'), 1, 23), 'commission-packages.revenue', 'View commission packages revenue', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('commission-packages.view'), 1, 23), 'commission-packages.view', 'View commission package detail', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('commission-packages.create'), 1, 23), 'commission-packages.create', 'Create commission package', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('commission-packages.update'), 1, 23), 'commission-packages.update', 'Update commission package', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('commission-packages.deactivate'), 1, 23), 'commission-packages.deactivate', 'Deactivate commission package', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('hotels.set-commission-package'), 1, 23), 'hotels.set-commission-package', 'Set hotel commission package', true, 'ANY', NOW(), NOW()),

  ('cl' || substr(md5('hotels.create'), 1, 23), 'hotels.create', 'Create hotel', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('hotels.my.list'), 1, 23), 'hotels.my.list', 'List my hotels', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('hotels.update'), 1, 23), 'hotels.update', 'Update hotel', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('hotels.members.add'), 1, 23), 'hotels.members.add', 'Add hotel member', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('hotels.members.remove'), 1, 23), 'hotels.members.remove', 'Remove hotel member', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('hotels.members.list'), 1, 23), 'hotels.members.list', 'List hotel members', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('hotels.delete'), 1, 23), 'hotels.delete', 'Delete hotel', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('hotels.admin.list'), 1, 23), 'hotels.admin.list', 'List hotels (Admin)', true, 'ANY', NOW(), NOW()),

  ('cl' || substr(md5('inventories.list'), 1, 23), 'inventories.list', 'List inventories', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('inventories.bulk.set'), 1, 23), 'inventories.bulk.set', 'Bulk set inventory', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('inventories.update'), 1, 23), 'inventories.update', 'Update inventory', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('inventories.delete'), 1, 23), 'inventories.delete', 'Delete inventory', true, 'ANY', NOW(), NOW()),

  ('cl' || substr(md5('news.create'), 1, 23), 'news.create', 'Create news', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('news.read'), 1, 23), 'news.read', 'Read news', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('news.update'), 1, 23), 'news.update', 'Update news', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('news.delete'), 1, 23), 'news.delete', 'Delete news', true, 'ANY', NOW(), NOW()),

  ('cl' || substr(md5('reviews.moderate'), 1, 23), 'reviews.moderate', 'Moderate review', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('reviews.delete'), 1, 23), 'reviews.delete', 'Delete review', true, 'ANY', NOW(), NOW()),

  ('cl' || substr(md5('rooms.create'), 1, 23), 'rooms.create', 'Create room', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('rooms.list'), 1, 23), 'rooms.list', 'List rooms', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('rooms.detail.read'), 1, 23), 'rooms.detail.read', 'View room detail', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('rooms.update'), 1, 23), 'rooms.update', 'Update room', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('rooms.delete'), 1, 23), 'rooms.delete', 'Delete room', true, 'ANY', NOW(), NOW()),

  ('cl' || substr(md5('room-types.update'), 1, 23), 'room-types.update', 'Update room type', true, 'ANY', NOW(), NOW()),
  ('cl' || substr(md5('room-types.delete'), 1, 23), 'room-types.delete', 'Delete room type', true, 'ANY', NOW(), NOW())
ON CONFLICT ("key") DO UPDATE SET
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();
