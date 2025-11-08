# Testing Guide for L'Oréal Routine Builder

## Feature Testing Checklist

### ✅ Product Search (10 pts)

Test the real-time product search functionality:

1. **Basic Search**

   - [ ] Type "cleanser" in the search field
   - [ ] Verify products filter in real-time as you type
   - [ ] Verify only matching products are shown

2. **Search Across Attributes**

   - [ ] Search by brand name (e.g., "CeraVe")
   - [ ] Search by product name (e.g., "Moisturizing")
   - [ ] Search by category keywords (e.g., "haircare")
   - [ ] Search by description keywords (e.g., "retinol")

3. **Combined Filters**

   - [ ] Select a category, then use search
   - [ ] Verify both filters work together
   - [ ] Clear search and verify category filter still works

4. **No Results**
   - [ ] Type a search term with no matches (e.g., "xyz123")
   - [ ] Verify "No products found" message appears

### ✅ Web Search (10 pts)

Test the AI web search capability:

1. **Enable Web Search**

   - [ ] Check the "Enable Web Search" checkbox
   - [ ] Verify checkbox state is visible

2. **Test Web Search Queries**
   Ask these questions with web search enabled:

   - [ ] "What are the latest L'Oréal products in 2025?"
   - [ ] "Find current reviews for CeraVe moisturizer"
   - [ ] "What are trending skincare ingredients?"

3. **Loading States**

   - [ ] Verify loading message shows "Searching the web..."
   - [ ] Verify response includes current/timely information

4. **Compare Without Web Search**
   - [ ] Uncheck web search toggle
   - [ ] Ask similar question
   - [ ] Verify loading shows "Thinking..." instead
   - [ ] Compare response quality

### ✅ RTL Language Support (5 pts)

Test right-to-left layout functionality:

1. **Toggle RTL**

   - [ ] Click "Toggle RTL/LTR" button at the top
   - [ ] Verify entire layout flips to RTL

2. **RTL Layout Elements**

   - [ ] Product cards are flipped (image on right)
   - [ ] Search field and category filter positions swap
   - [ ] Selected products tags flip direction
   - [ ] Chat messages flip (user on left, AI on right)
   - [ ] Icons and spacing adjust correctly

3. **Persistence**

   - [ ] Switch to RTL mode
   - [ ] Refresh the page
   - [ ] Verify RTL mode is maintained

4. **Toggle Back**
   - [ ] Click button again to switch to LTR
   - [ ] Verify layout returns to normal
   - [ ] Refresh page to verify LTR is saved

### 🎯 Integration Tests

1. **Product Search + Selection**

   - [ ] Search for products
   - [ ] Click to select some products
   - [ ] Verify selected products list updates
   - [ ] Change search query
   - [ ] Verify selected products remain selected

2. **Web Search + Routine Generation**

   - [ ] Select 2-3 products
   - [ ] Enable web search
   - [ ] Generate routine
   - [ ] Ask follow-up question with web search
   - [ ] Verify conversation flows naturally

3. **RTL + All Features**
   - [ ] Switch to RTL mode
   - [ ] Use product search
   - [ ] Select products
   - [ ] Generate routine
   - [ ] Ask chat questions
   - [ ] Verify all features work in RTL

## Expected Results

### Product Search

- Instant filtering as you type
- Search across name, brand, category, description
- Works with category filter
- Clear "no results" message

### Web Search

- Toggle visible and functional
- Loading indicator changes based on toggle state
- Responses should reference current information
- May include URLs or citations (model-dependent)

### RTL Support

- Complete layout flip
- All text and elements properly aligned
- Icons and spacing adjusted
- Preference saved in localStorage

## Common Issues

### Product Search Not Working

- Check browser console for errors
- Verify `productSearch` element exists in HTML
- Ensure `filterProducts()` function is called

### Web Search Not Returning Current Info

- Depends on OpenAI model capabilities
- May need Cloudflare Worker update
- Check API response format
- See `CLOUDFLARE_WEBSEARCH_SETUP.md`

### RTL Layout Issues

- Check browser support for `dir="rtl"`
- Verify CSS RTL selectors are loaded
- Clear browser cache if styles don't update
- Check localStorage for saved direction

## Scoring Criteria

- **Product Search (10 pts)**: Real-time filtering, works across all fields, combined with category filter
- **Web Search (10 pts)**: Toggle works, provides current info, proper loading states, API integration
- **RTL Support (5 pts)**: Complete layout flip, all elements adjusted, persistent preference

Total: 25 points
