--
-- PostgreSQL database cluster dump
--

\restrict Xf7UdSufw6bTUtcI47i7HruRZmDQqIYvLUnxpOXFLIlLwFCbwUQ88OgihVeKNlS

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE root;
ALTER ROLE root WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:anFXEIV1S+uL+bzio/oZ5Q==$Y7q6s4f9lpH1q3T9wAB4uQO5fExCHWPHetMe7JahFs4=:NRS+IenYt8nzbPyJ0kEFdZmhzZaUtiplj010Kb1yMpc=';

--
-- User Configurations
--








\unrestrict Xf7UdSufw6bTUtcI47i7HruRZmDQqIYvLUnxpOXFLIlLwFCbwUQ88OgihVeKNlS

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict Hbtnrd8IT1hnPWaQxWN6N7SyW6WftylT1icSzOLz63Z8LLdVESjIxRdPBkuZ3l3

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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
-- PostgreSQL database dump complete
--

\unrestrict Hbtnrd8IT1hnPWaQxWN6N7SyW6WftylT1icSzOLz63Z8LLdVESjIxRdPBkuZ3l3

--
-- Database "grades_management" dump
--

--
-- PostgreSQL database dump
--

\restrict IcwzK4T64QaehIxtiohWS73RojQgwRAKIacecyJZBYHld9P4KP8VbbyNzthGI1k

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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
-- Name: grades_management; Type: DATABASE; Schema: -; Owner: root
--

CREATE DATABASE grades_management WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE grades_management OWNER TO root;

\unrestrict IcwzK4T64QaehIxtiohWS73RojQgwRAKIacecyJZBYHld9P4KP8VbbyNzthGI1k
\connect grades_management
\restrict IcwzK4T64QaehIxtiohWS73RojQgwRAKIacecyJZBYHld9P4KP8VbbyNzthGI1k

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
-- PostgreSQL database dump complete
--

\unrestrict IcwzK4T64QaehIxtiohWS73RojQgwRAKIacecyJZBYHld9P4KP8VbbyNzthGI1k

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict 1Ci9K1fB1XM2Wnx7jhsZqZLbtpsYy9yyTxfmFge3rpx68Io1woJNscfCNTCBjj4

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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
-- PostgreSQL database dump complete
--

\unrestrict 1Ci9K1fB1XM2Wnx7jhsZqZLbtpsYy9yyTxfmFge3rpx68Io1woJNscfCNTCBjj4

--
-- PostgreSQL database cluster dump complete
--

