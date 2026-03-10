// js/components.js

import { formatCurrency } from './utils.js';

export function createRestaurantCard(restaurant) {
    const isFast = parseInt(restaurant.deliveryTime) < 20;
    
    return `
        <div class="card restaurant-card" data-id="${restaurant.id}" style="cursor: pointer;">
            <div style="position: relative; height: 160px;">
                <img src="${restaurant.image}" alt="${restaurant.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                <div style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.9); border-radius: var(--radius-pill); padding: 4px 8px; display: flex; align-items: center; gap: 4px; font-weight: 600; font-size: 12px; box-shadow: var(--shadow-sm);">
                    <i data-lucide="star" style="width: 12px; height: 12px; color: #F59E0B; fill: #F59E0B;"></i>
                    ${restaurant.rating}
                </div>
            </div>
            <div style="padding: 16px;">
                <div class="flex justify-between items-center" style="margin-bottom: 4px;">
                    <h3 class="font-bold truncate" style="max-width: 80%;">${restaurant.name}</h3>
                    <span class="text-caption">${restaurant.priceTier}</span>
                </div>
                <p class="text-sub truncate" style="margin-bottom: 12px;">${restaurant.tags.join(' • ')}</p>
                <div class="flex items-center gap-md text-caption">
                    <div class="flex items-center gap-xs" style="color: ${isFast ? 'var(--success)' : 'inherit'};">
                        <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                        <span>${restaurant.deliveryTime}</span>
                    </div>
                    <div class="flex items-center gap-xs">
                        <i data-lucide="bike" style="width: 14px; height: 14px;"></i>
                        <span>${formatCurrency(restaurant.deliveryFee)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function createFoodCategory(category) {
    return `
        <div class="category-item flex-col items-center justify-center" data-id="${category.id}" style="min-width: 72px; cursor: pointer;">
            <div style="width: 64px; height: 64px; background: var(--bg-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; transition: transform 0.2s; border: 1px solid var(--border);">
                <i data-lucide="${category.icon}" style="width: 28px; height: 28px; color: var(--text-primary);"></i>
            </div>
            <span class="text-caption font-medium">${category.name}</span>
        </div>
    `;
}

export function createMenuItem(item) {
    return `
        <div class="menu-item flex justify-between gap-md" data-id="${item.id}" style="padding: 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s;">
            <div style="flex: 1;">
                <h4 class="font-medium" style="margin-bottom: 4px; font-size: 16px;">${item.name}</h4>
                <p class="text-sub truncate" style="font-size: 13px; margin-bottom: 8px; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${item.description}</p>
                <div class="font-medium text-primary">${formatCurrency(item.price)}</div>
            </div>
            ${item.image ? `
                <div style="width: 100px; height: 100px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0;">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                </div>
            ` : ''}
        </div>
    `;
}

export function createCartItem(cartItem, index) {
    const { item, quantity, customizations } = cartItem;
    
    let optionsText = [];
    if(customizations.variant) optionsText.push(customizations.variant.name);
    if(customizations.addons && customizations.addons.length) {
        optionsText.push(...customizations.addons.map(a => a.name));
    }
    
    let itemTotal = item.price;
    if(customizations.variant) itemTotal += customizations.variant.price;
    if(customizations.addons) {
        customizations.addons.forEach(a => itemTotal += a.price);
    }
    itemTotal = itemTotal * quantity;
    
    return `
        <div class="cart-item flex justify-between items-center" style="padding: 16px 0; border-bottom: 1px solid var(--border);">
            <div class="flex gap-md w-full" style="flex: 1;">
                <div class="flex flex-col items-center justify-between" style="border: 1px solid var(--border); border-radius: var(--radius-pill); padding: 4px; min-width: 32px; background: var(--bg-secondary);">
                    <button class="qty-btn" data-action="decrease" data-index="${index}" style="background:none; border:none; cursor:pointer;"><i data-lucide="minus" style="width: 14px; height:14px;"></i></button>
                    <span class="font-medium text-caption" style="margin: 4px 0;">${quantity}</span>
                    <button class="qty-btn" data-action="increase" data-index="${index}" style="background:none; border:none; cursor:pointer;"><i data-lucide="plus" style="width: 14px; height:14px;"></i></button>
                </div>
                <div style="flex: 1;">
                    <div class="flex justify-between items-start" style="margin-bottom: 4px;">
                        <span class="font-medium">${item.name}</span>
                        <span class="font-medium">${formatCurrency(itemTotal)}</span>
                    </div>
                    ${optionsText.length ? `<div class="text-caption text-secondary" style="margin-bottom: 4px;">${optionsText.join(', ')}</div>` : ''}
                    <button class="remove-btn text-caption text-accent" data-index="${index}" style="background:none; border:none; padding:0; cursor:pointer; font-weight: 600;">Remove</button>
                </div>
            </div>
        </div>
    `;
}

export function createSkeletonList(count = 3, type = 'card') {
    let html = '';
    for(let i=0; i<count; i++) {
        if(type === 'card') {
            html += `
                <div class="card" style="margin-bottom: 16px;">
                    <div class="skeleton" style="height: 160px; width: 100%;"></div>
                    <div style="padding: 16px;">
                        <div class="skeleton" style="height: 20px; width: 60%; margin-bottom: 12px;"></div>
                        <div class="skeleton" style="height: 14px; width: 40%;"></div>
                    </div>
                </div>
            `;
        }
    }
    return html;
}
