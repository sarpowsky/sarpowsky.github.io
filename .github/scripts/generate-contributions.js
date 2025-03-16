const https = require('https');
const fs = require('fs');

// Get username from repository name
const repoName = process.env.GITHUB_REPOSITORY;
const username = repoName.split('/')[0];

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

const req = https.request(requestOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      
      if (jsonData.errors) {
        console.error('GraphQL errors:', jsonData.errors);
        process.exit(1);
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
      
      // Ensure directory exists
      if (!fs.existsSync('assets/js/data')) {
        fs.mkdirSync('assets/js/data', { recursive: true });
      }
      
      // Write to file
      fs.writeFileSync(
        'assets/js/data/github-contributions.json',
        JSON.stringify(contributionData, null, 2)
      );
      
      console.log('GitHub contribution data updated successfully!');
    } catch (error) {
      console.error('Error processing response:', error);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
  process.exit(1);
});

req.write(JSON.stringify({ query }));
req.end();