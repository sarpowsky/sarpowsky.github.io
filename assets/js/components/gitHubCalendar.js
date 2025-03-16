// assets/js/components/gitHubCalendar.js
export default class GitHubCalendar {
    constructor(containerId, username) {
        this.container = document.getElementById(containerId);
        this.username = username;
        this.cellSize = 10; // Default cell size
        this.gap = 2; // Gap between cells
        this.initialize();
    }

    async initialize() {
        if (!this.container) return;
        this.createCalendarStructure();
        await this.fetchAndDisplayData();
    }

    createCalendarStructure() {
        const header = document.createElement('div');
        header.className = 'github-calendar-header';
        
        const title = document.createElement('h3');
        header.appendChild(title);
        
        this.calendarContainer = document.createElement('div');
        this.calendarContainer.className = 'github-calendar-grid';
        
        const loading = document.createElement('div');
        loading.className = 'github-calendar-loading';
        loading.textContent = 'Loading contribution data...';
        this.calendarContainer.appendChild(loading);
        
        this.container.appendChild(header);
        this.container.appendChild(this.calendarContainer);
        // Removed footer with legend
    }

    async fetchAndDisplayData() {
        try {
            const contributionData = await this.fetchMockData();
            this.calendarContainer.innerHTML = '';
            
            // Create table structure for consistent sizing
            const table = document.createElement('table');
            table.className = 'contribution-table';
            const tbody = document.createElement('tbody');
            
            // Organize data by week and day
            const weeks = this.organizeByWeek(contributionData);
            
            // Create a row for each day of week (7 days)
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                const row = document.createElement('tr');
                
                // Create a cell for each week (53 weeks)
                for (let week = 0; week < weeks.length; week++) {
                    const cell = document.createElement('td');
                    const day = weeks[week][dayOfWeek];
                    
                    if (day) {
                        cell.className = `contribution-cell level-${day.level}`;
                        cell.setAttribute('data-date', day.date);
                        cell.setAttribute('data-count', day.count);
                        cell.title = `${day.date}: ${day.count} contributions`;
                    } else {
                        cell.className = 'contribution-cell empty';
                    }
                    
                    row.appendChild(cell);
                }
                
                tbody.appendChild(row);
            }
            
            table.appendChild(tbody);
            this.calendarContainer.appendChild(table);
            
        } catch (error) {
            console.error('Failed to load GitHub calendar data:', error);
            this.calendarContainer.innerHTML = '<p>Failed to load contribution data.</p>';
        }
    }
    
    // Organize days into a matrix by week and day
    organizeByWeek(days) {
        const weeks = [];
        let currentWeek = [];
        let dayOfWeek = new Date(days[0].date).getDay();
        
        // Fill in empty days at start of first week
        for (let i = 0; i < dayOfWeek; i++) {
            currentWeek.push(null);
        }
        
        for (const day of days) {
            const date = new Date(day.date);
            dayOfWeek = date.getDay();
            
            // If we reached Sunday (0) and already have data, start a new week
            if (dayOfWeek === 0 && currentWeek.length > 0) {
                // Fill in any remaining days
                while (currentWeek.length < 7) {
                    currentWeek.push(null);
                }
                weeks.push(currentWeek);
                currentWeek = [];
            }
            
            currentWeek.push(day);
            
            // If we're at the last day, push this week
            if (day === days[days.length - 1]) {
                // Fill in any remaining days
                while (currentWeek.length < 7) {
                    currentWeek.push(null);
                }
                weeks.push(currentWeek);
            }
        }
        
        return weeks;
    }

    // Mock data function (to be replaced with actual GitHub API in production)
    async fetchMockData() {
        const days = [];
        const now = new Date();
        
        for (let i = 365; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            const formattedDate = date.toISOString().split('T')[0];
            
            let count = 0;
            const random = Math.random();
            
            if (random < 0.6) {
                count = 0;
            } else if (random < 0.8) {
                count = Math.floor(Math.random() * 3) + 1;
            } else if (random < 0.95) {
                count = Math.floor(Math.random() * 5) + 3;
            } else {
                count = Math.floor(Math.random() * 10) + 8;
            }
            
            let level = 0;
            if (count === 0) {
                level = 0;
            } else if (count <= 2) {
                level = 1;
            } else if (count <= 5) {
                level = 2;
            } else if (count <= 10) {
                level = 3;
            } else {
                level = 4;
            }
            
            days.push({
                date: formattedDate,
                count,
                level
            });
        }
        
        return days;
    }
}