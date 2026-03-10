// js/pages/profile.js

import { userProfile } from '../data.js';

export function renderProfile() {
    return `
        <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-secondary); padding-bottom: 80px; overflow-y: auto;">
            <header style="padding: 24px 20px; background: var(--bg-main); border-bottom: 1px solid var(--border);">
                <h1 style="font-size: 24px; margin-bottom: 24px;">Profile</h1>
                
                <div class="flex items-center gap-md">
                    <div style="width: 72px; height: 72px; border-radius: 50%; overflow: hidden; border: 2px solid var(--border);">
                        <img src="${userProfile.avatar}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div>
                        <h2 style="font-size: 20px; margin-bottom: 4px;">${userProfile.name}</h2>
                        <p class="text-secondary">${userProfile.email}</p>
                    </div>
                </div>
            </header>
            
            <div style="margin-top: 24px;">
                <div style="background: var(--bg-main); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
                    ${[
                        { icon: 'map-pin', text: 'Saved Addresses' },
                        { icon: 'credit-card', text: 'Payment Methods' },
                        { icon: 'bell', text: 'Notifications' },
                        { icon: 'shield', text: 'Privacy & Security' },
                        { icon: 'help-circle', text: 'Help Center' }
                    ].map((item, i, arr) => `
                        <div class="flex items-center justify-between" style="padding: 16px 20px; cursor: pointer; border-bottom: ${i < arr.length - 1 ? '1px solid var(--border)' : 'none'};">
                            <div class="flex items-center gap-md">
                                <i data-lucide="${item.icon}" style="width: 20px; color: var(--text-secondary);"></i>
                                <span class="font-medium">${item.text}</span>
                            </div>
                            <i data-lucide="chevron-right" style="width: 20px; color: var(--text-tertiary);"></i>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="padding: 32px 20px;">
                <button class="btn btn-outline flex justify-center items-center gap-sm" style="color: var(--accent); border-color: var(--accent); width: 100%;">
                    <i data-lucide="log-out" style="width: 18px;"></i> Log Out
                </button>
            </div>
        </div>
    `;
}

export function initProfile() {
    // Basic init
}
