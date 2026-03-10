// js/pages/itemModal.js

import store from '../state.js';
import { formatCurrency } from '../utils.js';

let activeItem = null;
let activeRestaurantId = null;
let quantity = 1;
let selectedVariant = null;
let selectedAddons = [];

export function renderItemModal(item, restaurantId) {
    activeItem = item;
    activeRestaurantId = restaurantId;
    quantity = 1;
    selectedVariant = item.variants && item.variants.length ? item.variants[0] : null;
    selectedAddons = [];

    const container = document.getElementById('modal-container');
    
    const variantHtml = item.variants ? `
        <div style="margin-bottom: 24px;">
            <div class="flex justify-between items-center" style="margin-bottom: 12px;">
                <h3 style="font-size: 16px;">Size</h3>
                <span class="text-caption text-secondary" style="background: var(--bg-secondary); padding: 2px 8px; border-radius: var(--radius-sm);">Required</span>
            </div>
            <div class="flex-col gap-sm">
                ${item.variants.map((v, i) => `
                    <label class="flex justify-between items-center" style="padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: border-color 0.2s;">
                        <input type="radio" name="variant" value="${i}" ${i === 0 ? 'checked' : ''} style="accent-color: var(--primary); transform: scale(1.2);">
                        <span class="font-medium" style="margin-left: 12px; flex: 1;">${v.name}</span>
                        <span class="text-secondary">${v.price > 0 ? '+' + formatCurrency(v.price) : ''}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    ` : '';

    const addonsHtml = item.addons ? `
        <div style="margin-bottom: 32px;">
            <div class="flex justify-between items-center" style="margin-bottom: 12px;">
                <h3 style="font-size: 16px;">Add-ons</h3>
                <span class="text-caption text-secondary" style="background: var(--bg-secondary); padding: 2px 8px; border-radius: var(--radius-sm);">Optional</span>
            </div>
            <div class="flex-col gap-sm">
                ${item.addons.map((a, i) => `
                    <label class="flex justify-between items-center" style="padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer;">
                        <input type="checkbox" name="addon" value="${i}" style="accent-color: var(--primary); transform: scale(1.2);">
                        <span class="font-medium" style="margin-left: 12px; flex: 1;">${a.name}</span>
                        <span class="text-secondary">+${formatCurrency(a.price)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    ` : '';

    container.innerHTML = `
        <div class="modal-overlay show" id="itemModalOverlay"></div>
        <div class="bottom-sheet show flex-col" style="height: 85vh; padding: 0;">
            <div style="position: sticky; top: 0; background: var(--bg-main); z-index: 20; border-radius: var(--radius-xl) var(--radius-xl) 0 0;">
                <div class="sheet-handle" style="margin-top: 12px;"></div>
                <button id="closeModalBtn" class="btn-icon-only flex justify-center items-center" style="position: absolute; top: 12px; right: 16px; background: var(--bg-secondary); border: none; cursor: pointer;">
                    <i data-lucide="x" style="width: 20px; height: 20px; color: var(--text-primary);"></i>
                </button>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 0 20px 100px 20px; -webkit-overflow-scrolling: touch;">
                ${item.image ? `
                    <div style="width: 100%; height: 200px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 24px; box-shadow: var(--shadow-sm);">
                        <img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                ` : ''}
                
                <h2 style="font-size: 24px; margin-bottom: 8px;">${item.name}</h2>
                <p class="text-body text-secondary" style="margin-bottom: 16px;">${item.description}</p>
                <div class="flex gap-md" style="margin-bottom: 32px;">
                    <span class="font-bold text-primary" style="font-size: 18px;">${formatCurrency(item.price)}</span>
                    ${item.calories ? `<span class="text-caption text-secondary flex items-center gap-xs"><i data-lucide="flame" style="width: 14px; height:14px; color: var(--accent);"></i> ${item.calories} kcal</span>` : ''}
                </div>
                
                ${variantHtml}
                ${addonsHtml}
            </div>
            
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 16px 20px 24px; background: var(--bg-main); border-top: 1px solid var(--border); z-index: 20; display: flex; gap: 16px; align-items: center;">
                <div class="flex items-center justify-between" style="background: var(--bg-secondary); border-radius: var(--radius-pill); padding: 8px; width: 120px;">
                    <button id="minusQtyBtn" class="btn-icon-only flex justify-center items-center" style="width: 36px; height: 36px; background: var(--white); border: none; box-shadow: var(--shadow-sm); cursor: pointer;"><i data-lucide="minus" style="width:16px;"></i></button>
                    <span id="qtyDisplay" class="font-medium" style="font-size: 16px;">1</span>
                    <button id="plusQtyBtn" class="btn-icon-only flex justify-center items-center" style="width: 36px; height: 36px; background: var(--white); border: none; box-shadow: var(--shadow-sm); cursor: pointer;"><i data-lucide="plus" style="width:16px;"></i></button>
                </div>
                <button id="addToCartBtn" class="btn btn-primary flex justify-between items-center" style="flex: 1;">
                    <span>Add to Cart</span>
                    <span id="addToCartTotal">${formatCurrency(item.price)}</span>
                </button>
            </div>
        </div>
    `;

    if(window.lucide) lucide.createIcons();

    // Event Listeners
    const closeBtn = document.getElementById('closeModalBtn');
    const overlay = document.getElementById('itemModalOverlay');
    const closeFn = () => {
        const sheet = container.querySelector('.bottom-sheet');
        sheet.classList.remove('show');
        overlay.classList.remove('show');
        setTimeout(() => container.innerHTML = '', 300);
    };
    closeBtn.addEventListener('click', closeFn);
    overlay.addEventListener('click', closeFn);

    const updatePrice = () => {
        let total = parseFloat(item.price);
        if(selectedVariant) total += parseFloat(selectedVariant.price);
        selectedAddons.forEach(a => total += parseFloat(a.price));
        total *= quantity;
        document.getElementById('addToCartTotal').textContent = formatCurrency(total);
    };

    // Radios
    const rads = container.querySelectorAll('input[type="radio"]');
    rads.forEach(rad => {
        rad.addEventListener('change', (e) => {
            selectedVariant = item.variants[e.target.value];
            updatePrice();
        });
    });

    // Checkboxes
    const chks = container.querySelectorAll('input[type="checkbox"]');
    chks.forEach(chk => {
        chk.addEventListener('change', (e) => {
            const addon = item.addons[e.target.value];
            if(e.target.checked) selectedAddons.push(addon);
            else selectedAddons = selectedAddons.filter(a => a.name !== addon.name);
            updatePrice();
        });
    });

    // Qty
    const dQty = document.getElementById('qtyDisplay');
    document.getElementById('plusQtyBtn').addEventListener('click', () => {
        if(quantity < 99) { quantity++; dQty.textContent = quantity; updatePrice(); }
    });
    document.getElementById('minusQtyBtn').addEventListener('click', () => {
        if(quantity > 1) { quantity--; dQty.textContent = quantity; updatePrice(); }
    });

    // Add To Cart
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        store.addToCart(item, quantity, restaurantId, {
            variant: selectedVariant,
            addons: [...selectedAddons]
        });
        
        // Add to cart animation effect (badge scaling)
        const btnText = document.querySelector('#addToCartBtn span');
        btnText.textContent = 'Added!';
        setTimeout(() => closeFn(), 400);
    });

    updatePrice();
}
