-- Deploy fresh db tables

\i '/docker-entrypoint-initdb.d/tables/account.sql'

\i '/docker-entrypoint-initdb.d/_seed/seed.sql'