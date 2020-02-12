-- Deploy fresh db tables

-- \i executes script
\i '/docker-entrypoint-initdb.d/tables/account.sql'

\i '/docker-entrypoint-initdb.d/_seed/seed.sql'