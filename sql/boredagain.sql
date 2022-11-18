\echo 'Delete and recreate bored db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE bored;
CREATE DATABASE bored;
\connect bored

\i bored-schema.sql
\i bored-seed.sql

\echo 'Delete and recreate bored_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE bored_test;
CREATE DATABASE bored_test;
\connect bored_test

\i bored-schema.sql
\i bored-seed.sql