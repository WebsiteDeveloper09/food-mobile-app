// js/pages/cart.js

import store from '../state.js';
import { createCartItem } from '../components.js';
import { formatCurrency } from '../utils.js';
import { userProfile } from '../data.js';

export function renderCart() {
    const state = store.getState();
    const cart = state.cart;
    
    if(cart.length === 0) {
        return `
            <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-main);">
                <header class="flex justify-between items-center" style="padding: 16px 20px; border-bottom: 1px solid var(--border);">
                    <a href="javascript:history.back()" class="btn-icon-only flex justify-center items-center" style="color: var(--text-primary); text-decoration: none;">
                        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                    </a>
                    <h2 style="font-size: 18px;">Your Cart</h2>
                    <div style="width: 44px;"></div>
                </header>
                <div class="flex-col items-center justify-center flex-1" style="height: 100%; text-align: center; padding: 20px;">
                    <div style="width: 120px; height: 120px; background: var(--bg-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; color: var(--text-tertiary);"></i>
                    </div>
                    <h3 style="margin-bottom: 8px;">Your cart is empty</h3>
                    <p class="text-secondary" style="margin-bottom: 32px;">Looks like you haven't added anything yet.</p>
                    <a href="#/" class="btn btn-primary" style="text-decoration: none;">Browse Restaurants</a>
                </div>
            </div>
        `;
    }
    
    const restaurant = store.getCartRestaurant();
    const subtotal = store.getCartTotal();
    const deliveryFee = restaurant.deliveryFee;
    const taxes = subtotal * 0.08;
    const total = subtotal + deliveryFee + taxes;
    
    const defaultAddress = state.user.savedAddresses.find(a => a.isDefault) || state.user.savedAddresses[0];
    const defaultPayment = state.user.paymentMethods.find(p => p.isDefault) || state.user.paymentMethods[0];

    return `
        <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-secondary);">
            <header class="flex justify-between items-center" style="padding: 16px 20px; background: var(--bg-main); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10;">
                <a href="javascript:history.back()" class="btn-icon-only flex justify-center items-center" style="color: var(--text-primary); text-decoration: none;">
                    <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                </a>
                <h2 style="font-size: 18px;">Checkout</h2>
                <div style="width: 44px;"></div>
            </header>
            
            <div style="flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 120px;">
                
                <!-- Deliver to -->
                <div style="background: var(--bg-main); padding: 20px; margin-bottom: 12px;">
                    <div class="flex justify-between items-center" style="margin-bottom: 16px;">
                        <h3 style="font-size: 16px;">Deliver to</h3>
                        <a href="#/profile" class="text-primary text-caption" style="text-decoration: none; font-weight: 600;">Change</a>
                    </div>
                    
                    <div class="flex gap-md" style="align-items: center;">
                        <div style="width: 48px; height: 48px; background: var(--bg-secondary); border-radius: 50%; display: flex; flex-shrink: 0; align-items: center; justify-content: center;">
                            <i data-lucide="map-pin" style="width: 20px; height: 20px; color: var(--text-secondary);"></i>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <p class="font-medium truncate" style="margin-bottom: 4px;">${defaultAddress?.label || 'Home'}</p>
                            <p class="text-sub truncate">${defaultAddress?.address || '123 Main St'}</p>
                        </div>
                        <div class="flex items-center gap-xs text-primary" style="background: var(--bg-secondary); padding: 6px 12px; border-radius: var(--radius-pill); font-size: 14px; font-weight: 600;">
                            <i data-lucide="clock" style="width: 14px;"></i> ${restaurant.deliveryTime}
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div style="background: var(--bg-main); padding: 20px; margin-bottom: 12px;">
                    <div style="margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 16px;">
                        <a href="#/restaurant/${restaurant.id}" style="text-decoration: none; color: inherit; display: flex; align-items: center; justify-content: space-between;">
                            <h3 style="font-size: 18px;">${restaurant.name}</h3>
                            <span class="text-caption text-primary">Add more items</span>
                        </a>
                    </div>
                    <div id="cartItemsList" class="flex-col">
                        ${cart.map((item, idx) => createCartItem(item, idx)).join('')}
                    </div>
                </div>
                
                <!-- Summary -->
                <div style="background: var(--bg-main); padding: 20px; margin-bottom: 12px;">
                    <h3 style="font-size: 16px; margin-bottom: 16px;">Summary</h3>
                    
                    <div class="flex justify-between items-center text-body" style="margin-bottom: 12px;">
                        <span class="text-secondary">Subtotal</span>
                        <span class="font-medium">${formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div class="flex justify-between items-center text-body" style="margin-bottom: 12px;">
                        <span class="text-secondary">Delivery Fee</span>
                        <span class="font-medium">${formatCurrency(deliveryFee)}</span>
                    </div>
                    
                    <div class="flex justify-between items-center text-body" style="margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 16px;">
                        <span class="text-secondary">Taxes & Fees</span>
                        <span class="font-medium">${formatCurrency(taxes)}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="font-bold" style="font-size: 18px;">Total</span>
                        <span class="font-bold text-primary" style="font-size: 20px;">${formatCurrency(total)}</span>
                    </div>
                </div>
                
                <!-- Payment -->
                <div style="background: var(--bg-main); padding: 20px;">
                    <div class="flex justify-between items-center" style="margin-bottom: 16px;">
                        <h3 style="font-size: 16px;">Pay with</h3>
                        <a href="#/profile" class="text-primary text-caption" style="text-decoration: none; font-weight: 600;">Change</a>
                    </div>
                    
                    <div class="flex items-center justify-between" style="padding: 16px; border: 1px solid var(--primary); border-radius: var(--radius-md); background: rgba(255, 106, 61, 0.05);">
                        <div class="flex items-center gap-md">
                            <i data-lucide="credit-card" style="width: 24px; color: var(--text-secondary);"></i>
                            <span class="font-medium">${defaultPayment?.type} •••• ${defaultPayment?.last4 || ''}</span>
                        </div>
                        <i data-lucide="check-circle-2" style="width: 20px; color: var(--primary);"></i>
                    </div>
                </div>
                
            </div>
            
            <!-- Sticky Place Order -->
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 16px 20px 24px; background: var(--bg-main); border-top: 1px solid var(--border); box-shadow: 0 -4px 12px rgba(0,0,0,0.03); z-index: 20;">
                <button id="placeOrderBtn" class="btn btn-primary" style="font-size: 18px;">
                    Place Order • ${formatCurrency(total)}
                </button>
            </div>
        </div>
    `;
}

export function initCart() {
    // Hide bottom nav for checkout flow
    const nav = document.getElementById('bottom-nav');
    if(nav) nav.style.display = 'none';
    
    const container = document.getElementById('cartItemsList');
    if(container) {
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if(!btn) return;
            
            const index = btn.getAttribute('data-index');
            const cart = store.getState().cart;
            
            if(btn.classList.contains('remove-btn')) {
                store.removeFromCart(index);
                renderAppCart();
                return;
            }
            
            if(btn.getAttribute('data-action') === 'increase') {
                store.updateCartQuantity(index, cart[index].quantity + 1);
                renderAppCart();
            } else if(btn.getAttribute('data-action') === 'decrease') {
                store.updateCartQuantity(index, cart[index].quantity - 1);
                renderAppCart();
            }
        });
    }

    const placeBtn = document.getElementById('placeOrderBtn');
    if(placeBtn) {
        placeBtn.addEventListener('click', () => {
            const originalText = placeBtn.innerHTML;
            placeBtn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:24px;"></i> Processing...';
            if(window.lucide) lucide.createIcons();
            
            setTimeout(() => {
                const orderId = store.placeOrder();
                placeBtn.classList.add('success-pop');
                setTimeout(() => {
                    window.location.hash = `#/tracking/${orderId}`;
                }, 400);
            }, 1000); // Simulate network
        });
    }
}

// Ensure style for spinner exists
if (!document.getElementById('spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.innerHTML = `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
}

// Re-render helper
function renderAppCart() {
    const parent = document.getElementById('app');
    parent.innerHTML = renderCart();
    if(window.lucide) lucide.createIcons();
    initCart();
}
