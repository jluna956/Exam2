//this file holds the Genre and MediaItem objects and the business rules for the catalog
import { genres as genreSeed, mediaItems as itemSeed } from './seeddata.js';

export const media_types = ["Book", "Album", "Movie"];

// creates an error that carries an HTTP status code (404, 400, ...)
function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// classes for genre and media item
// the { } unpack each seed object into named values
class Genre {
    constructor({ id, name, mediaType }) {
        this.id = id;
        this.name = name;
        this.mediaType = mediaType;
    }
}

class MediaItem {
    constructor({ id, type, title, creator, releaseYear, genreId, cover }) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.creator = creator;
        this.releaseYear = releaseYear;
        this.genreId = genreId;
        this.cover = cover || "linear-gradient(135deg, #8C5A2B, #3B2616)"; // default cover if not provided
        this.averageRating = 0; // default average rating
        this.ratingCount = 0; // default rating count
    }
}

const genres = genreSeed.map(g => new Genre(g));
const items = itemSeed.map(i => new MediaItem(i));


// GENRE FUNCTIONS
    // function to get all genres
    export function getGenres() {
        return genres;
    }
    // function to get a genre by id
    export function getGenresById(id) {
        return genres.find(g => g.id === Number(id)) || null;
    }

// adds the genre name to an item so the views can show it
function withGenre(item) {
    const genre = getGenresById(item.genreId);
    return {
        ...item,
        genreName: genre ? genre.name : "Unknown"
    };
}

//filter by media type, id
export function getItems(type){
    const result = media_types.includes(type) ? items.filter(i => i.type === type) : items;
    return result.map(withGenre);
}

// throws a 404 if the item doesn't exist, so the error handler shows the 404 page
export function getItemById(id) {
    const item = items.find(i => i.id === Number(id));
    if (!item) {
        throw httpError(404, "That item doesn't exist.");
    }
    return withGenre(item);
}

//function to get top rated items
//will sort items by averageRating and return the top 'limit' items
export function getTopRated(limit = 4){
    return [...items].sort((a, b) => b.averageRating - a.averageRating).slice(0, limit).map(withGenre);
}

// rules for adding a new item
export function addItem({type, title, creator, releaseYear, genreId} = {}) {
    //error handling
    if (!media_types.includes(type)) {
        throw httpError(400, "Media type must be Book, Album or Movie.");
    }
    if (!title || !title.trim()) {
        throw httpError(400, "Title is required.");
    }
    if (!creator || !creator.trim()) {
        throw httpError(400, "Creator is required.");
    }
    const year = Number(releaseYear);
    if (!Number.isInteger(year) || year < 1800 || year > new Date().getFullYear()) {
        throw httpError(400, "Enter a valid release year.");
    }

    // the genre must exist and match the media type (no "Jazz" movies)
    const genre = getGenresById(genreId);
    if (!genre) {
        throw httpError(400, "Choose a genre.");
    }
    if (genre.mediaType !== type) {
        throw httpError(400, `${genre.name} is for ${genre.mediaType}s, not ${type}s.`);
    }
    const item = new MediaItem({
        id: items.length + 1,
        type,
        title: title.trim(),
        creator: creator.trim(),
        releaseYear: year,
        genreId: genre.id
    });
    items.push(item);
    return withGenre(item);
}

//update rating for an item after a review
export function updateRating(itemId, newRating, ratingCount) {
    const item = items.find(i => i.id === Number(itemId));
    if (!item) {
        throw httpError(404, "That item doesn't exist.");
    }
    item.averageRating = newRating;
    item.ratingCount = ratingCount;
    return withGenre(item);
}
