// Constants for localStorage keys
const STORAGE_KEY = 'expense_tracker_data';
const STORAGE_VERSION = '1.0';

// Utility object for handling localStorage operations
const StorageUtils = {
    // Saves data to localStorage
    save(data) {
        try {
            const storageData = {
                version: STORAGE_VERSION,
                timestamp: new Date().toISOString(),
                transactions: data
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Loads data from localStorage
    load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];
            const parsedData = JSON.parse(data);
            if (parsedData.version !== STORAGE_VERSION) {
                console.log('Migrating old data format to new version');
                return this.migrateData(parsedData);
            }
            return this.validateTransactions(parsedData.transactions);
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return [];
        }
    },

    // Validates the structure and types of transactions
    validateTransactions(transactions) {
        if (!Array.isArray(transactions)) return [];
        return transactions.filter(trx => {
            return trx && typeof trx.id === 'string' && typeof trx.name === 'string' &&
                   !isNaN(trx.amount) && trx.date &&
                   ['income', 'expense'].includes(trx.type) && typeof trx.category === 'string';
        });
    },

    // Migrates data from older versions to the current version
    migrateData(oldData) {
        if (Array.isArray(oldData)) {
            return oldData.map(trx => ({ ...trx, category: trx.category || 'other' }));
        }
        return oldData.transactions || [];
    },

    // Clears data from localStorage
    clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Load transactions from localStorage
const transactions = StorageUtils.load();
// Current currency and exchange rates
let currentCurrency = "INR";
let exchangeRates = { INR: 1 };

// API key and base URL for fetching exchange rates
const API_KEY = "fca_live_xXY27AF48y8OyhtYekpclzz9iAxvZMFC5Q3ktpbH";
const BASE_URL = "https://api.freecurrencyapi.com/v1";

// Fetches exchange rates from the API
async function fetchExchangeRates() {
    try {
        const response = await fetch(`${BASE_URL}/latest?apikey=${API_KEY}&base_currency=INR`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data && data.data) {
            exchangeRates = { ...data.data, INR: 1 };
            await updateDisplay();
        } else {
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        exchangeRates = {
            INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.77,
            AUD: 0.018, CAD: 0.016, CHF: 0.011, CNY: 0.086
        };
        await updateDisplay();
    }
}

// Converts an amount from one currency to another
function convertAmount(amount, fromCurrency = "INR", toCurrency) {
    const rate = exchangeRates[toCurrency] || 1;
    return amount * rate;
}

// Formatter for INR currency
const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    signDisplay: "always",
});

// Returns a formatter for a given currency
function getFormatter(currency) {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency: currency,
        signDisplay: "always",
    });
}

// DOM elements
const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const dateInput = document.getElementById("date");
const currencySelect = document.getElementById("currencySelect");

// Category filter
const filterCategorySelect = document.getElementById("filterCategory");
let filterCategory = "";
if (filterCategorySelect) {
    filterCategorySelect.addEventListener("change", (e) => {
        filterCategory = e.target.value;
        renderList();
    });
}

// Set default date for date input
dateInput.defaultValue = new Date().toISOString().split("T")[0];

// Event listeners
form.addEventListener("submit", addTransaction);
currencySelect.addEventListener("change", handleCurrencyChange);

// Initialize display
balance.textContent = "₹0.00";
income.textContent = "₹0.00";
expense.textContent = "₹0.00";

// Initialize currency and fetch exchange rates on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    currencySelect.value = "INR";
    fetchExchangeRates();
});

fetchExchangeRates().catch(error => {
    console.error("Failed to initialize exchange rates:", error);
});

// Handles currency change event
async function handleCurrencyChange(e) {
    const newCurrency = e.target.value;
    if (newCurrency === currentCurrency) return;
    balance.textContent = "Loading...";
    income.textContent = "Loading...";
    expense.textContent = "Loading...";
    currentCurrency = newCurrency;
    currencySelect.classList.add("animate-pulse");
    setTimeout(() => currencySelect.classList.remove("animate-pulse"), 500);
    await fetchExchangeRates();
    await updateDisplay();
}

// Formats a value as currency
function formatCurrency(value, currency = currentCurrency) {
    try {
        const convertedValue = convertAmount(value, "INR", currency);
        const formatter = getFormatter(currency);
        if (convertedValue === 0)
            return formatter.format(0).replace(/^[+-]/, "");
        return formatter.format(convertedValue);
    } catch (error) {
        console.error("Error formatting currency:", error, value, currency);
        return value.toFixed(2);
    }
}

// Variable to store the ID of the transaction being edited
let editingTransactionId = null;

// Creates a list item for a transaction
function createItem({ id, name, description, amount, date, type, category }) {
    const sign = type === "income" ? 1 : -1;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
        <span class="category-label">${category}</span>
        ${description ? `<p class="description">${description}</p>` : ""}
      </div>
      <div class="amount ${type}">
        <span>${formatCurrency(amount * sign)}</span>
      </div>
      <div class="actions">
        <button class="edit-transaction" title="Edit transaction">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete-transaction" title="Delete transaction">
           <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;

    // Add event listener to the edit button
    li.querySelector(".edit-transaction").addEventListener("click", (e) => {
        e.stopPropagation();
        editTransaction(id);
    });

    li.querySelector(".delete-transaction").addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTransaction(id);
    });
    return li;
}

// Updates the total balance, income, and expense
async function updateTotal() {
    const incomeTotal = transactions
        .filter(trx => trx.type === "income")
        .reduce((total, trx) => total + trx.amount, 0);
    const expenseTotal = transactions
        .filter(trx => trx.type === "expense")
        .reduce((total, trx) => total + trx.amount, 0);
    const balanceTotal = incomeTotal - expenseTotal;
    balance.textContent = formatCurrency(balanceTotal).replace(/^\+/, "");
    income.textContent = formatCurrency(incomeTotal);
    expense.textContent = formatCurrency(expenseTotal * -1);
}

// Updates the display by rendering the list and updating totals
async function updateDisplay() {
    renderList();
    await updateTotal();
}

// Renders the transaction list
function renderList() {
    list.innerHTML = "";
    const filteredTransactions = filterCategory ?
        transactions.filter(trx => trx.category === filterCategory) :
        transactions;
    filteredTransactions.forEach(transaction => {
        const li = createItem(transaction);
        list.appendChild(li);
    });
}

// Initial render and total update
renderList();
updateTotal();

// Deletes a transaction
function deleteTransaction(id) {
    const index = transactions.findIndex(trx => trx.id === id);
    const li = list.children[index];
    li.classList.add("fade-out");
    setTimeout(() => {
        transactions.splice(index, 1);
        li.remove();
        saveTransactions();
        updateTotal();
    }, 500);
}

// Adds a new transaction
function addTransaction(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const category = formData.get("category");
    if (!category) {
        alert("Please select a category");
        return;
    }

    const name = formData.get("name");
    const description = formData.get("description");
    const amount = parseFloat(formData.get("amount"));
    const date = new Date(formData.get("date"));
    const type = "on" === formData.get("type") ? "expense" : "income";

    if (!name || isNaN(amount) || !date) {
        alert("Please fill in all fields correctly.");
        return;
    }

    if (editingTransactionId) {
        // Update existing transaction
        const index = transactions.findIndex(trx => trx.id === editingTransactionId);
        if (index !== -1) {
            transactions[index] = {
                id: editingTransactionId,
                name: name,
                description: description,
                amount: amount,
                date: date,
                type: type,
                category: category
            };
        }
        editingTransactionId = null; // Clear editing ID
    } else {
        // Create new transaction
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const newTransaction = {
            id: uniqueId,
            name: name,
            description: description,
            amount: amount,
            date: date,
            type: type,
            category: category
        };
        transactions.push(newTransaction);
    }

    saveTransactions();
    renderList();
    updateTotal();
    form.reset();
    dateInput.defaultValue = new Date().toISOString().split("T")[0];
}

// Function to populate the form with transaction details for editing
function editTransaction(id) {
    const transaction = transactions.find(trx => trx.id === id);
    if (transaction) {
        editingTransactionId = id; // Set editing ID
        form.name.value = transaction.name;
        form.description.value = transaction.description;
        form.amount.value = transaction.amount;
        form.date.value = new Date(transaction.date).toISOString().split("T")[0];
        form.category.value = transaction.category;
        // Set the type (income/expense)
        const typeCheckbox = document.getElementById('type');
        if (transaction.type === "expense") {
            typeCheckbox.checked = true;
        } else {
            typeCheckbox.checked = false;
        }
    }
}

// Saves transactions to localStorage
function saveTransactions() {
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!StorageUtils.save(transactions)) {
        alert('Failed to save transactions. Please check your browser storage settings.');
    }
}

// Handles storage event
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        const newTransactions = StorageUtils.load();
        transactions.length = 0;
        transactions.push(...newTransactions);
        updateDisplay();
    }
});

// Adjusts the height of the right panel to match the left panel
function adjustRightPanelHeight() {
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    if (leftPanel && rightPanel) {
        rightPanel.style.maxHeight = `${leftPanel.offsetHeight}px`;
    }
}
window.addEventListener('DOMContentLoaded', adjustRightPanelHeight);
window.addEventListener('resize', adjustRightPanelHeight);