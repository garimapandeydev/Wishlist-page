const productContainer = document.getElementById('product-container');
const wishlistTab = document.getElementById('wishlist-tab');
const wishlistTabButton = document.getElementById('wishlist-tab-btn');  

fetch('https://673b0b20339a4ce4451a4c97.mockapi.io/products', {
  method: 'GET',
  headers: { 'content-type': 'application/json' },
})
.then(res => {
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
})
.then(products => {
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    const isFavorite = product.favorites;

    productElement.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        Actual Price: 
        <span class="product-price" style="text-decoration: line-through;">$${product.price}</span>
        <br>
        Discount: 
        <span class="product-discount">$${product.discount}</span>
        <br>
        Discounted Price: 
        <span class="product-discount-price">
          $${(product.price - product.discount).toFixed(2)}
        </span>
        <button class="heart-btn" data-id="${product.id}">
          ${isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
        </button>
      </div>
    `;

    productContainer.appendChild(productElement);

    const heartButton = productElement.querySelector('.heart-btn');
    heartButton.addEventListener('click', () => toggleFavorite(product));
  });
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
  productContainer.innerHTML = '<p>Sorry, we could not load the products. Please try again later.</p>';
});

function toggleFavorite(product) {
  const updatedProduct = { ...product, favorites: !product.favorites };

  fetch(`https://673b0b20339a4ce4451a4c97.mockapi.io/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProduct),
  })
  .then(response => response.json())
  .then(() => {
    console.log('Product favorites status updated');
    updateLocalStorage(updatedProduct);
    refreshProductList();
    loadWishlist();  
  })
  .catch(error => console.error('Error updating product favorites:', error));
}

function updateLocalStorage(updatedProduct) {
  const favorites = getFavoritesFromLocalStorage();
  
  const productIndex = favorites.findIndex(fav => fav.id === updatedProduct.id);

  if (productIndex === -1) {
    favorites.push(updatedProduct);
  } else {
    favorites.splice(productIndex, 1);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function getFavoritesFromLocalStorage() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

function refreshProductList() {
  productContainer.innerHTML = '';

  fetch('https://673b0b20339a4ce4451a4c97.mockapi.io/products', {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  })
  .then(products => {
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');

      const isFavorite = product.favorites;

      productElement.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          Actual Price: 
          <span class="product-price" style="text-decoration: line-through;">$${product.price}</span>
          <br>
          Discount: 
          <span class="product-discount">$${product.discount}</span>
          <br>
          Discounted Price: 
          <span class="product-discount-price">
            $${(product.price - product.discount).toFixed(2)}
          </span>
          <button class="heart-btn" data-id="${product.id}">
            ${isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
          </button>
        </div>
      `;

      productContainer.appendChild(productElement);

      const heartButton = productElement.querySelector('.heart-btn');
      heartButton.addEventListener('click', () => toggleFavorite(product));
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    productContainer.innerHTML = '<p>Sorry, we could not load the products. Please try again later.</p>';
  });
}

function loadWishlist() {
  const favorites = getFavoritesFromLocalStorage();

  if (favorites.length === 0) {
    wishlistTab.innerHTML = '<p>Your wishlist is empty.</p>';
    wishlistTab.style.display = 'block';  
  } else {
    wishlistTab.innerHTML = ''; 
    favorites.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');

      productElement.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-price">$${(product.price - product.discount).toFixed(2)}</span>
          <button class="remove-btn" data-id="${product.id}">❌ Remove</button>
        </div>
      `;
      wishlistTab.appendChild(productElement);

      const removeButton = productElement.querySelector('.remove-btn');
      removeButton.addEventListener('click', () => {
        toggleFavorite(product);  
        loadWishlist();  
      });
    });

    wishlistTab.style.display = 'block'; 
  }
}


wishlistTabButton.addEventListener('click', () => {
  if (wishlistTab.style.display === 'none') {
    loadWishlist();
  } else {
    wishlistTab.style.display = 'none'; 
  }
});
