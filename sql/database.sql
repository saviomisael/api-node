USE gamesdb;

CREATE TABLE genres (
  id VARCHAR(36) PRIMARY KEY NOT NULL,
  name VARCHAR(256) NOT NULL UNIQUE
);

CREATE TABLE platforms (
  id VARCHAR(36) PRIMARY KEY NOT NULL,
  name VARCHAR(256) NOT NULL UNIQUE
);

CREATE TABLE ageRatings (
  id VARCHAR(36) PRIMARY KEY NOT NULL,
  age VARCHAR(3) UNIQUE NOT NULL,
  description VARCHAR(256) NOT NULL
);
