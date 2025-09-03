# 📋 Google Keep-Style Todo Cards

A modern, card-based todo application inspired by Google Keep, built with React and TypeScript. Create multiple todo cards with customizable colors, drag-and-drop reordering, and seamless editing experience.

[Live Demo](your-github-pages-url) | [Report Bug](issues-url) | [Request Feature](issues-url)

## ✨ Key Features

### 🃏 **Card-Based Organization**
- Create unlimited todo cards, each with its own title and todo list
- Google Keep-inspired card layout in responsive grid
- Click anywhere on a card to start editing

### 🎨 **Visual Customization**
- 9 beautiful gradient color themes for each card
- Glassmorphism design with subtle shadows and transparency
- Textured background pattern for visual depth

### ✏️ **Smart Editing System**
- **Dual Mode Interface**: Display mode for viewing, Editor mode for editing
- **Focus-aware editing**: Click title to edit title, click todo item to edit that specific item  
- **Modal-style editing**: Full card editor overlay when editing
- **Auto-save**: Changes persist as you type

### 🔄 **Drag & Drop Functionality**  
- **Grabber handles** on each todo item for easy reordering
- **Framer Motion animations** with smooth drag feedback
- Visual scaling and shadow effects while dragging

### 💾 **Data Persistence**
- **Local Storage**: All cards and todos automatically saved to browser
- **Date tracking**: "Edited [date]" shown on hover for each card
- **Crash recovery**: Data persists through browser restarts

### 🎯 **User Experience**
- **Google Keep-style input**: "Take a note..." placeholder triggers new card creation
- **Instant todo creation**: New cards start with empty todo item ready for input
- **Keyboard navigation**: Enter to save and move to next item
- **Mobile responsive**: Works seamlessly across all device sizes

## 🚀 How It Works

### Creating a New Card
1. Click the "Take a note..." input at the top
2. A new card appears in edit mode with focus on the title
3. Add your title and start adding todo items

### Managing Todo Cards
- **View Mode**: See all your cards in a responsive grid layout
- **Edit Mode**: Click any card to enter full-screen editing mode
- **Color Themes**: Use the palette icon to choose from 9 gradient colors
- **Delete Cards**: Use the trash icon to remove entire cards

### Todo Item Management  
- ✅ **Toggle completion**: Click the checkbox to mark items done/undone
- ✏️ **Edit items**: Click on todo text to edit in-place
- ➕ **Add items**: Use the plus icon to add new todo items
- 🗑️ **Delete items**: Use the X button to remove individual items
- 🔄 **Reorder items**: Drag using the grabber handle to rearrange

### Smart Focus System
- **Title focus**: Click card title or empty space to edit the card title
- **Item focus**: Click specific todo items to edit them directly
- **Seamless navigation**: Tab through items, Enter to save and move to next

## 🛠️ Tech Stack

**Frontend Framework:**
- React 19.1.0 with TypeScript
- Context API for state management (CardBoard + CardEditor contexts)

**UI & Animation:**
- Tailwind CSS 4.1.8 for styling and gradients
- Framer Motion for drag-and-drop and animations
- Custom glassmorphism effects and shadows

**Security & Validation:**
- DOMPurify for XSS protection
- Input validation and sanitization utilities
- Content Security Policy headers

**Development & Testing:**
- Vite for lightning-fast development
- Vitest with 54+ comprehensive test files
- ESLint with security plugins
- TypeScript for type safety

**Build & Deployment:**
- GitHub Pages deployment
- Terser for production optimization
- SRI (Subresource Integrity) for security

## 🏗️ Architecture

### Component Architecture
```
App
├── CardTrigger          # "Take a note..." input
├── CardBoard           # Grid layout of all cards  
│   └── CardDisplay     # Read-only card view
└── CardEditor         # Modal editor overlay
    ├── TodoItem       # Individual todo with drag handle
    ├── ColorPicker   # 9-color gradient palette
    └── Icon          # SVG icon system
```

### State Management
- **CardBoardContext**: Manages all todo cards, localStorage persistence
- **CardEditorContext**: Controls editing state, focus targets, modal visibility
- **Local Storage**: Automatic persistence with error handling

### Key Design Patterns
- **Context + Hooks**: Clean state management without external libraries
- **Dual Rendering**: Same data renders differently in Display vs Editor mode
- **Focus Management**: Smart focusing system for seamless editing experience
- **Immutable Updates**: All state changes create new objects for React optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository  
git clone https://github.com/yourusername/Todo-App.git
cd Todo-App

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Available Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm run test` - Run comprehensive test suite (54+ tests)
- `npm run lint` - ESLint with security rules
- `npm run deploy` - Deploy to GitHub Pages

## 💡 Usage Examples

### Creating Your First Card
1. Click "Take a note..." → Card appears in edit mode
2. Type your card title (e.g., "Grocery List")  
3. Add todo items (e.g., "Buy milk", "Get bread")
4. Click outside or ESC to save

### Organizing Multiple Lists
- **Work Tasks**: Use cyan gradient for work-related todos
- **Personal**: Use rose gradient for personal tasks  
- **Shopping**: Use emerald gradient for shopping lists
- **Ideas**: Use violet gradient for creative ideas

### Power User Tips
- **Drag reordering**: Grab the ⋮⋮ handle to reorder items
- **Quick editing**: Click directly on text to edit in-place
- **Color coding**: Use consistent colors for different types of lists
- **Mobile use**: App works perfectly on phones with touch-friendly controls

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`  
3. Run tests: `npm test`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Google Keep's intuitive card-based interface
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for beautiful gradients and styling

---
⭐ **Star this repo if it helps you stay organized!**