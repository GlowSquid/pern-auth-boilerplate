BEGIN TRANSACTION;
CREATE TABLE account (
  id serial PRIMARY KEY, -- UUID
  email text UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL, -- CHARACTER(64)
  role text NOT NULL,
  created TIMESTAMP NOT NULL
);
COMMIT;

