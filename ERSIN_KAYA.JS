(() => {
  let self;

  const init = () => {
    self = {
      loadJQueryScript,
      buildHTML,
      buildCSS,
      setEvents,
    };

    self.buildHTML();
    self.loadJQueryScript(() => {
      self.buildCSS();
      self.setEvents();
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

    const productDetail = `
        <div class="product-detail">
            <span>click event test</span>
        </div>
    `;

    const carouselItem = `
        <div class="carousel-item">
            ${productDetail}
        </div>
    `;

    const carousel = `
        <div class="carousel">
          <div class="carousel-items">
            ${carouselItem}
            ${carouselItem}
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
        
        .container {
            background-color: #faf9f7;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
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
          max-width: 1600px;
          max-height: 380px;
          width: 100%;
          height: 380px;
        }

        .carousel-items {
          display: flex;
          width: 100%;
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

    $("<style>").addClass("reset").html(resetStyles).appendTo("head");
    $("<style>").addClass("general").html(generalStyles).appendTo("head");
    $("<style>")
      .addClass("carousel-style")
      .html(carouselStyles)
      .appendTo("head");
  };

  const setEvents = () => {
    $(".carousel").on("click", ".product-detail", () => {
      console.log("clicked");
    });
  };

  init();
})();
