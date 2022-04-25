create schema if not exists place;

drop table if exists place.place_photo CASCADE;
drop table if exists place.review_photo CASCADE;
drop table if exists place.review CASCADE;
drop table if exists place.photo CASCADE;
drop table if exists place.category CASCADE;
drop table if exists place.customer CASCADE;
drop table if exists place.location CASCADE;

create table place.category
(
	id integer primary key unique,
	name varchar(30) not null
);

create table place.customer
(
	id bigserial primary key unique,
	email varchar(256) not null,
	password varchar(8) not null
);

create table place.location
(
	id bigserial primary key unique,
	name varchar(256) not null,
	latitude float8 not null,
	longitude float8 not null,
	description varchar(512) not null,
	category_id integer references place.category(id),
	customer_id int4 references place.customer(id)
);

create table place.review
(
	location_id bigserial references place.location(id),
	customer_id int4 references place.customer(id),
	id int4 primary key unique,
	text varchar(512) not null,
	rating int not null
);

create table place.photo
(
	id bigserial primary key unique,
	file bytea not null
);

create table place.place_photo
(
	location_id bigserial references place.location(id),
	photo_id bigserial references place.photo(id)
);

create table place.review_photo
(
	review_id bigserial references place.review(id),
	photo_id bigserial references place.photo(id)
);