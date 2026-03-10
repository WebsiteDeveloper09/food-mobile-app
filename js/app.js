// js/app.js

import { renderOnboarding, initOnboarding } from './pages/onboarding.js';
import { renderHome, initHome } from './pages/home.js';
import { renderSearch, initSearch } from './pages/search.js';
import { renderCart, initCart } from './pages/cart.js';
import { renderTracking, initTracking } from './pages/tracking.js';
import { renderProfile, initProfile } from './pages/profile.js';
import { renderOrders, initOrders } from './pages/orders.js';
import { renderFavorites, initFavorites } from './pages/favorites.js';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    renderBottomNav();
});

const routes = {
    '/': { render: renderHome, init: initHome },
    '/onboarding': { render: renderOnboarding, init: initOnboarding },
    '/search': { render: renderSearch, init: initSearch },
    '/cart': { render: renderCart, init: initCart },
    '/profile': { render: renderProfile, init: initProfile },
    '/orders': { render: renderOrders, init: initOrders },
    '/favorites': { render: renderFavorites, init: initFavorites }
};

let currentPath = '/';
let isTransitioning = false;

function initRouter() {
    window.addEventListener('hashchange', handleHashChange);
    if(!window.location.hash) {
        window.location.hash = '#/onboarding';
    } else {
        handleHashChange();
    }
}

function handleHashChange() {
    if(isTransitioning) return;
    
    const hash = window.location.hash.substring(1) || '/';
    currentPath = hash;
    
    // Dynamic Routes
    if(hash.startsWith('/restaurant/')) {
        const id = hash.split('/')[2];
        import('./pages/restaurant.js').then(module => {
            transitionPage(() => {
                const html = module.renderRestaurant(id);
                renderContainer(html);
                module.initRestaurant();
                updateBottomNav(''); // clear active
            });
        });
        return;
    }
    
    if(hash.startsWith('/tracking/')) {
        const id = hash.split('/')[2];
        transitionPage(() => {
            const html = renderTracking(id);
            renderContainer(html);
            initTracking();
            updateBottomNav('');
        });
        return;
    }
    
    const baseRoute = hash.split('/')[1] ? `/${hash.split('/')[1]}` : '/';
    const page = routes[baseRoute] || routes['/'];
    
    transitionPage(() => {
        const html = page.render();
        renderContainer(html);
        if(page.init) page.init();
        updateBottomNav(baseRoute);
    });
}

function renderContainer(html) {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = html;
    window.scrollTo(0,0);
    if(window.lucide) {
        lucide.createIcons();
    }
}

function transitionPage(renderCallback) {
    const appContainer = document.getElementById('app');
    isTransitioning = true;
    
    // Fade out and SLIDE DOWN slightly
    appContainer.style.opacity = '0';
    appContainer.style.transform = 'translateY(15px)';
    
    setTimeout(() => {
        renderCallback();
        
        // Hide nav for specific pages
        const nav = document.getElementById('bottom-nav');
        if(nav) {
            if(currentPath === '/onboarding' || currentPath.startsWith('/restaurant/') || currentPath === '/cart' || currentPath.startsWith('/tracking/')) {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'flex';
            }
        }
        
        // Fade in and SLIDE UP to position
        requestAnimationFrame(() => {
            appContainer.style.opacity = '1';
            appContainer.style.transform = 'translateY(0)';
        });
        
        // Clear flag slightly after transition finishes
        setTimeout(() => isTransitioning = false, 300);
    }, 200);
}

document.getElementById('app').style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

function renderBottomNav() {
    const nav = document.getElementById('bottom-nav');
    nav.innerHTML = `
        <a href="#/" class="nav-item" data-route="/">
            <i data-lucide="home"></i>
            <span>Home</span>
        </a>
        <a href="#/search" class="nav-item" data-route="/search">
            <i data-lucide="search"></i>
            <span>Search</span>
        </a>
        <a href="#/orders" class="nav-item" data-route="/orders">
            <i data-lucide="receipt"></i>
            <span>Orders</span>
        </a>
        <a href="#/favorites" class="nav-item" data-route="/favorites">
            <i data-lucide="heart"></i>
            <span>Favorites</span>
        </a>
        <a href="#/profile" class="nav-item" data-route="/profile">
            <i data-lucide="user"></i>
            <span>Profile</span>
        </a>
    `;
    
    if(window.lucide) {
        lucide.createIcons();
    }
}

function updateBottomNav(activeRoute) {
    document.querySelectorAll('.nav-item').forEach(el => {
        if(el.getAttribute('data-route') === activeRoute) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}
