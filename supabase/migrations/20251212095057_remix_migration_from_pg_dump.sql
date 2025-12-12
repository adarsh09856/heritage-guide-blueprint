CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'editor',
    'user'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;


--
-- Name: is_admin_or_editor(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin_or_editor(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    destination_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: destinations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.destinations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    region text NOT NULL,
    country text,
    heritage_type text NOT NULL,
    era text,
    description text,
    history text,
    images text[] DEFAULT '{}'::text[],
    coordinates jsonb,
    features text[] DEFAULT '{}'::text[],
    best_time_to_visit text,
    rating numeric(2,1),
    review_count integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    is_published boolean DEFAULT false,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT destinations_heritage_type_check CHECK ((heritage_type = ANY (ARRAY['Cultural'::text, 'Natural'::text, 'Mixed'::text])))
);


--
-- Name: downloads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.downloads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    file_url text NOT NULL,
    file_name text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    event_date timestamp with time zone,
    end_date timestamp with time zone,
    location text,
    culture_tag text,
    image_url text,
    is_published boolean DEFAULT false,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: experiences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experiences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    destination_id uuid,
    title text NOT NULL,
    description text,
    type text NOT NULL,
    duration text,
    price numeric(10,2),
    image_url text,
    is_published boolean DEFAULT false,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT experiences_type_check CHECK ((type = ANY (ARRAY['workshop'::text, 'guided-tour'::text, 'cultural-event'::text, 'culinary'::text, 'festival'::text, 'craft'::text])))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    display_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text,
    author_id uuid,
    image_url text,
    tags text[] DEFAULT '{}'::text[],
    destination_id uuid,
    is_published boolean DEFAULT false,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role DEFAULT 'user'::public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: virtual_tours; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.virtual_tours (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    destination_id uuid,
    title text NOT NULL,
    description text,
    thumbnail_url text,
    tour_url text,
    tour_type text DEFAULT '360'::text,
    duration text,
    hotspots jsonb DEFAULT '[]'::jsonb,
    is_published boolean DEFAULT false,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT virtual_tours_tour_type_check CHECK ((tour_type = ANY (ARRAY['360'::text, 'video'::text, '3d'::text])))
);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_user_id_destination_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_destination_id_key UNIQUE (user_id, destination_id);


--
-- Name: destinations destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_pkey PRIMARY KEY (id);


--
-- Name: destinations destinations_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_slug_key UNIQUE (slug);


--
-- Name: downloads downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.downloads
    ADD CONSTRAINT downloads_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: stories stories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_slug_key UNIQUE (slug);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: virtual_tours virtual_tours_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.virtual_tours
    ADD CONSTRAINT virtual_tours_pkey PRIMARY KEY (id);


--
-- Name: destinations update_destinations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: events update_events_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: experiences update_experiences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: stories update_stories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: virtual_tours update_virtual_tours_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_virtual_tours_updated_at BEFORE UPDATE ON public.virtual_tours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bookmarks bookmarks_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: destinations destinations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: downloads downloads_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.downloads
    ADD CONSTRAINT downloads_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: events events_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: experiences experiences_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: experiences experiences_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id) ON DELETE SET NULL;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: stories stories_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id);


--
-- Name: stories stories_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: virtual_tours virtual_tours_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.virtual_tours
    ADD CONSTRAINT virtual_tours_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: virtual_tours virtual_tours_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.virtual_tours
    ADD CONSTRAINT virtual_tours_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id) ON DELETE CASCADE;


--
-- Name: destinations Admins and editors can delete destinations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can delete destinations" ON public.destinations FOR DELETE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: events Admins and editors can delete events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can delete events" ON public.events FOR DELETE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: experiences Admins and editors can delete experiences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can delete experiences" ON public.experiences FOR DELETE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: stories Admins and editors can delete stories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can delete stories" ON public.stories FOR DELETE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: virtual_tours Admins and editors can delete tours; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can delete tours" ON public.virtual_tours FOR DELETE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: destinations Admins and editors can insert destinations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can insert destinations" ON public.destinations FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));


--
-- Name: events Admins and editors can insert events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can insert events" ON public.events FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));


--
-- Name: experiences Admins and editors can insert experiences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can insert experiences" ON public.experiences FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));


--
-- Name: stories Admins and editors can insert stories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can insert stories" ON public.stories FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));


--
-- Name: virtual_tours Admins and editors can insert tours; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can insert tours" ON public.virtual_tours FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));


--
-- Name: destinations Admins and editors can update destinations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can update destinations" ON public.destinations FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: events Admins and editors can update events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can update events" ON public.events FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: experiences Admins and editors can update experiences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can update experiences" ON public.experiences FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: stories Admins and editors can update stories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can update stories" ON public.stories FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: virtual_tours Admins and editors can update tours; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and editors can update tours" ON public.virtual_tours FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: downloads Authenticated users can log downloads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can log downloads" ON public.downloads FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Public profiles are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);


--
-- Name: destinations Published destinations are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Published destinations are viewable by everyone" ON public.destinations FOR SELECT USING (((is_published = true) OR public.is_admin_or_editor(auth.uid())));


--
-- Name: events Published events are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Published events are viewable by everyone" ON public.events FOR SELECT USING (((is_published = true) OR public.is_admin_or_editor(auth.uid())));


--
-- Name: experiences Published experiences are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Published experiences are viewable by everyone" ON public.experiences FOR SELECT USING (((is_published = true) OR public.is_admin_or_editor(auth.uid())));


--
-- Name: stories Published stories are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Published stories are viewable by everyone" ON public.stories FOR SELECT USING (((is_published = true) OR public.is_admin_or_editor(auth.uid())));


--
-- Name: virtual_tours Published tours are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Published tours are viewable by everyone" ON public.virtual_tours FOR SELECT USING (((is_published = true) OR public.is_admin_or_editor(auth.uid())));


--
-- Name: bookmarks Users can add own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can add own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: bookmarks Users can remove own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can remove own bookmarks" ON public.bookmarks FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: bookmarks Users can view own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: downloads Users can view own downloads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own downloads" ON public.downloads FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: bookmarks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

--
-- Name: destinations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

--
-- Name: downloads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: experiences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: stories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: virtual_tours; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.virtual_tours ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


