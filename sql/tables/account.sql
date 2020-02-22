BEGIN TRANSACTION;
CREATE TABLE account (
  id UUID NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role text NOT NULL,
  created TIMESTAMP NOT NULL
);
COMMIT;

