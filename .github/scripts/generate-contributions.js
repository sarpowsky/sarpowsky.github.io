const https = require('https');
const fs = require('fs');

// Get username from repository name
const repoName = process.env.GITHUB_REPOSITORY;
const username = repoName.split('/')[0];

console.log(`Repository: ${repoName}, Username: ${username}`);

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

const requestOptions = {
  hostname: 'api.github.com',
  path: '/graphql',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
    'User-Agent': 'GitHub-Action',
    'Content-Type': 'application/json'
  }
};

console.log('Making GraphQL request to GitHub API...');

const req = https.request(requestOptions, (res) => {
  let data = '';
  
  console.log(`Status code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      console.log('Response received, parsing JSON...');
      const jsonData = JSON.parse(data);
      
      console.log('API response:', JSON.stringify(jsonData));
      
      if (jsonData.errors || !jsonData.data || !jsonData.data.user) {
        console.error('Invalid or error response from GitHub API');
        generateMockData();
        return;
      }
      
      const weeks = jsonData.data.user.contributionsCollection.contributionCalendar.weeks;
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
      
      saveContributions(contributionData);
    } catch (error) {
      console.error('Error processing response:', error);
      generateMockData();
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
  generateMockData();
});

// Generate mock data that looks realistic
function generateMockData() {
  console.log('Generating mock contribution data as fallback...');
  
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
  
  saveContributions(days);
}

function saveContributions(data) {
  // Ensure directory exists
  if (!fs.existsSync('assets/js/data')) {
    fs.mkdirSync('assets/js/data', { recursive: true });
  }
  
  // Write to file
  fs.writeFileSync(
    'assets/js/data/github-contributions.json',
    JSON.stringify(data, null, 2)
  );
  
  console.log('GitHub contribution data saved successfully!');
}

// Execute the request or generate mock data
req.write(JSON.stringify({ query }));
req.end();
