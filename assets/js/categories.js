// Categories Management Logic

let editingCategoryId = null;

// Update user info
function updateUserInfo() {
    const user = getCurrentUser();
    if (user.name) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
    }
}

// Count products in category
function countProductsInCategory(categoryId) {
    const products = getProducts();
    return products.filter(p => p.categoryId === categoryId).length;
}

// Load and display all categories
function loadCategories() {
    const categories = getCategories();
    const grid = document.getElementById('categoriesGrid');
    
    if (categories.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-gray-500">Aucune catégorie disponible</div>';
        return;
    }
    
    grid.innerHTML = categories.map(category => {
        const productCount = countProductsInCategory(category.id);
        
        return `
            <div class="col-md-6 col-lg-4">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="stat-icon primary">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                        </div>
                        <div>
                            <button class="action-btn edit me-2" onclick="editCategory(${category.id})" data-bs-toggle="modal" data-bs-target="#categoryModal">
                                <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button class="action-btn delete" onclick="deleteCategory(${category.id})">
                                <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <h3 class="h5 font-bold text-gray-800 mb-2">${category.name}</h3>
                    <p class="text-gray-600 text-sm mb-3">${category.description || 'Aucune description'}</p>
                    
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-primary">${productCount} produit${productCount !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Open modal for adding new category
function openAddCategoryModal() {
    editingCategoryId = null;
    document.getElementById('categoryModalLabel').textContent = 'Ajouter une catégorie';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
}

// Edit category
function editCategory(id) {
    editingCategoryId = id;
    const category = getCategoryById(id);
    
    if (!category) return;
    
    document.getElementById('categoryModalLabel').textContent = 'Modifier la catégorie';
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDescription').value = category.description || '';
}

// Save category (add or update)
function saveCategory() {
    const form = document.getElementById('categoryForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const categoryData = {
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value
    };
    
    const categories = getCategories();
    
    if (editingCategoryId) {
        // Update existing category
        const index = categories.findIndex(c => c.id === editingCategoryId);
        if (index !== -1) {
            categories[index] = {
                ...categories[index],
                ...categoryData
            };
        }
    } else {
        // Add new category
        const newCategory = {
            id: getNextId(categories),
            ...categoryData
        };
        categories.push(newCategory);
    }
    
    saveCategories(categories);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
    modal.hide();
    
    // Reload categories
    loadCategories();
    
    // Reset form
    form.reset();
    editingCategoryId = null;
}

// Delete category
function deleteCategory(id) {
    const productCount = countProductsInCategory(id);
    
    if (productCount > 0) {
        alert(`Impossible de supprimer cette catégorie car elle contient ${productCount} produit(s). Veuillez d'abord supprimer ou déplacer les produits.`);
        return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
        return;
    }
    
    const categories = getCategories();
    const filteredCategories = categories.filter(c => c.id !== id);
    saveCategories(filteredCategories);
    
    loadCategories();
}

// Initialize page
function initCategoriesPage() {
    updateUserInfo();
    loadCategories();
}

// Load page on DOM ready
document.addEventListener('DOMContentLoaded', initCategoriesPage);
