DROP ROLE IF EXISTS root;
CREATE ROLE root WITH LOGIN PASSWORD '133742';
CREATE DATABASE root;
GRANT ALL PRIVILEGES ON DATABASE root TO root;

DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles 
      WHERE  rolname = 'ipman') THEN

      CREATE USER ipman WITH PASSWORD '133742';
   ELSE
      ALTER USER ipman WITH PASSWORD '133742';
   END IF;
END
$do$;

CREATE DATABASE ft_transcendence;
GRANT ALL PRIVILEGES ON DATABASE ft_transcendence TO ipman;
\c ft_transcendence
GRANT ALL PRIVILEGES ON SCHEMA public TO ipman;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ipman;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ipman;
