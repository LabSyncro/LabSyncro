CREATE TYPE user_role as ENUM ('admin', 'lab_manager', 'user');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_labs jsonb NOT NULL, -- format: { id: string; location: Location }[]
  name text CHECK ((char_length(name) <= 256)),
  meta jsonb NOT NULL,
  borrowed_devices jsonb NOT NULL, -- computed using trigger; format: { id: string; name: string }[]
  default_role user_role NOT NULL
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name jsonb NOT NULL -- format: { [ faculty: string ]: 'Level 1/Level 2/Level 3' }
);

CREATE TABLE device_kinds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  category_id uuid,
  FOREIGN KEY(category_id)
  REFERENCES categories(id),

  name text CHECK ((char_length(name) <= 256)),
  meta jsonb NOT NULL,
  available_quantity jsonb NOT NULL -- computed using trigger; format: { [ location: string ]: number }
);

CREATE TYPE reservation_status as ENUM ('pending', 'approved', 'cancelled');

CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id uuid NOT NULL,
  FOREIGN KEY(user_id)
  REFERENCES users(id),

  -- implicit foreign key
  device_quantities jsonb, -- format: { [ device_kind_id: string ]: number }

  pickup_time_start timestamp with time zone NOT NULL,
  pickup_time_end timestamp with time zone NOT NULL,
  return_time_start timestamp with time zone NOT NULL,
  return_time_end timestamp with time zone NOT NULL,
  lab_id uuid NOT NULL,
  status reservation_status NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL
);

CREATE TABLE role_histories (
  grantee_id uuid,
  FOREIGN KEY(grantee_id)
  REFERENCES users(id),

  granter_id uuid,
  FOREIGN KEY(granter_id)
  REFERENCES users(id),

  permissions jsonb,
  effective_start timestamp with time zone NOT NULL,
  effective_end timestamp with time zone NOT NULL,
  PRIMARY KEY(grantee_id, granter_id)
);

CREATE TABLE labs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text CHECK ((char_length(name) <= 256)),
  faculty text CHECK ((char_length(name) <= 256)),
  room text CHECK ((char_length(name) <= 256)),
  branch text CHECK ((char_length(name) <= 256)),
  timetable jsonb NOT NULL,
  admin_id uuid,
  FOREIGN KEY(admin_id)
  REFERENCES users(id)
);

CREATE TABLE receipts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  borrower_id uuid NOT NULL,

  checker_id uuid,
  FOREIGN KEY(checker_id)
  REFERENCES users(id),

  quantity integer NOT NULL,
  borrowed_at time with time zone NOT NULL,
  expected_returned_at time with time zone NOT NULL,
  returned_at time with time zone,
  device_id uuid NOT NULL,
  lab_id uuid NOT NULL
);

CREATE TYPE device_quality AS ENUM ('healthy', 'needs fixing', 'broken', 'lost');

CREATE TYPE device_borrowable_status AS ENUM ();

CREATE table devices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  kind uuid,
  FOREIGN KEY(kind)
  REFERENCES users(id),

  quantity integer DEFAULT 0,
  unit text CHECK ((char_length(name) <= 32)),
  lab_id uuid,
  available_quantity integer NOT NULL, -- computed
  quality device_quality NOT NULL,
  borrowable_status device_borrowable_status NOT NULL,
  meta jsonb NOT NULL,
  borrower_id uuid,
  FOREIGN KEY(borrower_id)
  REFERENCES users(id)
);

CREATE TABLE inventory_assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  finished_at time with time zone,
  lab_id uuid NOT NULL,

  accountant_id uuid,
  FOREIGN KEY(accountant_id)
  REFERENCES users(id),

  devices jsonb NOT NULL
);

CREATE TABLE shipments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_at time with time zone,
  arrive_at time with time zone,
  devices jsonb NOT NULL,
  start_lab_id uuid NOT NULL,
  arrive_lab_id uuid NOT NULL
);

CREATE TABLE expiration_extension_requests (
  user_id uuid,
  FOREIGN KEY(user_id)
  REFERENCES users(id),

  receipt_id uuid,
  status request_status NOT NULL,
  return_at time with time zone NOT NULL,
  PRIMARY KEY(user_id, receipt_id)
);
