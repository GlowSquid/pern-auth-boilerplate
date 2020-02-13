BEGIN TRANSACTION;

insert into account (id, email, password_hash, role, created) values ('fdda765f-fc57-5604-a269-52a7df8164ec', 'u@u.uuu', '$2a$11$yea1tMIcmayzjF34NueZn.Uw4A6b3lFWtmigGfRWyWqs05l7SX2K2', 'user', '2020-02-10');

COMMIT;