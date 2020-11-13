const imageContainer = document.getElementById('image-container');
const cols = document.querySelectorAll('.grid-col');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
let colShownNum = 0;
let photos = [];
let imagesLoaded;
let totalImages;
let loadDone = false;

//Unsplash API
const UNSPLASH_API_KEY = 'JHpsMZn8P6DwKybIINcnFzqM9r7m2j7aBvFoFiE2vbI';
const count = 30;
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_API_KEY}&count=${count}`;

// Check if all images were loaded
function hasImageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    loadDone = true;
    loader.hidden = true;
  }
}

// Helper Function to Set Attributes on DOM Elements
const setAttributes = (el, attrs) => {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};
const getColHeights = () => {
  let colHeights = [cols[0].clientHeight, cols[1].clientHeight, cols[2].clientHeight];
  const visibleColHeight = colHeights.filter((height) => height);
  return visibleColHeight;
};
const findShorterCol = () => {
  const heights = getColHeights();
  return heights.indexOf(Math.min(...heights));
};

const displayPhotos = () => {
  imagesLoaded = 0;
  totalImages = photos.length;
  photos.forEach((photo, index) => {
    // Create <a> to link to full photo
    const item = document.createElement('a');
    item.className = `grid-item ${index}`;
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank'
    });
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description
    });
    // check when each is finished loading
    img.addEventListener('load', hasImageLoaded);
    item.appendChild(img);
    setTimeout(() => {
      if (colShownNum === 3) {
        //append image in shorter column
        const shoterColIndex = findShorterCol();
        cols[shoterColIndex].appendChild(item);
      } else {
        cols[index % 3].appendChild(item);
      }
    }, 100 * index);
  });
};


//get photos from Unsplash API
const getPhotos = async () => {
  loadDone = false;
  loader.hidden = false;
  errorMessage.style.display = 'none';

  try {
    const response = await fetch(apiUrl);
    photos = await response.json();
    displayPhotos();
  } catch (error) {
    errorMessage.textContent = 'error : api usage limit exceeded , try again after an hour ';
    errorMessage.style.display = 'block';
    loadDone = true;
    loader.hidden = true;
    console.log('getPhoto error', error);
  }
};

//get grid column number
window.addEventListener('resize', () => {
  if (getColHeights().length !== colShownNum) {
    colShownNum = getColHeights().length;
  }
});

//checkScroll hit the bottom
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && loadDone) {
    checkScrollBottomAfter1Sec();
  }
});

const checkScrollBottomAfter1Sec = () => {
  setTimeout(() => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && loadDone) {
      console.log('load more...');
      getPhotos();
    }
  }, 1000);
};

getPhotos();
