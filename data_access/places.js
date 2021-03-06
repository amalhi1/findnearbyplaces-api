const { Pool } = require("pg");
require("dotenv").config();

const connectionString = `postgres://eiaifxhwtkepjb:1a17a2ee6997bc2b922510c93f73e904a8ea7395d51259ff1b9bc7e55a8e82e5@ec2-3-223-213-207.compute-1.amazonaws.com:5432/d19br5bef3gmsn`;

//postgres://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}
//postgres://eiaifxhwtkepjb:1a17a2ee6997bc2b922510c93f73e904a8ea7395d51259ff1b9bc7e55a8e82e5@ec2-3-223-213-207.compute-1.amazonaws.com:5432/d19br5bef3gmsn
const connection = {
  connectionString: process.env.DATABASEURL
    ? process.env.DATABASEURL
    : connectionString,
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
    return pool
      .query(
        "select email, password from place.customer where place.customer.email = $1",
        [email]
      )
      .then((x) => {
        if (x.rows.length >= 0) {
          if (password === x.rows[0].password) {
            valid = true;
          } else {
            valid = false;
          }
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

  place: (name, category_id, latitude, longitude, description, customer_id) => {
    if (customer_id === undefined) {
      return pool.query(
        "insert into place.location (name, latitude, longitude, description, category_id) values ($1, $2, $3, $4, $5)",
        [name, latitude, longitude, description, category_id]
      );
    } else {
      console.log(
        "insert into place.location (name, latitude, longitude, description, category_id, customer_id) values ($1, $2, $3, $4, $5, $6)",
        [name, latitude, longitude, description, category_id, customer_id]
      );
      return pool.query(
        "insert into place.location (name, latitude, longitude, description, category_id, customer_id) values ($1, $2, $3, $4, $5, $6)",
        [name, latitude, longitude, description, category_id, customer_id]
      );
    }
  },

  placeUp: (place_id, name, category_id, latitude, longitude, description) => {
    return pool.query(
      "update place.location set name = $1, latitude = $2, longitude = $3, description = $4, category_id = $5 where id = $6",
      [name, latitude, longitude, description, category_id, place_id]
    );
  },

  placeDel: (place_id) => {
    return pool.query("delete from place.location where id = $1", [place_id]);
  },

  category: (name) => {
    return pool.query("insert into place.category (name) values ($1)", [name]);
  },

  photo: (photo, place_id, review_id) => {
    console.log(review_id);
    return pool
      .query("insert into place.photo (file) values ($1)", [photo])
      .then((x) => {
        return pool
          .query(
            "select place.photo.id from place.photo where place.photo.file = $1",
            [photo]
          )
          .then((x) => {
            photo_id = x.rows[0].id;
            if (review_id === undefined || review_id === null) {
              return pool.query(
                "insert into place.place_photo (location_id, photo_id) values ($1, $2)",
                [place_id, photo_id]
              );
            } else if (place_id === undefined || place_id === null) {
              pool.query(
                "insert into place.review_photo (review_id, photo_id) values ($1, $2)",
                [review_id, photo_id]
              );
            }
          });
      });
  },

  photoUp: (photo_id, photo) => {
    return pool.query("update place.photo set file = $1 where id = $2", [
      photo,
      photo_id,
    ]);
  },

  photoDel: (photo_id) => {
    return pool
      .query("delete from place.place_photo where photo_id = $1", [photo_id])
      .then((x) => {
        return pool
          .query("delete from place.review_photo where photo_id = $1", [
            photo_id,
          ])
          .then((X) => {
            return pool.query("delete from place.photo where id = $1", [
              photo_id,
            ]);
          });
      });
  },

  review: (place_id, comment, rating) => {
    return pool.query(
      "insert into place.review (location_id, text, rating) values ($1, $2, $3)",
      [place_id, comment, rating]
    );
  },

  reviewUp: (review_id, comment, rating) => {
    return pool.query(
      "update place.review set text = $1, rating = $2 where id = $3",
      [comment, rating, review_id]
    );
  },

  reviewDel: (review_id) => {
    return pool.query("delete from place.review where id = $1", [review_id]);
  },
};

exports.places = places;
