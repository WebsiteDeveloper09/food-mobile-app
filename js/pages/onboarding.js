// js/pages/onboarding.js

export function renderOnboarding() {
    return `
        <div class="page-view flex-col" style="height: 100vh; height: 100dvh; background: var(--bg-main);">
            <div style="flex: 1; position: relative; overflow: hidden;">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" alt="Delicious Food" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8));"></div>
            </div>
            
            <div style="flex: 1; padding: 32px 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border-radius: var(--radius-xl) var(--radius-xl) 0 0; margin-top: -32px; background: var(--bg-main); position: relative; z-index: 10;">
                <div style="width: 64px; height: 64px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: var(--white); box-shadow: 0 8px 16px rgba(255,106,61,0.3);">
                    <i data-lucide="utensils-crossed" style="width: 32px; height: 32px;"></i>
                </div>
                
                <h1 style="margin-bottom: 12px; font-size: 32px;">Savor</h1>
                <p class="text-body text-secondary" style="margin-bottom: 40px; max-width: 280px;">Discover the best local food and get it delivered fast, hot, and fresh to your door.</p>
                
                <a href="#/home" class="btn btn-primary" style="margin-bottom: 16px; text-decoration: none;">Get Started</a>
                <a href="#/home" class="btn btn-secondary" style="text-decoration: none;">Sign In</a>
            </div>
        </div>
    `;
}

export function initOnboarding() {
    // Hide bottom nav on onboarding
    const nav = document.getElementById('bottom-nav');
    if(nav) nav.style.display = 'none';
}
