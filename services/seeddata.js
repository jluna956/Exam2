//This file contains seed data for the application. It includes arrays of media items and genres.
export const genres = [
    { id: 1, name: "Science fiction", mediaType: "Book" },
    { id: 2, name: "Fantasy", mediaType: "Book" },
    { id: 3, name: "Literary fiction", mediaType: "Book" },
    { id: 4, name: "Rock", mediaType: "Album" },
    { id: 5, name: "Jazz", mediaType: "Album" },
    { id: 6, name: "Science fiction", mediaType: "Movie" },
    { id: 7, name: "Animation", mediaType: "Movie" },
    { id: 8, name: "Drama", mediaType: "Movie" }
];

//hardcoded media items for app
//each media item has id, type, title, creator, releaseYear, genreId, and a default cover image
export const mediaItems = [
    { id: 1, type: "Book", title: "Dune", creator: "Frank Herbert", releaseYear: 1965, genreId: 1, cover: "linear-gradient(135deg, #8C5A2B, #3B2616)" },
    { id: 2, type: "Book", title: "The Hobbit", creator: "J.R.R. Tolkien", releaseYear: 1937, genreId: 2, cover: "linear-gradient(135deg, #7A6A2F, #26200F)" },
    { id: 3, type: "Book", title: "Beloved", creator: "Toni Morrison", releaseYear: 1987, genreId: 3, cover: "linear-gradient(135deg, #6B3A5A, #24131F)" },
    { id: 4, type: "Album", title: "OK Computer", creator: "Radiohead", releaseYear: 1997, genreId: 4, cover: "linear-gradient(135deg, #3C5A7A, #161F2B)" },
    { id: 5, type: "Album", title: "Rumours", creator: "Fleetwood Mac", releaseYear: 1977, genreId: 4, cover: "linear-gradient(135deg, #9A6B3F, #2B1D12)" },
    { id: 6, type: "Album", title: "Kind of Blue", creator: "Miles Davis", releaseYear: 1959, genreId: 5, cover: "linear-gradient(135deg, #2F6F6A, #11201F)" },
    { id: 7, type: "Movie", title: "Blade Runner", creator: "Ridley Scott", releaseYear: 1982, genreId: 6, cover: "linear-gradient(135deg, #C2503D, #2A1512)" },
    { id: 8, type: "Movie", title: "Spirited Away", creator: "Hayao Miyazaki", releaseYear: 2001, genreId: 7, cover: "linear-gradient(135deg, #4F7A3A, #182414)" },
    { id: 9, type: "Movie", title: "Moonlight", creator: "Barry Jenkins", releaseYear: 2016, genreId: 8, cover: "linear-gradient(135deg, #2E4F8C, #10182B)" }
];

