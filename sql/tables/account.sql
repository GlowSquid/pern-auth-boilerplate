BEGIN TRANSACTION;
CREATE TABLE account (
  id UUID NOT NULL,  -- id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL, -- CHARACTER(64) 61?
  role text NOT NULL,
  created TIMESTAMP NOT NULL
);
COMMIT;

