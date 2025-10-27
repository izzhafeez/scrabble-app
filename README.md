# Scrabble Points Calculator

This application allows you to enter words, calculate their Scrabble scores, and maintain a leaderboard of saved scores.

**Features**
- Enter a word
- See the letter and word scores
- Save a word and its score
- View the top 10 words based on score
- Load a word and its score
- Reset the word

## Getting Started

### Clone the repository

```
git clone TODO
cd scrabble-app
```

### Frontend setup

1. Navigate to the frontend folder `cd scrabble-frontend`
2. Install npm dependencies `npm install`
3. Create a `.env` file in the root of the frontend project and insert the following: `NEXT_PUBLIC_SCRABBLE_BACKEND_URL=http://localhost:8080`

### Run both front and backend

Run in the `scrabble-frontend` folder:
```
npm run dev:all
```

## Testing

### Frontend Jesting

1. Navigate to the frontend folder
2. Run `npm run test`

### Backend testing

1. Navigate to the backend folder `scrabble-backend`
2. Run `./gradlew test`

