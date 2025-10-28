// Event listener ini memastikan kode JavaScript baru berjalan setelah seluruh elemen HTML dimuat.
document.addEventListener("DOMContentLoaded", () => {
  // --- Elemen DOM ---
  const productGrid = document.getElementById("product-grid");
  const loader = document.getElementById("loader");
  const errorMessage = document.getElementById("error-message");
  const cartCount = document.getElementById("cart-count");

  // Elemen Modal
  const modal = document.getElementById("productModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalImage = document.getElementById("modal-image");
  const modalCategory = document.getElementById("modal-category");
  const modalProductName = document.getElementById("modal-product-name");
  const modalPrice = document.getElementById("modal-price");
  const modalDescription = document.getElementById("modal-description");
  const modalAddToCartBtn = document.getElementById("modal-add-to-cart");
  const toastContainer = document.getElementById("toast-container");

  // --- State ---
  let products = [];
  let cart = [];
  const API_URL = "https://fakestoreapi.com/products";

  // --- Functions ---

  /**
   * Mengambil produk dari Fake Store API
   */
  async function fetchProducts() {
    loader.style.display = "block";
    productGrid.innerHTML = "";
    errorMessage.classList.add("hidden");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
      errorMessage.classList.remove("hidden");
    } finally {
      loader.style.display = "none";
    }
  }

  /**
   * Menampilkan produk di dalam grid
   * @param {Array} productsToDisplay - Array objek produk
   */
  function displayProducts(productsToDisplay) {
    productGrid.innerHTML = ""; // Bersihkan produk sebelumnya
    productsToDisplay.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className =
        "product-card bg-white rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer";
      productCard.dataset.productId = product.id;

      productCard.innerHTML = `
                <div class="p-4 bg-white h-48 flex items-center justify-center">
                    <img src="${product.image}" alt="${
        product.title
      }" class="max-h-full max-w-full object-contain">
                </div>
                <div class="p-4 border-t border-gray-200 flex flex-col flex-grow">
                    <span class="text-xs text-gray-500 capitalize">${
                      product.category
                    }</span>
                    <h3 class="text-md font-semibold text-gray-800 mt-1 flex-grow">${product.title.substring(
                      0,
                      40
                    )}...</h3>
                    <div class="mt-4 flex justify-between items-center">
                        <p class="text-lg font-bold text-blue-600">Rp ${Math.round(
                          product.price * 15000
                        ).toLocaleString("id-ID")}</p>
                        <button class="add-to-cart-btn bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full w-9 h-9 flex items-center justify-center transition-colors" data-product-id="${
                          product.id
                        }">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            `;
      productGrid.appendChild(productCard);
    });
  }

  /**
   * Menampilkan modal detail produk
   * @param {number} productId - ID produk yang akan ditampilkan
   */
  function showProductDetail(productId) {
    const product = products.find((p) => p.id == productId);
    if (!product) return;

    modalImage.src = product.image;
    modalCategory.textContent = product.category;
    modalProductName.textContent = product.title;
    modalPrice.textContent = `Rp ${Math.round(
      product.price * 15000
    ).toLocaleString("id-ID")}`;
    modalDescription.textContent = product.description;
    modalAddToCartBtn.dataset.productId = product.id; // Atur ID produk pada tombol

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Mencegah scroll di latar belakang
  }

  /**
   * Menyembunyikan modal detail produk
   */
  function hideModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  /**
   * Menambahkan produk ke keranjang dan memperbarui UI
   * @param {number} productId - ID produk yang akan ditambahkan
   */
  function addToCart(productId) {
    const product = products.find((p) => p.id == productId);
    if (product) {
      cart.push(product);
      updateCartCounter();
      showToast(
        `${product.title.substring(0, 20)}... ditambahkan ke keranjang!`
      );
    }
  }

  /**
   * Memperbarui tampilan counter keranjang
   */
  function updateCartCounter() {
    cartCount.textContent = cart.length;
  }

  /**
   * Menampilkan notifikasi toast
   * @param {string} message - Pesan yang akan ditampilkan
   */
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className =
      "toast-notification bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg";
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000); // Hapus toast setelah 3 detik
  }

  // --- Event Listeners ---

  // Menangani klik pada grid produk (untuk melihat detail atau menambah ke keranjang)
  productGrid.addEventListener("click", (e) => {
    const addToCartBtn = e.target.closest(".add-to-cart-btn");
    if (addToCartBtn) {
      const productId = addToCartBtn.dataset.productId;
      addToCart(productId);
      return; // Hentikan proses lebih lanjut
    }

    const card = e.target.closest(".product-card");
    if (card) {
      const productId = card.dataset.productId;
      showProductDetail(productId);
    }
  });

  // Menambah ke keranjang dari modal
  modalAddToCartBtn.addEventListener("click", () => {
    const productId = modalAddToCartBtn.dataset.productId;
    addToCart(productId);
    hideModal();
  });

  // Event untuk menutup modal
  closeModalBtn.addEventListener("click", hideModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      hideModal();
    }
  });

  // --- Pemuatan Awal ---
  fetchProducts();
});
