// Dashboard Logic

// Update user info in topbar
function updateUserInfo() {
    const user = getCurrentUser();
    if (user.name) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
    }
}

// Load and display statistics
function loadStatistics() {
    const products = getProducts();
    const categories = getCategories();
    const suppliers = getSuppliers();
    
    // Total products
    document.getElementById('totalProducts').textContent = products.length;
    
    // Low stock and out of stock products
    const lowStockCount = products.filter(p => {
        const status = getProductStatus(p.quantity, p.minStock);
        return status === 'low-stock' || status === 'out-of-stock';
    }).length;
    document.getElementById('lowStockProducts').textContent = lowStockCount;
    
    // Total categories
    document.getElementById('totalCategories').textContent = categories.length;
    
    // Total suppliers
    document.getElementById('totalSuppliers').textContent = suppliers.length;
}

// Load recent products
function loadRecentProducts() {
    const products = getProducts();
    const categories = getCategories();
    
    // Sort by creation date (most recent first) and take first 5
    const recentProducts = products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    const tableBody = document.getElementById('recentProductsTable');
    
    if (recentProducts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500">Aucun produit disponible</td></tr>';
        return;
    }
    
    tableBody.innerHTML = recentProducts.map(product => {
        const category = getCategoryById(product.categoryId);
        const status = getProductStatus(product.quantity, product.minStock);
        
        let statusBadge = '';
        if (status === 'available') {
            statusBadge = '<span class="badge-available">Disponible</span>';
        } else if (status === 'low-stock') {
            statusBadge = '<span class="badge-low-stock">Stock faible</span>';
        } else {
            statusBadge = '<span class="badge-out-of-stock">Rupture</span>';
        }
        
        return `
            <tr>
                <td class="font-semibold">${product.name}</td>
                <td>${category ? category.name : 'N/A'}</td>
                <td>${product.quantity}</td>
                <td>${formatPrice(product.price)}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(price);
}

// Create stock chart
function createStockChart() {
    const products = getProducts();
    const categories = getCategories();
    
    // Calculate total quantity per category
    const categoryData = categories.map(category => {
        const categoryProducts = products.filter(p => p.categoryId === category.id);
        const totalQuantity = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);
        return {
            name: category.name,
            quantity: totalQuantity
        };
    });
    
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryData.map(c => c.name),
            datasets: [{
                label: 'Quantité en stock',
                data: categoryData.map(c => c.quantity),
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    'rgba(79, 70, 229, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Initialize dashboard
function initDashboard() {
    updateUserInfo();
    loadStatistics();
    loadRecentProducts();
    createStockChart();
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', initDashboard);
