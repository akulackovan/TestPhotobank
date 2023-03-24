import {
  factory,
  primaryKey,
  nullable,
  oneOf,
  manyOf,
  drop,
} from "@mswjs/data";
import { faker } from "@faker-js/faker";

export const db = factory({
  // Create a "Post" model,
  post: {
    id: primaryKey(faker.datatype.uuid),
    author: oneOf("user"),
    city: oneOf("city"),
    image: (String) => "photo.png",
    test: nullable(String),
    views: (Number) => 0,
    likes: (Number) => 0,
    comments: manyOf("comments"),
  },

  comments: {
    id: primaryKey(faker.datatype.uuid),
    author: oneOf("user"),
    comment: String,
  },

  city: {
    id: primaryKey(faker.datatype.uuid),
    city: String,
  },

  user: {
    id: primaryKey(faker.datatype.uuid),
    username: String,
    password: String,
    text: nullable(String),
    city: oneOf("city"),
    image: (String) => "image.png",
    typeImg: (String) => "image/png",
    likes: manyOf("post"),
    user: manyOf("user"),
  },
});

let city;
let city2;
let user;

export const createCity = () => {
  city = db.city.create({
    city: "Москва",
  });
  city2 = db.city.create({
    city: "Красноярск",
  });
};

export const createUsers = () => {
  user = db.user.create({
    username: "test",
    password: "$2a$10$Qu8A79SeKQ9rwEDbbUmWP.Faw7lLf1Pyw.wXJ2adLHq4tMgulGu4.",
    city: city,
  });

  const user2 = db.user.create({
    username: "tessi",
    password: "$2a$10$h1.TTfozSGIRAbObUIRPZOVdSwkQMP/WyDAUJgnA4GuS.qfvljCJS",
    city: city2,
  });
};

export const createPost = () => {
  const post = db.post.create({
    author: user,
    city: city,
  });
};

export const createDefault = () => {
  createCity();
  createUsers();
  createPost();
};

export const clearDB = () => {
  drop(db);
};
