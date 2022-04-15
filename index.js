const { places } = require("./data_access/places");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT | 4002;

app.get(
  "/search/:search_term/:user_location:/radius_filter:/maximum_results_to_return/:category_filter/:sort/:distance",
  (request, response) => {
    console.log("HELLO");
    let search_term = request.params.search_term;
    let user_location = request.params.user_location;
    let radius_filter = request.params.radius_filter;
    let maximum_results_to_return = request.params.maximum_results_to_return;
    let category_filter = request.params.category_filter;
    let sort = request.params.sort;
    let distance = request.params.distance;
    places
      .search(
        search_term,
        user_location,
        radius_filter,
        maximum_results_to_return,
        category_filter,
        sort,
        distance
      )
      .then((x) => {
        if (x.length > 0) {
          response.status(200).json({ done: false, message: x });
        } else {
          response
            .status(404)
            .json({ done: false, message: "No entries met criteria" });
        }
      })
      .catch((e) => {
        console.log(e);
        response
          .status(500)
          .json({ done: false, message: "Something went wrong" });
      });
  }
);

app.post("/customer", (request, response) => {
  let email = request.body.email;
  let password = request.body.password;
  places
    .customer(email, password)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Customer succesfully added" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: true, message: "Customer not added due to error" });
    });
});

app.post("/login", (request, response) => {
  let email = request.body.email;
  let password = request.body.password;
  results = places
    .login(email, password)
    .then((x) => {
      if (x.valid) {
        response
          .status(200)
          .json({ done: true, message: "The customer logged in successfully" });
      } else {
        response.status(401).json({ done: false, message: x.message });
      }
    })
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Something went wrong" });
    });
});

app.post("/place", (request, response) => {
  let name = request.body.name;
  let category_id = request.body.category_id;
  let latitude = request.body.latitude;
  let longitude = request.body.longitude;
  let description = request.body.description;
  places
    .customer(name, category_id, latitude, longitude, description)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Place succesfully added" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: true, message: "Place not added due to error" });
    });
});

app.post("/category", (request, response) => {
  let name = request.body.name;
  places
    .category(name)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Category succesfully added" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: true, message: "Category not added due to error" });
    });
});

app.post("/photo", (request, response) => {
  let photo = request.body.photo;
  let place_id = request.body.place_id;
  let review_id = request.body.review_id;
  places
    .photo(photo, place_id, review_id)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Category succesfully added" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: true, message: "Category not added due to error" });
    });
});

app.post("/review", (request, response) => {
  let place_id = request.body.place_id;
  let comment = request.body.comment;
  let rating = request.body.rating;
  places
    .review(place_id, comment, rating)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Category succesfully added" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: true, message: "Category not added due to error" });
    });
});

app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
