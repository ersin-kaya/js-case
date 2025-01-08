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
            ${carouselItem}
            ${carouselItem}
        </div>
    `;

    const container = `
        <div class="container">
            <h1>You Might Also Like</h1>
            ${carousel}
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
            color: #000000;
            display: flex;
            justify-content: center;
        }
        
        .container {
            background-color: #faf9f7;
            max-width: 1600px;
            max-height: 380px;
            width: 1600px;
            height: 380px;
        }
    `;

    const carouselStyles = ``;

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
