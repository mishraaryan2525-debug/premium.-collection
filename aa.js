 // ==========================================
// SHARED DATA STATE
// ==========================================
let products = [
    {
        id: 1,
        name: "Classic White Tee",
        category: "Men",
        price: 499,
        rating: 4.2,
        image: "https://picsum.photos/seed/menst/300",
        stock: 50,
        description: "A timeless classic white t-shirt for everyday wear."
    },
    {
        id: 2,
        name: "Floral Summer Dress",
        category: "Women",
        price: 1299,
        rating: 4.7,
        image: "https://picsum.photos/seed/womendress/300",
        stock: 30,
        description: "Beautiful floral dress perfect for summer outings."
    },
    {
        id: 3,
        name: "Kids Denim Jacket",
        category: "Kids",
        price: 899,
        rating: 4.5,
        image: "https://picsum.photos/seed/kidsjacket/300",
        stock: 40,
        description: "Stylish denim jacket for kids, durable and trendy."
    },
    {
        id: 4,
        name: "Leather Belt",
        category: "Accessories",
        price: 349,
        rating: 4.0,
        image: "https://picsum.photos/seed/leatherbelt/300",
        stock: 100,
        description: "Genuine leather belt with classic buckle design."
    },
    {
        id: 5,
        name: "Men's Chinos",
        category: "Men",
        price: 999,
        rating: 4.3,
        image: "https://picsum.photos/seed/menschinos/300",
        stock: 45,
        description: "Comfortable slim-fit chinos for a polished look."
    },
    {
        id: 6,
        name: "Women's Kurti",
        category: "Women",
        price: 799,
        rating: 4.6,
        image: "https://picsum.photos/seed/womenkurti/300",
        stock: 60,
        description: "Elegant kurti with intricate embroidery work."
    },
    {
        id: 7,
        name: "Kids Joggers",
        category: "Kids",
        price: 649,
        rating: 4.1,
        image: "https://picsum.photos/seed/kidsjoggers/300",
        stock: 55,
        description: "Comfortable joggers for active kids."
    },
    {
        id: 8,
        name: "Canvas Tote Bag",
        category: "Accessories",
        price: 449,
        rating: 4.4,
        image: "https://picsum.photos/seed/canvastote/300",
        stock: 80,
        description: "Spacious canvas tote bag for everyday use."
    }
];

let cart = [];
let nextProductId = 9;

// ==========================================
// CURSOR TRAIL EFFECT (Added from new JS)
// ==========================================
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.hue = 0;
    }

    init() {
        const canvas = document.createElement('canvas');
        canvas.id = 'cursor-trail';
        canvas.style.cssText = `
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%;
            pointer-events: none; 
            z-index: 9998;
        `;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        window.addEventListener('mousemove', (e) => {
            this.trail.push({ 
                x: e.clientX, 
                y: e.clientY, 
                life: 1 
            });
            if (this.trail.length > this.maxTrail) {
                this.trail.shift();
            }
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.hue = (this.hue + 0.5) % 360;

            this.trail.forEach((point, i) => {
                point.life -= 0.03;
                if (point.life <= 0) return;

                const size = point.life * 8;
                const alpha = point.life * 0.6;
                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue + i * 5}, 80%, 60%, ${alpha})`;
                ctx.fill();
            });

            this.trail = this.trail.filter(p => p.life > 0);
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function showPanel(panelId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(panelId).classList.add('active');
}

function showToast(message, icon = '??') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    toastMsg.textContent = message;
    toastIcon.textContent = icon;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 2500);
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.3;
    for (let i = 0; i < fullStars; i++) stars += '?';
    if (hasHalf) stars += '?';
    while (stars.length < 5) stars += '?';
    return stars;
}

function formatPrice(price) {
    return '?' + price.toLocaleString('en-IN');
}

// ==========================================
// LOGIN LOGIC
// ==========================================
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorEl = document.getElementById('login-error');

    if (!username || !password) {
        errorEl.textContent = 'Please enter both username and password.';
        return;
    }

    if (username === 'admin' && password === '1234') {
        errorEl.textContent = '';
        showPanel('customer-panel');
        renderProducts();
        renderCart();
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else if (username === 'admin' && password === '4321') {
        errorEl.textContent = '';
        showPanel('admin-panel');
        renderAdminProducts();
        updateDashboardStats();
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        errorEl.textContent = 'Invalid credentials. Please try again.';
        // Shake animation
        const card = document.querySelector('.login-card-right');
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'shake 0.5s ease';
        }, 10);
    }
}

// Enter key support for login
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');

    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
});

// Add shake animation CSS dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

function logout(from) {
    showPanel('login-panel');
    if (from === 'admin') {
        // Close sidebar on mobile
        document.getElementById('admin-sidebar').classList.remove('active');
        document.getElementById('admin-sidebar-overlay').classList.remove('active');
    }
    // Close mobile menu if open
    document.getElementById('mobile-menu').classList.remove('active');
}

// ==========================================
// CUSTOMER PANEL - PRODUCT RENDERING
// ==========================================
function renderProducts() {
    const grid = document.getElementById('product-grid');
    const noProducts = document.getElementById('no-products');

    const searchTerm = document.getElementById('search-input') ? 
        document.getElementById('search-input').value.toLowerCase() : '';
    const categoryFilter = document.getElementById('category-filter') ? 
        document.getElementById('category-filter').value : 'All';
    const sortFilter = document.getElementById('sort-filter') ? 
        document.getElementById('sort-filter').value : 'newest';

    let filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Sort
    switch (sortFilter) {
        case 'price-lh':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-hl':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
        default:
            filtered.sort((a, b) => b.id - a.id);
            break;
    }

    if (filtered.length === 0) {
        grid.innerHTML = '';
        noProducts.style.display = 'block';
        return;
    }

    noProducts.style.display = 'none';

    grid.innerHTML = filtered.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.1}s">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-category-badge">${product.category}</span>
                <button class="product-wishlist" 
                    onclick="showToast('Added to wishlist!', '??')">?</button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${generateStars(product.rating)}</span>
                    <span class="rating-value">(${product.rating})</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        ?? Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    renderProducts();
}

// ==========================================
// CUSTOMER PANEL - CART
// ==========================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCartBadge();
    renderCart();
    showToast(`${product.name} added to cart!`);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.classList.remove('bounce');
    setTimeout(() => badge.classList.add('bounce'), 10);
}

function renderCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartEmptyEl = document.getElementById('cart-empty');
    const cartFooterEl = document.getElementById('cart-footer');

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '';
        cartEmptyEl.classList.add('active');
        cartFooterEl.style.display = 'none';
        return;
    }

    cartEmptyEl.classList.remove('active');
    cartFooterEl.style.display = 'block';

    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">?</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                    <button class="cart-item-remove" 
                        onclick="removeFromCart(${item.id})" title="Remove">???</button>
                </div>
            </div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('cart-gst').textContent = formatPrice(gst);
    document.getElementById('cart-total').textContent = formatPrice(total);
}

function changeQty(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    updateCartBadge();
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartBadge();
    renderCart();
    showToast('Item removed from cart', '???');
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function checkout() {
    if (cart.length === 0) return;

    toggleCart();

    setTimeout(() => {
        document.getElementById('success-overlay').classList.add('active');
        document.getElementById('success-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 300);

    cart = [];
    updateCartBadge();
    renderCart();
}

function closeSuccessModal() {
    document.getElementById('success-overlay').classList.remove('active');
    document.getElementById('success-modal').classList.remove('active');
    document.body.style.overflow = '';
}

// ==========================================
// CUSTOMER PANEL - NAVIGATION
// ==========================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('hero-section').style.display = '';
    document.getElementById('filter-section') && 
        (document.querySelector('.filter-section').style.display = '');
    document.querySelector('.products-section').style.display = '';
    document.getElementById('about-section').style.display = 'none';
}

function scrollToShop() {
    document.getElementById('hero-section').style.display = '';
    document.querySelector('.filter-section').style.display = '';
    document.querySelector('.products-section').style.display = '';
    document.getElementById('about-section').style.display = 'none';

    setTimeout(() => {
        document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function showAbout() {
    document.getElementById('hero-section').style.display = 'none';
    document.querySelector('.filter-section').style.display = 'none';
    document.querySelector('.products-section').style.display = 'none';
    document.getElementById('about-section').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('active');
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('customer-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ==========================================
// ADMIN PANEL - DASHBOARD
// ==========================================
function updateDashboardStats() {
    document.getElementById('stat-products').textContent = products.length;
}

// ==========================================
// ADMIN PANEL - PRODUCT MANAGEMENT
// ==========================================
function renderAdminProducts() {
    const tbody = document.getElementById('admin-product-tbody');

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="table-product-img">
            </td>
            <td><strong>${product.name}</strong></td>
            <td>
                <span class="status-badge status-shipped">
                    ${product.category}
                </span>
            </td>
            <td>${formatPrice(product.price)}</td>
            <td>${product.stock || 0}</td>
            <td>${generateStars(product.rating)} ${product.rating}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" 
                        onclick="editProduct(${product.id})">?? Edit</button>
                    <button class="btn-delete" 
                        onclick="deleteProduct(${product.id})">??? Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const overlay = document.getElementById('product-modal-overlay');
    const title = document.getElementById('modal-title');
    const submitBtn = document.getElementById('modal-submit-btn');
    const form = document.getElementById('product-form');

    form.reset();
    document.getElementById('edit-product-id').value = '';

    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            title.textContent = 'Edit Product';
            submitBtn.textContent = 'Update Product';
            document.getElementById('edit-product-id').value = product.id;
            document.getElementById('prod-name').value = product.name;
            document.getElementById('prod-category').value = product.category;
            document.getElementById('prod-price').value = product.price;
            document.getElementById('prod-stock').value = product.stock || 0;
            document.getElementById('prod-rating').value = product.rating;
            document.getElementById('prod-image').value = product.image;
            document.getElementById('prod-desc').value = product.description || '';
        }
    } else {
        title.textContent = 'Add New Product';
        submitBtn.textContent = 'Add Product';
    }

    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
    document.getElementById('product-modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        products = products.filter(p => p.id !== productId);

        // Also remove from cart if present
        cart = cart.filter(item => item.id !== productId);

        renderAdminProducts();
        updateDashboardStats();
        renderProducts(); // Sync customer panel
        updateCartBadge();
        renderCart();
        showToast(`"${product.name}" deleted successfully`, '???');
    }
}

// Product form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const editId = document.getElementById('edit-product-id').value;
        const productData = {
            name: document.getElementById('prod-name').value.trim(),
            category: document.getElementById('prod-category').value,
            price: parseInt(document.getElementById('prod-price').value),
            stock: parseInt(document.getElementById('prod-stock').value),
            rating: parseFloat(document.getElementById('prod-rating').value),
            image: document.getElementById('prod-image').value.trim(),
            description: document.getElementById('prod-desc').value.trim()
        };

        if (editId) {
            // Update existing product
            const index = products.findIndex(p => p.id === parseInt(editId));
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };

                // Update cart item if it exists
                const cartItem = cart.find(item => item.id === parseInt(editId));
                if (cartItem) {
                    cartItem.name = productData.name;
                    cartItem.price = productData.price;
                    cartItem.image = productData.image;
                }

                showToast(`"${productData.name}" updated successfully`, '?');
            }
        } else {
            // Add new product
            const newProduct = {
                id: nextProductId++,
                ...productData
            };
            products.push(newProduct);
            showToast(`"${productData.name}" added successfully`, '?');
        }

        closeProductModal();
        renderAdminProducts();
        updateDashboardStats();
        renderProducts(); // Sync with customer panel
        renderCart(); // Update cart in case prices changed
    });
});

// ==========================================
// ADMIN PANEL - NAVIGATION
// ==========================================
function showAdminPage(page, linkEl) {
    // Hide all admin pages
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));

    // Show selected page
    document.getElementById(`admin-${page}`).classList.add('active');

    // Update sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    if (linkEl) linkEl.classList.add('active');

    // Close mobile sidebar
    document.getElementById('admin-sidebar').classList.remove('active');
    document.getElementById('admin-sidebar-overlay').classList.remove('active');

    // Refresh data on page switch
    if (page === 'dashboard') {
        updateDashboardStats();
    } else if (page === 'products') {
        renderAdminProducts();
    }
}

function toggleAdminSidebar() {
    document.getElementById('admin-sidebar').classList.toggle('active');
    document.getElementById('admin-sidebar-overlay').classList.toggle('active');
}

// ==========================================
// INITIAL RENDER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Ensure login panel is shown by default
    showPanel('login-panel');

    // ? Initialize Cursor Trail Effect HERE
    const cursorTrail = new CursorTrail();
    cursorTrail.init();
});