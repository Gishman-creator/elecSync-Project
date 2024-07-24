const Power = require('../models/powerModel'); // Import the Power model

let interval;

const handleConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle starting the simulation
    socket.on('startSimulation', async (totalPower) => {
      console.log(`Start simulation with totalPower: ${totalPower}`);
      let consumedPower = 0;

      if (interval) {
        clearInterval(interval);
      }

      interval = setInterval(async () => {
        // Simulate a random power consumption between 50 and 100 kW
        const randomConsumption = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        consumedPower += randomConsumption;

        if (consumedPower >= totalPower) {
          clearInterval(interval);
          consumedPower = totalPower;
        }

        const powerData = new Power({ timestamp: new Date(), consumedPower });
        await powerData.save();

        io.emit('updatePower', { consumedPower, totalPower });
        console.log(`Emitting updatePower: ${consumedPower}/${totalPower}`);
      }, 1000);
    });

    // Handle stopping the simulation
    socket.on('stopSimulation', () => {
      console.log('Stop simulation');
      if (interval) {
        clearInterval(interval);
        interval = null; // Clear the interval reference
        consumedPower = 0;
        console.log(consumedPower);
      }

      // Emit reset signal to clients
      io.emit('updatePower', { consumedPower });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      if (interval) {
        clearInterval(interval);
        interval = null; // Clear the interval reference
      }
    });
  });

  console.log('Socket.io server is ready and listening for connections.');
};

module.exports = { handleConnection };
