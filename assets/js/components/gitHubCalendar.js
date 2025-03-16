// assets/js/components/gitHubCalendar.js
export default class GitHubCalendar {
    constructor(containerId, username) {
        this.container = document.getElementById(containerId);
        this.username = username;
        this.cellSize = 10;
        this.gap = 2;
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
        title.textContent = `GitHub Contributions`;
        header.appendChild(title);
        
        this.calendarContainer = document.createElement('div');
        this.calendarContainer.className = 'github-calendar-grid';
        
        const loading = document.createElement('div');
        loading.className = 'github-calendar-loading';
        loading.textContent = 'Loading contribution data...';
        this.calendarContainer.appendChild(loading);
        
        this.container.appendChild(header);
        this.container.appendChild(this.calendarContainer);
    }

    async fetchAndDisplayData() {
        try {
            const contributionData = await this.fetchContributions();
            this.calendarContainer.innerHTML = '';
            
            // Create table structure
            const table = document.createElement('table');
            table.className = 'contribution-table';
            const tbody = document.createElement('tbody');
            
            // Organize data by week and day
            const weeks = this.organizeByWeek(contributionData);
            
            // Create rows for each day of week
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                const row = document.createElement('tr');
                
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
        
        // Fill empty days at start of first week
        for (let i = 0; i < dayOfWeek; i++) {
            currentWeek.push(null);
        }
        
        for (const day of days) {
            const date = new Date(day.date);
            dayOfWeek = date.getDay();
            
            // New week on Sunday
            if (dayOfWeek === 0 && currentWeek.length > 0) {
                while (currentWeek.length < 7) {
                    currentWeek.push(null);
                }
                weeks.push(currentWeek);
                currentWeek = [];
            }
            
            currentWeek.push(day);
            
            // Last day
            if (day === days[days.length - 1]) {
                while (currentWeek.length < 7) {
                    currentWeek.push(null);
                }
                weeks.push(currentWeek);
            }
        }
        
        return weeks;
    }

    async fetchContributions() {
        try {
            const response = await fetch('/assets/js/data/github-contributions.json');
            
            if (!response.ok) throw new Error('Failed to load GitHub contributions');
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching GitHub contributions:', error);
            return this.generateMockData();
        }
    }

    generateMockData() {
        const days = [];
        const now = new Date();
        
        for (let i = 365; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            const formattedDate = date.toISOString().split('T')[0];
            
            // Random contribution data
            let count = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 10);
            let level = 0;
            
            if (count === 0) level = 0;
            else if (count <= 2) level = 1;
            else if (count <= 5) level = 2;
            else if (count <= 10) level = 3;
            else level = 4;
            
            days.push({
                date: formattedDate,
                count,
                level
            });
        }
        
        return days;
    }
}