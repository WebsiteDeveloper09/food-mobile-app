// js/data.js

const IMAGES = {
    burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sushi: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
    salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    dessert: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?auto=format&fit=crop&w=800&q=80',
    coffee: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
    steak: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tacos: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    bowl: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?auto=format&fit=crop&w=800&q=80'
};

const RESTAURANT_NAMES = [
    "Burger Joint", "Slice of Italy", "Tokyo Drift Sushi", "Green Bowl", "The Steakhouse",
    "Taco Fiesta", "Morning Brew", "Pasta Paradise", "Sweet Cravings", "Healthy Bites",
    "Urban Burger", "Pizza Express", "Sushi Zen", "Vegan Heaven", "Fire Grill",
    "El Camino Tacos", "Cafe Mocha", "Noodle Bar", "Dessert Factory", "Salad Station"
];

const CUISINES = ['Burgers', 'Italian', 'Japanese', 'Healthy', 'American', 'Mexican', 'Cafe', 'Italian', 'Desserts', 'Healthy', 'American', 'Italian', 'Japanese', 'Vegan', 'American', 'Mexican', 'Cafe', 'Asian', 'Desserts', 'Healthy'];

const IMAGE_MAPPING = ['burger', 'pizza', 'sushi', 'bowl', 'steak', 'tacos', 'coffee', 'pasta', 'dessert', 'salad', 'burger', 'pizza', 'sushi', 'bowl', 'steak', 'tacos', 'coffee', 'pasta', 'dessert', 'salad'];

const MENU_SECTIONS = ['Popular', 'Starters', 'Mains', 'Drinks', 'Desserts'];

function generateMenu(cuisineIdx) {
    let menu = [];
    let itemId = 1;
    const baseImage = IMAGES[IMAGE_MAPPING[cuisineIdx]];
    
    MENU_SECTIONS.forEach(section => {
        // Generate 3-6 items per section mapping to 15-30 items total
        const count = Math.floor(Math.random() * 4) + 3; 
        for(let i=0; i<count; i++) {
            menu.push({
                id: `item_${cuisineIdx}_${itemId++}`,
                name: `${section} Item ${i+1}`,
                description: "A delicious and freshly prepared dish containing high-quality ingredients.",
                price: parseFloat((Math.random() * 20 + 5).toFixed(2)),
                image: Math.random() > 0.3 ? baseImage : null,
                section: section,
                calories: Math.floor(Math.random() * 500) + 200,
                addons: [
                    { name: 'Extra Sauce', price: 1.50 },
                    { name: 'Add Bacon', price: 2.00 },
                    { name: 'Gluten Free', price: 0.00 }
                ],
                variants: [
                    { name: 'Regular', price: 0 },
                    { name: 'Large', price: 3.50 }
                ]
            });
        }
    });
    return menu;
}

const restaurants = RESTAURANT_NAMES.map((name, index) => {
    return {
        id: `rest_${index+1}`,
        name: name,
        image: IMAGES[IMAGE_MAPPING[index]],
        tags: [CUISINES[index], Math.random() > 0.5 ? 'Fast Food' : 'Casual Dining'],
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviewsCount: Math.floor(Math.random() * 500) + 50,
        deliveryTime: `${Math.floor(Math.random() * 30) + 15} min`,
        deliveryFee: parseFloat((Math.random() * 4 + 1).toFixed(2)),
        distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
        priceTier: index % 3 === 0 ? '$$$' : (index % 2 === 0 ? '$$' : '$'),
        isOpen: true,
        menu: generateMenu(index),
        reviews: [
            { id: 1, user: 'John D.', rating: 5, date: '2 days ago', comment: 'Absolutely fantastic food and fast delivery!' },
            { id: 2, user: 'Sarah M.', rating: 4, date: '1 week ago', comment: 'Great taste, but portion could be slightly bigger.' }
        ]
    };
});

const userProfile = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    savedAddresses: [
        { id: 'addr_1', label: 'Home', address: '123 Main St, Apt 4B', isDefault: true },
        { id: 'addr_2', label: 'Work', address: '456 Market St, Floor 10', isDefault: false }
    ],
    paymentMethods: [
        { id: 'pay_1', type: 'Visa', last4: '4242', isDefault: true },
        { id: 'pay_2', type: 'Apple Pay', last4: '', isDefault: false }
    ]
};

const categories = [
    { id: 'cat_1', name: 'Pizza', icon: 'pizza' },
    { id: 'cat_2', name: 'Burgers', icon: 'beef' }, // Lucide doesn't have hamburger, use beef or sandwich
    { id: 'cat_3', name: 'Healthy', icon: 'leaf' },
    { id: 'cat_4', name: 'Sushi', icon: 'fish' },
    { id: 'cat_5', name: 'Coffee', icon: 'coffee' },
    { id: 'cat_6', name: 'Desserts', icon: 'cake' }
];

export { restaurants, userProfile, categories };
