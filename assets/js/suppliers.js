// Suppliers Management Logic

let editingSupplierId = null;

// Update user info
function updateUserInfo() {
    const user = getCurrentUser();
    if (user.name) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
    }
}

// Count products from supplier
function countProductsFromSupplier(supplierId) {
    const products = getProducts();
    return products.filter(p => p.supplierId === supplierId).length;
}

// Load and display all suppliers
function loadSuppliers() {
    const suppliers = getSuppliers();
    const tableBody = document.getElementById('suppliersTable');
    
    if (suppliers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500">Aucun fournisseur disponible</td></tr>';
        return;
    }
    
    tableBody.innerHTML = suppliers.map(supplier => {
        const productCount = countProductsFromSupplier(supplier.id);
        
        return `
            <tr>
                <td class="font-semibold">#${supplier.id}</td>
                <td class="font-semibold">${supplier.name}</td>
                <td>
                    <a href="mailto:${supplier.email}" class="text-primary">
                        ${supplier.email}
                    </a>
                </td>
                <td>${supplier.phone}</td>
                <td>${supplier.address || 'N/A'}</td>
                <td>
                    <span class="badge bg-primary">${productCount} produit${productCount !== 1 ? 's' : ''}</span>
                </td>
                <td>
                    <button class="action-btn edit me-2" onclick="editSupplier(${supplier.id})" data-bs-toggle="modal" data-bs-target="#supplierModal">
                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Modifier
                    </button>
                    <button class="action-btn delete" onclick="deleteSupplier(${supplier.id})">
                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Supprimer
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Open modal for adding new supplier
function openAddSupplierModal() {
    editingSupplierId = null;
    document.getElementById('supplierModalLabel').textContent = 'Ajouter un fournisseur';
    document.getElementById('supplierForm').reset();
    document.getElementById('supplierId').value = '';
}

// Edit supplier
function editSupplier(id) {
    editingSupplierId = id;
    const supplier = getSupplierById(id);
    
    if (!supplier) return;
    
    document.getElementById('supplierModalLabel').textContent = 'Modifier le fournisseur';
    document.getElementById('supplierId').value = supplier.id;
    document.getElementById('supplierName').value = supplier.name;
    document.getElementById('supplierEmail').value = supplier.email;
    document.getElementById('supplierPhone').value = supplier.phone;
    document.getElementById('supplierAddress').value = supplier.address || '';
}

// Save supplier (add or update)
function saveSupplier() {
    const form = document.getElementById('supplierForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const supplierData = {
        name: document.getElementById('supplierName').value,
        email: document.getElementById('supplierEmail').value,
        phone: document.getElementById('supplierPhone').value,
        address: document.getElementById('supplierAddress').value
    };
    
    const suppliers = getSuppliers();
    
    if (editingSupplierId) {
        // Update existing supplier
        const index = suppliers.findIndex(s => s.id === editingSupplierId);
        if (index !== -1) {
            suppliers[index] = {
                ...suppliers[index],
                ...supplierData
            };
        }
    } else {
        // Add new supplier
        const newSupplier = {
            id: getNextId(suppliers),
            ...supplierData
        };
        suppliers.push(newSupplier);
    }
    
    saveSuppliers(suppliers);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('supplierModal'));
    modal.hide();
    
    // Reload suppliers
    loadSuppliers();
    
    // Reset form
    form.reset();
    editingSupplierId = null;
}

// Delete supplier
function deleteSupplier(id) {
    const productCount = countProductsFromSupplier(id);
    
    if (productCount > 0) {
        alert(`Impossible de supprimer ce fournisseur car il est associé à ${productCount} produit(s). Veuillez d'abord supprimer ou réassigner les produits.`);
        return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
        return;
    }
    
    const suppliers = getSuppliers();
    const filteredSuppliers = suppliers.filter(s => s.id !== id);
    saveSuppliers(filteredSuppliers);
    
    loadSuppliers();
}

// Initialize page
function initSuppliersPage() {
    updateUserInfo();
    loadSuppliers();
}

// Load page on DOM ready
document.addEventListener('DOMContentLoaded', initSuppliersPage);
