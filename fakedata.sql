
create database api_security;

use api_security;

create table users (
    id int auto_increment primary key,
    username varchar(50) not null unique,
    password varchar(50) not null,
    fname varchar(50) not null,
    lname varchar(50) not null
);


insert into users (username, password, fname, lname)
values 
('averageKid1998', 'super-secret-pw', 'Timmy', 'Turner'),
('spongebob01', 'pineapple123', 'SpongeBob', 'SquarePants'),
('patrickStar02', 'rockdweller88', 'Patrick', 'Star'),
('dannyPhantom03', 'ghostly999', 'Danny', 'Phantom'),
('jimmyNeutron05', 'brainblast', 'Jimmy', 'Neutron'),
('samuraiJack06', 'timeTravel', 'Samurai', 'Jack'),
('dexterLab09', 'mandarkRival', 'Dexter', 'Genius'),
('courageDog11', 'stupidDog', 'Courage', 'Dog'),
('mysteryMachine10', 'scoobySnax', 'Scooby', 'Doo'),
('picnicBear99', 'heyBooBoo', 'Yogi', 'Bear');

create table documents (
    id int auto_increment primary key,
    data json not null,
    date_created timestamp default current_timestamp
);

insert into documents (data)
values 
('{"title": "The Fairly OddParents", "description": "A young boy named Timmy Turner has two fairy godparents, Cosmo and Wanda, who grant his every wish."}'),
('{"title": "SpongeBob SquarePants", "description": "The misadventures of a talking sea sponge who works at a fast food restaurant, attends a boating school, and lives in a pineapple."}'),
('{"title": "Danny Phantom", "description": "A teenage boy named Danny Fenton, who, after an accident with an unpredictable portal between the human world and the supernatural Ghost Zone, becomes a human-ghost hybrid and takes on the task of saving his town (and the world) from subsequent ghost attacks using an evolving variety of supernatural powers."}'),
('{"title": "Jimmy Neutron", "description": "The adventures of an inventive young scientist named Jimmy Neutron, who creates gadgets to improve his everyday life."}'),
('{"title": "Samurai Jack", "description": "A samurai sent through time fights to return home and save the world."}');

create table example (
    id int auto_increment primary key
);

insert into example values (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);