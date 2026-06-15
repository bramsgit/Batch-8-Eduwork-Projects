// 1. DATA PRODUK
const products = [
    { id: 1, name: "Minimalist Shirt", price: "IDR 249.000", image: "produk1.jpg", category: "clothing" },
    { id: 2, name: "Classic Trousers", price: "IDR 399.000", image: "produk2.jpg", category: "clothing" },
    { id: 3, name: "Leather Tote Bag", price: "IDR 549.000", image: "produk3.jpg", category: "accessories" },
    { id: 4, name: "Canvas Sneakers", price: "IDR 449.000", image: "produk4.jpg", category: "shoes" },
    { id: 5, name: "Woolen Scarf", price: "IDR 199.000", image: "produk5.jpg", category: "accessories" },
    { id: 6, name: "Denim Jacket", price: "IDR 599.000", image: "produk6.jpg", category: "clothing" },
    { id: 7, name: "Silk Blouse", price: "IDR 349.000", image: "produk7.jpg", category: "clothing" },
    { id: 8, name: "Chino Shorts", price: "IDR 299.000", image: "produk8.jpg", category: "clothing" },
    { id: 9, name: "Woolen Coat", price: "IDR 899.000", image: "produk9.jpg", category: "clothing" },
    { id: 10, name: "Linen Dress", price: "IDR 499.000", image: "produk10.jpg", category: "clothing" },
    { id: 11, name: "Cashmere Sweater", price: "IDR 799.000", image: "produk11.jpg", category: "clothing" },
    { id: 12, name: "Leather Belt", price: "IDR 149.000", image: "produk12.jpg", category: "accessories" },
    { id: 13, name: "Cotton T-Shirt", price: "IDR 99.000", image: "produk13.jpg", category: "clothing" },
    { id: 14, name: "Woolen Hat", price: "IDR 129.000", image: "produk14.jpg", category: "accessories" },
    { id: 15, name: "Denim Skirt", price: "IDR 349.000", image: "produk15.jpg", category: "clothing" },
    { id: 16, name: "Silk Tie", price: "IDR 199.000", image: "produk16.jpg", category: "accessories" },
    { id: 17, name: "Canvas Backpack", price: "IDR 499.000", image: "produk17.jpg", category: "accessories" },
    { id: 18, name: "Ballet Flats", price: "IDR 349.000", image: "produk18.jpg", category: "shoes" },
    { id: 19, name: "Leather Wallet", price: "IDR 199.000", image: "produk19.jpg", category: "accessories" },
    { id: 20, name: "Cotton Socks", price: "IDR 49.000", image: "produk20.jpg", category: "clothing" }
];

let currentFilter = "all";
let searchQuery = "";

const container = document.getElementById('productContainer');
const searchInput = document.getElementById('product-search');
const filterButtons = document.querySelectorAll('.filter-button');

document.querySelector('[data-filter="all"]')?.classList.add('active');

function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchCategory = currentFilter === "all" || product.category === currentFilter;
        const query = searchQuery.toLowerCase().trim();
        const matchSearch = product.name.toLowerCase().includes(query) || 
                            product.category.toLowerCase().includes(query);
        
        return matchCategory && matchSearch;
    });

    if (filteredProducts.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777; font-family: 'SN Pro', sans-serif;">No products found.</p>`;
        return;
    }

    container.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        </article>
    `).join('');
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
    
        document.querySelector('.filter-button.active')?.classList.remove('active');
        button.classList.add('active');

        const targetFilter = button.getAttribute('data-filter');
        currentFilter = targetFilter;

        if (targetFilter === "all") {
            searchInput.value = "";
            searchQuery = ""; 
        } else {
            searchInput.value = targetFilter;
            searchQuery = targetFilter; 
        }

        renderProducts();
    });
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
});

renderProducts();