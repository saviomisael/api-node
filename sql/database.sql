USE gamesdb;

ALTER DATABASE gamesdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
