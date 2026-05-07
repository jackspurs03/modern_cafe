let currentIndex = 0;
let drinksData = [];
let isTransitioning = false;
const SLIDE_DELAY = 3000;
const CLONE_COUNT = 3;

async function loadDrinks() {
    const grid = document.querySelector('.product-grid');
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error('Failed to load drinks');
        
        drinksData = await response.json();
        renderDrinks();
        
        currentIndex = CLONE_COUNT;
        updatePosition(false);

        startAutoCycle();

        grid.addEventListener('transitionend', handleJump);
        window.addEventListener('resize', () => updatePosition(false));

    } catch (error) {
        console.error('Error:', error);
    }
}

function renderDrinks() {
    const grid = document.querySelector('.product-grid');
    
    const startClones = drinksData.slice(-CLONE_COUNT);
    const endClones = drinksData.slice(0, CLONE_COUNT);
    const combinedData = [...startClones, ...drinksData, ...endClones];

    grid.innerHTML = '';
    combinedData.forEach(drink => {
        const article = document.createElement('article');
        article.className = 'product-card';
        article.innerHTML = `
            <div class="card-visual-group ${drink.themeClass}">
                <div class="card-image-wrapper ${drink.bgClass}">
                    <img src="${drink.image}" alt="${drink.title}" class="product-image">
                </div>
                <div class="price-tag">${drink.price}</div>
                <div class="delivery-bar">${drink.badge}</div>
            </div>
            <div class="card-info">
                <div class="info-header">
                    <h2 class="product-title">${drink.title}</h2>
                    <a href="#" class="order-link">Order Now <span>↗</span></a>
                </div>
                <div class="tags-container">
                    ${drink.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        grid.appendChild(article);
    });
}

function updatePosition(animate = true) {
    const grid = document.querySelector('.product-grid');
    const cards = grid.querySelectorAll('.product-card');
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(grid).gap) || 0;
    
    if (animate) {
        grid.style.transition = 'transform 0.8s cubic-bezier(0.45, 0, 0.55, 1)';
        isTransitioning = true;
    } else {
        grid.style.transition = 'none';
    }

    const offset = (cardWidth + gap) * currentIndex;
    grid.style.transform = `translateX(-${offset}px)`;
}

function handleJump() {
    isTransitioning = false;
    
    if (currentIndex >= drinksData.length + CLONE_COUNT) {
        currentIndex = CLONE_COUNT;
        updatePosition(false);
    }
    if (currentIndex <= 0) {
        currentIndex = drinksData.length;
        updatePosition(false);
    }
}

function startAutoCycle() {
    setTimeout(() => {
        if (!isTransitioning) {
            currentIndex++;
            updatePosition(true);
        }
        startAutoCycle();
    }, SLIDE_DELAY);
}

document.addEventListener('DOMContentLoaded', loadDrinks);
