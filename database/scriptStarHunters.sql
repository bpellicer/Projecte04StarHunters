-- M14 DUAL - UF2 Projectes
-- Projecte 04: Start Hunters
-- Authors: Bernat Pellicer & Jordi Hernandez

DROP SCHEMA IF EXISTS `starhunters`;

CREATE SCHEMA `starhunters`
    DEFAULT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci';

USE `starhunters`;

-- -------------
-- GAMES TABLE
-- -------------
CREATE TABLE `games` (
	`id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `code`      VARCHAR(5)  NOT NULL COMMENT 'Public game code',
    `date`      DATE        NOT NULL,
    
    CONSTRAINT PK_games PRIMARY KEY (`id`)
);

-- -------------
-- PLAYERS TABLE
-- -------------
CREATE TABLE `players` (
	`id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `nickname`		VARCHAR(25)     NOT NULL,
    `score`			TINYINT UNSIGNED NOT NULL COMMENT 'Number of stars',
    `game_id`       INT UNSIGNED    NOT NULL,

    CONSTRAINT PK_players PRIMARY KEY (`id`),
    CONSTRAINT FK_players_games FOREIGN KEY (`game_id`)
    	REFERENCES `games` (`id`)
            ON DELETE CASCADE
);