const https = require('https');
const fs = require('fs');

// Get username from environment or use hardcoded value
const username = process.env.USERNAME || 'sarpowsky';

console.log(`Fetching data for username: ${username}`);

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
    'Authorization': `Bearer ${process.env.GITHUB_PAT}`,
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
      
      // Log a truncated version of the response for debugging
      console.log('API response status:', res.statusCode);
      console.log('API response errors:', jsonData.errors || 'None');
      
      if (jsonData.errors || !jsonData.data || !jsonData.data.user) {
        console.error('Invalid or error response from GitHub API');
        console.error('Error details:', jsonData.errors);
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

// Execute the request
req.write(JSON.stringify({ query }));
req.end();
