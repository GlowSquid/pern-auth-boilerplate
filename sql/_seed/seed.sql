BEGIN TRANSACTION;

insert into account (id, email, password_hash, role, created) values ('fe0cbbe5-d2af-4e0f-ac9e-6c358f3078ce', 'u@u.uuu', '$2a$11$X7FVZEk1UybeTVvGK3F5fOzl8TII6gzW9VJM3L/hUDaKc56q1OMhy', 'user', '2020-02-10');

COMMIT;