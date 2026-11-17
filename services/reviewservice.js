import {httpError} from "./httperror.js";
import {getItemById, updateRating} from "./mediaservice.js";
import {getUserById} from "./userservice.js";

class Review{
    constructor({ id, userId, itemId, rating, text, createdAt = new Date() }){
        this.id = id;
        this.userId = userId;
        this.itemId = itemId;
        this.rating = rating;
        this.text = text;
        this.createdAt = createdAt;
    }
}

const reviews = [];
let nextReviewId = 1;

//recalculate item average after a review is added
function recalculateItemRating(itemId){
    const itemReviews = reviews.filter(r => r.itemId === Number(itemId));
    const ratingCount = itemReviews.length;
    const total = itemReviews.reduce((sum, r) => sum + r.rating, 0);
    const newRating = ratingCount > 0 ? Math.round((total / ratingCount) * 10) / 10 : 0; // rounded to 1 decimal
    updateRating(itemId, newRating, ratingCount);
}

//hard code some reviews for testing (user 1 = admin, user 2 = demo)
const seedReviews = [
    { userId: 2, itemId: 1, rating: 5, text: 'Slow start, but impossible to put down once the politics kick in.', daysAgo: 6 },
    { userId: 1, itemId: 1, rating: 4, text: 'Dense worldbuilding. The appendices are worth reading too.', daysAgo: 4 },
    { userId: 1, itemId: 4, rating: 5, text: 'Still sounds ahead of its time.', daysAgo: 5 },
    { userId: 1, itemId: 6, rating: 4, text: 'My go-to album for focusing.', daysAgo: 3 },
    { userId: 2, itemId: 7, rating: 4, text: 'Every shot looks like a painting. Slow, but worth it.', daysAgo: 2 },
    { userId: 2, itemId: 8, rating: 5, text: 'Beautiful from the first frame to the last.', daysAgo: 2 },
    { userId: 1, itemId: 8, rating: 5, text: 'A perfect introduction to Studio Ghibli.', daysAgo: 1 }
];

//turn the seed data into Review objects, then set each item's average
seedReviews.forEach(({ daysAgo, ...data }) => {
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    reviews.push(new Review({ id: nextReviewId++, ...data, createdAt }));
});
[...new Set(reviews.map(r => r.itemId))].forEach(recalculateItemRating);

//looks up the reviewer's name for display
function usernameFor(userId){
    try {
        return getUserById(userId).username;
    } catch {
        return 'Former user';
    }
}

//all reviews for one item, newest first, with the reviewer's name and a readable date
export function getReviewsForItem(itemId){
    return reviews
        .filter(r => r.itemId === Number(itemId))
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(r => ({
            ...r,
            username: usernameFor(r.userId),
            dateLabel: r.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
}

//business rules for adding a review
export function addReview({ userId, itemId, rating, text }){
    getItemById(itemId); // throws a 404 if the item doesn't exist

    const score = Number(rating);
    if(!Number.isInteger(score) || score < 1 || score > 5){
        throw httpError(400, 'Rating must be a whole number from 1 to 5.');
    }

    const body = (text || '').trim();
    if(body.length === 0){
        throw httpError(400, 'Write a few words about it.');
    }
    if(body.length > 1000){
        throw httpError(400, 'Reviews can be up to 1000 characters.');
    }

    //one review per user per item
    const alreadyReviewed = reviews.some(r => r.userId === Number(userId) && r.itemId === Number(itemId));
    if(alreadyReviewed){
        throw httpError(409, 'You have already reviewed this item.');
    }

    const review = new Review({ id: nextReviewId++, userId: Number(userId), itemId: Number(itemId), rating: score, text: body });
    reviews.push(review);
    recalculateItemRating(itemId); // keeps the MediaItem's averageRating and ratingCount up to date
    return review;
}
