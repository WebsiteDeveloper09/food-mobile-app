// js/pages/tracking.js

import store from '../state.js';
import { formatCurrency } from '../utils.js';

export function renderTracking(orderId) {
    const state = store.getState();
    const order = state.orders.find(o => o.id === orderId) || state.activeOrder;
    
    if(!order) {
        return `
            <div class="page-view flex-col items-center justify-center">
                <div style="width: 80px; height: 80px; background: var(--bg-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                    <i data-lucide="search-x" style="width: 40px; height: 40px; color: var(--text-tertiary);"></i>
                </div>
                <h2>Order not found</h2>
                <p class="text-secondary" style="margin-top: 8px;">We couldn't locate this order.</p>
                <a href="#/" class="btn btn-primary" style="margin-top:32px; max-width: 200px; text-decoration: none;">Go Home</a>
            </div>
        `;
    }

    const statuses = ['Processing', 'Preparing', 'On the way', 'Arriving', 'Delivered'];
    let currentStep = statuses.indexOf(order.status) + 1;
    if(currentStep === 0) currentStep = 1; 

    // Simulation logic for map marker position
    let markerTop = "50%";
    let markerLeft = "50%";
    let markerIcon = "store";
    let pulseClass = "pulse";

    if (order.status === 'On the way') {
        markerTop = "40%";
        markerLeft = "30%";
        markerIcon = "bike";
    } else if (order.status === 'Arriving') {
        markerTop = "55%";
        markerLeft = "65%";
        markerIcon = "bike";
    } else if (order.status === 'Delivered') {
        markerTop = "60%";
        markerLeft = "75%";
        markerIcon = "home";
        pulseClass = ""; // No pulse when delivered
    }

    return `
        <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-secondary);">
            <!-- Map Simulation Area -->
            <div style="flex: 2; position: relative; background: #E5E9EA; min-height: 250px; overflow: hidden;">
                <!-- Simulated Google Map Image background -->
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6; mix-blend-mode: multiply;">
                
                <!-- Map UI Elements Overlay -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; padding: 16px 20px; display: flex; justify-content: space-between; z-index: 10;">
                    <a href="#/orders" class="btn-icon-only flex justify-center items-center" style="background: var(--white); color: var(--text-primary); text-decoration: none; box-shadow: var(--shadow-sm); width: 44px; height: 44px; border-radius: 50%;">
                        <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
                    </a>
                </div>

                <!-- Animated Map Marker -->
                <div style="position: absolute; top: ${markerTop}; left: ${markerLeft}; transform: translate(-50%, -50%); transition: all 2s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5;">
                    <div class="${pulseClass}" style="width: 64px; height: 64px; background: rgba(255,106,61,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(255,106,61,0.4); border: 2px solid var(--white);">
                            <i data-lucide="${markerIcon}" style="color: var(--white); width: 20px;"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tracking Card -->
            <div style="flex: 3; background: var(--bg-main); border-radius: var(--radius-xl) var(--radius-xl) 0 0; margin-top: -30px; position: relative; z-index: 20; padding: 24px 20px; overflow-y: auto; box-shadow: 0 -10px 30px rgba(0,0,0,0.05);">
                
                <div class="flex-col items-center justify-center text-center" style="margin-bottom: 24px;">
                    <div style="background: rgba(255,106,61,0.1); color: var(--primary); padding: 6px 16px; border-radius: var(--radius-pill); font-weight: 700; font-size: 14px; margin-bottom: 12px;">
                        ${order.status === 'Delivered' ? 'Order Delivered' : 'Arriving in 15-20 min'}
                    </div>
                    <h2 style="font-size: 24px; margin-bottom: 4px;">${order.status === 'Delivered' ? 'Enjoy your food!' : 'Track your order'}</h2>
                    <p class="text-secondary text-sub">Order #${order.id.slice(-6)} • ${order.restaurant.name}</p>
                </div>

                <!-- Progress Bar -->
                <div style="width: 100%; height: 6px; background: var(--bg-secondary); border-radius: 3px; margin-bottom: 32px; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; height: 100%; background: var(--primary); width: ${(currentStep / statuses.length) * 100}%; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                </div>

                <!-- Timeline -->
                <div style="position: relative; margin-bottom: 32px; padding-left: 12px;">
                    <div style="position: absolute; left: 18px; top: 10px; bottom: 10px; width: 2px; background: var(--border); z-index: 1;"></div>
                    
                    ${statuses.map((status, index) => {
                        const isCompleted = index < currentStep;
                        const isCurrent = index === currentStep - 1;
                        const color = isCompleted ? 'var(--primary)' : 'var(--border)';
                        const textColor = isCompleted ? 'var(--text-primary)' : 'var(--text-tertiary)';
                        
                        return `
                            <div class="flex items-center gap-md" style="margin-bottom: 24px; position: relative; z-index: 2; opacity: ${isCompleted ? '1' : '0.4'}; transition: opacity 0.5s;">
                                <div style="width: 14px; height: 14px; border-radius: 50%; background: ${isCurrent ? 'var(--primary)' : 'var(--white)'}; border: 3px solid ${color}; box-shadow: ${isCurrent ? '0 0 0 4px rgba(255,106,61,0.2)' : 'none'};"></div>
                                <div>
                                    <h4 style="color: ${textColor}; font-weight: ${isCurrent ? '700' : '500'}; font-size: 16px;">${status}</h4>
                                </div>
                            </div>
                        `;
                    }).join('')}
                    
                    <div style="position: absolute; left: 18px; top: 10px; height: ${Math.max(0, (currentStep - 1) * 22.5)}%; width: 2px; background: var(--primary); z-index: 1; transition: height 1s ease-in-out;"></div>
                </div>

                <!-- Driver details -->
                ${currentStep >= 3 ? `
                    <div class="flex items-center justify-between" style="padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg-secondary); margin-bottom: 24px; animation: slideUp 0.5s ease-out;">
                        <div class="flex items-center gap-sm">
                            <div style="width: 52px; height: 52px; border-radius: 50%; overflow: hidden; border: 2px solid var(--white); box-shadow: var(--shadow-sm);">
                                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80" alt="Driver" style="width:100%; height:100%; object-fit:cover;">
                            </div>
                            <div>
                                <h4 class="font-bold">Alex M. <span style="font-weight: 400; font-size: 12px; color: var(--text-tertiary); margin-left: 4px;">⭐ 4.9</span></h4>
                                <span class="text-caption text-secondary">Toyota Prius • ABC 123</span>
                            </div>
                        </div>
                        <div class="flex gap-sm">
                            <button class="btn-icon-only flex justify-center items-center" style="width: 44px; height: 44px; background: var(--white); border: 1px solid var(--border); border-radius: 50%; cursor:pointer; color: var(--primary);">
                                <i data-lucide="message-square" style="width: 20px;"></i>
                            </button>
                        </div>
                    </div>
                ` : ''}

                <a href="#/" class="btn btn-secondary text-primary" style="text-decoration:none; display:flex; background-color: rgba(255, 106, 61, 0.05); font-weight: 700;">Back to Home</a>
            </div>
        </div>
    `;
}

export function initTracking() {
    const nav = document.getElementById('bottom-nav');
    if(nav) nav.style.display = 'none';

    if (!document.getElementById('tracking-animations')) {
        const style = document.createElement('style');
        style.id = 'tracking-animations';
        style.innerHTML = `
            @keyframes pulse {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 106, 61, 0.4); }
                70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(255, 106, 61, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 106, 61, 0); }
            }
            .pulse { animation: pulse 2s infinite; }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Advanced Simulation Loop
    const state = store.getState();
    const activeOrder = state.activeOrder;
    
    if (activeOrder && activeOrder.status !== 'Delivered') {
        const timeline = [
            { status: 'Processing', delay: 0 },
            { status: 'Preparing', delay: 4000 },
            { status: 'On the way', delay: 10000 },
            { status: 'Arriving', delay: 20000 },
            { status: 'Delivered', delay: 30000 }
        ];

        const currentIdx = timeline.findIndex(t => t.status === activeOrder.status);
        
        timeline.slice(currentIdx + 1).forEach(step => {
            setTimeout(() => {
                // Verify we are still looking at the same order or order is still active
                const currentOrder = store.getState().activeOrder;
                if (currentOrder && currentOrder.id === activeOrder.id) {
                    store.updateOrderStatus(step.status);
                    
                    // Re-render if we are on the tracking page
                    if (window.location.hash.startsWith('#/tracking/')) {
                        const app = document.getElementById('app');
                        app.innerHTML = renderTracking(activeOrder.id);
                        if(window.lucide) lucide.createIcons();
                    }
                }
            }, step.delay - timeline[currentIdx].delay);
        });
    }
}
