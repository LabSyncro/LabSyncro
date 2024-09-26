-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role as ENUM ('admin', 'lab_manager', 'user');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- implicit foreign key
  admin_labs jsonb NOT NULL, -- format: { id: string; location: Location }[]

  name text CHECK ((char_length(name) <= 256)),
  meta jsonb NOT NULL,

  -- implicit foreign key
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
  CONSTRAINT fk_category
  FOREIGN KEY(category_id)
  REFERENCES categories(id),

  name text CHECK ((char_length(name) <= 256)),
  meta jsonb NOT NULL,
  available_quantity jsonb NOT NULL -- computed using trigger; format: { [ location: string ]: number }
);

CREATE TABLE labs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text CHECK ((char_length(name) <= 256)),
  faculty text CHECK ((char_length(faculty) <= 256)),
  room text CHECK ((char_length(room) <= 256)),
  branch text CHECK ((char_length(branch) <= 256)),
  timetable jsonb NOT NULL,
  admin_id uuid,
  CONSTRAINT fk_admin_user
  FOREIGN KEY(admin_id)
  REFERENCES users(id)
);

CREATE TYPE reservation_status as ENUM ('pending', 'approved', 'ready', 'cancelled');

CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id uuid NOT NULL,
  CONSTRAINT fk_owner_user
  FOREIGN KEY(user_id)
  REFERENCES users(id),

  -- implicit foreign key
  device_quantities jsonb, -- format: { [ device_kind_id: string ]: number }

  pickup_time_start timestamp with time zone NOT NULL,
  pickup_time_end timestamp with time zone NOT NULL,
  return_time_start timestamp with time zone NOT NULL,
  return_time_end timestamp with time zone NOT NULL,

  lab_id uuid NOT NULL,
  CONSTRAINT fk_lab
  FOREIGN KEY(lab_id)
  REFERENCES labs(id),

  status reservation_status NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL
);

CREATE TABLE role_histories (
  grantee_id uuid,
  CONSTRAINT fk_grantee_user
  FOREIGN KEY(grantee_id)
  REFERENCES users(id),

  granter_id uuid,
  CONSTRAINT fk_granter_user
  FOREIGN KEY(granter_id)
  REFERENCES users(id),

  permissions jsonb,
  effective_start timestamp with time zone NOT NULL,
  effective_end timestamp with time zone NOT NULL,
  PRIMARY KEY(grantee_id, granter_id)
);


CREATE TYPE device_quality AS ENUM ('healthy', 'needs fixing', 'broken', 'lost');

CREATE TYPE device_allowed_borrow_role AS ENUM ();

CREATE table devices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  kind uuid,
  CONSTRAINT fk_device_kind
  FOREIGN KEY(kind)
  REFERENCES device_kinds(id),

  quantity integer DEFAULT 0,
  unit text CHECK ((char_length(unit) <= 32)),

  lab_id uuid,
  CONSTRAINT fk_admin_user
  FOREIGN KEY(lab_id)
  REFERENCES labs(id),

  available_quantity integer NOT NULL, -- computed
  quality device_quality NOT NULL,
  allowed_borrow_role device_allowed_borrow_role NOT NULL,
  meta jsonb NOT NULL,
  borrower_id uuid,
  CONSTRAINT fk_borrow_user
  FOREIGN KEY(borrower_id)
  REFERENCES users(id)
);

CREATE TABLE receipts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  borrower_id uuid NOT NULL,
  CONSTRAINT fk_borrow_user
  FOREIGN KEY(borrower_id)
  REFERENCES users(id),

  checker_id uuid,
  CONSTRAINT fk_checker_user
  FOREIGN KEY(checker_id)
  REFERENCES users(id),

  quantity integer NOT NULL,
  borrowed_at time with time zone NOT NULL,
  expected_returned_at time with time zone NOT NULL,
  returned_at time with time zone,

  device_id uuid NOT NULL,
  CONSTRAINT fk_device
  FOREIGN KEY(device_id)
  REFERENCES devices(id),

  lab_id uuid NOT NULL,
  CONSTRAINT fk_lab
  FOREIGN KEY(lab_id)
  REFERENCES labs(id)
);

CREATE TABLE inventory_assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  finished_at time with time zone,

  lab_id uuid NOT NULL,
  CONSTRAINT fk_lab
  FOREIGN KEY(lab_id)
  REFERENCES labs(id),

  accountant_id uuid,
  CONSTRAINT fk_accountant_user
  FOREIGN KEY(accountant_id)
  REFERENCES users(id),

  -- implicit foreign key
  devices jsonb NOT NULL
);

CREATE TYPE shipment_status AS ENUM ('pending', 'shipping', 'completed', 'cancelled');

CREATE TABLE shipments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  sender_id uuid,
  CONSTRAINT fk_send_user
  FOREIGN KEY(sender_id)
  REFERENCES users(id),

  receiver_id uuid,
  CONSTRAINT fk_receiver_user
  FOREIGN KEY(receiver_id)
  REFERENCES users(id),

  status shipment_status NOT NULL,

  start_at time with time zone,
  arrive_at time with time zone,
  -- implicit foreign key
  devices jsonb NOT NULL,

  start_lab_id uuid NOT NULL,
  CONSTRAINT fk_start_lab
  FOREIGN KEY(start_lab_id)
  REFERENCES labs(id),

  arrive_lab_id uuid NOT NULL,
  CONSTRAINT fk_end_lab
  FOREIGN KEY (arrive_lab_id)
  REFERENCES labs(id)
);

CREATE TYPE maintenance_status AS ENUM ('pending', 'maintaining', 'completed', 'cancelled');

CREATE TABLE maintenances (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  status maintenance_status NOT NULL,

  maintainer_id uuid,
  CONSTRAINT fk_maintain_user
  FOREIGN KEY(maintainer_id)
  REFERENCES users(id),

  start_at time with time zone,
  complete_at time with time zone,

  lab_id uuid NOT NULL,
  CONSTRAINT fk_lab
  FOREIGN KEY(lab_id)
  REFERENCES labs(id),

  device_ids jsonb
);

CREATE TYPE request_status as ENUM ();

CREATE TABLE expiration_extension_requests (
  user_id uuid,
  CONSTRAINT fk_user
  FOREIGN KEY(user_id)
  REFERENCES users(id),

  receipt_id uuid,
  CONSTRAINT fk_receipt
  FOREIGN KEY(receipt_id)
  REFERENCES receipts(id),

  status request_status NOT NULL,
  return_at time with time zone NOT NULL,
  PRIMARY KEY(user_id, receipt_id)
);

-- migrate:down

