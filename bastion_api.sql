--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
-- Dumped by pg_dump version 14.0

-- Started on 2021-12-13 15:18:49 CET

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 24577)
-- Name: cron; Type: TABLE; Schema: public; Owner: antoinepaul
--

CREATE TABLE public.cron (
    id integer NOT NULL,
    cron_id integer NOT NULL,
    cron_done boolean NOT NULL,
    cron_db_user_id text NOT NULL,
    db_done boolean NOT NULL
);


ALTER TABLE public.cron OWNER TO antoinepaul;

--
-- TOC entry 210 (class 1259 OID 24582)
-- Name: db; Type: TABLE; Schema: public; Owner: antoinepaul
--

CREATE TABLE public.db (
    db_name character varying(255),
    db_path character varying(255),
    id integer NOT NULL,
    db_deleted boolean DEFAULT false
);


ALTER TABLE public.db OWNER TO antoinepaul;

--
-- TOC entry 217 (class 1259 OID 24647)
-- Name: db_id_seq; Type: SEQUENCE; Schema: public; Owner: antoinepaul
--

CREATE SEQUENCE public.db_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.db_id_seq OWNER TO antoinepaul;

--
-- TOC entry 3354 (class 0 OID 0)
-- Dependencies: 217
-- Name: db_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antoinepaul
--

ALTER SEQUENCE public.db_id_seq OWNED BY public.db.id;


--
-- TOC entry 211 (class 1259 OID 24587)
-- Name: logdb; Type: TABLE; Schema: public; Owner: antoinepaul
--

CREATE TABLE public.logdb (
    log_db_user_id integer NOT NULL,
    log_cron_finished boolean,
    log_user_id character varying,
    log_date bigint,
    log_duration bigint,
    log_id integer NOT NULL
);


ALTER TABLE public.logdb OWNER TO antoinepaul;

--
-- TOC entry 216 (class 1259 OID 24628)
-- Name: log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: antoinepaul
--

CREATE SEQUENCE public.log_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.log_log_id_seq OWNER TO antoinepaul;

--
-- TOC entry 3355 (class 0 OID 0)
-- Dependencies: 216
-- Name: log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antoinepaul
--

ALTER SEQUENCE public.log_log_id_seq OWNED BY public.logdb.log_id;


--
-- TOC entry 212 (class 1259 OID 24590)
-- Name: user_db; Type: TABLE; Schema: public; Owner: antoinepaul
--

CREATE TABLE public.user_db (
    db_id integer,
    db_user_name character varying(255),
    db_user_password character varying(255),
    db_user_role character varying(255),
    id integer NOT NULL,
    db_deleted boolean DEFAULT false
);


ALTER TABLE public.user_db OWNER TO antoinepaul;

--
-- TOC entry 218 (class 1259 OID 24654)
-- Name: user_db_id_seq; Type: SEQUENCE; Schema: public; Owner: antoinepaul
--

CREATE SEQUENCE public.user_db_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_db_id_seq OWNER TO antoinepaul;

--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_db_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antoinepaul
--

ALTER SEQUENCE public.user_db_id_seq OWNED BY public.user_db.id;


--
-- TOC entry 213 (class 1259 OID 24595)
-- Name: user_rights; Type: TABLE; Schema: public; Owner: antoinepaul
--

CREATE TABLE public.user_rights (
    right_user_id integer,
    right_role character varying(255),
    right_db_id integer,
    right_expire bigint DEFAULT 0,
    right_deleted boolean DEFAULT false,
    right_id integer NOT NULL
);


ALTER TABLE public.user_rights OWNER TO antoinepaul;

--
-- TOC entry 219 (class 1259 OID 24672)
-- Name: user_rights_right_id_seq; Type: SEQUENCE; Schema: public; Owner: antoinepaul
--

CREATE SEQUENCE public.user_rights_right_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_rights_right_id_seq OWNER TO antoinepaul;

--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_rights_right_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antoinepaul
--

ALTER SEQUENCE public.user_rights_right_id_seq OWNED BY public.user_rights.right_id;


--
-- TOC entry 214 (class 1259 OID 24600)
-- Name: users; Type: TABLE; Schema: public; Owner: antoinepaul
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    user_mail character varying(255),
    user_google_id character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    user_is_admin boolean DEFAULT false,
    user_deleted boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO antoinepaul;

--
-- TOC entry 215 (class 1259 OID 24605)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: antoinepaul
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO antoinepaul;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antoinepaul
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3191 (class 2604 OID 24648)
-- Name: db id; Type: DEFAULT; Schema: public; Owner: antoinepaul
--

ALTER TABLE ONLY public.db ALTER COLUMN id SET DEFAULT nextval('public.db_id_seq'::regclass);


--
-- TOC entry 3193 (class 2604 OID 24629)
-- Name: logdb log_id; Type: DEFAULT; Schema: public; Owner: antoinepaul
--

ALTER TABLE ONLY public.logdb ALTER COLUMN log_id SET DEFAULT nextval('public.log_log_id_seq'::regclass);


--
-- TOC entry 3194 (class 2604 OID 24655)
-- Name: user_db id; Type: DEFAULT; Schema: public; Owner: antoinepaul
--

ALTER TABLE ONLY public.user_db ALTER COLUMN id SET DEFAULT nextval('public.user_db_id_seq'::regclass);


--
-- TOC entry 3198 (class 2604 OID 24673)
-- Name: user_rights right_id; Type: DEFAULT; Schema: public; Owner: antoinepaul
--

ALTER TABLE ONLY public.user_rights ALTER COLUMN right_id SET DEFAULT nextval('public.user_rights_right_id_seq'::regclass);


--
-- TOC entry 3199 (class 2604 OID 24606)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: antoinepaul
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3203 (class 2606 OID 24608)
-- Name: cron cron_pkey; Type: CONSTRAINT; Schema: public; Owner: antoinepaul
--

ALTER TABLE ONLY public.cron
    ADD CONSTRAINT cron_pkey PRIMARY KEY (id);


--
-- TOC entry 3205 (class 2606 OID 24662)
-- Name: user_db user_db_pkey; Type: CONSTRAINT; Schema: public; Owner: antoinepaul
--

ALTER TABLE ONLY public.user_db
    ADD CONSTRAINT user_db_pkey PRIMARY KEY (id);


--
-- TOC entry 3207 (class 2606 OID 24678)
-- Name: user_rights user_rights_pkey; Type: CONSTRAINT; Schema: public; Owner: antoinepaul
--

ALTER TABLE ONLY public.user_rights
    ADD CONSTRAINT user_rights_pkey PRIMARY KEY (right_id);


--
-- TOC entry 3209 (class 2606 OID 24618)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: antoinepaul
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


-- Completed on 2021-12-13 15:18:51 CET

--
-- PostgreSQL database dump complete
--

