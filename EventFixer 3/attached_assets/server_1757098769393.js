const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Enable the use of JSON in the request body
app.use(express.json());

// --- MOCK DATA ---
// In a real application, this data would be fetched from a database.
const buses = [
  {
    id: '38',
    route: 'Downtown Express',
    currentLocation: 'Market Street & 3rd Street',
    status: 'On Time',
    eta: 3,
    schedule: [
      { time: '8:30 AM', stop: 'Home Station' },
      { time: '8:45 AM', stop: 'Downtown Hub' },
      { time: '9:00 AM', stop: 'Financial District' },
    ],
  },
  {
    id: '14',
    route: 'Mission to Bay',
    currentLocation: 'Mission Street & 16th Street',
    status: 'Delayed',
    eta: 5,
    schedule: [
      { time: '9:00 AM', stop: 'Mission Station' },
      { time: '9:20 AM', stop: 'Pier 39' },
      { time: '9:40 AM', stop: 'Fisherman\'s Wharf' },
    ],
  },
  {
    id: '22',
    route: 'The Castro Circuit',
    currentLocation: 'Castro Street & Market Street',
    status: 'Planned',
    eta: null,
    schedule: [
      { time: '1:30 PM', stop: 'Castro Station' },
      { time: '1:45 PM', stop: 'Twin Peaks' },
      { time: '2:00 PM', stop: 'Haight-Ashbury' },
    ],
  },
];

// --- API ENDPOINTS ---

// GET all buses
app.get('/api/buses', (req, res) => {
  console.log('GET /api/buses requested');
  res.json(buses);
});

// GET a single bus by ID
app.get('/api/buses/:id', (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  if (bus) {
    console.log(`GET /api/buses/${req.params.id} found`);
    res.json(bus);
  } else {
    console.log(`GET /api/buses/${req.params.id} not found`);
    res.status(404).send('Bus not found');
  }
});

// Mock AI endpoint
app.post('/api/ai/query', (req, res) => {
  const { query } = req.body;
  console.log(`POST /api/ai/query received query: "${query}"`);

  let responseText;
  const lowerCaseQuery = query.toLowerCase();

  // Simple keyword-based responses
  if (lowerCaseQuery.includes('fastest')) {
    responseText = 'The fastest route to downtown is currently Route 38. It is on time with an ETA of 3 minutes.';
  } else if (lowerCaseQuery.includes('traffic')) {
    responseText = 'There is a 5-minute delay on Route 14 due to heavy traffic on Mission Street. All other routes are clear.';
  } else if (lowerCaseQuery.includes('bus')) {
    responseText = 'I can provide real-time updates for all of our luxury bus routes. Please specify a route number or a destination.';
  } else {
    responseText = 'I am your Luxury AI Travel Assistant. How can I help you get around the city today?';
  }

  res.json({ text: responseText });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
