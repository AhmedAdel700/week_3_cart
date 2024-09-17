// DOM Elements
let logInBtn = document.querySelector(".log-in-out"),
    logoutBtn = document.querySelector(".log-out"),
    loginPage = document.getElementById("first-case"),
    logoutPage = document.getElementById("second-case"),
    loginForm = document.getElementById("loginForm"),
    itemsSection = document.querySelector("#items"),
    loading = document.querySelector(".loading"),
    cartSection = document.querySelector("#cart"),
    cleanCart = document.querySelector("#clean"),
    noAuthLinks = document.querySelectorAll(".logo a , header nav a"),
    cartText = document.querySelector("#buy"),
    currentItemsText = document.querySelector(".current-items"),
    totalPrice = document.querySelector(".total-price");


// Login Page (index.html)
let loginState = JSON.parse(window.localStorage.getItem("loginState")) || false;

// Update button text based on loginState
if (logInBtn) {
    logInBtn.innerHTML = loginState ? 'log-out' : "login";
}

// Handle login state on login page
if (window.location.pathname.includes("index.html")) {
    if (loginState) {
        loginPage?.classList.remove('d-none');
        logoutPage?.classList.add('d-none');
    } else {
        loginPage?.classList.add('d-none');
        logoutPage?.classList.remove('d-none');
    }
}

if (logInBtn) {
    logInBtn.onclick = function () {
        window.location.href = "index.html";

        if (logInBtn.innerHTML === 'log-out') {
            loginState = false;
        }

        window.localStorage.setItem('loginState', JSON.stringify(loginState));
    };
}

if (logoutBtn) {
    logoutBtn.onclick = function () {
        loginState = false;
        window.localStorage.setItem('loginState', JSON.stringify(loginState));
        window.location.href = "index.html";
    };
}

if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        loginState = !loginState;
        window.localStorage.setItem('loginState', JSON.stringify(loginState));
        window.location.href = "index.html";
    });
}

noAuthLinks.forEach(link => {
    if (!loginState) {
        link.classList.add("no-auth");
    } else {
        link.classList.remove("no-auth");
    }
});

// Check if elements exist to avoid errors
if (itemsSection) {
    // Home Page
    function createItemDiv(items) {
        items.forEach(item => {
            let itemDiv = document.createElement("div");
            itemDiv.classList.add("item");

            let imgDiv = document.createElement("div");
            imgDiv.classList.add("img-box");

            let image = document.createElement("img");
            image.src = item.image;
            image.alt = item.title;
            imgDiv.appendChild(image);

            itemDiv.appendChild(imgDiv);

            let boxDiv = document.createElement("div");
            boxDiv.classList.add("box");
            itemDiv.appendChild(boxDiv);

            let titlePriceDiv = document.createElement("div");
            titlePriceDiv.classList.add("title-price");
            boxDiv.appendChild(titlePriceDiv);

            let title = document.createElement("h2");
            title.classList.add("item-name");
            title.textContent = item.title;
            titlePriceDiv.appendChild(title);

            let price = document.createElement("span");
            price.classList.add("price");
            price.textContent = `Price: $${item.price}`;
            titlePriceDiv.appendChild(price);

            let description = document.createElement("p");
            description.classList.add("item-des");
            description.textContent = item.description;
            boxDiv.appendChild(description);

            let btns = document.createElement("div");
            btns.classList.add("btns");

            // Create The Add Button
            let addToCartBtn = document.createElement("button");
            addToCartBtn.textContent = "Add To Cart";
            addToCartBtn.classList.add("add");
            btns.appendChild(addToCartBtn);

            boxDiv.appendChild(btns);

            addToCartBtn.onclick = () => {
                handleAddRToCart(item);
            };

            // Push The Item To The Section
            itemsSection.appendChild(itemDiv);
        });
    }

    function fetchProducts() {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(products => {
                if (loading) { // Check if loading exists
                    loading.style.display = "none";
                }
                createItemDiv(products);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }

    fetchProducts();
}

// Add To Cart Logic
let cartData = JSON.parse(window.localStorage.getItem('cartData')) || [];

if (cartData.length) {
    if (cartText) {
        cartText.classList.remove("d-none");
    }

    if (currentItemsText) {
        currentItemsText.innerHTML = "Your Current Items";
    }

} else {
    currentItemsText ? currentItemsText.innerHTML = "Your Cart Is Empty !" : null;
}

function handleAddRToCart(item) {
    cartData.push(item);
    window.localStorage.setItem("cartData", JSON.stringify(cartData));
}

// Function to calculate total price of all items in the cart
function calculateTotalPrice() {
    let total = cartData.reduce((acc, item) => acc + item.price, 0); // Sum up all item prices
    totalPrice ? totalPrice.innerHTML = `Total Price: $${total.toFixed(2)}` : null; // Display total price with 2 decimal places
}

function createCartItems() {
    if (cartSection) {
        cartSection.innerHTML = ''; // Clear the section before adding items
        cartData.forEach(item => {
            let cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");

            let imgDiv = document.createElement("div");
            imgDiv.classList.add("cart-img-box");
            let img = document.createElement("img");

            img.src = item.image;
            img.alt = item.title;
            imgDiv.appendChild(img);

            cartItemDiv.appendChild(imgDiv);

            let iteminfo = document.createElement("div");
            iteminfo.classList.add("cart-item-info");

            let itemTitle = document.createElement("h4");
            itemTitle.textContent = item.title;

            let description = document.createElement("p");
            description.textContent = item.description;

            let itemPrice = document.createElement("span");
            itemPrice.textContent = `Price: $${item.price}`;

            iteminfo.appendChild(itemTitle);
            iteminfo.appendChild(description);
            iteminfo.appendChild(itemPrice);

            cartItemDiv.appendChild(iteminfo);

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Remove Item";
            deleteButton.classList.add("delete");

            deleteButton.onclick = () => {
                deleteItem(item);
            }

            cartItemDiv.appendChild(deleteButton);

            cartSection.appendChild(cartItemDiv);
        });
    }

    calculateTotalPrice();
}

function deleteItem(item) {
    // Find the index of the item to be deleted
    const index = cartData.findIndex((cartItem) => cartItem.id === item.id);

    // If the item was found, remove it from the cart data
    if (index !== -1) {
        cartData.splice(index, 1); // Remove one item from the specified index
        window.localStorage.setItem("cartData", JSON.stringify(cartData));
        createCartItems(); // Update cart UI
    }
}

// Clean cart and handle click only if cleanCart exists
if (cleanCart) {
    cleanCart.onclick = () => {
        window.localStorage.removeItem('cartData');
        window.location.href = "cart.html"; // Redirect to cart.html page
    };
}

// Update Cart UI
createCartItems();

