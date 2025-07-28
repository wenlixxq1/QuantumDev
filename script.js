// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let currentUniverse = null;
let gamePlayer = { x: 50, y: 350, width: 40, height: 40, vx: 0, vy: 0, onGround: false, lives: 3 };
let gameSkills = [];
let gameEnemies = [];
let gameProjectiles = [];
let gameBosses = [];
let gameLevel = 1;
let skillsCollected = 0;
let gameCanvas, gameCtx;
let audioContext = null;
let particles = [];

// ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showUniverseSelector();
        createParticles();
    }, 4000);
    
    initializeGame();
    initializeAudio();
    createStars();
    
    // Добавляем обработчики клавиатуры для игры
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
});

// СИСТЕМА ЧАСТИЦ
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.animation = `particleFloat ${Math.random() * 10 + 5}s linear infinite`;
        particlesContainer.appendChild(particle);
    }
    
    // Добавляем CSS анимацию для частиц
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% { transform: translateY(100vh) rotate(0deg); }
            100% { transform: translateY(-100px) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// ЗАГРУЗОЧНЫЙ ЭКРАН
function showLoading() {
    const loading = document.getElementById('loading');
    const progress = document.getElementById('progress');
    loading.style.display = 'flex';
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 8 + 2;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
        }
        progress.style.width = width + '%';
    }, 150);
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// СЕЛЕКТОР ВСЕЛЕННЫХ
function showUniverseSelector() {
    document.getElementById('universe-selector').style.display = 'flex';
}

function hideUniverseSelector() {
    document.getElementById('universe-selector').style.display = 'none';
}

// ВХОД В ВСЕЛЕННУЮ
function enterUniverse(universe) {
    hideUniverseSelector();
    currentUniverse = universe;
    
    // Логируем посещение в базу данных
    if (typeof portfolioDB !== 'undefined') {
        portfolioDB.logVisit(universe);
    }
    
    // Скрываем все вселенные
    document.querySelectorAll('.universe').forEach(u => {
        u.classList.remove('active');
    });
    
    // Показываем выбранную
    const targetUniverse = document.getElementById(universe + '-universe');
    if (targetUniverse) {
        targetUniverse.classList.add('active');
        
        // Специальная инициализация для каждой вселенной
        switch(universe) {
            case 'terminal':
                initTerminal();
                break;
            case 'game':
                startGame();
                break;
            case 'lab':
                initLab();
                break;
            case 'space':
                initSpace();
                break;
            case 'city':
                initCity();
                break;
            case 'music':
                initMusic();
                break;
        }
    }
}

function exitUniverse() {
    if (currentUniverse) {
        document.getElementById(currentUniverse + '-universe').classList.remove('active');
        currentUniverse = null;
    }
    showUniverseSelector();
}

// ТЕРМИНАЛ ХАКЕРА
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const content = document.getElementById('terminal-content');
    
    // Приветственное сообщение с эффектом печати
    typeText('Квантовая система инициализирована...', () => {
        typeText('Добро пожаловать в QUANTUM TERMINAL v3.0.42', () => {
            typeText('Квантовые процессоры готовы. Введите "help" для списка команд.', () => {
                addTerminalLine('');
            });
        });
    });
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendCommand();
        }
    });
    
    input.focus();
}

function sendCommand() {
    const input = document.getElementById('terminal-input');
    const command = input.value.trim();
    if (command) {
        addTerminalLine(`root@portfolio:~$ ${command}`);
        executeCommand(command);
        input.value = '';
        input.focus();
    }
}

function typeText(text, callback) {
    const content = document.getElementById('terminal-content');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    content.appendChild(line);
    
    let i = 0;
    const typeInterval = setInterval(() => {
        line.innerHTML = text.substring(0, i + 1) + '<span class="cursor">_</span>';
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
            line.innerHTML = text;
            if (callback) callback();
        }
    }, 50);
    
    content.scrollTop = content.scrollHeight;
}

function addTerminalLine(text) {
    const content = document.getElementById('terminal-content');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = text;
    content.appendChild(line);
    content.scrollTop = content.scrollHeight;
}

function executeCommand(command) {
    const cmd = command.toLowerCase();
    
    switch(cmd) {
        case 'help':
            addTerminalLine('<span style="color: #00ffff;">═══ ДОСТУПНЫЕ КОМАНДЫ ═══</span>');
            addTerminalLine('  help     - показать эту справку');
            addTerminalLine('  about    - информация обо мне');
            addTerminalLine('  skills   - мои технические навыки');
            addTerminalLine('  projects - портфолио проектов');
            addTerminalLine('  contact  - контактная информация');
            addTerminalLine('  matrix   - запустить матрицу');
            addTerminalLine('  hack     - взломать систему');
            addTerminalLine('  scan     - сканировать сеть');
            addTerminalLine('  stats    - статистика посещений');
            addTerminalLine('  god      - режим бога (секрет)');
            addTerminalLine('  hack_nasa - взлом NASA (шутка)');
            addTerminalLine('  clear    - очистить терминал');
            break;
            
        case 'about':
            addTerminalLine('<span style="color: #ff00ff;">═══ ПРОФИЛЬ РАЗРАБОТЧИКА ═══</span>');
            addTerminalLine('┌─────────────────────────────────────┐');
            addTerminalLine('│ Имя: Ваше Имя Фамилия              │');
            addTerminalLine('│ Роль: Full-Stack Developer         │');
            addTerminalLine('│ Опыт: 5+ лет                       │');
            addTerminalLine('│ Локация: Москва, Россия            │');
            addTerminalLine('│ Статус: Готов к новым проектам     │');
            addTerminalLine('└─────────────────────────────────────┘');
            break;
            
        case 'skills':
            addTerminalLine('<span style="color: #00ff00;">═══ ТЕХНИЧЕСКИЙ СТЕК ═══</span>');
            addTerminalLine('Core Technologies:');
            addTerminalLine('  ▶ JavaScript (ES6+) ████████████ 95%');
            addTerminalLine('  ▶ Node.js           ████████████ 90%');
            addTerminalLine('  ▶ Python            ██████████   85%');
            addTerminalLine('  ▶ CSS3              ████████████ 90%');
            addTerminalLine('Additional Skills:');
            addTerminalLine('  ▶ HTML5             ████████████ 95%');
            addTerminalLine('  ▶ Git               ██████████   85%');
            addTerminalLine('  ▶ REST API          ████████     80%');
            addTerminalLine('  ▶ Database Design   ██████       75%');
            break;
            
        case 'projects':
            addTerminalLine('<span style="color: #ffff00;">═══ ПОРТФОЛИО ПРОЕКТОВ ═══</span>');
            addTerminalLine('1. 🌐 Web Application');
            addTerminalLine('   Tech: JavaScript + Node.js + CSS');
            addTerminalLine('   Status: Production Ready');
            addTerminalLine('');
            addTerminalLine('2. 🐍 Python Backend API');
            addTerminalLine('   Tech: Python + Node.js Integration');
            addTerminalLine('   Status: Live');
            addTerminalLine('');
            addTerminalLine('3. 🎨 Interactive Portfolio');
            addTerminalLine('   Tech: JavaScript + CSS + Node.js');
            addTerminalLine('   Status: Current Project');
            break;
            
        case 'contact':
            addTerminalLine('<span style="color: #00ffff;">═══ КОНТАКТНАЯ ИНФОРМАЦИЯ ═══</span>');
            addTerminalLine('📧 Email: your.email@example.com');
            addTerminalLine('💬 Telegram: @yourusername');
            addTerminalLine('🐙 GitHub: github.com/yourusername');
            addTerminalLine('💼 LinkedIn: linkedin.com/in/yourusername');
            addTerminalLine('🌐 Website: yourwebsite.com');
            break;
            
        case 'matrix':
            addTerminalLine('<span style="color: #00ff00;">Запуск матрицы...</span>');
            startMatrix();
            break;
            
        case 'hack':
            addTerminalLine('<span style="color: #ff0000;">Инициализация взлома...</span>');
            setTimeout(() => addTerminalLine('Сканирование портов... [████████████] 100%'), 500);
            setTimeout(() => addTerminalLine('Обход защиты... [████████████] 100%'), 1000);
            setTimeout(() => addTerminalLine('Получение доступа... [████████████] 100%'), 1500);
            setTimeout(() => addTerminalLine('<span style="color: #00ff00;">СИСТЕМА ВЗЛОМАНА! 🔓</span>'), 2000);
            setTimeout(() => addTerminalLine('Шучу :) Это просто портфолио!'), 2500);
            break;
            
        case 'scan':
            addTerminalLine('Сканирование сети...');
            setTimeout(() => {
                addTerminalLine('Найдены устройства:');
                addTerminalLine('192.168.1.1   - Router');
                addTerminalLine('192.168.1.100 - Ваш компьютер');
                addTerminalLine('192.168.1.101 - Смартфон');
                addTerminalLine('Сканирование завершено.');
            }, 1500);
            break;
            
        case 'clear':
            document.getElementById('terminal-content').innerHTML = '<div class="terminal-line"><span class="prompt">root@portfolio:~$</span><span class="cursor">_</span></div>';
            break;
            
        case 'stats':
            if (typeof portfolioDB !== 'undefined') {
                portfolioDB.getVisitStats().then(stats => {
                    addTerminalLine('<span style="color: #00ffff;">═══ СТАТИСТИКА ПОРТФОЛИО ═══</span>');
                    addTerminalLine(`Всего посещений: ${stats.total}`);
                    addTerminalLine(`Сегодня: ${stats.today}`);
                    addTerminalLine(`За неделю: ${stats.thisWeek}`);
                    addTerminalLine('Популярные вселенные:');
                    Object.entries(stats.universes).forEach(([universe, count]) => {
                        addTerminalLine(`  ${universe}: ${count} посещений`);
                    });
                });
            } else {
                addTerminalLine('База данных недоступна.');
            }
            break;
            
        case 'god':
            addTerminalLine('<span style="color: #ff00ff;">🔓 РЕЖИМ БОГА АКТИВИРОВАН</span>');
            addTerminalLine('Все ограничения сняты. Добро пожаловать, создатель.');
            addTerminalLine('Доступны команды: teleport, create, destroy');
            addTerminalLine('Используйте силу ответственно!');
            break;
            
        case 'hack_nasa':
            addTerminalLine('<span style="color: #ff0000;">⚠️ ПОПЫТКА ВЗЛОМА NASA ОБНАРУЖЕНА</span>');
            addTerminalLine('Подключение к спутникам...');
            setTimeout(() => addTerminalLine('Доступ к МКС... [████████████] 100%'), 1000);
            setTimeout(() => addTerminalLine('ФБР уже в пути... 🚔'), 2000);
            setTimeout(() => addTerminalLine('Шучу! Это просто портфолио 😄'), 3000);
            break;
            
        default:
            addTerminalLine(`<span style="color: #ff0000;">bash: ${command}: команда не найдена</span>`);
            addTerminalLine('Введите "help" для списка доступных команд');
    }
    
    addTerminalLine('');
}

function startMatrix() {
    const content = document.getElementById('terminal-content');
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    let matrixInterval = setInterval(() => {
        let line = '';
        for (let i = 0; i < 60; i++) {
            line += matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
        addTerminalLine(`<span style="color: #00ff00; font-size: 0.8rem;">${line}</span>`);
    }, 80);
    
    setTimeout(() => {
        clearInterval(matrixInterval);
        addTerminalLine('<span style="color: #ff0000;">Матрица остановлена.</span>');
        addTerminalLine('');
    }, 6000);
}

// УЛУЧШЕННАЯ РЕТРО ИГРА
function initializeGame() {
    gameCanvas = document.getElementById('game-canvas');
    if (gameCanvas) {
        gameCtx = gameCanvas.getContext('2d');
        resetGameData();
    }
}

function resetGameData() {
    // Создаем навыки для сбора
    gameSkills = [
        {x: 150, y: 300, skill: 'JS', collected: false, color: '#f7df1e', points: 10},
        {x: 300, y: 250, skill: 'React', collected: false, color: '#61dafb', points: 15},
        {x: 450, y: 320, skill: 'Node', collected: false, color: '#68a063', points: 20},
        {x: 600, y: 280, skill: 'CSS', collected: false, color: '#1572b6', points: 10},
        {x: 750, y: 300, skill: 'Vue', collected: false, color: '#4fc08d', points: 15},
        {x: 200, y: 200, skill: 'TS', collected: false, color: '#3178c6', points: 25},
        {x: 500, y: 180, skill: 'Python', collected: false, color: '#3776ab', points: 20},
        {x: 700, y: 200, skill: 'Docker', collected: false, color: '#2496ed', points: 30},
        {x: 350, y: 150, skill: 'AWS', collected: false, color: '#ff9900', points: 35},
        {x: 550, y: 350, skill: 'Git', collected: false, color: '#f05032', points: 15}
    ];
    
    // Создаем врагов
    gameEnemies = [
        {x: 400, y: 350, width: 30, height: 30, vx: -1, type: 'bug', health: 1},
        {x: 650, y: 350, width: 30, height: 30, vx: 1, type: 'virus', health: 2},
        {x: 800, y: 350, width: 40, height: 40, vx: -0.5, type: 'malware', health: 3}
    ];
    
    // Создаем босса для уровня
    if (gameLevel % 5 === 0) {
        gameBosses = [{
            x: 750, y: 300, width: 60, height: 60, 
            health: 10, maxHealth: 10, vx: -0.3, 
            type: 'boss', shootTimer: 0
        }];
    }
    
    gameProjectiles = [];
}

function startGame() {
    if (gameCanvas && gameCtx) {
        gameLoop();
    }
}

function gameLoop() {
    if (currentUniverse !== 'game') return;
    
    // Очистка canvas с градиентом неба
    const gradient = gameCtx.createLinearGradient(0, 0, 0, gameCanvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#98fb98');
    gameCtx.fillStyle = gradient;
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Рисуем облака
    drawClouds();
    
    // Рисуем землю
    gameCtx.fillStyle = '#8B4513';
    gameCtx.fillRect(0, gameCanvas.height - 50, gameCanvas.width, 50);
    
    // Обновление и рисование игровых объектов
    updatePlayer();
    updateEnemies();
    updateProjectiles();
    updateBosses();
    
    drawPlayer();
    drawSkills();
    drawEnemies();
    drawProjectiles();
    drawBosses();
    drawUI();
    
    // Проверка коллизий
    checkCollisions();
    
    requestAnimationFrame(gameLoop);
}

function drawClouds() {
    gameCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    // Облако 1
    gameCtx.beginPath();
    gameCtx.arc(100, 80, 25, 0, Math.PI * 2);
    gameCtx.arc(130, 80, 35, 0, Math.PI * 2);
    gameCtx.arc(160, 80, 25, 0, Math.PI * 2);
    gameCtx.fill();
    
    // Облако 2
    gameCtx.beginPath();
    gameCtx.arc(600, 60, 30, 0, Math.PI * 2);
    gameCtx.arc(640, 60, 40, 0, Math.PI * 2);
    gameCtx.arc(680, 60, 30, 0, Math.PI * 2);
    gameCtx.fill();
}

function updatePlayer() {
    // Гравитация
    if (!gamePlayer.onGround) {
        gamePlayer.vy += 0.8;
    }
    
    // Движение
    gamePlayer.x += gamePlayer.vx;
    gamePlayer.y += gamePlayer.vy;
    
    // Проверка границ
    if (gamePlayer.x < 0) gamePlayer.x = 0;
    if (gamePlayer.x > gameCanvas.width - gamePlayer.width) {
        gamePlayer.x = gameCanvas.width - gamePlayer.width;
    }
    
    // Проверка земли
    if (gamePlayer.y > gameCanvas.height - gamePlayer.height - 50) {
        gamePlayer.y = gameCanvas.height - gamePlayer.height - 50;
        gamePlayer.vy = 0;
        gamePlayer.onGround = true;
    }
    
    // Трение
    gamePlayer.vx *= 0.85;
}

function updateEnemies() {
    gameEnemies.forEach(enemy => {
        enemy.x += enemy.vx;
        
        // Отскок от границ
        if (enemy.x <= 0 || enemy.x >= gameCanvas.width - enemy.width) {
            enemy.vx *= -1;
        }
    });
}

function updateProjectiles() {
    gameProjectiles = gameProjectiles.filter(projectile => {
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;
        
        // Удаляем снаряды за границами экрана
        return projectile.x > 0 && projectile.x < gameCanvas.width && 
               projectile.y > 0 && projectile.y < gameCanvas.height;
    });
}

function updateBosses() {
    gameBosses.forEach(boss => {
        boss.x += boss.vx;
        boss.shootTimer++;
        
        // Отскок от границ
        if (boss.x <= 0 || boss.x >= gameCanvas.width - boss.width) {
            boss.vx *= -1;
        }
        
        // Стрельба босса
        if (boss.shootTimer > 120) {
            gameProjectiles.push({
                x: boss.x + boss.width/2,
                y: boss.y + boss.height,
                vx: 0,
                vy: 3,
                type: 'enemy',
                width: 8,
                height: 8
            });
            boss.shootTimer = 0;
        }
    });
}

function drawPlayer() {
    // Тело игрока
    gameCtx.fillStyle = '#ff6b6b';
    gameCtx.fillRect(gamePlayer.x, gamePlayer.y, gamePlayer.width, gamePlayer.height);
    
    // Глаза
    gameCtx.fillStyle = '#fff';
    gameCtx.fillRect(gamePlayer.x + 8, gamePlayer.y + 8, 10, 10);
    gameCtx.fillRect(gamePlayer.x + 22, gamePlayer.y + 8, 10, 10);
    
    gameCtx.fillStyle = '#000';
    gameCtx.fillRect(gamePlayer.x + 10, gamePlayer.y + 10, 6, 6);
    gameCtx.fillRect(gamePlayer.x + 24, gamePlayer.y + 10, 6, 6);
    
    // Улыбка
    gameCtx.strokeStyle = '#000';
    gameCtx.lineWidth = 2;
    gameCtx.beginPath();
    gameCtx.arc(gamePlayer.x + gamePlayer.width/2, gamePlayer.y + 25, 8, 0, Math.PI);
    gameCtx.stroke();
}

function drawSkills() {
    gameSkills.forEach(skill => {
        if (!skill.collected) {
            // Эффект свечения
            gameCtx.shadowColor = skill.color;
            gameCtx.shadowBlur = 10;
            
            gameCtx.fillStyle = skill.color;
            gameCtx.fillRect(skill.x, skill.y, 35, 35);
            
            gameCtx.shadowBlur = 0;
            
            // Текст навыка
            gameCtx.fillStyle = '#000';
            gameCtx.font = 'bold 12px Arial';
            gameCtx.textAlign = 'center';
            gameCtx.fillText(skill.skill, skill.x + 17, skill.y + 22);
            
            // Анимация плавания
            skill.y += Math.sin(Date.now() * 0.005 + skill.x * 0.01) * 0.5;
        }
    });
}

function drawEnemies() {
    gameEnemies.forEach(enemy => {
        switch(enemy.type) {
            case 'bug':
                gameCtx.fillStyle = '#8B0000';
                break;
            case 'virus':
                gameCtx.fillStyle = '#4B0082';
                break;
            case 'malware':
                gameCtx.fillStyle = '#FF4500';
                break;
        }
        
        gameCtx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Глаза врага
        gameCtx.fillStyle = '#FF0000';
        gameCtx.fillRect(enemy.x + 5, enemy.y + 5, 6, 6);
        gameCtx.fillRect(enemy.x + enemy.width - 11, enemy.y + 5, 6, 6);
    });
}

function drawProjectiles() {
    gameProjectiles.forEach(projectile => {
        if (projectile.type === 'player') {
            gameCtx.fillStyle = '#00ff00';
        } else {
            gameCtx.fillStyle = '#ff0000';
        }
        gameCtx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    });
}

function drawBosses() {
    gameBosses.forEach(boss => {
        // Тело босса
        gameCtx.fillStyle = '#800080';
        gameCtx.fillRect(boss.x, boss.y, boss.width, boss.height);
        
        // Полоска здоровья
        const healthPercent = boss.health / boss.maxHealth;
        gameCtx.fillStyle = '#ff0000';
        gameCtx.fillRect(boss.x, boss.y - 10, boss.width, 5);
        gameCtx.fillStyle = '#00ff00';
        gameCtx.fillRect(boss.x, boss.y - 10, boss.width * healthPercent, 5);
        
        // Глаза босса
        gameCtx.fillStyle = '#ff0000';
        gameCtx.fillRect(boss.x + 10, boss.y + 10, 12, 12);
        gameCtx.fillRect(boss.x + boss.width - 22, boss.y + 10, 12, 12);
    });
}

function drawUI() {
    // Счетчик очков
    gameCtx.fillStyle = '#000';
    gameCtx.font = 'bold 16px Arial';
    gameCtx.textAlign = 'left';
    gameCtx.fillText(`Очки: ${skillsCollected * 100}`, 10, 30);
}

function checkCollisions() {
    // Коллизии с навыками
    gameSkills.forEach(skill => {
        if (!skill.collected) {
            if (gamePlayer.x < skill.x + 35 &&
                gamePlayer.x + gamePlayer.width > skill.x &&
                gamePlayer.y < skill.y + 35 &&
                gamePlayer.y + gamePlayer.height > skill.y) {
                
                skill.collected = true;
                skillsCollected++;
                document.getElementById('skills-count').textContent = skillsCollected;
                
                // Проверка завершения уровня
                if (skillsCollected >= gameSkills.filter(s => !s.collected).length + skillsCollected) {
                    gameLevel++;
                    document.getElementById('level').textContent = gameLevel;
                    setTimeout(() => {
                        resetGameData();
                        skillsCollected = 0;
                        document.getElementById('skills-count').textContent = skillsCollected;
                    }, 1000);
                }
            }
        }
    });
    
    // Коллизии с врагами
    gameEnemies.forEach((enemy, enemyIndex) => {
        if (gamePlayer.x < enemy.x + enemy.width &&
            gamePlayer.x + gamePlayer.width > enemy.x &&
            gamePlayer.y < enemy.y + enemy.height &&
            gamePlayer.y + gamePlayer.height > enemy.y) {
            
            gamePlayer.lives--;
            document.getElementById('lives').textContent = gamePlayer.lives;
            
            if (gamePlayer.lives <= 0) {
                alert('Игра окончена! Начинаем заново.');
                resetGame();
            } else {
                // Отбрасываем игрока
                gamePlayer.x = 50;
                gamePlayer.y = 300;
            }
        }
        
        // Коллизии снарядов игрока с врагами
        gameProjectiles.forEach((projectile, projIndex) => {
            if (projectile.type === 'player' &&
                projectile.x < enemy.x + enemy.width &&
                projectile.x + projectile.width > enemy.x &&
                projectile.y < enemy.y + enemy.height &&
                projectile.y + projectile.height > enemy.y) {
                
                enemy.health--;
                gameProjectiles.splice(projIndex, 1);
                
                if (enemy.health <= 0) {
                    gameEnemies.splice(enemyIndex, 1);
                }
            }
        });
    });
}

function resetGame() {
    gamePlayer.lives = 3;
    gameLevel = 1;
    skillsCollected = 0;
    document.getElementById('lives').textContent = gamePlayer.lives;
    document.getElementById('level').textContent = gameLevel;
    document.getElementById('skills-count').textContent = skillsCollected;
    resetGameData();
}

// УПРАВЛЕНИЕ ИГРОЙ
let keys = {};

function handleKeyDown(e) {
    keys[e.key] = true;
    
    if (currentUniverse === 'game') {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
                gamePlayer.vx = -4;
                break;
            case 'ArrowRight':
            case 'd':
                gamePlayer.vx = 4;
                break;
            case 'ArrowUp':
            case 'w':
            case ' ':
                if (gamePlayer.onGround) {
                    gamePlayer.vy = -15;
                    gamePlayer.onGround = false;
                }
                break;
            case 'x':
            case 'Enter':
                shootProjectile();
                break;
        }
    }
}

function handleKeyUp(e) {
    keys[e.key] = false;
}

function movePlayer(direction) {
    if (direction === 'left') {
        gamePlayer.vx = -4;
    } else if (direction === 'right') {
        gamePlayer.vx = 4;
    }
}

function stopPlayer() {
    gamePlayer.vx *= 0.5;
}

function jumpPlayer() {
    if (gamePlayer.onGround) {
        gamePlayer.vy = -15;
        gamePlayer.onGround = false;
    }
}

function shootProjectile() {
    gameProjectiles.push({
        x: gamePlayer.x + gamePlayer.width/2,
        y: gamePlayer.y,
        vx: 0,
        vy: -8,
        type: 'player',
        width: 6,
        height: 12
    });
}

// ЛАБОРАТОРИЯ
function initLab() {
    // Улучшенная анимация пузырьков
    document.querySelectorAll('.flask').forEach((flask, index) => {
        flask.addEventListener('mouseenter', () => {
            flask.style.transform = 'scale(1.15) translateY(-10px)';
            flask.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(0, 255, 170, 0.6))';
        });
        flask.addEventListener('mouseleave', () => {
            flask.style.transform = 'scale(1)';
            flask.style.filter = 'none';
        });
        
        // Случайная анимация пузырьков
        setInterval(() => {
            const bubbles = flask.querySelector('.bubbles');
            if (bubbles) {
                bubbles.style.animation = 'none';
                setTimeout(() => {
                    bubbles.style.animation = 'float 4s ease-in-out infinite';
                }, 100);
            }
        }, Math.random() * 5000 + 3000);
    });
}

function runExperiment(tech) {
    const result = document.getElementById('experiment-result');
    result.style.display = 'block';
    
    const experiments = {
        javascript: {
            title: '🟨 JavaScript Эксперимент',
            description: 'Создание интерактивных веб-приложений с современным ES6+ синтаксисом',
            result: '✅ Успешно! Функции созданы, события обработаны, DOM манипуляции выполнены.',
            code: 'const greeting = (name) => `Hello, ${name}!`;'
        },
        node: {
            title: '🟢 Node.js Эксперимент',
            description: 'Серверная логика и API с асинхронной обработкой',
            result: '✅ Превосходно! Сервер запущен, API функционирует стабильно, middleware подключен.',
            code: 'app.get("/api", (req, res) => res.json({status: "OK"}));'
        },
        python: {
            title: '🐍 Python Эксперимент',
            description: 'Бэкенд разработка и автоматизация с мощными библиотеками',
            result: '✅ Отлично! Скрипты выполнены, данные обработаны, алгоритмы оптимизированы.',
            code: 'def hello_world(): return "Hello from Python!"'
        },
        css: {
            title: '🎨 CSS Эксперимент',
            description: 'Стилизация и анимации для создания красивых интерфейсов',
            result: '✅ Великолепно! Стили применены, анимации запущены, адаптивность настроена.',
            code: '.element { transform: scale(1.1); transition: all 0.3s; }'
        }
    };
    
    const exp = experiments[tech];
    result.innerHTML = `
        <h3>${exp.title}</h3>
        <p><strong>Описание:</strong> ${exp.description}</p>
        <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 5px; margin: 1rem 0; font-family: 'JetBrains Mono', monospace; color: #00ffaa;">
            ${exp.code}
        </div>
        <p><strong>Результат:</strong> ${exp.result}</p>
        <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(0,255,170,0.2); border-radius: 10px; border: 1px solid #00ffaa;">
            🧪 Эксперимент завершен успешно! Данные сохранены в базе знаний.
        </div>
    `;
    
    // Анимация появления результата
    result.style.opacity = '0';
    result.style.transform = 'translateY(20px)';
    setTimeout(() => {
        result.style.transition = 'all 0.5s ease';
        result.style.opacity = '1';
        result.style.transform = 'translateY(0)';
    }, 100);
}

// УЛУЧШЕННАЯ КОСМИЧЕСКАЯ СТАНЦИЯ
function initSpace() {
    createStars();
    createNebula();
    createPlanets();
    animateStars();
}

function createStars() {
    const starsField = document.getElementById('stars-field');
    if (!starsField) return;
    
    starsField.innerHTML = ''; // Очищаем предыдущие звезды
    
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 4 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.backgroundColor = '#fff';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.style.animation = `twinkle ${Math.random() * 4 + 2}s infinite, starMove ${Math.random() * 20 + 10}s linear infinite`;
        starsField.appendChild(star);
    }
}

function createNebula() {
    const nebula = document.getElementById('nebula');
    if (nebula) {
        nebula.style.background = `
            radial-gradient(ellipse at 30% 50%, rgba(255, 0, 255, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 30%, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(255, 255, 0, 0.2) 0%, transparent 40%)
        `;
    }
}

function createPlanets() {
    const planetsContainer = document.getElementById('planets');
    if (planetsContainer) {
        planetsContainer.innerHTML = `
            <div style="position: absolute; top: 60%; left: 5%; width: 80px; height: 80px; background: radial-gradient(circle at 30% 30%, #ff6b6b, #cc5555); border-radius: 50%; box-shadow: 0 0 30px rgba(255, 107, 107, 0.5); animation: planetRotate 20s linear infinite;"></div>
            <div style="position: absolute; top: 20%; right: 10%; width: 60px; height: 60px; background: radial-gradient(circle at 40% 40%, #4ecdc4, #45b7aa); border-radius: 50%; box-shadow: 0 0 25px rgba(78, 205, 196, 0.5); animation: planetRotate 15s linear infinite reverse;"></div>
            <div style="position: absolute; top: 80%; left: 60%; width: 40px; height: 40px; background: radial-gradient(circle at 35% 35%, #feca57, #ff9ff3); border-radius: 50%; box-shadow: 0 0 20px rgba(254, 202, 87, 0.5); animation: planetRotate 10s linear infinite;"></div>
        `;
    }
}

function animateStars() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes starMove {
            0% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(10px) translateY(-5px); }
            50% { transform: translateX(-5px) translateY(10px); }
            75% { transform: translateX(5px) translateY(5px); }
            100% { transform: translateX(0) translateY(0); }
        }
        @keyframes planetRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

function enterRoom(room) {
    const rooms = {
        bridge: {
            title: '🎛️ Мостик космической станции',
            content: `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🚀</div>
                    <h4>Центр управления PORTFOLIO-7</h4>
                </div>
                <p>Добро пожаловать на мостик космической станции! Отсюда координируются все проекты и миссии.</p>
                <div style="margin: 2rem 0; padding: 1rem; background: rgba(0, 212, 255, 0.1); border-radius: 10px;">
                    <h4>🛰️ Текущий статус:</h4>
                    <ul style="margin-top: 1rem;">
                        <li>✅ Все системы в норме</li>
                        <li>✅ Связь с Землей установлена</li>
                        <li>✅ Проекты в разработке: 3</li>
                        <li>✅ Энергия: 100%</li>
                    </ul>
                </div>
            `
        },
        lab: {
            title: '🔬 Исследовательская лаборатория',
            content: `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🧪</div>
                    <h4>Лаборатория инноваций</h4>
                </div>
                <p>Здесь проводятся эксперименты с новыми технологиями и разрабатываются инновационные решения.</p>
                <div style="margin: 2rem 0; padding: 1rem; background: rgba(0, 255, 170, 0.1); border-radius: 10px;">
                    <h4>🔬 Текущие исследования:</h4>
                    <ul style="margin-top: 1rem;">
                        <li>🧬 Квантовые алгоритмы</li>
                        <li>🤖 Машинное обучение</li>
                        <li>🌐 Блокчейн технологии</li>
                        <li>🚀 WebAssembly оптимизация</li>
                    </ul>
                </div>
            `
        },
        hangar: {
            title: '🚀 Ангар проектов',
            content: `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🛸</div>
                    <h4>Ангар готовых проектов</h4>
                </div>
                <p>Место где хранятся готовые проекты, готовые к запуску в открытый космос интернета.</p>
                <div style="margin: 2rem 0; padding: 1rem; background: rgba(255, 255, 0, 0.1); border-radius: 10px;">
                    <h4>🚀 Готовые к запуску:</h4>
                    <ul style="margin-top: 1rem;">
                        <li>🛒 E-commerce платформа</li>
                        <li>📱 Мобильное приложение</li>
                        <li>🏢 Корпоративный сайт</li>
                        <li>🎮 Игровой портал</li>
                    </ul>
                </div>
            `
        },
        quarters: {
            title: '🛏️ Личная каюта',
            content: `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">👨‍🚀</div>
                    <h4>Личные апартаменты</h4>
                </div>
                <p>Личное пространство разработчика для отдыха и размышлений о будущих проектах.</p>
                <div style="margin: 2rem 0; padding: 1rem; background: rgba(255, 0, 255, 0.1); border-radius: 10px;">
                    <h4>📚 Личная информация:</h4>
                    <ul style="margin-top: 1rem;">
                        <li>🎓 Образование: Высшее техническое</li>
                        <li>💼 Опыт: 5+ лет</li>
                        <li>🌍 Локация: Москва, Россия</li>
                        <li>🎯 Цель: Создание инновационных решений</li>
                    </ul>
                </div>
            `
        }
    };
    
    showModal(rooms[room].title, rooms[room].content);
}

// КИБЕРСИТИ
function initCity() {
    // Добавляем улучшенные эффекты для зданий
    document.querySelectorAll('.building').forEach((building, index) => {
        building.addEventListener('mouseenter', () => {
            building.style.filter = 'brightness(1.4) drop-shadow(0 0 30px #4ecdc4)';
            building.style.transform = 'translateY(-25px) rotateX(8deg) rotateY(3deg) scale(1.05)';
        });
        building.addEventListener('mouseleave', () => {
            building.style.filter = 'none';
            building.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
        
        // Добавляем случайное мерцание окон
        setInterval(() => {
            const front = building.querySelector('.building-front');
            if (front && Math.random() > 0.7) {
                front.style.boxShadow = '0 0 40px rgba(68, 160, 141, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.1)';
                setTimeout(() => {
                    front.style.boxShadow = '0 0 30px rgba(68, 160, 141, 0.3)';
                }, 200);
            }
        }, Math.random() * 3000 + 1000);
    });
}

function showProject(project) {
    const projects = {
        ecommerce: {
            title: '🛒 E-commerce Платформа',
            content: `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🛍️</div>
                </div>
                <h4>🔧 Технологии:</h4>
                <div style="display: flex; gap: 1rem; margin: 1rem 0; flex-wrap: wrap;">
                    <span style="background: #f7df1e; color: #000; padding: 0.5rem 1rem; border-radius: 20px;">JavaScript</span>
                    <span style="background: #68a063; color: #fff; padding: 0.5rem 1rem; border-radius: 20px;">Node.js</span>
                    <span style="background: #1572b6; color: #fff; padding: 0.5rem 1rem; border-radius: 20px;">CSS</span>
                    <span style="background: #e34f26; color: #fff; padding: 0.5rem 1rem; border-radius: 20px;">HTML</span>
                </div>
                <h4>📝 Описание:</h4>
                <p>Полнофункциональная платформа для онлайн торговли с системой платежей, управлением заказами и продвинутой аналитикой.</p>
                <h4>✨ Особенности:</h4>
                <ul style="margin: 1rem 0;">
                    <li>📱 Адаптивный дизайн для всех устройств</li>
                    <li>💳 Интеграция с платежными системами</li>
                    <li>📧 Система уведомлений в реальном времени</li>
                    <li>📊 Административная панель с аналитикой</li>
                    <li>🔍 Продвинутый поиск и фильтрация</li>
                    <li>⭐ Система отзывов и рейтингов</li>
                </ul>
                <div style="margin-top: 2rem; padding: 1rem; background: rgba(0, 255, 255, 0.1); border-radius: 10px;">
                    🚀 Статус: Запущен в продакшн | 👥 Пользователи: 10,000+
                </div>
            `
        },
        portfolio: {
            title: '🌟 Портфолио сайт',
            content: `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎨</div>
                </div>
                <h4>🔧 Технологии:</h4>
                <div style="display: flex; gap: 1rem; margin: 1rem 0; flex-wrap: wrap;">
                    <span style="background: #f7df1e; color: #000; padding: 0.5rem 1rem; border-radius: 20px;">JavaScript</span>
                    <span style="background: #1572b6; color: #fff; padding: 0.5rem 1rem; border-radius: 20px;">CSS</span>
                    <span style="background: #68a063; color: #fff; padding: 0.5rem 1rem; border-radius: 20px;">Node.js</span>
                    <span style="background: #3776ab; color: #fff; padding: 0.5rem 1rem; border-radius: 20px;">Python</span>
                </div>
                <h4>📝 Описание:</h4>
                <p>Интерактивное мультивселенное портфолио с 3D анимациями, играми и уникальными визуальными эффектами.</p>
                <h4>✨ Особенности:</h4>
                <ul style="margin: 1rem 0;">
                    <li>🌌 6 различных интерактивных вселенных</li>
                    <li>🎮 Встроенная ретро-игра с боссами</li>
                    <li>⌨️ Функциональный терминал хакера</li>
                    <li>🧪 Интерактивная лаборатория</li>
                    <li>🚀 3D космическая станция</li>
                    <li>🎵 Музыкальные визуализации</li>
                </ul>
                <div style="margin-top: 2rem; padding: 1rem; background: rgba(255, 0, 255, 0.1); border-radius: 10px;">
                    🏆 Статус: Уникальный проект | 🎯 Цель: Впечатлить работодателей
                </div>
            `
        }
    };
    
    const proj = projects[project];
    showModal(proj.title, proj.content);
}

// МУЗЫКАЛЬНЫЙ МИР
function initMusic() {
    const canvas = document.getElementById('audio-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        startVisualizer(ctx, canvas);
    }
}

function initializeAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API не поддерживается');
    }
}

function playNote(note) {
    if (!audioContext) return;
    
    const frequencies = {
        'C': 261.63,
        'D': 293.66,
        'E': 329.63,
        'F': 349.23,
        'G': 392.00,
        'A': 440.00,
        'B': 493.88
    };
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequencies[note], audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
    
    // Визуальный эффект
    animateNote(note, frequencies[note]);
}

function animateNote(note, frequency) {
    const canvas = document.getElementById('audio-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    let radius = 0;
    const maxRadius = 150;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    function animate() {
        // Не очищаем весь canvas, создаем эффект следа
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем основную волну
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Рисуем дополнительные волны
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * (1 + i * 0.3), 0, 2 * Math.PI);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3 - i;
            ctx.globalAlpha = 0.7 - i * 0.2;
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        
        // Добавляем текст ноты
        ctx.fillStyle = color;
        ctx.font = 'bold 24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(note, centerX, centerY + 8);
        
        radius += 3;
        
        if (radius < maxRadius) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function startVisualizer(ctx, canvas) {
    const bars = 128;
    const barWidth = canvas.width / bars;
    
    function draw() {
        if (currentUniverse !== 'music') return;
        
        // Создаем градиентный фон
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.1)');
        gradient.addColorStop(1, 'rgba(118, 75, 162, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < bars; i++) {
            const barHeight = Math.random() * canvas.height * 0.7;
            const hue = (i / bars) * 360;
            
            // Создаем градиент для каждого бара
            const barGradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
            barGradient.addColorStop(0, `hsl(${hue}, 70%, 60%)`);
            barGradient.addColorStop(1, `hsl(${hue}, 70%, 40%)`);
            
            ctx.fillStyle = barGradient;
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
            
            // Добавляем свечение
            ctx.shadowColor = `hsl(${hue}, 70%, 60%)`;
            ctx.shadowBlur = 10;
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
            ctx.shadowBlur = 0;
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

// МОДАЛЬНОЕ ОКНО
function showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `<h2 style="color: #00ffff; margin-bottom: 2rem;">${title}</h2>${content}`;
    modal.style.display = 'block';
    
    // Анимация появления
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.8) translateY(-50px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transition = 'all 0.3s ease';
        modalContent.style.transform = 'scale(1) translateY(0)';
        modalContent.style.opacity = '1';
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'scale(0.8) translateY(-50px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}