-- Deploy fresh db tables

-- \i executes script
\i '/docker-entrypoint-initdb.d/tables/users.sql'

\i '/docker-entrypoint-initdb.d/tables/login.sql'

\i '/docker-entrypoint-initdb.d/_seed/seed.sql'