// Badges the player can unlock. `test` receives the player's stats.
export const achievements = [
  { id: "first-page", icon: "📖", name: "First Page", desc: "Add your first book", test: (s) => s.books >= 1 },
  { id: "bookworm", icon: "🐛", name: "Bookworm", desc: "Have 5 books on your shelf", test: (s) => s.books >= 5 },
  { id: "explorer", icon: "🧭", name: "Explorer", desc: "Send your first borrow request", test: (s) => s.sent >= 1 },
  { id: "reader", icon: "🎒", name: "Happy Reader", desc: "Borrow a book from someone", test: (s) => s.borrowed >= 1 },
  { id: "generous", icon: "💝", name: "Generous Soul", desc: "Lend a book to someone", test: (s) => s.lent >= 1 },
  { id: "trusted", icon: "🛡️", name: "Trusted Lender", desc: "Get 3 lent books returned", test: (s) => s.completedLoans >= 3 },
  { id: "collector", icon: "💎", name: "Collector", desc: "Save 3 books to your wishlist", test: (s) => s.wishlist >= 3 },
  { id: "streak3", icon: "🔥", name: "On Fire", desc: "Visit 3 days in a row", test: (s) => s.streak >= 3 },
];
