const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const connectionString = `postgres://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`;

//postgres://eiaifxhwtkepjb:1a17a2ee6997bc2b922510c93f73e904a8ea7395d51259ff1b9bc7e55a8e82e5@ec2-3-223-213-207.compute-1.amazonaws.com:5432/d19br5bef3gmsn
const connection = {
  connectionsString:
    "postgres://eiaifxhwtkepjb:1a17a2ee6997bc2b922510c93f73e904a8ea7395d51259ff1b9bc7e55a8e82e5@ec2-3-223-213-207.compute-1.amazonaws.com:5432/d19br5bef3gmsn",
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(connection);

let places = {
  search: (
    search_term,
    user_location,
    radius_filter,
    maximum_results_to_return,
    category_filter,
    sort,
    distance
  ) => {
    pool
      .query(
        "select name, latitude, longitude, category_id from place.location where place.location.description like %$1% and place.location.category_id = $2 ",
        [search_term, category_filter]
      )
      .then((x) => {
        console.log(x);
        return x.rows;
      })
      .catch((e) => {
        console.log(e);
        return { done: false, message: "Something went wrong" };
      });
  },

  customer: (email, password) => {
    return pool.query(
      "insert into place.customer (email, password) values ($1, $2)",
      [email, password]
    );
  },

  login: (email, password) => {
    pool
      .query(
        "select email, password from place.customer where place.customer.email = $1",
        [email]
      )
      .then((x) => {
        if (x.rows.length == 1) {
          let valid = bcrypt.compareSync(password, x.rows[0].password);
          if (valid) {
            return { valid: true };
          } else {
            return { valid: false, message: "Credentials are not valid" };
          }
        } else {
          return { valid: false, message: "Email not found" };
        }
      })
      .catch((e) => {
        console.log(e);
        return { valid: false, message: "Something went wrong" };
      });
  },

  place: (name, category_id, latitude, longitude, description) => {
    return pool.query(
      "insert into place.locations (name, latitude, longitude, description, category_id) values ($1, $2, $3, $4, $5)",
      [name, latitude, longitude, description, category_id]
    );
  },

  category: (name) => {
    return pool.query("insert into place.category (name) values ($1)", [name]);
  },

  photo: (photo, place_id, review_id) => {
    pool.query("insert into place.photo (file) values ($1)", [photo]);
    let photo_id = pool.query(
      "select place.photo.id from place.photo where place.photo.fiiel = $1",
      [photo]
    );
    if (review_id === NULL) {
      return pool.query(
        "insert into place.place_photo (location_id, photo_id)",
        [place_id, photo_id]
      );
    } else if (place_id === NULL) {
      return pool.query(
        "insert into place.review_photo (review_id, photo_id)",
        [review_id, photo_id]
      );
    }
  },

  review: (place_id, comment, rating) => {
    return pool.query(
      "insert into place.review (location_id, text, rating) values ($1, $2, $3)",
      [place_id, comment, rating]
    );
  },
};

exports.places = places;
