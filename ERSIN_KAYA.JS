(() => {
  class FavoriteProduct {
    constructor(id) {
      this.id = id;
      this.favoriteAddedAt = Date.now();
    }
  }

  const PREFIX = "insider-";
  const PREFIX_FOR_LOCAL_STORAGE = PREFIX.replace("-", ".");

  const LOCAL_STORAGE_KEYS = {
    PRODUCT_LIST: `${PREFIX_FOR_LOCAL_STORAGE}productList`,
    FAVORITE_PRODUCT_LIST: `${PREFIX_FOR_LOCAL_STORAGE}favoriteProductList`,
  };
  const UI_CLASSES = {
    FAVORITED: `${PREFIX}favorited`,
    DISABLED: `${PREFIX}disabled`,
  };

  let productList =
    JSON.parse(getLocalStorageItem(LOCAL_STORAGE_KEYS.PRODUCT_LIST)) || [];
  let favoriteProductList =
    JSON.parse(getLocalStorageItem(LOCAL_STORAGE_KEYS.FAVORITE_PRODUCT_LIST)) ||
    [];

  let self;

  const init = async () => {
    self = {
      buildHTML,
      buildCSS,
      setEvents,
      fetchProducts,
      renderProducts,
      updatePrevButtonState,
      updateNextButtonState,
    };

    self.buildHTML();
    self.buildCSS();
    self.setEvents();

    if (!productList.length) {
      productList = await self.fetchProducts();
      saveData();
    }
    self.renderProducts();

    self.updatePrevButtonState();
    self.updateNextButtonState();
  };

  const buildHTML = () => {
    const carousel = `
        <div class="${PREFIX}carousel">
          <div class="${PREFIX}carousel-items">
          </div>
          <div class="${PREFIX}carousel-control-buttons">
            <div class="${PREFIX}carousel-control-prev">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAQNJREFUWEft1qFKBFEUh/HfJtti0qRRq9h9AZtNRJOCUbDoG4hJQTCLaFgWthgU9AF8HJNJ1B2YC4KGO3OHPQgz+TDfN/9z5p47EPwMgvl6gT6BrhOYxwgXeMoZ8C4FFmvoGu6xO0uBZTxjBbfYx8esBFZr+BKucISvHHhVU9qCdTxiAec4zQWnuhKBDTxgiGNcNoWXJLCJMeZwgJs28LYC2/WgfWIHk7bwNgKH035f4x1beCmBNxU4mUZ+hjdULXgthf87gUo4tAUp8dAhTBKhv2GSCD2IkkToUZwkQpdRkghdx0ni54XkDns5B1XJNvzr/aFXspwP/lXTdQKNJXqBPoFvJpkyIcOSNNYAAAAASUVORK5CYII=" alt="prev image">
            </div>
            <div class="${PREFIX}carousel-control-next">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAQRJREFUWEft1qFKBUEUBuDvIkajT2I3CIposXlFo4JRgwgmbVoFuVm0WQSDyQewGcxWMSgmo7gDa7LM7A4ckN2ysAz8H2fPnJmR4GcUnG8ADBUoqcACjrCO91rNWwK4xiaesIy3GogSwBQm2MELFtt3L0cJIAWl9Wc4wCuW8NxHUAr4zTrEKT6wgseuiK6AlLeLC3w1fbGGhy6IPoCUt4FLfGOM21JEX0DKW8UNprHdgrIdNQApbB53mMEeznMFtQApbw73TV/MNrvlpPlwnIP4N4DQXxDahKHbMHQQhY3i0MMo/Di+wlbkhSTdgvbbK9lnzpTLWVNzEubk/VkzAIYKhFfgByhgNCFVjHxgAAAAAElFTkSuQmCC" alt="next image">
            </div>
          </div>
        </div>
    `;

    const recommendedItems = `
        <div id="${PREFIX}recommended-items" class="${PREFIX}recommended-items">
            <div class="${PREFIX}recommended-items-header">
              <h1>You Might Also Like</h1>
            </div>
            <div class="${PREFIX}recommended-items-body">
              ${carousel}
            </div>
        </div>
    `;

    $(".product-detail").after(recommendedItems);
  };

  const buildCSS = () => {
    const recommendedItemsStyles = `
        .${PREFIX}recommended-items {
            background-color: #faf9f7;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding-bottom: 24px;
        }

        .${PREFIX}recommended-items-header,
        .${PREFIX}recommended-items-body {
          width: 80%;
          margin-left: 28px;
        }

        .${PREFIX}recommended-items-header {
          padding: 15px 0;
        }
          
        .${PREFIX}recommended-items-header h1 {
          font-weight: 300;
        }

        .${PREFIX}recommended-items-body {
        }

        @media screen and (max-width: 991px) {
          .${PREFIX}recommended-items-header,
          .${PREFIX}recommended-items-body {
            width: 100%;
          }
        }
    `;

    const carouselStyles = `
        .${PREFIX}carousel {
          position: relative;
          width: 100%;
          height: 380px;
        }

        .${PREFIX}carousel-items {
          display: flex;
          width: 100%;
          overflow-x: scroll;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
        }

        .${PREFIX}carousel-items::-webkit-scrollbar {
          display: none;
        }

        .${PREFIX}carousel-item {
          scroll-snap-align: start;
          flex: 0 0 auto;
          width: 210px;
          margin-right: 19px;
        }

        .${PREFIX}carousel-control-buttons {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 50%;
        }

        .${PREFIX}carousel-control-prev,
        .${PREFIX}carousel-control-next {
          position: absolute;
          cursor: pointer;
        }

        .${PREFIX}carousel-control-prev {
          left: -35px;
        }

        .${PREFIX}carousel-control-next {
          right: -35px;
        }

        .${PREFIX}carousel-control-prev.${UI_CLASSES.DISABLED},
        .${PREFIX}carousel-control-next.${UI_CLASSES.DISABLED} {
          pointer-events: none;
          cursor: default;
        }

        @media screen and (max-width: 991px) {
          .${PREFIX}carousel {
            height: 510px;
          }

          .${PREFIX}carousel-item {
            width: 280px;
            margin-right: 29px;
          }

          .${PREFIX}carousel-control-buttons {
            display: none;
          }
        }
    `;

    const productCardStyles = `
      .${PREFIX}product-card {
        background-color: #ffffff;
        width: 210px;
        height: 380px;
      }

      .${PREFIX}product-card .${PREFIX}card-header {
        position: relative;
      }

      .${PREFIX}product-image {
        width: 210px;
        height: 280px;
      }

      .${PREFIX}card-favorite-icon {
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

      .${PREFIX}card-favorite-icon .${PREFIX}heart {
        fill: none;
        stroke: #555555;
        stroke-width: 1.5;
        width: 23px;
        height: 23px;
        transition: fill 0.3s ease, stroke 0.3s ease;
      }

      .${PREFIX}card-favorite-icon.${UI_CLASSES.FAVORITED} .${PREFIX}heart{
        fill: #193db0;
        stroke: #193db0;
      }

      .${PREFIX}card-body {
        padding: 0 10px;
      }

      .${PREFIX}card-body a {
        text-decoration: none;
        color: inherit;
      }

      .${PREFIX}product-name {
        color: #302e2b;
        font-size: 14px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        height: 2.8em;
        margin: 5px 0 0;
      }

      .${PREFIX}product-price {
        font-size: 18px;
        font-weight: 600;
        color: #193db0;
        height: 45px;
      }

      .${PREFIX}product-add-to-cart-button {
        display: none;
      }

      @media screen and (max-width: 991px) {
        .${PREFIX}product-card {
          width: 280px;
          height: 510px;
        }

        .${PREFIX}product-image {
          width: 280px;
          height: 373.33px;
        }

        .${PREFIX}product-name {
          margin: 5px 0 0;
        }

        .${PREFIX}product-price {
          height: 40px;
        }

        .${PREFIX}product-add-to-cart-button {
          display: block;
          background-color: #193db0;
          color: #ffffff;
          width: 100%;
          height: 35px;
          border: none;
          border-radius: 5px;
          text-transform: uppercase;
          font-size: 14px;
          font-weight: bold;
        }
      }
    `;

    $("<style>")
      .addClass(`${PREFIX}recommended-items-styles`)
      .html(recommendedItemsStyles)
      .appendTo("head");
    $("<style>")
      .addClass(`${PREFIX}carousel-styles`)
      .html(carouselStyles)
      .appendTo("head");
    $("<style>")
      .addClass(`${PREFIX}product-card-styles`)
      .html(productCardStyles)
      .appendTo("head");
  };

  const setEvents = () => {
    const $carouselItems = $(`.${PREFIX}carousel-items`);
    let isDragging = false;
    let startX, scrollLeft;
    let mouseX,
      mouseY,
      mouseMoved = false;

    $(`.${PREFIX}carousel`).on("click", `.${PREFIX}card-favorite-icon`, (e) => {
      e.stopPropagation();

      const $favoriteTriggerTarget = $(e.target);
      updateFavoriteProductList($favoriteTriggerTarget);
    });

    $carouselItems.on("scroll", () => {
      updatePrevButtonState();
      updateNextButtonState();
    });

    $(`.${PREFIX}carousel-control-prev`).on("click", (e) => {
      e.stopPropagation();
      slideCarouselLeft();
    });

    $(`.${PREFIX}carousel-control-next`).on("click", (e) => {
      e.stopPropagation();
      slideCarouselRight();
    });

    $carouselItems.on("click", "a", (e) => {
      if (mouseMoved) {
        e.preventDefault();
        mouseMoved = false;
      }
    });

    $carouselItems.on("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      startX = e.pageX - $carouselItems.offset().left;
      scrollLeft = $carouselItems.scrollLeft();
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    $(document).on("mouseup", (e) => {
      e.preventDefault();
      isDragging = false;
      if (mouseX !== e.clientX && mouseY !== e.clientY) {
        mouseMoved = true;
      }
    });

    $carouselItems.on("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - $carouselItems.offset().left;
      const walk = (x - startX) * 2.5;
      $carouselItems.scrollLeft(scrollLeft - walk);
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

  const renderProducts = () => {
    productList.forEach((product) => {
      const productCard = `
        <div class="${PREFIX}product-card" data-product-id="${product.id}">
          <div class="${PREFIX}card-header">
            <div class="${PREFIX}card-image">
              <a href="${product.url}" target="_blank">
                <img class="${PREFIX}product-image" src="${product.img}" alt="${product.name} image" />
              </a>
            </div>
            <div class="${PREFIX}card-favorite-icon">
              <svg class="${PREFIX}heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
          <div class="${PREFIX}card-body">          
            <a href="${product.url}" target="_blank">
              <p class="${PREFIX}product-name">
                ${product.name}
              </p>
            </a>
            <p class="${PREFIX}product-price">
              ${product.price} TL
            </p>
            <button class="${PREFIX}product-add-to-cart-button">Sepete Ekle</button>
          </div>
        </div>
    `;

      const carouselItem = `
        <div class="${PREFIX}carousel-item">
            ${productCard}
        </div>
      `;

      $(`.${PREFIX}carousel-items`).append(carouselItem);
    });

    if (favoriteProductList.length) {
      $(`.${PREFIX}product-card`).each((index, productCardElement) => {
        const productId = $(productCardElement).data("product-id");
        if (favoriteProductList.some((product) => product.id === productId)) {
          const $cardFavoriteIconElement = $(productCardElement).find(
            `.${PREFIX}card-favorite-icon`
          );
          $cardFavoriteIconElement.addClass(UI_CLASSES.FAVORITED);
        }
      });
    }
  };

  function saveData() {
    setLocalStorageItem(LOCAL_STORAGE_KEYS.PRODUCT_LIST, productList);
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
      // Used setTimeout() to make it look like the reaction on lcw.com

      favoriteTriggerTarget
        .closest(`.${PREFIX}card-favorite-icon`)
        .toggleClass(UI_CLASSES.FAVORITED);

      const targetProductId = $(favoriteTriggerTarget[0])
        .closest(`.${PREFIX}product-card`)
        .data("product-id");
      const isFavorite = favoriteTriggerTarget
        .closest(`.${PREFIX}card-favorite-icon`)
        .hasClass(UI_CLASSES.FAVORITED);

      if (isFavorite) {
        favoriteProductList.push(new FavoriteProduct(targetProductId));
      } else {
        favoriteProductList = favoriteProductList.filter(
          (product) => product.id !== targetProductId
        );
      }

      saveData();
    }, 500);
  }

  function slideCarouselLeft() {
    $(`.${PREFIX}carousel-items`).animate(
      { scrollLeft: "-=229" },
      400,
      "swing"
    );
  }

  function slideCarouselRight() {
    $(`.${PREFIX}carousel-items`).animate(
      { scrollLeft: "+=229" },
      400,
      "swing"
    );
  }

  function updatePrevButtonState() {
    const $carouselItems = $(`.${PREFIX}carousel-items`);
    const $carouselControlPrev = $(`.${PREFIX}carousel-control-prev`);

    if ($carouselItems.scrollLeft() === 0) {
      $carouselControlPrev.addClass(UI_CLASSES.DISABLED);
    } else {
      $carouselControlPrev.removeClass(UI_CLASSES.DISABLED);
    }
  }

  function updateNextButtonState() {
    const $carouselItems = $(`.${PREFIX}carousel-items`);
    const $carouselControlNext = $(`.${PREFIX}carousel-control-next`);

    const maxScrollLeft =
      $carouselItems[0].scrollWidth - $carouselItems.outerWidth();

    if (maxScrollLeft >= 0 && $carouselItems.scrollLeft() >= maxScrollLeft) {
      $carouselControlNext.addClass(UI_CLASSES.DISABLED);
    } else {
      $carouselControlNext.removeClass(UI_CLASSES.DISABLED);
    }
  }

  if ($(".product-detail")) {
    init();
  }
})();
