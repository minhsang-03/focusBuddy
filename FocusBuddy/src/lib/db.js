import { MongoClient, ObjectId } from "mongodb"; // See https://www.mongodb.com/docs/drivers/node/current/quick-start/
import { DB_URI } from "$env/static/private";
import { get } from "svelte/store";

const client = new MongoClient(DB_URI);

await client.connect();
todob: "richtige Datenbankname auswählen";
const db = client.db("ScreenStackDB");

//////////////////////////////////////////
// Artists
//////////////////////////////////////////

// Get all movies
async function getLearnCards() {
  let learnCards = [];
  try {
    const collection = db.collection("learnCards");

    // You can specify a query/filter here
    // See https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/
    const query = {};

    // Get all objects that match the query
    movies = await collection.find(query).toArray();
    // normalize each movie document to a consistent schema (lowercase keys)
    movies = movies.map((m) => {
      const movie = {
        _id: m._id.toString(),
        title: m.title || m.Title || m.name || "",
        year: m.year || m.Year || "",
        duration: m.duration || m.Duration || m.length || "",
        image: m.image || m.Image || m.imageUrl || "/img/placeholder.jpg",
        actors: Array.isArray(m.actors)
          ? m.actors
          : Array.isArray(m.Actors)
          ? m.Actors
          : m.actors
          ? [m.actors]
          : m.Actors
          ? [m.Actors]
          : [],
      };
      return movie;
    });
  } catch (error) {
    // TODO: errorhandling
  }
  return movies;
}

// Get movie by id
async function getMovie(id) {
  let movie = null;
  try {
    const collection = db.collection("movies");
    // validate id before creating ObjectId
    if (!ObjectId.isValid(id)) {
      console.log("Invalid movie id: " + id);
      return null;
    }
    const query = { _id: new ObjectId(id) }; // filter by id
    movie = await collection.findOne(query);

    if (!movie) {
      console.log("No movie with id " + id);
      // TODO: errorhandling
    } else {
      // normalize to lowercase schema before returning
      movie = {
        _id: movie._id.toString(),
        title: movie.title || movie.Title || movie.name || "",
        year: movie.year || movie.Year || "",
        duration: movie.duration || movie.Duration || movie.length || "",
        image: movie.image || movie.Image || movie.imageUrl || "/img/placeholder.jpg",
        actors: Array.isArray(movie.actors)
          ? movie.actors
          : Array.isArray(movie.Actors)
          ? movie.Actors
          : movie.actors
          ? [movie.actors]
          : movie.Actors
          ? [movie.Actors]
          : [],
      };
    }
  } catch (error) {
    // TODO: errorhandling
    console.log(error.message);
  }
  return movie;
}

// create a movie
async function createMovie(movie) {
  try {
    const collection = db.collection("movies");

    // Normalize and supply defaults so callers can provide a minimal object
    const doc = {
      // support either `title` or legacy `name`
      title: movie.title || movie.name || "",
      year: movie.year || "",
      duration: movie.duration || movie.length || "",
      // accept an explicit image url or fall back to placeholder
      image: movie.image || movie.imageUrl || "/images/placeholder.jpg",
      // ensure actors is always an array
      actors: Array.isArray(movie.actors) ? movie.actors : movie.actors ? [movie.actors] : [],
      // additional fields may be added later; keep object minimal now
    };

    const result = await collection.insertOne(doc);
    return result.insertedId.toString(); // convert ObjectId to String
  } catch (error) {
    // TODO: errorhandling
    console.log(error.message);
  }
  return null;
}

// update movie
// returns: id of the updated movie or null, if movie could not be updated
async function updateMovie(movie) {
  try {
    let id = movie._id;
    delete movie._id; // delete the _id from the object, because the _id cannot be updated
    const collection = db.collection("movies");
    if (!ObjectId.isValid(id)) {
      console.log("Invalid id for update: " + id);
      return null;
    }
    const query = { _id: new ObjectId(id) }; // filter by id
    const result = await collection.updateOne(query, { $set: movie });

    if (result.matchedCount === 0) {
      console.log("No movie with id " + id);
      // TODO: errorhandling
    } else {
      console.log("Movie with id " + id + " has been updated.");
      return id;
    }
  } catch (error) {
    // TODO: errorhandling
    console.log(error.message);
  }
  return null;
}
// delete artist by id
// returns: id of the deleted movie or null, if movie could not be deleted
async function deleteMovie(id) {
  try {
    const collection = db.collection("movies");
    if (!ObjectId.isValid(id)) {
      console.log("Invalid id for delete: " + id);
      return null;
    }
    const query = { _id: new ObjectId(id) }; // filter by id
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      console.log("No object with id " + id);
    } else {
      console.log("Object with id " + id + " has been successfully deleted.");
      return id;
    }
  } catch (error) {
    // TODO: errorhandling
    console.log(error.message);
  }
  return null;
}

//////////////////////////////////////////
// Albums
//////////////////////////////////////////

// Get all albums
async function getAlbums() {
  let albums = [];
  try {
    const collection = db.collection("albums");

    // You can specify a query/filter here
    // See https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/
    const query = {};

    // Get all objects that match the query
    albums = await collection.find(query).toArray();
    albums.forEach((albums) => {
      albums._id = albums._id.toString(); // convert ObjectId to String
    });
    //console.log(albums)
  } catch (error) {
    // TODO: errorhandling
  }
  return albums;
}

// export all functions so that they can be used in other files
export default {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getAlbums,
};
