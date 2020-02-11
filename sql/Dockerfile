FROM postgres:latest

ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /_seed/ /docker-entrypoint-initdb.d/_seed/
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/
