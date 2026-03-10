// js/pages/restaurant.js

import { restaurants } from '../data.js';
import store from '../state.js';
import { createMenuItem } from '../components.js';
import { renderItemModal } from './itemModal.js';
import { formatCurrency } from '../utils.js';

let currentRestaurant = null;

export function renderRestaurant(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if(!restaurant) return '<div class="page-view flex justify-center items-center"><h2>Restaurant not found</h2></div>';
    
    currentRestaurant = restaurant;
    const isFav = store.isFavorite(restaurant.id);
    
    // Group menu by section
    const groupedMenu = {};
    restaurant.menu.forEach(item => {
        if(!groupedMenu[item.section]) groupedMenu[item.section] = [];
        groupedMenu[item.section].push(item);
    });

    return `
        <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-main);">
            <!-- Transparent Header Over Image -->
            <header class="flex justify-between items-center" style="position: absolute; top: 0; left: 0; width: 100%; padding: 16px 20px; z-index: 50; background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);">
                <a href="#/" class="btn-icon-only flex justify-center items-center" style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); color: var(--text-primary); text-decoration: none; box-shadow: var(--shadow-sm);">
                    <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
                </a>
                <button id="favBtn" class="btn-icon-only flex justify-center items-center" style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); color: var(--text-primary); border: none; cursor: pointer; box-shadow: var(--shadow-sm);">
                    <i data-lucide="heart" style="width: 20px; height: 20px; ${isFav ? 'fill: var(--accent); color: var(--accent);' : ''}"></i>
                </button>
            </header>
            
            <div style="flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 100px;">
                <!-- Hero Image -->
                <div style="height: 240px; width: 100%;">
                    <img src="${restaurant.image}" alt="${restaurant.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                
                <!-- Info block -->
                <div style="padding: 24px 20px; background: var(--bg-main); border-radius: var(--radius-xl) var(--radius-xl) 0 0; margin-top: -24px; position: relative; z-index: 10;">
                    <h1 style="font-size: 24px; margin-bottom: 8px;">${restaurant.name}</h1>
                    <div class="flex items-center gap-sm text-sub" style="margin-bottom: 16px;">
                        <span class="flex items-center gap-xs font-medium" style="color: var(--text-primary);">
                            <i data-lucide="star" style="width: 14px; fill: #F59E0B; color: #F59E0B;"></i> ${restaurant.rating}
                        </span>
                        <span>(${restaurant.reviewsCount}+)</span>
                        <span>•</span>
                        <span>${restaurant.tags[0]}</span>
                    </div>
                    
                    <div class="flex gap-md" style="margin-bottom: 24px;">
                        <div class="flex-col" style="flex: 1; padding: 12px; border-radius: var(--radius-md); background: var(--bg-secondary); border: 1px solid var(--border);">
                            <span class="text-caption text-secondary" style="margin-bottom: 4px;">Delivery</span>
                            <span class="font-bold">${restaurant.deliveryTime}</span>
                        </div>
                        <div class="flex-col" style="flex: 1; padding: 12px; border-radius: var(--radius-md); background: var(--bg-secondary); border: 1px solid var(--border);">
                            <span class="text-caption text-secondary" style="margin-bottom: 4px;">Fee</span>
                            <span class="font-bold">${formatCurrency(restaurant.deliveryFee)}</span>
                        </div>
                    </div>
                    
                    <!-- Sticky Tabs (simulated) -->
                    <div class="flex gap-lg" style="border-bottom: 1px solid var(--border); margin-bottom: 24px;">
                        <span class="font-medium text-primary" style="padding-bottom: 12px; border-bottom: 2px solid var(--primary);">Menu</span>
                        <span class="font-medium text-secondary" style="padding-bottom: 12px;">Reviews</span>
                        <span class="font-medium text-secondary" style="padding-bottom: 12px;">Info</span>
                    </div>
                    
                    <!-- Menu List -->
                    <div>
                        ${Object.keys(groupedMenu).map(section => `
                            <div style="margin-bottom: 32px;">
                                <h3 style="margin-bottom: 16px; font-size: 18px;">${section}</h3>
                                <div class="flex-col">
                                    ${groupedMenu[section].map(item => `
                                        <div class="menu-item-wrapper" data-item-id="${item.id}">
                                            ${createMenuItem(item)}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Sticky View Cart Bar (hidden initially) -->
            <div id="stickyCartBar" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 16px 20px 24px; background: linear-gradient(to top, var(--bg-main) 60%, transparent); display: none; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);">
                <a href="#/cart" class="btn btn-primary flex justify-between items-center" style="text-decoration: none;">
                    <div class="flex items-center gap-sm">
                        <div id="cartCountBadge" style="background: rgba(255,255,255,0.2); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">1</div>
                        <span>View Cart</span>
                    </div>
                    <span id="cartTotalAmt" class="font-bold"></span>
                </a>
            </div>
        </div>
    `;
}

export function initRestaurant() {
    const favBtn = document.getElementById('favBtn');
    if(!currentRestaurant) return;
    
    // Favorite Toggle
    if(favBtn) {
        favBtn.addEventListener('click', () => {
            store.toggleFavorite(currentRestaurant.id);
            const isFav = store.isFavorite(currentRestaurant.id);
            const icon = favBtn.querySelector('i');
            if(isFav) {
                icon.style.fill = 'var(--accent)';
                icon.style.color = 'var(--accent)';
            } else {
                icon.style.fill = 'none';
                icon.style.color = 'var(--text-primary)';
            }
        });
    }

    // Menu Item Click
    document.querySelectorAll('.menu-item-wrapper').forEach(el => {
        el.addEventListener('click', (e) => {
            const itemId = e.currentTarget.getAttribute('data-item-id');
            const item = currentRestaurant.menu.find(i => i.id === itemId);
            if(item) {
                renderItemModal(item, currentRestaurant.id);
            }
        });
    });

    // Sub to store changes to show/hide sticky cart
    updateStickyCart();
    store.addEventListener('change', updateStickyCart);
}

function updateStickyCart() {
    const bar = document.getElementById('stickyCartBar');
    const badge = document.getElementById('cartCountBadge');
    const totalEl = document.getElementById('cartTotalAmt');
    
    if(!bar) return;

    const state = store.getState();
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if(cartCount > 0 && state.cart[0].restaurantId === currentRestaurant.id) {
        bar.style.display = 'block';
        // Reflow to enable transition from display:none
        void bar.offsetWidth;
        bar.style.transform = 'translateY(0)';
        
        badge.textContent = cartCount;
        totalEl.textContent = formatCurrency(store.getCartTotal());
    } else {
        bar.style.transform = 'translateY(100%)';
        setTimeout(() => { if(bar.style.transform === 'translateY(100%)') bar.style.display = 'none'; }, 300);
    }
}
