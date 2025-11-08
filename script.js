/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedProductsList = document.getElementById("selectedProductsList");
const generateRoutineBtn = document.getElementById("generateRoutine");
const productSearch = document.getElementById("productSearch");
const languageToggle = document.getElementById("languageToggle");
const webSearchToggle = document.getElementById("webSearchToggle");

/* Array to store selected products and conversation history */
let selectedProducts = [];
let conversationHistory = [];
let allProducts = [];
let currentCategory = "";
let searchQuery = "";

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load selected products from localStorage on page load */
function loadSelectedFromStorage() {
  const saved = localStorage.getItem("selectedProducts");
  if (saved) {
    selectedProducts = JSON.parse(saved);
    updateSelectedProductsDisplay();
  }
}

/* Save selected products to localStorage */
function saveSelectedToStorage() {
  localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
}

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  allProducts = data.products;
  return allProducts;
}

/* Check if a product is already selected */
function isProductSelected(productId) {
  return selectedProducts.some((p) => p.id === productId);
}

/* Toggle product selection */
function toggleProductSelection(product) {
  const index = selectedProducts.findIndex((p) => p.id === product.id);

  if (index > -1) {
    /* Product is already selected, remove it */
    selectedProducts.splice(index, 1);
  } else {
    /* Add product to selection */
    selectedProducts.push(product);
  }

  /* Save to localStorage and update display */
  saveSelectedToStorage();
  updateSelectedProductsDisplay();

  /* Update the visual state of product cards */
  displayProducts(allProducts.filter((p) => p.category === product.category));
}

/* Update the selected products list display */
function updateSelectedProductsDisplay() {
  if (selectedProducts.length === 0) {
    selectedProductsList.innerHTML = `
      <p class="no-selection">No products selected yet. Click on products above to add them.</p>
    `;
    return;
  }

  selectedProductsList.innerHTML = selectedProducts
    .map(
      (product) => `
      <div class="selected-item">
        <span class="selected-item-name">${product.brand} - ${product.name}</span>
        <button class="remove-btn" data-id="${product.id}" aria-label="Remove ${product.name}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `
    )
    .join("");

  /* Add event listeners to remove buttons */
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = parseInt(e.currentTarget.dataset.id);
      const product = selectedProducts.find((p) => p.id === productId);
      if (product) {
        toggleProductSelection(product);
      }
    });
  });
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map((product) => {
      const isSelected = isProductSelected(product.id);
      return `
        <div class="product-card ${isSelected ? "selected" : ""}" data-id="${
        product.id
      }">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-brand">${product.brand}</p>
            <button class="view-description-btn" data-id="${product.id}">
              <i class="fa-solid fa-info-circle"></i> View Description
            </button>
            <div class="product-description" id="desc-${
              product.id
            }" style="display: none;">
              <p>${product.description}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  /* Add click event listeners to product cards for selection */
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      /* Don't toggle if clicking the description button */
      if (e.target.closest(".view-description-btn")) {
        return;
      }

      const productId = parseInt(card.dataset.id);
      const product = allProducts.find((p) => p.id === productId);
      if (product) {
        toggleProductSelection(product);
      }
    });
  });

  /* Add click event listeners to view description buttons */
  document.querySelectorAll(".view-description-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card selection
      const productId = btn.dataset.id;
      const descElement = document.getElementById(`desc-${productId}`);

      if (descElement.style.display === "none") {
        descElement.style.display = "block";
        btn.innerHTML =
          '<i class="fa-solid fa-info-circle"></i> Hide Description';
      } else {
        descElement.style.display = "none";
        btn.innerHTML =
          '<i class="fa-solid fa-info-circle"></i> View Description';
      }
    });
  });
}

/* Filter products based on category and search query */
function filterProducts() {
  let filteredProducts = allProducts;

  /* Filter by category if one is selected */
  if (currentCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === currentCategory
    );
  }

  /* Filter by search query if one exists */
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }

  /* Show message if no products match */
  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        No products found matching your search.
      </div>
    `;
  } else {
    displayProducts(filteredProducts);
  }
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  if (allProducts.length === 0) {
    await loadProducts();
  }

  currentCategory = e.target.value;
  filterProducts();
});

/* Search products as user types */
productSearch.addEventListener("input", async (e) => {
  if (allProducts.length === 0) {
    await loadProducts();
  }

  searchQuery = e.target.value.trim();

  /* If there's a search query, show all products (ignore category filter) */
  /* If no search query, respect the category filter */
  if (searchQuery && !currentCategory) {
    currentCategory = ""; // Show all categories when searching
  }

  filterProducts();
});

/* Add a message to the chat window */
function addMessageToChat(message, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = isUser
    ? "chat-message user-message"
    : "chat-message ai-message";
  messageDiv.textContent = message;
  chatWindow.appendChild(messageDiv);

  /* Scroll to bottom */
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Send a request to the OpenAI API with optional web search */
async function sendToOpenAI(messages, useWebSearch = false) {
  /* If web search is enabled, use gpt-4o with web search capability */
  const model = useWebSearch ? "gpt-4o" : "gpt-4o";

  const requestBody = {
    model: model,
    messages: messages,
  };

  /* Add web search parameter if enabled */
  if (useWebSearch) {
    /* Add instruction to the system message to search for current info */
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      lastMessage.content = `${lastMessage.content}\n\nPlease search the web for the most current information about L'Oréal products, beauty trends, or related topics. Include any relevant links or sources in your response.`;
    }
  }

  const response = await fetch(`https://${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

/* Generate a personalized routine based on selected products */
generateRoutineBtn.addEventListener("click", async () => {
  if (selectedProducts.length === 0) {
    addMessageToChat(
      "Please select at least one product before generating a routine."
    );
    return;
  }

  /* Clear chat window and conversation history for new routine */
  chatWindow.innerHTML = "";
  conversationHistory = [];

  /* Create a prompt with the selected products */
  const productsInfo = selectedProducts
    .map((p) => `- ${p.brand} ${p.name} (${p.category}): ${p.description}`)
    .join("\n");

  const systemMessage = {
    role: "system",
    content:
      "You are a helpful beauty and skincare advisor for L'Oréal. You help users create personalized routines and answer questions about skincare, haircare, makeup, fragrance, and related topics. Be friendly, professional, and knowledgeable.",
  };

  const userMessage = {
    role: "user",
    content: `Please create a personalized routine using these products:\n\n${productsInfo}\n\nProvide a step-by-step routine with tips on how to use each product effectively.`,
  };

  /* Add to conversation history */
  conversationHistory.push(systemMessage);
  conversationHistory.push(userMessage);

  /* Show loading message */
  addMessageToChat("Generating your personalized routine...");

  try {
    /* Send request to OpenAI */
    const routine = await sendToOpenAI(conversationHistory);

    /* Clear loading message and show routine */
    chatWindow.innerHTML = "";
    addMessageToChat(routine);

    /* Add AI response to conversation history */
    conversationHistory.push({
      role: "assistant",
      content: routine,
    });
  } catch (error) {
    chatWindow.innerHTML = "";
    addMessageToChat(
      "Sorry, there was an error generating your routine. Please try again."
    );
    console.error("Error:", error);
  }
});

/* Handle follow-up questions in the chatbox */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userInput = document.getElementById("userInput");
  const question = userInput.value.trim();

  if (!question) return;

  /* Check if web search is enabled */
  const useWebSearch = webSearchToggle.checked;

  /* Clear input field */
  userInput.value = "";

  /* Add user message to chat */
  addMessageToChat(question, true);

  /* If no conversation history exists, start with system message */
  if (conversationHistory.length === 0) {
    const systemContent = useWebSearch
      ? "You are a helpful beauty and skincare advisor for L'Oréal. You help users with questions about skincare, haircare, makeup, fragrance, and related topics. When web search is enabled, provide current, up-to-date information about L'Oréal products and include relevant links or citations. Be friendly, professional, and knowledgeable."
      : "You are a helpful beauty and skincare advisor for L'Oréal. You help users with questions about skincare, haircare, makeup, fragrance, and related topics. Be friendly, professional, and knowledgeable.";

    conversationHistory.push({
      role: "system",
      content: systemContent,
    });
  }

  /* Add user question to conversation history */
  conversationHistory.push({
    role: "user",
    content: question,
  });

  /* Show loading indicator */
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "chat-message ai-message loading";
  loadingDiv.textContent = useWebSearch
    ? "Searching the web..."
    : "Thinking...";
  chatWindow.appendChild(loadingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    /* Send request to OpenAI with full conversation history */
    const response = await sendToOpenAI(conversationHistory, useWebSearch);

    /* Remove loading indicator */
    chatWindow.removeChild(loadingDiv);

    /* Add AI response to chat */
    addMessageToChat(response);

    /* Add AI response to conversation history */
    conversationHistory.push({
      role: "assistant",
      content: response,
    });
  } catch (error) {
    /* Remove loading indicator */
    chatWindow.removeChild(loadingDiv);

    addMessageToChat(
      "Sorry, there was an error processing your question. Please try again."
    );
    console.error("Error:", error);
  }
});

/* Toggle RTL/LTR language support */
languageToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const currentDir = html.getAttribute("dir");

  if (currentDir === "rtl") {
    /* Switch to LTR (Left-to-Right) */
    html.setAttribute("dir", "ltr");
    html.setAttribute("lang", "en");
    localStorage.setItem("textDirection", "ltr");
  } else {
    /* Switch to RTL (Right-to-Left) */
    html.setAttribute("dir", "rtl");
    html.setAttribute("lang", "ar");
    localStorage.setItem("textDirection", "rtl");
  }
});

/* Load saved text direction on page load */
function loadTextDirection() {
  const savedDirection = localStorage.getItem("textDirection");
  if (savedDirection === "rtl") {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
  }
}

/* Load selected products from storage when page loads */
loadSelectedFromStorage();

/* Load text direction preference */
loadTextDirection();
