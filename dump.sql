--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11
-- Dumped by pg_dump version 16.5 (Homebrew)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: GameStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."GameStatus" AS ENUM (
    'OPEN',
    'FULL',
    'CANCELLED',
    'COMPLETED'
);


--
-- Name: SignupStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SignupStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED'
);


--
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED'
);


--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TransactionType" AS ENUM (
    'DEPOSIT',
    'WITHDRAWAL',
    'GAME_PAYMENT'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Game; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Game" (
    id text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    location text NOT NULL,
    "maxPlayers" integer DEFAULT 18 NOT NULL,
    "pricePerPerson" double precision DEFAULT 35 NOT NULL,
    status public."GameStatus" DEFAULT 'OPEN'::public."GameStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: GameSignup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GameSignup" (
    id text NOT NULL,
    "gameId" text NOT NULL,
    "userId" text NOT NULL,
    status public."SignupStatus" DEFAULT 'PENDING'::public."SignupStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount double precision NOT NULL,
    type public."TransactionType" NOT NULL,
    status public."TransactionStatus" DEFAULT 'PENDING'::public."TransactionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    login text NOT NULL,
    password text NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Game" (id, date, location, "maxPlayers", "pricePerPerson", status, "createdAt", "updatedAt") VALUES ('cm62tgpc100014ni72n0wfmu3', '2025-01-19 12:30:00', 'Hala sportowa UWr', 18, 35, 'COMPLETED', '2025-01-18 23:25:24.673', '2025-01-19 23:37:39.281');
INSERT INTO public."Game" (id, date, location, "maxPlayers", "pricePerPerson", status, "createdAt", "updatedAt") VALUES ('cm64w8aeu000x4nffcpo8gid5', '2025-01-26 13:00:00', 'Hala sportowa UWr', 6, 35, 'COMPLETED', '2025-01-20 10:18:23.277', '2025-01-20 10:20:49.463');


--
-- Data for Name: GameSignup; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."GameSignup" (id, "gameId", "userId", status, "createdAt") VALUES ('cm648vvi1000h4nffc1511048', 'cm62tgpc100014ni72n0wfmu3', 'cm647mfs800024nffhd7gb822', 'CONFIRMED', '2025-01-19 23:24:52.922');
INSERT INTO public."GameSignup" (id, "gameId", "userId", status, "createdAt") VALUES ('cm648y325000l4nffyzmtwhr0', 'cm62tgpc100014ni72n0wfmu3', 'cm647w28400054nffyznaei46', 'CONFIRMED', '2025-01-19 23:26:36.03');
INSERT INTO public."GameSignup" (id, "gameId", "userId", status, "createdAt") VALUES ('cm64wao93001c4nffdzyf9t91', 'cm64w8aeu000x4nffcpo8gid5', 'cm64w8w6c000y4nffr7sn2acb', 'CONFIRMED', '2025-01-20 10:20:14.535');
INSERT INTO public."GameSignup" (id, "gameId", "userId", status, "createdAt") VALUES ('cm64wb28e001e4nffr81h81af', 'cm64w8aeu000x4nffcpo8gid5', 'cm647mfs800024nffhd7gb822', 'CONFIRMED', '2025-01-20 10:20:32.655');


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Transaction" (id, "userId", amount, type, status, "createdAt") VALUES ('cm64w9tch00104nffn7tjrp27', 'cm64w8w6c000y4nffr7sn2acb', 100, 'DEPOSIT', 'COMPLETED', '2025-01-20 10:19:34.481');
INSERT INTO public."Transaction" (id, "userId", amount, type, status, "createdAt") VALUES ('cm64w9ybs00124nff1g9zqlkw', 'cm647w28400054nffyznaei46', 35, 'DEPOSIT', 'COMPLETED', '2025-01-20 10:19:40.937');
INSERT INTO public."Transaction" (id, "userId", amount, type, status, "createdAt") VALUES ('cm64wa11200144nffcbbmphre', 'cm647mfs800024nffhd7gb822', 50, 'DEPOSIT', 'COMPLETED', '2025-01-20 10:19:44.439');
INSERT INTO public."Transaction" (id, "userId", amount, type, status, "createdAt") VALUES ('cm64wa3at00164nffjlhcjog8', 'cm62whs2m00014nkeq3z5oaiu', 100, 'DEPOSIT', 'COMPLETED', '2025-01-20 10:19:47.381');
INSERT INTO public."Transaction" (id, "userId", amount, type, status, "createdAt") VALUES ('cm64wa5xx00184nffyymdtnyt', 'cm62uspyl00004nkebdk5ap48', 200, 'DEPOSIT', 'COMPLETED', '2025-01-20 10:19:50.805');
INSERT INTO public."Transaction" (id, "userId", amount, type, status, "createdAt") VALUES ('cm64wbyqz001g4nff6x4s0cgg', 'cm64w8w6c000y4nffr7sn2acb', -37, 'GAME_PAYMENT', 'COMPLETED', '2025-01-20 10:21:14.795');
INSERT INTO public."Transaction" (id, "userId", amount, type, status, "createdAt") VALUES ('cm64wbyrc001i4nffp3sjb3xy', 'cm647mfs800024nffhd7gb822', -37, 'GAME_PAYMENT', 'COMPLETED', '2025-01-20 10:21:14.808');


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."User" (id, name, login, password, balance, "isAdmin", "createdAt", "updatedAt") VALUES ('cm62tgpbp00004ni7jufbzeqf', 'Admin User', 'admin', '$2a$12$.EKKHu7TatlHUlSWGPqdRuQGmtVTCeUvQZ3myK9r4SNMNcH8pbKS2', 0, true, '2025-01-18 23:25:24.661', '2025-01-20 10:16:13.539');
INSERT INTO public."User" (id, name, login, password, balance, "isAdmin", "createdAt", "updatedAt") VALUES ('cm647w28400054nffyznaei46', 'User 4', 'user4', '$2a$12$Vpp.47E.0LHtteeD1bxLreyfuKK9PgYWFut7wtjvNjpZWeVGPjOCG', 35, false, '2025-01-19 22:57:02.02', '2025-01-20 10:19:40.943');
INSERT INTO public."User" (id, name, login, password, balance, "isAdmin", "createdAt", "updatedAt") VALUES ('cm62whs2m00014nkeq3z5oaiu', 'User 2', 'user2', '$2a$12$.EKKHu7TatlHUlSWGPqdRuQGmtVTCeUvQZ3myK9r4SNMNcH8pbKS2', 100, false, '2025-01-19 00:50:13.726', '2025-01-20 10:19:47.385');
INSERT INTO public."User" (id, name, login, password, balance, "isAdmin", "createdAt", "updatedAt") VALUES ('cm62uspyl00004nkebdk5ap48', 'User 1', 'user1', '$2a$12$.EKKHu7TatlHUlSWGPqdRuQGmtVTCeUvQZ3myK9r4SNMNcH8pbKS2', 200, false, '2025-01-19 00:02:44.971', '2025-01-20 10:19:50.809');
INSERT INTO public."User" (id, name, login, password, balance, "isAdmin", "createdAt", "updatedAt") VALUES ('cm64w8w6c000y4nffr7sn2acb', 'User 5', 'user5', '$2a$12$UQghduMBHniwLi257BcJYuzOd2yLl3nTxShoA16AC7ygD9GlYv84G', 63, false, '2025-01-20 10:18:51.492', '2025-01-20 10:21:14.801');
INSERT INTO public."User" (id, name, login, password, balance, "isAdmin", "createdAt", "updatedAt") VALUES ('cm647mfs800024nffhd7gb822', 'User 3', 'user3', '$2a$12$Z.ldY67LJns1dR.AMWvTge2UkFpGXGiWbmbzU8dZwCiCsBwk9Ca.m', 13, false, '2025-01-19 22:49:33.032', '2025-01-20 10:21:14.81');


--
-- Name: GameSignup GameSignup_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GameSignup"
    ADD CONSTRAINT "GameSignup_pkey" PRIMARY KEY (id);


--
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: GameSignup_gameId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "GameSignup_gameId_userId_key" ON public."GameSignup" USING btree ("gameId", "userId");


--
-- Name: User_login_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_login_key" ON public."User" USING btree (login);


--
-- Name: GameSignup GameSignup_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GameSignup"
    ADD CONSTRAINT "GameSignup_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GameSignup GameSignup_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GameSignup"
    ADD CONSTRAINT "GameSignup_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

