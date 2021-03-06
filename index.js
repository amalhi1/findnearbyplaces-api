const { places } = require("./data_access/places");
const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const req = require("express/lib/request");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bp.urlencoded({ extended: true }));

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
          response.status(200).json({ done: true, message: x });
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
  //WORKS
  let email = request.body.email;
  let password = request.body.password;
  console.log(email);
  console.log(password);
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
        .json({ done: false, message: "Customer not added due to error" });
    });
});

app.post("/login", (request, response) => {
  //WORKS
  let email = request.body.email;
  let password = request.body.password;
  console.log(email);
  console.log(password);
  places
    .login(email, password)
    .then((x) => {
      console.log(x);
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
  //WORKS
  console.log(request.body);
  let name = request.body.name;
  let category_id = request.body.category_id;
  let latitude = request.body.latitude;
  let longitude = request.body.longitude;
  let description = request.body.description;
  let customer_id = request.body.customer_id;
  places
    .place(name, category_id, latitude, longitude, description, customer_id)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Place succesfully added" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Place not added due to error" });
    });
});

app.post("/category", (request, response) => {
  //WORKS
  let name = request.body.name;
  console.log(name);
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
        .json({ done: false, message: "Category not added due to error" });
    });
});

app.post("/photo", (request, response) => {
  //WORKS
  let photo = request.body.photo;
  console.log(request.body);
  let place_id = request.body.place_id;
  let review_id = request.body.review_id;
  if (place_id === "" && review_id === "") {
    response
      .status(200)
      .json({ done: false, message: "Both id fields are empty" });
  } else if (place_id == "") {
    place_id = undefined;
  } else if (review_id == "") {
    review_id = undefined;
  }
  places
    .photo(photo, place_id, review_id)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Photo succesfully added" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Photo not added due to error" });
    });
});

app.post("/review", (request, response) => {
  //WORKS
  let place_id = request.body.place_id;
  let comment = request.body.comment;
  let rating = request.body.rating;
  places
    .review(place_id, comment, rating)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Review succesfully added" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Review not added due to error" });
    });
});

app.put("/place", (request, response) => {
  //WORKS
  let place_id = request.body.place_id;
  let name = request.body.name;
  let category_id = request.body.category_id;
  let latitude = request.body.latitude;
  let longitude = request.body.longitude;
  let description = request.body.description;
  places
    .placeUp(place_id, name, category_id, latitude, longitude, description)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Place succesfully updated" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Place not updated due to error" });
    });
});

app.delete("/place", (request, response) => {
  //WORKS
  let place_id = request.body.place_id;
  places
    .placeDel(place_id)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Place succesfully deleted" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Place not deleted due to error" });
    });
});

app.put("/review", (request, response) => {
  //WORKS
  let review_id = request.body.review_id;
  let comment = request.body.comment;
  let rating = request.body.rating;
  places
    .reviewUp(review_id, comment, rating)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Review succesfully updated" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Review not updated due to error" });
    });
});

app.delete("/review", (request, response) => {
  //WORKS
  let review_id = request.body.review_id;
  places
    .reviewDel(review_id)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Review succesfully deleted" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Review not deleted due to error" });
    });
});

app.put("/photo", (request, response) => {
  //WORKS
  let photo_id = request.body.photo_id;
  let photo = request.body.photo;
  places
    .photoUp(photo_id, photo)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Photo succesfully updated" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Photo not updated due to error" });
    });
});

app.delete("/photo", (request, response) => {
  //WORKS
  let photo_id = request.body.photo_id;
  places
    .photoDel(photo_id)
    .then((x) =>
      response
        .status(200)
        .json({ done: true, message: "Photo succesfully deleted" })
    )
    .catch((e) => {
      console.log(e);
      response
        .status(500)
        .json({ done: false, message: "Photo not deleted due to error" });
    });
});

app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
