# Project 9: L'Oréal Routine Builder
L'Oréal is expanding what's possible with AI, and now your chatbot is getting smarter. This week, you'll upgrade it into a product-aware routine builder. 

Users will be able to browse real L'Oréal brand products, select the ones they want, and generate a personalized routine using AI. They can also ask follow-up questions about their routine—just like chatting with a real advisor.

## Features

### Core Functionality
- **Product Selection**: Click on product cards to select/unselect them
- **Visual Feedback**: Selected products are highlighted with a dark border
- **Selected Products List**: View all selected products with easy removal
- **Product Descriptions**: Toggle descriptions for each product
- **AI-Generated Routines**: Create personalized routines from selected products
- **Conversation History**: Chat maintains context for follow-up questions
- **localStorage Persistence**: Selected products saved across page reloads

### Advanced Features

#### 🌐 Web Search (10 pts)
- Enable real-time web search for current L'Oréal product information
- Toggle web search on/off in the chat interface
- AI responses include current trends, news, and may include citations
- See `CLOUDFLARE_WEBSEARCH_SETUP.md` for implementation details

#### 🔍 Product Search (10 pts)
- Real-time search field filters products as you type
- Search by product name, brand, category, or description keywords
- Works seamlessly alongside category filter
- Shows all matching products across categories

#### 🌍 RTL Language Support (5 pts)
- Toggle between LTR (Left-to-Right) and RTL (Right-to-Left) layouts
- Complete layout adjustments for RTL languages
- Product grid, chat interface, and all UI elements adapt
- Text direction preference saved in localStorage

## How to Use

### Basic Product Selection
1. Choose a category from the dropdown or use the search field
2. Click on product cards to select them
3. Click "View Description" to see product details
4. Selected products appear in the "Selected Products" section
5. Click "Generate Routine" to get your personalized routine

### Using Web Search
1. Check the "Enable Web Search" checkbox in the chat section
2. Ask questions about current products or trends
3. The AI will search for real-time information
4. Responses may include links and citations

### Product Search
1. Type in the search field to filter products
2. Search works across all product attributes
3. Combine with category filter for refined results
4. Clear search to show all products in selected category

### RTL Language Support
1. Click the "Toggle RTL/LTR" button at the top
2. The entire interface flips to right-to-left layout
3. Preference is saved automatically
4. Click again to switch back to left-to-right

## Technical Details

### Files
- `index.html` - Main HTML structure with new search and RTL features
- `script.js` - JavaScript functionality with search, web search, and RTL support
- `style.css` - Styling including RTL layout adjustments
- `products.json` - Product database
- `secrets.js` - API configuration
- `CLOUDFLARE_WEBSEARCH_SETUP.md` - Web search setup guide

### API Integration
- Uses Cloudflare Worker proxy: `lorealbot.mhelm0225.workers.dev`
- OpenAI GPT-4 model for chat and routine generation
- Optional web search capability for real-time information

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Supports both LTR and RTL text directions
- Responsive design adapts to different screen sizes

## Development

To run locally:
```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Credits
Built for L'Oréal's AI-powered routine builder project using OpenAI's GPT-4 API.