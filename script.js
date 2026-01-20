/**
 * WEBCRAFT SEO ARCHITECT - DEMO LOGIC
 * Mục tiêu: Render layout không trùng lặp (Deduplication)
 */

// 1. MOCK DATABASE (Giả lập API từ Shopify/CMS)
const mockData = {
    articles: [
        { id: 101, title: "The Sacred Tatau: More Than Ink", tag: "Culture", image: "https://images.unsplash.com/photo-1596306499317-84902290b8e4?auto=format&fit=crop&w=600", date: "Oct 24, 2025", blog: "Samoa" },
        { id: 102, title: "Top 10 Hidden Beaches in Fiji", tag: "Travel", image: "https://images.unsplash.com/photo-1596423736502-39257e87315a?auto=format&fit=crop&w=600", date: "Oct 22, 2025", blog: "Fiji" },
        { id: 103, title: "Weaving the Future: Modern Mats", tag: "Arts", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600", date: "Oct 20, 2025", blog: "Tonga" },
        { id: 104, title: "Merrie Monarch Festival 2025 Guide", tag: "Holidays", image: "https://images.unsplash.com/photo-1505307520037-c79a9e32f05a?auto=format&fit=crop&w=600", date: "Oct 18, 2025", blog: "Hawaii" },
        { id: 105, title: "Island Fashion Week Highlights", tag: "Fashion", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600", date: "Oct 15, 2025", blog: "PNG" },
        { id: 106, title: "Sustainable Fishing in Micronesia", tag: "Island Life", image: "https://images.unsplash.com/photo-1582967788606-a171f1080ca8?auto=format&fit=crop&w=600", date: "Oct 10, 2025", blog: "FSM" },
        { id: 107, title: "Understanding the Haka", tag: "Culture", image: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=600", date: "Oct 05, 2025", blog: "NZL" },
        { id: 108, title: "Cook Islands: A Paradise Found", tag: "Travel", image: "https://images.unsplash.com/photo-1536697277808-8dc0386762da?auto=format&fit=crop&w=600", date: "Sep 28, 2025", blog: "Cook Islands" },
    ],
    regions: {
        "Polynesia": [
            { name: "Hawaii", img: "https://images.unsplash.com/photo-1542259646-cd6643267d3b?w=400" },
            { name: "New Zealand", img: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400" },
            { name: "Samoa", img: "https://images.unsplash.com/photo-1596306499300-0b7c168e4a5d?w=400" },
            { name: "Tonga", img: "https://images.unsplash.com/photo-1562953218-d760742f8454?w=400" }
        ],
        "Melanesia": [
            { name: "Fiji", img: "https://images.unsplash.com/photo-1574620026266-932d03e5c7a0?w=400" },
            { name: "PNG", img: "https://images.unsplash.com/photo-1558963595-827606e9275b?w=400" },
            { name: "Vanuatu", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400" }
        ],
        "Micronesia": [
            { name: "Guam", img: "https://images.unsplash.com/photo-1598980756779-11762111550c?w=400" },
            { name: "Palau", img: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400" }
        ]
    }
};

// GLOBAL EXCLUSION SET - "Bộ nhớ" chứa các ID đã hiển thị
const displayedArticleIds = new Set();

// 2. HELPER FUNCTIONS
const createCard = (article, type = 'standard') => {
    // Type standard: Card dọc cho Section 1
    // Type topic: Card ngang hoặc minimal cho Section 2
    return `
        <article class="story-card bg-white rounded-lg overflow-hidden border border-gray-100 h-full flex flex-col">
            <div class="relative h-48 img-zoom-container cursor-pointer">
                <span class="absolute top-3 left-3 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10 uppercase">${article.tag}</span>
                <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover" loading="lazy">
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <div class="text-xs text-gray-400 mb-2 flex items-center gap-2">
                    <span class="font-semibold text-gray-600">${article.blog}</span>
                    <i class="fa-solid fa-circle text-[4px]"></i>
                    <span>${article.date}</span>
                </div>
                <h3 class="text-lg font-bold text-gray-900 leading-snug mb-3 hover:text-brand-red cursor-pointer transition">
                    ${article.title}
                </h3>
                <a href="#" class="mt-auto text-sm font-semibold text-brand-red hover:underline decoration-2 underline-offset-4">Read Story <i class="fa-solid fa-arrow-right ml-1 text-xs"></i></a>
            </div>
        </article>
    `;
};

// 3. RENDER SECTION 1: LATEST STORIES (THE PULSE)
function renderLatestStories() {
    const container = document.getElementById('latest-stories-grid');
    // Lấy 4 bài mới nhất (Giả sử DB đã sort theo date)
    const latest = mockData.articles.slice(0, 4);
    
    let html = '';
    latest.forEach(article => {
        // QUAN TRỌNG: Lưu ID vào Set để chặn trùng lặp
        displayedArticleIds.add(article.id);
        html += createCard(article);
    });
    
    container.innerHTML = html;
}

// 4. RENDER SECTION 2: TOPIC SPOTLIGHT (DEDUPLICATION APPLIED)
function renderTopicSpotlight() {
    const container = document.getElementById('topic-grid');
    const topics = ["Culture", "Travel", "Island Life", "Arts", "Holidays", "Fashion"];
    
    let html = '';
    
    topics.forEach(tag => {
        // Logic tìm bài viết: Tìm bài có tag này VÀ ID chưa từng xuất hiện
        const article = mockData.articles.find(a => a.tag === tag && !displayedArticleIds.has(a.id));
        
        if (article) {
            // Nếu tìm thấy bài Unique -> Render và thêm vào Set
            displayedArticleIds.add(article.id);
            html += `
                <div class="group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-lg">
                    <img src="${article.image}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6 text-white">
                        <span class="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-2 py-1 rounded mb-2 inline-block border border-white/30">${tag}</span>
                        <h3 class="text-xl font-bold leading-tight group-hover:underline">${article.title}</h3>
                    </div>
                </div>
            `;
        } else {
            // Fallback: Nếu đã hết bài unique, lấy đại 1 bài cùng topic (chấp nhận trùng hoặc lấy bài cũ hơn)
            // Trong thực tế, SEO tốt là nên ẩn block này hoặc fetch bài cũ hơn nữa từ API.
            html += `
                <div class="h-64 bg-gray-100 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
                    <div class="text-center text-gray-400">
                        <p class="font-bold text-lg">${tag}</p>
                        <p class="text-sm">More stories coming soon</p>
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
}

// 5. RENDER SECTION 3: REGION DEEP-DIVE (TABS LOGIC)
function renderRegionDeepDive() {
    const contentContainer = document.getElementById('region-content');
    const tabs = document.querySelectorAll('.region-tab');
    
    // Hàm render nội dung vùng
    const loadRegion = (regionName) => {
        const countries = mockData.regions[regionName];
        let html = '';
        
        countries.forEach(country => {
            html += `
                <div class="flex-none w-64 snap-center group cursor-pointer">
                    <div class="h-80 rounded-2xl overflow-hidden relative shadow-md">
                        <img src="${country.img}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" loading="lazy">
                        <div class="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition"></div>
                        <div class="absolute bottom-6 left-0 w-full text-center">
                            <h3 class="text-2xl font-script text-white drop-shadow-md transform group-hover:-translate-y-2 transition duration-300">${country.name}</h3>
                            <span class="opacity-0 group-hover:opacity-100 text-white text-xs uppercase tracking-widest font-bold transition duration-300 delay-75 border-b border-white pb-1">Explore</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Add "View All" card
        html += `
             <div class="flex-none w-48 snap-center flex items-center justify-center">
                <a href="#" class="flex flex-col items-center text-gray-400 hover:text-white transition group">
                    <div class="w-16 h-16 rounded-full border-2 border-gray-600 group-hover:border-white flex items-center justify-center mb-2">
                        <i class="fa-solid fa-arrow-right text-xl"></i>
                    </div>
                    <span class="font-bold text-sm uppercase">View All ${regionName}</span>
                </a>
             </div>
        `;
        
        // Animation fade-in nhẹ
        contentContainer.style.opacity = '0';
        setTimeout(() => {
            contentContainer.innerHTML = html;
            contentContainer.style.opacity = '1';
        }, 200);
    };

    // Event Listeners cho Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-white', 'text-brand-dark', 'border-white');
                t.classList.add('text-gray-300', 'border-gray-600');
            });
            // Add active class
            tab.classList.add('active', 'bg-white', 'text-brand-dark', 'border-white');
            tab.classList.remove('text-gray-300', 'border-gray-600');
            
            // Load content
            loadRegion(tab.dataset.region);
        });
    });

    // Init mặc định
    loadRegion('Polynesia');
}

// 6. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    renderLatestStories(); // Chạy trước để điền ID vào exclusion list
    renderTopicSpotlight(); // Chạy sau để lọc ID trùng
    renderRegionDeepDive();
    
    // Hiệu ứng Header đổi màu khi scroll
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) {
            header.classList.add('shadow-md');
        } else {
            header.classList.remove('shadow-md');
        }
    });
});
