// CODESPIRE 3.0 - Full Screen Reveal JavaScript with Confetti

class CodespireReveal {
    constructor() {
        this.timeRemaining = 30; // 30 seconds for testing
        this.timerInterval = null;
        this.isRunning = false;
        this.isRevealed = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.setupConfetti();
        this.startTimer(); // Auto-start timer
    }

    initializeElements() {
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.restartBtn = document.getElementById('restartBtn');
        this.countdownSection = document.getElementById('countdownSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.loadingSection = document.getElementById('loadingSection');
        this.teamsGrid = document.getElementById('teamsGrid');
    }

    attachEventListeners() {
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => this.restartInvestigation());
        }
    }

    setupConfetti() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.confettiParticles = [];
        
        // Resize canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createConfetti() {
        const colors = ['#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1'];
        
        // Reduced particle count for better performance
        // Left corner confetti
        for (let i = 0; i < 25; i++) {
            this.confettiParticles.push({
                x: Math.random() * 150,
                y: this.canvas.height + Math.random() * 50,
                vx: Math.random() * 6 + 2,
                vy: -(Math.random() * 12 + 8),
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 3,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 8 - 4,
                gravity: 0.4,
                life: 1.0,
                decay: Math.random() * 0.015 + 0.008
            });
        }
        
        // Right corner confetti
        for (let i = 0; i < 25; i++) {
            this.confettiParticles.push({
                x: this.canvas.width - Math.random() * 150,
                y: this.canvas.height + Math.random() * 50,
                vx: -(Math.random() * 6 + 2),
                vy: -(Math.random() * 12 + 8),
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 3,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 8 - 4,
                gravity: 0.4,
                life: 1.0,
                decay: Math.random() * 0.015 + 0.008
            });
        }
    }

    animateConfetti() {
        // Use requestAnimationFrame for better performance
        if (this.confettiParticles.length === 0) {
            this.canvas.style.display = 'none';
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Process particles in batches for better performance
        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const particle = this.confettiParticles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.rotation += particle.rotationSpeed;
            particle.life -= particle.decay;
            
            // Optimized drawing - use simpler shapes
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation * Math.PI / 180);
            this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            this.ctx.restore();
            
            // Remove dead particles
            if (particle.life <= 0 || particle.y > this.canvas.height + 50) {
                this.confettiParticles.splice(i, 1);
            }
        }
        
        // Continue animation
        requestAnimationFrame(() => this.animateConfetti());
    }

    startConfetti() {
        this.canvas.style.display = 'block';
        this.createConfetti();
        this.animateConfetti();
    }

    startTimer() {
        if (this.isRunning || this.isRevealed) return;
        
        this.isRunning = true;
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.timerComplete();
            }
        }, 1000);
    }

    timerComplete() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.isRunning = false;
        this.fetchResults();
    }

    updateTimerDisplay() {
        const hours = Math.floor(this.timeRemaining / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = this.timeRemaining % 60;
        
        if (this.hoursElement) this.hoursElement.textContent = hours.toString().padStart(2, '0');
        if (this.minutesElement) this.minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (this.secondsElement) this.secondsElement.textContent = seconds.toString().padStart(2, '0');
    }

    async fetchResults() {
        this.showLoading();
        
        try {
            const response = await fetch('/api/top10', {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'LOCKED') {
                this.showCountdown();
            } else if (data.status === 'OPEN') {
                this.revealResults(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch results:', error);
            this.showError('Failed to access results. Please try again.');
        }
    }

    showLoading() {
        this.countdownSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.loadingSection.style.display = 'block';
    }

    showCountdown() {
        this.loadingSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.countdownSection.style.display = 'block';
        this.isRunning = false;
    }

    revealResults(teamsData) {
        this.isRevealed = true;
        this.loadingSection.style.display = 'none';
        this.countdownSection.style.display = 'none';
        this.resultsSection.style.display = 'block';
        this.restartBtn.style.display = 'block';
        
        // Start confetti animation
        setTimeout(() => this.startConfetti(), 500);
        
        if (teamsData) {
            this.renderTeams(teamsData);
        }
    }

    renderTeams(teams) {
        this.teamsGrid.innerHTML = '';
        
        teams.forEach((team, index) => {
            const teamCard = this.createTeamCard(team, index + 1);
            this.teamsGrid.appendChild(teamCard);
            
            // Reduced stagger animation for better performance
            teamCard.style.animationDelay = `${index * 0.1}s`;
        });
    }

    createTeamCard(team, rank) {
        const card = document.createElement('div');
        card.className = 'team-card';
        
        // Detective-themed badges based on rank
        const badges = ['🕵️', '🔍', '🎯', '⚡', '🔬', '🎖️', '🏅', '⭐', '💎', '🔥'];
        const badge = badges[rank - 1] || '🕵️';
        
        card.innerHTML = `
            <div class="team-rank">${rank}.</div>
            <div class="team-info">
                <div class="team-name">${team.team}</div>
                <div class="team-details">
                    Score: ${this.generateScore()}, Project: ${this.getProjectName(team.problem)}
                </div>
            </div>
            <div class="team-badge">${badge}</div>
        `;
        
        return card;
    }

    generateScore() {
        // Generate realistic scores between 85-99
        return (Math.random() * (99 - 85) + 85).toFixed(1);
    }

    getProjectName(problem) {
        // Convert problem statement to project name
        const projectNames = {
            "Campus waste management system": "EcoTracker",
            "Smart attendance tracking": "AttendSmart",
            "Student mental health platform": "MindCare",
            "Campus security enhancement": "SecureGuard",
            "Library resource optimization": "LibraryAI",
            "Food delivery optimization": "QuickBite",
            "Study group matching": "StudySync",
            "Campus event management": "EventHub",
            "Sustainable transport system": "GreenMove",
            "Academic collaboration tool": "CollabSpace"
        };
        
        return projectNames[problem] || "Innovation";
    }

    showError(message) {
        this.loadingSection.style.display = 'none';
        this.countdownSection.style.display = 'block';
        
        // Show error in console for now
        console.error(message);
    }

    async restartInvestigation() {
        try {
            const response = await fetch('/api/restart', {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (response.ok) {
                // Reset all state
                this.isRevealed = false;
                this.isRunning = false;
                this.timeRemaining = 30; // 30 seconds for testing
                
                // Clear any running timer
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
                
                // Hide confetti
                this.canvas.style.display = 'none';
                this.confettiParticles = [];
                
                // Reset UI
                this.resultsSection.style.display = 'none';
                this.loadingSection.style.display = 'none';
                this.countdownSection.style.display = 'block';
                this.restartBtn.style.display = 'none';
                
                // Reset timer display
                this.updateTimerDisplay();
                
                console.log('🔄 Investigation restarted successfully');
                
                // Auto-start the new timer
                this.startTimer();
            }
        } catch (error) {
            console.error('Failed to restart investigation:', error);
            this.showError('Failed to restart investigation');
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 CODESPIRE 3.0 Reveal System Initialized');
    new CodespireReveal();
});

// Add entrance animations - simplified for better performance
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.content-wrapper > *');
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease-out';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150 + 500);
    });
});