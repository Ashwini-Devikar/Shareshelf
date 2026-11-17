// Mock data for the logged-in user. Replaced by API calls in Week 3.
export const myBooks = [
  { id: 101, title: "Deep Work", author: "Cal Newport", genre: "Self-Help", condition: "GOOD", status: "AVAILABLE", owner: "You", city: "Nagpur", color: "#1971c2" },
  { id: 102, title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "Technology", condition: "FAIR", status: "BORROWED", owner: "You", city: "Nagpur", color: "#087f5b" },
  { id: 103, title: "Ikigai", author: "Héctor García", genre: "Non-Fiction", condition: "NEW", status: "REQUESTED", owner: "You", city: "Nagpur", color: "#d9480f" },
];

// Requests I sent to other people's books
export const sentRequests = [
  { id: 1, bookTitle: "The Alchemist", owner: "Riya", status: "PENDING", requestedAt: "2026-11-14", dueDate: null },
  { id: 2, bookTitle: "Sapiens", owner: "Rahul", status: "APPROVED", requestedAt: "2026-11-10", dueDate: "2026-11-28" },
  { id: 3, bookTitle: "Wings of Fire", owner: "Karan", status: "REJECTED", requestedAt: "2026-11-05", dueDate: null },
  { id: 4, bookTitle: "Head First Java", owner: "Neha", status: "RETURNED", requestedAt: "2026-10-12", dueDate: "2026-10-26" },
];

// Requests other people sent for my books
export const receivedRequests = [
  { id: 11, bookTitle: "Ikigai", borrower: "Amit", message: "Would love to read this over the weekend!", status: "PENDING", requestedAt: "2026-11-15", dueDate: null },
  { id: 12, bookTitle: "The Pragmatic Programmer", borrower: "Sneha", message: "Need it for my project.", status: "APPROVED", requestedAt: "2026-11-08", dueDate: "2026-11-22" },
  { id: 13, bookTitle: "Deep Work", borrower: "Priya", message: "", status: "RETURNED", requestedAt: "2026-10-01", dueDate: "2026-10-15" },
];
