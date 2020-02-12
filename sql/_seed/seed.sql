BEGIN TRANSACTION;

insert into users (email, password_hash, created) values ('u@u.uuu', '$2a$11$yea1tMIcmayzjF34NueZn.Uw4A6b3lFWtmigGfRWyWqs05l7SX2K2', '2020-02-10');
insert into login (hash, email, last_login) values ('$2a$11$yea1tMIcmayzjF34NueZn.Uw4A6b3lFWtmigGfRWyWqs05l7SX2K2', 'test@test.com', '2020-02-11');

COMMIT;