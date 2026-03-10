// js/pages/orders.js

import store from '../state.js';
import { formatCurrency } from '../utils.js';

export function renderOrders() {
    const orders = store.getState().orders;
    
    if(orders.length === 0) {
        return `
            <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-main);">
                <header style="padding: 24px 20px; border-bottom: 1px solid var(--border);">
                    <h1 style="font-size: 24px;">Orders</h1>
                </header>
                <div class="flex-col items-center justify-center flex-1" style="padding: 20px; text-align: center;">
                    <i data-lucide="receipt" style="width: 48px; height: 48px; color: var(--text-tertiary); margin-bottom: 16px;"></i>
                    <h3 style="margin-bottom: 8px;">No orders yet</h3>
                    <p class="text-secondary" style="margin-bottom: 24px;">When you place an order, it will appear here.</p>
                    <a href="#/" class="btn btn-primary">Find Food</a>
                </div>
            </div>
        `;
    }

    return `
        <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-secondary); padding-bottom: 80px; overflow-y: auto;">
            <header style="padding: 24px 20px; background: var(--bg-main); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10;">
                <h1 style="font-size: 24px;">Orders</h1>
            </header>
            
            <div style="padding: 20px;">
                ${orders.slice().reverse().map(order => `
                    <div style="background: var(--bg-main); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; border: 1px solid var(--border);">
                        <div class="flex justify-between items-start" style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
                            <div class="flex items-center gap-md">
                                <img src="${order.restaurant.image}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover;">
                                <div>
                                    <h3 class="font-medium" style="font-size: 16px; margin-bottom: 4px;">${order.restaurant.name}</h3>
                                    <p class="text-caption text-secondary">${new Date(order.date).toLocaleDateString()} • ${formatCurrency(order.total)}</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-caption font-bold" style="color: ${order.status === 'Delivered' ? 'var(--success)' : 'var(--primary)'}; background: rgba(0,0,0,0.05); padding: 4px 8px; border-radius: var(--radius-sm);">
                                ${order.status}
                            </span>
                            <a href="#/tracking/${order.id}" class="text-caption text-primary" style="text-decoration: none; font-weight: 600;">View Details</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

export function initOrders() {
    // 
}
