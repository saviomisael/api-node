USE gamesdb;

ALTER DATABASE gamesdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE games (
  id VARCHAR(36) PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  releaseDate DATE NOT NULL,
  fkAgeRating VARCHAR(36) NOT NULL,
  FOREIGN KEY (fkAgeRating) REFERENCES ageRatings(id),
  FULLTEXT idx_g_name (name)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE games_genres (
  fk_genre VARCHAR(36) NOT NULL,
  fk_game VARCHAR(36) NOT NULL,
  FOREIGN KEY (fk_genre) REFERENCES genres(id),
  FOREIGN KEY (fk_game) REFERENCES games(id),
  PRIMARY KEY (fk_genre, fk_game)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE games_platforms (
  fk_platform VARCHAR(36) NOT NULL,
  fk_game VARCHAR(36) NOT NULL,
  FOREIGN KEY (fk_platform) REFERENCES platforms(id),
  FOREIGN KEY (fk_game) REFERENCES games(id),
  PRIMARY KEY (fk_platform, fk_game)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY NOT NULL,
  description TEXT NOT NULL,
  stars SMALLINT NOT NULL,
  fk_game VARCHAR(36) NOT NULL,
  fk_reviewer VARCHAR(36) NOT NULL,
  FOREIGN KEY (fk_game) REFERENCES games(id),
  FOREIGN KEY (fk_reviewer) REFERENCES reviewers(id)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
