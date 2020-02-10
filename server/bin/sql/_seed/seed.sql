BEGIN TRANSACTION;

insert into users (email, created) values ('test@test.com', '2020-02-10');
insert into login (hash, email, last_login) values ('s7jdOus0audu0ahHDHfhDSHhfdhajJ7hHggmJ&mMgG/jjJgHoaHbMqn0M1as', 'test@test.com', '2020-02-11');

COMMIT;