// LocalStorage Management and Data Initialization - Multi-user support

// Get current user email
function getCurrentUserEmail() {
    return localStorage.getItem('userEmail') || 'guest';
}

// Storage Keys - Dynamic per user
const STORAGE_KEYS = {
    PRODUCTS: () => `stock_products_${getCurrentUserEmail()}`,
    CATEGORIES: () => `stock_categories_${getCurrentUserEmail()}`,
    SUPPLIERS: () => `stock_suppliers_${getCurrentUserEmail()}`,
    INITIALIZED: () => `stock_initialized_${getCurrentUserEmail()}`
};

// LocalStorage Utilities
const Storage = {
    get: function(key) {
        const storageKey = typeof key === 'function' ? key() : key;
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : null;
    },
    
    set: function(key, value) {
        const storageKey = typeof key === 'function' ? key() : key;
        localStorage.setItem(storageKey, JSON.stringify(value));
    },
    
    remove: function(key) {
        const storageKey = typeof key === 'function' ? key() : key;
        localStorage.removeItem(key);
    },
    
    clear: function() {
        const userEmail = getCurrentUserEmail();
        localStorage.removeItem(`stock_products_${userEmail}`);
        localStorage.removeItem(`stock_categories_${userEmail}`);
        localStorage.removeItem(`stock_suppliers_${userEmail}`);
        localStorage.removeItem(`stock_initialized_${userEmail}`);
    }
};

// Initial Data
const INITIAL_DATA = {
    categories: [
        { id: 1, name: 'Électronique', description: 'Appareils et accessoires électroniques' },
        { id: 2, name: 'Vêtements', description: 'Vêtements et accessoires de mode' },
        { id: 3, name: 'Alimentation', description: 'Produits alimentaires et boissons' },
        { id: 4, name: 'Mobilier', description: 'Meubles et décoration' },
        { id: 5, name: 'Sport', description: 'Équipements et accessoires sportifs' }
    ],
    
    suppliers: [
        { 
            id: 1, 
            name: 'TechSupply SARL', 
            email: 'contact@techsupply.com', 
            phone: '+225 27 20 30 40 50',
            address: 'Abidjan, Plateau'
        },
        { 
            id: 2, 
            name: 'Fashion Import', 
            email: 'info@fashionimport.ci', 
            phone: '+225 07 08 09 10 11',
            address: 'Abidjan, Marcory'
        },
        { 
            id: 3, 
            name: 'Agro Distribution', 
            email: 'ventes@agrodist.com', 
            phone: '+225 05 06 07 08 09',
            address: 'Abidjan, Yopougon'
        },
        { 
            id: 4, 
            name: 'Meuble Plus', 
            email: 'contact@meubleplus.ci', 
            phone: '+225 01 02 03 04 05',
            address: 'Abidjan, Cocody'
        },
        { 
            id: 5, 
            name: 'Sport Pro', 
            email: 'info@sportpro.com', 
            phone: '+225 25 26 27 28 29',
            address: 'Abidjan, Treichville'
        }
    ],
    
    products: [
        { 
            id: 1, 
            name: 'Smartphone Samsung Galaxy A54', 
            categoryId: 1, 
            supplierId: 1, 
            quantity: 45, 
            price: 250000,
            minStock: 10,
            createdAt: new Date('2024-01-15').toISOString()
        },
        { 
            id: 2, 
            name: 'Ordinateur Portable HP', 
            categoryId: 1, 
            supplierId: 1, 
            quantity: 8, 
            price: 450000,
            minStock: 10,
            createdAt: new Date('2024-01-20').toISOString()
        },
        { 
            id: 3, 
            name: 'Écouteurs Bluetooth', 
            categoryId: 1, 
            supplierId: 1, 
            quantity: 120, 
            price: 15000,
            minStock: 20,
            createdAt: new Date('2024-02-01').toISOString()
        },
        { 
            id: 4, 
            name: 'T-shirt Homme Coton', 
            categoryId: 2, 
            supplierId: 2, 
            quantity: 200, 
            price: 8000,
            minStock: 30,
            createdAt: new Date('2024-02-05').toISOString()
        },
        { 
            id: 5, 
            name: 'Jean Femme Slim', 
            categoryId: 2, 
            supplierId: 2, 
            quantity: 5, 
            price: 25000,
            minStock: 10,
            createdAt: new Date('2024-02-10').toISOString()
        },
        { 
            id: 6, 
            name: 'Chaussures Sport Nike', 
            categoryId: 2, 
            supplierId: 2, 
            quantity: 0, 
            price: 45000,
            minStock: 15,
            createdAt: new Date('2024-02-12').toISOString()
        },
        { 
            id: 7, 
            name: 'Riz Parfumé 25kg', 
            categoryId: 3, 
            supplierId: 3, 
            quantity: 150, 
            price: 18000,
            minStock: 50,
            createdAt: new Date('2024-02-15').toISOString()
        },
        { 
            id: 8, 
            name: 'Huile de Palme 5L', 
            categoryId: 3, 
            supplierId: 3, 
            quantity: 80, 
            price: 12000,
            minStock: 30,
            createdAt: new Date('2024-02-18').toISOString()
        },
        { 
            id: 9, 
            name: 'Café Soluble 200g', 
            categoryId: 3, 
            supplierId: 3, 
            quantity: 3, 
            price: 5000,
            minStock: 10,
            createdAt: new Date('2024-02-20').toISOString()
        },
        { 
            id: 10, 
            name: 'Canapé 3 Places', 
            categoryId: 4, 
            supplierId: 4, 
            quantity: 12, 
            price: 350000,
            minStock: 5,
            createdAt: new Date('2024-02-22').toISOString()
        },
        { 
            id: 11, 
            name: 'Table à Manger 6 Places', 
            categoryId: 4, 
            supplierId: 4, 
            quantity: 7, 
            price: 180000,
            minStock: 10,
            createdAt: new Date('2024-02-25').toISOString()
        },
        { 
            id: 12, 
            name: 'Lampe de Bureau LED', 
            categoryId: 4, 
            supplierId: 4, 
            quantity: 35, 
            price: 22000,
            minStock: 15,
            createdAt: new Date('2024-03-01').toISOString()
        },
        { 
            id: 13, 
            name: 'Ballon de Football', 
            categoryId: 5, 
            supplierId: 5, 
            quantity: 60, 
            price: 12000,
            minStock: 20,
            createdAt: new Date('2024-03-05').toISOString()
        },
        { 
            id: 14, 
            name: 'Raquette de Tennis', 
            categoryId: 5, 
            supplierId: 5, 
            quantity: 0, 
            price: 35000,
            minStock: 10,
            createdAt: new Date('2024-03-08').toISOString()
        },
        { 
            id: 15, 
            name: 'Tapis de Yoga', 
            categoryId: 5, 
            supplierId: 5, 
            quantity: 25, 
            price: 18000,
            minStock: 15,
            createdAt: new Date('2024-03-10').toISOString()
        },
        { 
            id: 16, 
            name: 'Montre Connectée', 
            categoryId: 1, 
            supplierId: 1, 
            quantity: 6, 
            price: 85000,
            minStock: 10,
            createdAt: new Date('2024-03-12').toISOString()
        },
        { 
            id: 17, 
            name: 'Sac à Dos Cuir', 
            categoryId: 2, 
            supplierId: 2, 
            quantity: 40, 
            price: 32000,
            minStock: 15,
            createdAt: new Date('2024-03-15').toISOString()
        }
    ]
};

// Initialize data if not exists
function initializeData() {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED());
    
    if (!isInitialized) {
        Storage.set(STORAGE_KEYS.CATEGORIES, INITIAL_DATA.categories);
        Storage.set(STORAGE_KEYS.SUPPLIERS, INITIAL_DATA.suppliers);
        Storage.set(STORAGE_KEYS.PRODUCTS, INITIAL_DATA.products);
        localStorage.setItem(STORAGE_KEYS.INITIALIZED(), 'true');
    }
}

// Get all products
function getProducts() {
    return Storage.get(STORAGE_KEYS.PRODUCTS) || [];
}

// Get all categories
function getCategories() {
    return Storage.get(STORAGE_KEYS.CATEGORIES) || [];
}

// Get all suppliers
function getSuppliers() {
    return Storage.get(STORAGE_KEYS.SUPPLIERS) || [];
}

// Get product by ID
function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === parseInt(id));
}

// Get category by ID
function getCategoryById(id) {
    const categories = getCategories();
    return categories.find(c => c.id === parseInt(id));
}

// Get supplier by ID
function getSupplierById(id) {
    const suppliers = getSuppliers();
    return suppliers.find(s => s.id === parseInt(id));
}

// Save products
function saveProducts(products) {
    Storage.set(STORAGE_KEYS.PRODUCTS, products);
}

// Save categories
function saveCategories(categories) {
    Storage.set(STORAGE_KEYS.CATEGORIES, categories);
}

// Save suppliers
function saveSuppliers(suppliers) {
    Storage.set(STORAGE_KEYS.SUPPLIERS, suppliers);
}

// Get product status
function getProductStatus(quantity, minStock = 10) {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < minStock) return 'low-stock';
    return 'available';
}

// Get next ID
function getNextId(items) {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map(item => item.id)) + 1;
}

// Note: Data initialization is now called after login in auth.js
// This ensures each user gets their own isolated data
