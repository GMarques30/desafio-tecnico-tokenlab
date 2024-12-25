DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS invitees;

CREATE TABLE accounts (
  account_id UUID PRIMARY KEY UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT NOT NULL
);

CREATE TABLE events (
  event_id UUID PRIMARY KEY UNIQUE NOT NULL,
  description TEXT NOT NULL,
  account_id UUID NOT NULL,
  started_at DATE NOT NULL,
  finished_at DATE NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE invitees (
  invitee_id UUID PRIMARY KEY UNIQUE NOT NULL,
  event_id UUID NOT NULL,
  guest_id UUID NOT NULL,
  invitee_status TEXT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (guest_id) REFERENCES accounts(account_id)
);
