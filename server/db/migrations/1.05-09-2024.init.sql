CREATE TYPE user_role as ENUM ('admin', 'lab_manager', 'user');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_labs jsonb, -- format: { id: string; location: Location }[]
  name text CHECK ((char_length(name) <= 256)),
  meta jsonb,
  borrowed_devices jsonb, -- computed using trigger; format: { id: string; name: string }[]
  default_role user_role
);

CREATE TABLE device_kinds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid,
  name text CHECK ((char_length(name) <= 256)),
  meta jsonb,
  available_quantity jsonb -- computed using trigger; format: { [ location: string ]: number }
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name jsonb -- format: { [ faculty: string ]: 'Level 1/Level 2/Level 3' }
);

CREATE TYPE reservation_status as ENUM ('pending', 'approved', 'cancelled');

CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid,
  device_quantities jsonb, -- format: { [ device_kind_id: string ]: number }
  pickup_time_start timestamp with time zone,
  pickup_time_end timestamp with time zone,
  return_time_start timestamp with time zone,
  return_time_end timestamp with time zone,
  lab_id uuid,
  status reservation_status,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE role_histories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  grantee_id uuid,
  granter_id uuid,
  permissions jsonb,
  effective_start timestamp with time zone,
  effective_end timestamp with time zone
);

CREATE TABLE labs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text CHECK ((char_length(name) <= 256)),
  faculty text CHECK ((char_length(name) <= 256)),
  room text CHECK ((char_length(name) <= 256)),
  branch text CHECK ((char_length(name) <= 256)),
  timetable jsonb CHECK,
  admin_id uuid
);

CREATE TABLE receipts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  borrower_id uuid,
  checker_id uuid,
  quantity integer NOT NULL,
  borrowed_at time with time zone NOT NULL,
  expected_returned_at time with time zone NOT NULL,
  returned_at time with time zone,
  device_id uuid,
  lab_id uuid
);

CREATE TYPE device_quality AS ENUM ('healthy', 'needs fixing', 'broken', 'lost');

CREATE TYPE device_borrowable_status AS ENUM ();

CREATE table devices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind uuid,
  quantity integer DEFAULT 0,
  unit text CHECK ((char_length(name) <= 32)),
  lab_id uuid,
  available_quantity integer, -- computed
  quality device_quality,
  borrowable_status device_borrowable_status,
  meta jsonb,
  borrower_id uuid
);

CREATE TABLE inventory_assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  finished_at time with time zone,
  lab_id uuid,
  accountant_id uuid,
  devices jsonb
);

CREATE TABLE shipments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_at time with time zone,
  arrive_at time with time zone,
  devices jsonb,
  start_lab_id uuid NOT NULL,
  arrive_lab_id uuid NOT NULL
);

CREATE TABLE expiration_extension_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid,
  receipt_id uuid,
  status request_status,
  return_at time with time zone
);
