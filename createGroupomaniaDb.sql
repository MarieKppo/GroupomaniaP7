SET NAMES utf8;

DROP DATABASE IF EXISTS groupomania;

CREATE DATABASE groupomania CHARACTER SET utf8 COLLATE utf84_general_ci;

CREATE USER 'adminGroupo' IDENTIFIED BY 'P7Groupomania';
GRANT ALL 
ON groupomania.*
TO 'adminP7';

USE groupomania;

CREATE TABLE users (
	userId INT NOT NULL AUTO_INCREMENT,
	lastName VARCHAR(100) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
	pseudo VARCHAR(50),
	password VARCHAR(100) NOT NULL UNIQUE,
	profilePic VARCHAR(150) NOT NULL DEFAULT 'http://localhost:3000/images/avatarDefault.jpg',
	dateCreation DATETIME NOT NULL,
	PRIMARY KEY (id)
)

CREATE TABLE posts (
	postId INT NOT NULL AUTO_INCREMENT,
	userId INT,
	urlContent VARCHAR(180),
	-- postIdComment MEDIUMINT UNSIGNED,
	textContent TEXT,
	dateCreation DATETIME NOT NULL,
	PRIMARY KEY (postId)
)

ALTER TABLE posts
ADD CONSTRAINT fk_posts_userId FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE SET NULL,
ADD CONSTRAINT fk_commentId FOREIGN KEY (postIdComment) REFERENCES posts(postId) ON DELETE CASCADE;

