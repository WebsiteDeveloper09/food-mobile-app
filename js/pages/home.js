// js/pages/home.js

import { categories, restaurants, userProfile } from '../data.js';
import { createFoodCategory, createRestaurantCard } from '../components.js';

export function renderHome() {
    const categoriesHtml = categories.map(c => createFoodCategory(c)).join('');
    
    // Featured (Ratings > 4.5)
    const featuredHtml = restaurants
        .filter(r => parseFloat(r.rating) >= 4.5)
        .slice(0, 5)
        .map(r => `
            <div style="min-width: 260px; scroll-snap-align: start;">
                ${createRestaurantCard(r)}
            </div>
        `).join('');

    // Near You
    const nearYouHtml = restaurants
        .slice(0, 10)
        .map(r => createRestaurantCard(r))
        .join('');

    return `
        <div class="page-view" style="padding-bottom: 24px;">
            <!-- Header -->
            <header class="flex justify-between items-center" style="padding: 24px 20px 16px 20px; position: sticky; top: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); z-index: 50; border-bottom: 1px solid var(--border);">
                <div>
                    <p class="text-caption" style="color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Deliver to</p>
                    <h3 class="flex items-center gap-xs cursor-pointer" style="margin-top: 2px;">
                        ${userProfile.savedAddresses.find(a => a.isDefault)?.label || 'Home'} • 12 min 
                        <i data-lucide="chevron-down" style="width:16px; height:16px; color: var(--primary);"></i>
                    </h3>
                </div>
                <div style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 2px solid var(--border);">
                    <img src="${userProfile.avatar}" alt="User" style="width:100%; height:100%; object-fit: cover;">
                </div>
            </header>
            
            <!-- Search Bar -->
            <div style="padding: 0 20px 24px 20px;">
                <a href="#/search" style="text-decoration: none; display: flex; align-items: center; gap: 12px; background: var(--bg-secondary); border-radius: var(--radius-pill); padding: 14px 20px; color: var(--text-secondary); border: 1px solid var(--border); transition: border-color 0.2s;">
                    <i data-lucide="search" style="width: 20px; height: 20px; color: var(--primary);"></i>
                    <span style="font-size: 15px; font-weight: 500;">What are you craving?</span>
                </a>
            </div>
            
            <!-- Categories -->
            <div style="padding: 0 0 24px 0;">
                <div class="flex gap-md" style="overflow-x: auto; padding: 4px 20px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none;">
                    ${categoriesHtml}
                </div>
            </div>
            
            <!-- Featured -->
            <div style="padding: 0 0 32px 0;">
                <h2 style="padding: 0 20px; margin-bottom: 16px; font-size: 20px;">Featured for you</h2>
                <div class="flex gap-md" style="overflow-x: auto; padding: 4px 20px 12px 20px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none;">
                    ${featuredHtml}
                </div>
            </div>
            
            <!-- Near You -->
            <div style="padding: 0 20px;">
                <h2 style="margin-bottom: 16px; font-size: 20px;">Near you</h2>
                <div class="flex-col gap-lg">
                    ${nearYouHtml}
                </div>
            </div>
        </div>
    `;
}

export function initHome() {
    // Show bottom nav
    const nav = document.getElementById('bottom-nav');
    if(nav) nav.style.display = 'flex';
    
    // Add click listeners to restaurant cards
    document.querySelectorAll('.restaurant-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            window.location.hash = `#/restaurant/${id}`;
        });
    });
}
