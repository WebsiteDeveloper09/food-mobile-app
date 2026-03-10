// js/state.js

import { restaurants, userProfile } from './data.js';

class Store extends EventTarget {
    constructor() {
        super();
        const savedState = localStorage.getItem('savor_state');
        this.state = savedState ? JSON.parse(savedState) : {
            cart: [], // { item, quantity, restaurantId, customizations: { variant, addons } }
            favorites: ['rest_1', 'rest_3'], // Array of restaurant IDs
            orders: [], // Array of past/active orders
            activeOrder: null, // Current order being tracked
            user: userProfile,
            restaurants: restaurants
        };
    }

    getState() {
        return this.state;
    }

    emitChange() {
        localStorage.setItem('savor_state', JSON.stringify(this.state));
        this.dispatchEvent(new Event('change'));
    }

    // Cart Methods
    addToCart(item, quantity, restaurantId, customizations) {
        // To keep it simple, if cart has items from another restaurant, we usually clear it.
        // Or we enforce single restaurant cart.
        if(this.state.cart.length > 0 && this.state.cart[0].restaurantId !== restaurantId) {
            // Emulate confirmation. For now, clear cart.
            this.state.cart = [];
        }

        const existingItemIndex = this.state.cart.findIndex(i => 
            i.item.id === item.id && 
            JSON.stringify(i.customizations) === JSON.stringify(customizations)
        );

        if(existingItemIndex > -1) {
            this.state.cart[existingItemIndex].quantity += quantity;
        } else {
            this.state.cart.push({ item, quantity, restaurantId, customizations });
        }
        
        this.emitChange();
    }

    removeFromCart(index) {
        this.state.cart.splice(index, 1);
        this.emitChange();
    }

    updateCartQuantity(index, newQuantity) {
        if(newQuantity <= 0) {
            this.removeFromCart(index);
        } else {
            this.state.cart[index].quantity = newQuantity;
            this.emitChange();
        }
    }

    clearCart() {
        this.state.cart = [];
        this.emitChange();
    }

    getCartTotal() {
        return this.state.cart.reduce((total, cartItem) => {
            let itemTotal = cartItem.item.price;
            if (cartItem.customizations.variant) {
                itemTotal += cartItem.customizations.variant.price;
            }
            if (cartItem.customizations.addons) {
                cartItem.customizations.addons.forEach(addon => {
                    itemTotal += addon.price;
                });
            }
            return total + (itemTotal * cartItem.quantity);
        }, 0);
    }
    
    getCartRestaurant() {
        if(this.state.cart.length === 0) return null;
        return this.state.restaurants.find(r => r.id === this.state.cart[0].restaurantId);
    }

    // Favorites
    toggleFavorite(restaurantId) {
        const idx = this.state.favorites.indexOf(restaurantId);
        if(idx > -1) {
            this.state.favorites.splice(idx, 1);
        } else {
            this.state.favorites.push(restaurantId);
        }
        this.emitChange();
    }
    
    isFavorite(restaurantId) {
        return this.state.favorites.includes(restaurantId);
    }

    // Orders
    placeOrder() {
        if(this.state.cart.length === 0) return null;
        
        const restaurant = this.getCartRestaurant();
        const total = this.getCartTotal();
        const fee = restaurant.deliveryFee;
        const tax = total * 0.08;
        
        const order = {
            id: `ord_${Date.now()}`,
            date: new Date().toISOString(),
            restaurant: restaurant,
            items: [...this.state.cart],
            subtotal: total,
            deliveryFee: fee,
            tax: tax,
            total: total + fee + tax,
            status: 'Preparing' // 'Preparing' -> 'On the way' -> 'Delivered'
        };
        
        this.state.orders.push(order);
        this.state.activeOrder = order;
        this.clearCart();
        this.emitChange();
        return order.id;
    }
    
    updateOrderStatus(status) {
        if(this.state.activeOrder) {
            this.state.activeOrder.status = status;
            this.emitChange();
        }
    }
}

const store = new Store();
export default store;
