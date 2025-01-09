(() => {
  class FavoriteProduct {
    constructor(id) {
      this.id = id;
      this.favoriteAddedAt = Date.now();
    }
  }

  const LOCAL_STORAGE_KEYS = {
    FAVORITE_PRODUCT_LIST: "product.favoriteProductList",
  };
  const UI_CLASSES = {
    FAVORITED: "favorited",
  };

  let favoriteProductList =
    JSON.parse(getLocalStorageItem(LOCAL_STORAGE_KEYS.FAVORITE_PRODUCT_LIST)) ||
    [];

  let self;

  const init = () => {
    self = {
      loadJQueryScript,
      buildHTML,
      buildCSS,
      setEvents,
      fetchProducts,
      renderProducts,
    };

    self.buildHTML();
    self.loadJQueryScript(async () => {
      self.buildCSS();
      self.setEvents();

      const products = await self.fetchProducts();
      self.renderProducts(products);
    });
  };

  const loadJQueryScript = (callback) => {
    const scriptElementForJQuery = document.createElement("script");

    scriptElementForJQuery.setAttribute("defer", "");
    scriptElementForJQuery.setAttribute(
      "src",
      "https://code.jquery.com/jquery-3.7.1.min.js"
    );
    scriptElementForJQuery.setAttribute(
      "integrity",
      "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
    );
    scriptElementForJQuery.setAttribute("crossorigin", "anonymous");

    scriptElementForJQuery.onload = () => {
      callback();
    };

    document.head.appendChild(scriptElementForJQuery);
  };

  const buildHTML = () => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
        </head>
        <body></body>
        </html>
    `;

    const parser = new DOMParser();
    const newDocument = parser.parseFromString(htmlContent, "text/html");
    const htmlElement = newDocument.documentElement;
    const headElement = htmlElement.querySelector("head");
    const titleElement = headElement.querySelector("title");
    const bodyElement = htmlElement.querySelector("body");

    titleElement.textContent = "Test Title";

    const carousel = `
        <div class="carousel">
          <div class="carousel-items">
          </div>
          <div class="carousel-control-buttons">
            <div class="carousel-control-prev">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAQNJREFUWEft1qFKBFEUh/HfJtti0qRRq9h9AZtNRJOCUbDoG4hJQTCLaFgWthgU9AF8HJNJ1B2YC4KGO3OHPQgz+TDfN/9z5p47EPwMgvl6gT6BrhOYxwgXeMoZ8C4FFmvoGu6xO0uBZTxjBbfYx8esBFZr+BKucISvHHhVU9qCdTxiAec4zQWnuhKBDTxgiGNcNoWXJLCJMeZwgJs28LYC2/WgfWIHk7bwNgKH035f4x1beCmBNxU4mUZ+hjdULXgthf87gUo4tAUp8dAhTBKhv2GSCD2IkkToUZwkQpdRkghdx0ni54XkDns5B1XJNvzr/aFXspwP/lXTdQKNJXqBPoFvJpkyIcOSNNYAAAAASUVORK5CYII=" alt="prev image">
            </div>
            <div class="carousel-control-next">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAQRJREFUWEft1qFKBUEUBuDvIkajT2I3CIposXlFo4JRgwgmbVoFuVm0WQSDyQewGcxWMSgmo7gDa7LM7A4ckN2ysAz8H2fPnJmR4GcUnG8ADBUoqcACjrCO91rNWwK4xiaesIy3GogSwBQm2MELFtt3L0cJIAWl9Wc4wCuW8NxHUAr4zTrEKT6wgseuiK6AlLeLC3w1fbGGhy6IPoCUt4FLfGOM21JEX0DKW8UNprHdgrIdNQApbB53mMEeznMFtQApbw73TV/MNrvlpPlwnIP4N4DQXxDahKHbMHQQhY3i0MMo/Di+wlbkhSTdgvbbK9lnzpTLWVNzEubk/VkzAIYKhFfgByhgNCFVjHxgAAAAAElFTkSuQmCC" alt="next image">
            </div>
          </div>
        </div>
    `;

    const container = `
        <div class="container">
            <div class="container-header">
              <h1>You Might Also Like</h1>
            </div>
            <div class="container-body">
              ${carousel}
            </div>
        </div>
    `;

    bodyElement.insertAdjacentHTML("afterbegin", container);
    document.replaceChild(htmlElement, document.documentElement);
  };

  const buildCSS = () => {
    const resetStyles = `
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        * {
            margin: 0;
            padding: 0;
        }
    `;

    const generalStyles = `
        body {
            background-color: #ffffff;
            color: #29323b;
            font-family: "Open Sans", serif;
        }

        a {
          text-decoration: none;
          color: inherit;
        }
        
        .container {
            background-color: #faf9f7;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 25px;
        }

        .container-header {
          width: 80%;
          padding: 15px 0;
        }
          
        .container-header h1 {
          font-weight: 300;
        }

        .container-body {
            width: 80%;
        }
    `;

    const carouselStyles = `
        .carousel {
          position: relative;
          width: 100%;
          height: 380px;
        }

        .carousel-items {
          display: flex;
          width: 100%;
          overflow: hidden;
        }

        .carousel-control-buttons {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 50%;
        }

        .carousel-control-prev {
          position: absolute;
          left: -35px;
        }

        .carousel-control-next {
          position: absolute;
          right: -35px;
        }
    `;

    const productDetailStyles = `
      .product-detail {
        background-color: #ffffff;
        width: 210px;
        height: 380px;
        margin-right: 19px;
      }

      .product-card .card-header {
        position: relative;
      }

      .product-image {
        width: 210px;
        height: 280px;
      }

      .card-favorite-icon {
        cursor: pointer;
        position: absolute;
        top: 9px;
        right: 15px;
        width: 34px;
        height: 34px;
        background-color: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .card-favorite-icon .heart {
        fill: none;
        stroke: #555555;
        stroke-width: 1.5;
        width: 23px;
        height: 23px;
        transition: fill 0.3s ease, stroke 0.3s ease;
      }

      .card-favorite-icon.${UI_CLASSES.FAVORITED} .heart{
        fill: #193db0;
        stroke: #193db0;
      }

      .card-body {
        padding: 0 10px;
      }

      .product-name {
        color: #302e2b;
        font-size: 14px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        height: 2.65em;
      }

      .product-price {
        font-size: 18px;
        font-weight: 600;
        color: #193db0;
      }
    `;

    $("<style>").addClass("reset").html(resetStyles).appendTo("head");
    $("<style>").addClass("general").html(generalStyles).appendTo("head");
    $("<style>")
      .addClass("carousel-styles")
      .html(carouselStyles)
      .appendTo("head");
    $("<style>")
      .addClass("product-detail-styles")
      .html(productDetailStyles)
      .appendTo("head");
  };

  const setEvents = () => {
    $(".carousel").on("click", ".card-favorite-icon, .heart, path", (e) => {
      e.stopPropagation();

      const favoriteTriggerTarget = $(e.target);
      updateFavoriteProductList(favoriteTriggerTarget);
    });
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const renderProducts = (products) => {
    products.forEach((product) => {
      const productDetail = `
        <div class="product-detail" data-product-id="${product.id}">
            <div class="product-card">
              <div class="card-header">
                <div class="card-image">
                  <a href="${product.url}">
                    <img class="product-image" src="${product.img}" alt="product image" />
                  </a>
                </div>
                <div class="card-favorite-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="heart">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>
              <div class="card-body">
                <a href="${product.url}">
                  <p class="product-name">
                    ${product.name}
                  </p>
                </a>
                <p class="product-price">
                  ${product.price} TL
                </p>
              </div>
            </div>
        </div>
    `;

      const carouselItem = `
        <div class="carousel-item">
            ${productDetail}
        </div>
      `;

      $(".carousel-items").append(carouselItem);
    });

    if (favoriteProductList.length) {
      $(".product-detail").each((index, productDetailElement) => {
        const productId = $(productDetailElement).data("product-id");
        if (favoriteProductList.some((product) => product.id === productId)) {
          const cardFavoriteIconElement = productDetailElement.querySelector(
            ".card-favorite-icon"
          );
          $(cardFavoriteIconElement).addClass(UI_CLASSES.FAVORITED);
        }
      });
    }
  };

  function save() {
    setLocalStorageItem(
      LOCAL_STORAGE_KEYS.FAVORITE_PRODUCT_LIST,
      favoriteProductList
    );
  }

  function getLocalStorageItem(key) {
    return localStorage.getItem(key);
  }

  function setLocalStorageItem(key, value) {
    if (!key) {
      return;
    }

    localStorage.setItem(
      key,
      typeof value === "object" ? JSON.stringify(value) : value
    );
  }

  function updateFavoriteProductList(favoriteTriggerTarget) {
    setTimeout(() => {
      // setTimeout() to make it look like the reaction on lcw.com

      favoriteTriggerTarget
        .closest(".card-favorite-icon")
        .toggleClass(UI_CLASSES.FAVORITED);

      const targetProductId = $(favoriteTriggerTarget[0])
        .closest(".product-detail")
        .data("product-id");
      const isFavorite = favoriteTriggerTarget
        .closest(".card-favorite-icon")
        .hasClass(UI_CLASSES.FAVORITED);

      if (isFavorite) {
        favoriteProductList.push(new FavoriteProduct(targetProductId));
      } else {
        favoriteProductList = favoriteProductList.filter(
          (product) => product.id !== targetProductId
        );
      }

      save();
    }, 500);
  }

  init();
})();
