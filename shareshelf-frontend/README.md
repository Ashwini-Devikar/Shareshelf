# ShareShelf Frontend

React + Vite + Bootstrap frontend for ShareShelf, a book sharing and lending platform.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

```
src/
├── components/   Navbar, BookCard, SearchBar
├── data/         mockBooks.js (temporary, replaced by API in Week 3)
├── pages/        Home, BrowseBooks, Login, Register
├── App.jsx       routes
├── main.jsx      entry point
└── index.css     theme
```

## Next steps
- Week 2: Spring Boot backend (JWT auth, book CRUD)
- Week 3: replace mock data with API calls (axios), add AuthContext, MyShelf, AddBook, MyRequests, ReceivedRequests
