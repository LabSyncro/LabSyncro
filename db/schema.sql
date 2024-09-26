SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: device_allowed_borrow_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.device_allowed_borrow_role AS ENUM (
);


--
-- Name: device_quality; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.device_quality AS ENUM (
    'healthy',
    'needs fixing',
    'broken',
    'lost'
);


--
-- Name: maintenance_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.maintenance_status AS ENUM (
    'pending',
    'maintaining',
    'completed',
    'cancelled'
);


--
-- Name: request_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.request_status AS ENUM (
);


--
-- Name: reservation_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.reservation_status AS ENUM (
    'pending',
    'approved',
    'ready',
    'cancelled'
);


--
-- Name: shipment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.shipment_status AS ENUM (
    'pending',
    'shipping',
    'completed',
    'cancelled'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'lab_manager',
    'user'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name jsonb NOT NULL
);


--
-- Name: device_kinds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.device_kinds (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category_id uuid,
    name text,
    meta jsonb NOT NULL,
    available_quantity jsonb NOT NULL,
    CONSTRAINT device_kinds_name_check CHECK ((char_length(name) <= 256))
);


--
-- Name: devices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.devices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    kind uuid,
    quantity integer DEFAULT 0,
    unit text,
    lab_id uuid,
    available_quantity integer NOT NULL,
    quality public.device_quality NOT NULL,
    allowed_borrow_role public.device_allowed_borrow_role NOT NULL,
    meta jsonb NOT NULL,
    borrower_id uuid,
    CONSTRAINT devices_unit_check CHECK ((char_length(unit) <= 32))
);


--
-- Name: expiration_extension_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expiration_extension_requests (
    user_id uuid NOT NULL,
    receipt_id uuid NOT NULL,
    status public.request_status NOT NULL,
    return_at time with time zone NOT NULL
);


--
-- Name: inventory_assessments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory_assessments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    finished_at time with time zone,
    lab_id uuid NOT NULL,
    accountant_id uuid,
    devices jsonb NOT NULL
);


--
-- Name: labs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.labs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text,
    faculty text,
    room text,
    branch text,
    timetable jsonb NOT NULL,
    admin_id uuid,
    CONSTRAINT labs_branch_check CHECK ((char_length(branch) <= 256)),
    CONSTRAINT labs_faculty_check CHECK ((char_length(faculty) <= 256)),
    CONSTRAINT labs_name_check CHECK ((char_length(name) <= 256)),
    CONSTRAINT labs_room_check CHECK ((char_length(room) <= 256))
);


--
-- Name: maintenances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maintenances (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status public.maintenance_status NOT NULL,
    maintainer_id uuid,
    start_at time with time zone,
    complete_at time with time zone,
    lab_id uuid NOT NULL,
    device_ids jsonb
);


--
-- Name: receipts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.receipts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    borrower_id uuid NOT NULL,
    checker_id uuid,
    quantity integer NOT NULL,
    borrowed_at time with time zone NOT NULL,
    expected_returned_at time with time zone NOT NULL,
    returned_at time with time zone,
    device_id uuid NOT NULL,
    lab_id uuid NOT NULL
);


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    device_quantities jsonb,
    pickup_time_start timestamp with time zone NOT NULL,
    pickup_time_end timestamp with time zone NOT NULL,
    return_time_start timestamp with time zone NOT NULL,
    return_time_end timestamp with time zone NOT NULL,
    lab_id uuid NOT NULL,
    status public.reservation_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: role_histories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_histories (
    grantee_id uuid NOT NULL,
    granter_id uuid NOT NULL,
    permissions jsonb,
    effective_start timestamp with time zone NOT NULL,
    effective_end timestamp with time zone NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: shipments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sender_id uuid,
    receiver_id uuid,
    status public.shipment_status NOT NULL,
    start_at time with time zone,
    arrive_at time with time zone,
    devices jsonb NOT NULL,
    start_lab_id uuid NOT NULL,
    arrive_lab_id uuid NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    admin_labs jsonb NOT NULL,
    name text,
    meta jsonb NOT NULL,
    borrowed_devices jsonb NOT NULL,
    default_role public.user_role NOT NULL,
    CONSTRAINT users_name_check CHECK ((char_length(name) <= 256))
);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: device_kinds device_kinds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_kinds
    ADD CONSTRAINT device_kinds_pkey PRIMARY KEY (id);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- Name: expiration_extension_requests expiration_extension_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expiration_extension_requests
    ADD CONSTRAINT expiration_extension_requests_pkey PRIMARY KEY (user_id, receipt_id);


--
-- Name: inventory_assessments inventory_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_assessments
    ADD CONSTRAINT inventory_assessments_pkey PRIMARY KEY (id);


--
-- Name: labs labs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labs
    ADD CONSTRAINT labs_pkey PRIMARY KEY (id);


--
-- Name: maintenances maintenances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT maintenances_pkey PRIMARY KEY (id);


--
-- Name: receipts receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: role_histories role_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_histories
    ADD CONSTRAINT role_histories_pkey PRIMARY KEY (grantee_id, granter_id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: inventory_assessments fk_accountant_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_assessments
    ADD CONSTRAINT fk_accountant_user FOREIGN KEY (accountant_id) REFERENCES public.users(id);


--
-- Name: labs fk_admin_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labs
    ADD CONSTRAINT fk_admin_user FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- Name: devices fk_admin_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT fk_admin_user FOREIGN KEY (lab_id) REFERENCES public.labs(id);


--
-- Name: devices fk_borrow_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT fk_borrow_user FOREIGN KEY (borrower_id) REFERENCES public.users(id);


--
-- Name: receipts fk_borrow_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT fk_borrow_user FOREIGN KEY (borrower_id) REFERENCES public.users(id);


--
-- Name: device_kinds fk_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_kinds
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: receipts fk_checker_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT fk_checker_user FOREIGN KEY (checker_id) REFERENCES public.users(id);


--
-- Name: receipts fk_device; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT fk_device FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- Name: devices fk_device_kind; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT fk_device_kind FOREIGN KEY (kind) REFERENCES public.device_kinds(id);


--
-- Name: shipments fk_end_lab; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT fk_end_lab FOREIGN KEY (arrive_lab_id) REFERENCES public.labs(id);


--
-- Name: role_histories fk_grantee_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_histories
    ADD CONSTRAINT fk_grantee_user FOREIGN KEY (grantee_id) REFERENCES public.users(id);


--
-- Name: role_histories fk_granter_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_histories
    ADD CONSTRAINT fk_granter_user FOREIGN KEY (granter_id) REFERENCES public.users(id);


--
-- Name: reservations fk_lab; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_lab FOREIGN KEY (lab_id) REFERENCES public.labs(id);


--
-- Name: receipts fk_lab; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT fk_lab FOREIGN KEY (lab_id) REFERENCES public.labs(id);


--
-- Name: inventory_assessments fk_lab; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_assessments
    ADD CONSTRAINT fk_lab FOREIGN KEY (lab_id) REFERENCES public.labs(id);


--
-- Name: maintenances fk_lab; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT fk_lab FOREIGN KEY (lab_id) REFERENCES public.labs(id);


--
-- Name: maintenances fk_maintain_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT fk_maintain_user FOREIGN KEY (maintainer_id) REFERENCES public.users(id);


--
-- Name: reservations fk_owner_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_owner_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: expiration_extension_requests fk_receipt; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expiration_extension_requests
    ADD CONSTRAINT fk_receipt FOREIGN KEY (receipt_id) REFERENCES public.receipts(id);


--
-- Name: shipments fk_receiver_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT fk_receiver_user FOREIGN KEY (receiver_id) REFERENCES public.users(id);


--
-- Name: shipments fk_send_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT fk_send_user FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: shipments fk_start_lab; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT fk_start_lab FOREIGN KEY (start_lab_id) REFERENCES public.labs(id);


--
-- Name: expiration_extension_requests fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expiration_extension_requests
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20240926150407');
