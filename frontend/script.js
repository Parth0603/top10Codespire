// CODESPIRE 3.0 - Detective Theme JavaScript

class DetectiveTimer {
    constructor() {
        this.timeRemaining = 30; // 30 seconds
        this.timerInterval = null;
        this.isRunning = false;
        this.isRevealed = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.startTimer(); // Auto-start timer
    }

    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.restartBtn = document.getElementById('restartBtn');
        this.countdownSection = document.getElementById('countdownSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.loadingSection = document.getElementById('loadingSection');
        this.statusText = document.getElementById('statusText');
        this.caseFiles = document.getElementById('caseFiles');
    }

    attachEventListeners() {
        // Only restart button listener needed now
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => this.restartInvestigation());
        }
    }

    startTimer() {
        if (this.isRunning || this.isRevealed) return;
        
        this.isRunning = true;
        this.statusText.textContent = 'INVESTIGATION IN PROGRESS...';
        
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
        this.statusText.textContent = 'ACCESSING CASE FILES...';
        
        // Always check with backend - no frontend bypass
        this.fetchCaseFiles();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timerElement.textContent = display;
        
        // Add urgency styling when time is low
        if (this.timeRemaining <= 60 && this.timeRemaining > 0) {
            this.timerElement.style.color = '#ff6b6b';
            this.timerElement.style.animation = 'pulse 1s infinite';
        }
    }

    async fetchCaseFiles() {
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
                this.showLockedMessage(data.message);
            } else if (data.status === 'OPEN') {
                this.revealCaseFiles(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch case files:', error);
            this.showError('Failed to access case files. Evidence database unreachable.');
        }
    }

    showLoading() {
        this.countdownSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.loadingSection.style.display = 'block';
    }

    showLockedMessage(message) {
        this.loadingSection.style.display = 'none';
        this.countdownSection.style.display = 'block';
        this.statusText.textContent = message || 'CASE FILES REMAIN SEALED';
        
        // Reset timer state
        this.isRunning = false;
    }

    revealCaseFiles(caseData = null) {
        this.isRevealed = true;
        this.loadingSection.style.display = 'none';
        this.countdownSection.style.display = 'none';
        this.resultsSection.style.display = 'block';
        
        if (caseData) {
            this.renderCaseFiles(caseData);
        }
        
        // Attach restart button listener now that it's visible
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartInvestigation());
        }
        
        // Add reveal sound effect (if audio is available)
        this.playRevealEffect();
    }

    renderCaseFiles(teams) {
        this.caseFiles.innerHTML = '';
        
        teams.forEach((team, index) => {
            const caseFile = this.createCaseFileCard(team, index + 1);
            this.caseFiles.appendChild(caseFile);
            
            // Stagger the animation
            setTimeout(() => {
                caseFile.style.opacity = '1';
                caseFile.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }

    createCaseFileCard(team, rank) {
        const card = document.createElement('div');
        card.className = 'case-file';
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        card.style.transition = 'all 0.6s ease-out';
        
        const techTags = team.tech.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="case-rank">#${rank}</div>
            <div class="team-name">${team.team}</div>
            <div class="problem-statement">
                <strong>Problem:</strong> ${team.problem}
            </div>
            <div class="tech-stack">
                <div class="tech-label">Tech Stack:</div>
                <div class="tech-tags">
                    ${techTags}
                </div>
            </div>
        `;
        
        return card;
    }

    showError(message) {
        this.loadingSection.style.display = 'none';
        this.countdownSection.style.display = 'block';
        this.statusText.textContent = `❌ ${message}`;
        this.statusText.style.color = '#ff6b6b';
    }

    async restartInvestigation() {
        try {
            // Call restart endpoint
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
                
                // Reset UI
                this.resultsSection.style.display = 'none';
                this.loadingSection.style.display = 'none';
                this.countdownSection.style.display = 'block';
                
                // Reset timer display and status
                this.updateTimerDisplay();
                this.statusText.textContent = 'THE CASE FILES ARE SEALED';
                this.statusText.style.color = '#d4af37';
                
                // Reset timer color
                this.timerElement.style.color = '#d4af37';
                this.timerElement.style.animation = '';
                
                console.log('🔄 Investigation restarted successfully');
                
                // Auto-start the new timer
                this.startTimer();
            }
        } catch (error) {
            console.error('Failed to restart investigation:', error);
            this.showError('Failed to restart investigation');
        }
    }

    playRevealEffect() {
        // Add visual effect for reveal
        document.body.style.animation = 'flash 0.5s ease-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
}

// Add flash animation for reveal effect
const style = document.createElement('style');
style.textContent = `
    @keyframes flash {
        0% { background-color: rgba(212, 175, 55, 0.1); }
        50% { background-color: rgba(212, 175, 55, 0.3); }
        100% { background-color: transparent; }
    }
`;
document.head.appendChild(style);

// Initialize the detective timer when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 CODESPIRE 3.0 Detective System Initialized');
    new DetectiveTimer();
});

// Add typing effect to title
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        typingElement.style.display = 'inline-block';
        typingElement.style.overflow = 'hidden';
        typingElement.style.whiteSpace = 'nowrap';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 150);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});