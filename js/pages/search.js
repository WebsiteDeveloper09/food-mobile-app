// js/pages/search.js

import { restaurants } from '../data.js';
import { createRestaurantCard, createSkeletonList } from '../components.js';

export function renderSearch() {
    return `
        <div class="page-view flex-col" style="height: 100vh; height: 100dvh; overflow: hidden; background: var(--bg-main);">
            <!-- Header -->
            <header style="padding: 16px 20px; border-bottom: 1px solid var(--border); z-index: 10;">
                <div class="flex items-center gap-md">
                    <a href="#/" class="btn-icon-only flex justify-center items-center" style="background: var(--bg-secondary); color: var(--text-primary); text-decoration: none;">
                        <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
                    </a>
                    <div style="flex: 1; position: relative;">
                        <i data-lucide="search" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; color: var(--text-secondary);"></i>
                        <input type="text" id="searchInput" placeholder="Search restaurants, foods..." autofocus
                            style="width: 100%; padding: 12px 16px 12px 42px; border-radius: var(--radius-pill); border: 1px solid var(--border); background: var(--bg-secondary); font-size: 15px; font-family: inherit; outline: none; transition: border-color 0.2s;">
                    </div>
                </div>
                
                <!-- Filters -->
                <div class="flex gap-sm" style="overflow-x: auto; margin-top: 16px; padding-bottom: 4px; scroll-snap-type: x mandatory; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
                    ${['Top rated', 'Fastest', 'Under $10'].map(f => `
                        <button class="filter-chip" style="white-space: nowrap; padding: 6px 14px; border-radius: var(--radius-pill); border: 1px solid var(--border); background: var(--white); font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer;">
                            ${f}
                        </button>
                    `).join('')}
                </div>
            </header>
            
            <!-- Results list -->
            <div id="searchResults" style="flex: 1; overflow-y: auto; padding: 20px; padding-bottom: 80px; -webkit-overflow-scrolling: touch;">
                <!-- Initial state can show skeletons or popular searches -->
                <h3 class="text-secondary" style="margin-bottom: 16px; font-size: 14px;">Recommended</h3>
                ${restaurants.slice(0, 4).map(r => `
                    <div style="margin-bottom: 16px;">
                        ${createRestaurantCard(r)}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

export function initSearch() {
    const input = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    
    // Focus input ring color
    input.addEventListener('focus', () => input.style.borderColor = 'var(--primary)');
    input.addEventListener('blur', () => input.style.borderColor = 'var(--border)');
    
    // Auto focus with a small delay for mobile keyboards
    setTimeout(() => input.focus(), 300);

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (!query.trim()) {
            resultsContainer.innerHTML = '<h3 class="text-secondary" style="margin-bottom: 16px; font-size: 14px;">Type to search...</h3>';
            return;
        }

        resultsContainer.innerHTML = createSkeletonList(3);
        
        setTimeout(() => {
            const filtered = restaurants.filter(r => 
                r.name.toLowerCase().includes(query) || 
                r.tags.some(t => t.toLowerCase().includes(query)) ||
                r.menu.some(m => m.name.toLowerCase().includes(query))
            );
            
            if (filtered.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="flex-col items-center justify-center text-center" style="padding: 40px 20px; color: var(--text-secondary);">
                        <i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                        <h3>No results found</h3>
                        <p class="text-sub" style="margin-top: 8px;">Try searching for a different keyword</p>
                    </div>
                `;
            } else {
                resultsContainer.innerHTML = filtered.map(r => `
                    <div style="margin-bottom: 16px;">
                        ${createRestaurantCard(r)}
                    </div>
                `).join('');
            }
            if(window.lucide) lucide.createIcons();
            attachCardClicks();
        }, 300); // Debounce / loading simulation
    });
    
    attachCardClicks();
}

function attachCardClicks() {
    document.querySelectorAll('.restaurant-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            window.location.hash = `#/restaurant/${id}`;
        });
    });
}
