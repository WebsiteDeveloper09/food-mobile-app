// js/pages/favorites.js

import store from '../state.js';
import { restaurants } from '../data.js';
import { createRestaurantCard } from '../components.js';

export function renderFavorites() {
    const state = store.getState();
    const favs = restaurants.filter(r => state.favorites.includes(r.id));
    
    if(favs.length === 0) {
        return `
            <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-main);">
                <header style="padding: 24px 20px; border-bottom: 1px solid var(--border);">
                    <h1 style="font-size: 24px;">Favorites</h1>
                </header>
                <div class="flex-col items-center justify-center flex-1" style="padding: 20px; text-align: center;">
                    <i data-lucide="heart" style="width: 48px; height: 48px; color: var(--text-tertiary); margin-bottom: 16px;"></i>
                    <h3 style="margin-bottom: 8px;">No favorites yet</h3>
                    <p class="text-secondary" style="margin-bottom: 24px;">Tap the heart icon on a restaurant to save it here.</p>
                </div>
            </div>
        `;
    }

    return `
        <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-main); padding-bottom: 80px; overflow-y: auto;">
            <header style="padding: 24px 20px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); z-index: 10;">
                <h1 style="font-size: 24px;">Favorites</h1>
            </header>
            
            <div style="padding: 20px;">
                ${favs.map(r => `
                    <div style="margin-bottom: 16px;">
                        ${createRestaurantCard(r)}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

export function initFavorites() {
    document.querySelectorAll('.restaurant-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            window.location.hash = `#/restaurant/${id}`;
        });
    });
}
