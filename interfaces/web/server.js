const express = require('express');
const path = require('path');
const fs = require('fs');
const facultyRoutes = require('./routes/facultyRoutes');
const specialtyRoutes = require('./routes/specialtyRoutes');
const benefitRoutes = require('./routes/benefitRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dormitoryRoutes = require('./routes/dormitoryRoutes');
const priceRoutes = require('./routes/priceRoutes');
const superintendentRoutes = require('./routes/superintendentRoutes');
const studentRoutes = require('./routes/studentRoutes'); 

const app = express();

// Set view engine and middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../static')));
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/static_staff', express.static(path.join(__dirname, '../static_staff')));
app.use(express.static(path.join(__dirname, '../student')));
app.use(express.static(path.join(__dirname, '../staff')));

// Serve root route
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../student/index.html');
  console.log('Attempting to serve:', filePath);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Index.html not found:', err);
      res.status(404).send('index.html not found in interfaces/student/');
      return;
    }
    res.sendFile(filePath, (sendErr) => {
      if (sendErr) {
        console.error('Error serving index.html:', sendErr);
        res.status(500).send('Error serving index.html');
      }
    });
  });
});

app.get('/staff/index.html', (req, res) => {
  const filePath = path.join(__dirname, '../staff/index.html');
  console.log('Attempting to serve:', filePath);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Staff index.html not found:', err);
      res.status(404).send('index.html not found in interfaces/staff/');
      return;
    }
    res.sendFile(filePath, (sendErr) => {
      if (sendErr) {
        console.error('Error serving staff index.html:', sendErr);
        res.status(500).send('Error serving staff index.html');
      }
    });
  });
});

app.get('/staff/residents.html', (req, res) => {
  const filePath = path.join(__dirname, '../staff/residents.html');
  console.log('Attempting to serve:', filePath);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Residents.html not found:', err);
      res.status(404).send('residents.html not found in interfaces/staff/');
      return;
    }
    res.sendFile(filePath, (sendErr) => {
      if (sendErr) {
        console.error('Error serving residents.html:', sendErr);
        res.status(500).send('Error serving residents.html');
      }
    });
  });
});

app.get('/staff/applications.html', (req, res) => {
  const filePath = path.join(__dirname, '../staff/applications.html');
  console.log('Attempting to serve:', filePath);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Applications.html not found:', err);
      res.status(404).send('applications.html not found in interfaces/staff/');
      return;
    }
    res.sendFile(filePath, (sendErr) => {
      if (sendErr) {
        console.error('Error serving applications.html:', sendErr);
        res.status(500).send('Error serving applications.html');
      }
    });
  });
});

app.get('/staff', (req, res) => {
  res.redirect('/staff/index.html');
});

// Register API routes
app.use('/api', facultyRoutes);
app.use('/api', specialtyRoutes);
app.use('/api', benefitRoutes);
app.use('/api', studentRoutes); // Replace studentRouter with studentRoutes
app.use('/api', dormitoryRoutes);
app.use('/api', priceRoutes);
app.use('/api', applicationRoutes);
app.use('/api', superintendentRoutes);


// Handle 404 for undefined routes
app.use((req, res) => {
  console.log(`404: Resource not found at ${req.url}`);
  res.status(404).send('Resource not found');
});

module.exports = app;