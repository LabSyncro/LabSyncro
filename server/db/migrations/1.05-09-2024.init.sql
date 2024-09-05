CREATE TYPE user_role as ENUM ('admin', 'lab_manager', 'user');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  labs jsonb,
  name text CHECK ((char_length(name) <= 256)),
  meta jsonb,
  borrowed_devices jsonb,
  default_role user_role
);

CREATE TABLE device_kinds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid,
  name text CHECK ((char_length(name) <= 256)),
  meta jsonb,
  available_quantity jsonb -- computed using trigger
);
