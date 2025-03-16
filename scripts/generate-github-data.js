// scripts/generate-github-data.js
const fetch = require('node-fetch');
const fs = require('fs');

async function generateContributionData() {
  // Replace with your personal access token
  const token = 'YOUR_PERSONAL_ACCESS_TOKEN';
  const username = 'sarpowsky'; // Your GitHub username
  
  try {
    // GraphQL query for contributions
    const query = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    
    const data = await response.json();
    
    // Process contributions
    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
    const contributionData = [];
    
    weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        const count = day.contributionCount;
        let level = 0;
        
        if (count === 0) level = 0;
        else if (count <= 2) level = 1;
        else if (count <= 5) level = 2;
        else if (count <= 10) level = 3;
        else level = 4;
        
        contributionData.push({
          date: day.date,
          count,
          level
        });
      });
    });
    
    // Save to file
    fs.writeFileSync(
      './assets/js/data/github-contributions.json',
      JSON.stringify(contributionData, null, 2)
    );
    
    console.log('GitHub contribution data generated successfully!');
  } catch (error) {
    console.error('Error generating data:', error);
  }
}

generateContributionData();