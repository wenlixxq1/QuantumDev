// БАЗА ДАННЫХ (LocalStorage + IndexedDB)
class PortfolioDatabase {
    constructor() {
        this.dbName = 'PortfolioMultiverse';
        this.version = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Таблица посетителей
                if (!db.objectStoreNames.contains('visitors')) {
                    const visitorsStore = db.createObjectStore('visitors', { keyPath: 'id', autoIncrement: true });
                    visitorsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    visitorsStore.createIndex('universe', 'universe', { unique: false });
                }
                
                // Таблица достижений
                if (!db.objectStoreNames.contains('achievements')) {
                    const achievementsStore = db.createObjectStore('achievements', { keyPath: 'id', autoIncrement: true });
                    achievementsStore.createIndex('type', 'type', { unique: false });
                }
                
                // Таблица статистики
                if (!db.objectStoreNames.contains('stats')) {
                    const statsStore = db.createObjectStore('stats', { keyPath: 'key' });
                }
            };
        });
    }

    // Записать посещение вселенной
    async logVisit(universe, userAgent = navigator.userAgent) {
        const transaction = this.db.transaction(['visitors'], 'readwrite');
        const store = transaction.objectStore('visitors');
        
        const visit = {
            universe: universe,
            timestamp: new Date().toISOString(),
            userAgent: userAgent,
            screen: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
        
        return store.add(visit);
    }

    // Получить статистику посещений
    async getVisitStats() {
        const transaction = this.db.transaction(['visitors'], 'readonly');
        const store = transaction.objectStore('visitors');
        
        return new Promise((resolve) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const visits = request.result;
                const stats = {
                    total: visits.length,
                    universes: {},
                    today: 0,
                    thisWeek: 0
                };
                
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                
                visits.forEach(visit => {
                    const visitDate = new Date(visit.timestamp);
                    
                    // Подсчет по вселенным
                    stats.universes[visit.universe] = (stats.universes[visit.universe] || 0) + 1;
                    
                    // Подсчет за сегодня
                    if (visitDate >= today) stats.today++;
                    
                    // Подсчет за неделю
                    if (visitDate >= weekAgo) stats.thisWeek++;
                });
                
                resolve(stats);
            };
        });
    }

    // Сохранить достижение
    async saveAchievement(type, description) {
        const transaction = this.db.transaction(['achievements'], 'readwrite');
        const store = transaction.objectStore('achievements');
        
        const achievement = {
            type: type,
            description: description,
            timestamp: new Date().toISOString(),
            unlocked: true
        };
        
        return store.add(achievement);
    }

    // Получить все достижения
    async getAchievements() {
        const transaction = this.db.transaction(['achievements'], 'readonly');
        const store = transaction.objectStore('achievements');
        
        return new Promise((resolve) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
        });
    }

    // Сохранить настройки пользователя
    saveSettings(settings) {
        localStorage.setItem('portfolioSettings', JSON.stringify(settings));
    }

    // Получить настройки пользователя
    getSettings() {
        const settings = localStorage.getItem('portfolioSettings');
        return settings ? JSON.parse(settings) : {
            theme: 'dark',
            soundEnabled: true,
            gesturesEnabled: true,
            voiceEnabled: false
        };
    }
}

// Инициализация базы данных
const portfolioDB = new PortfolioDatabase();