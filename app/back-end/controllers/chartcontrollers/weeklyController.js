const Power = require('../../models/powerModel'); // Update the path to the model

const getWeeklyData = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1); // Start of the week

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End of the week

    const data = await Power.find({ timestamp: { $gte: startDate, $lt: endDate } });

    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const datasets = [{ label: 'Power Consumption', data: Array(7).fill(0) }];

    data.forEach(entry => {
      const day = entry.timestamp.getDay();
      datasets[0].data[day] += entry.consumedPower;
    });

    res.json({ labels, datasets });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getWeeklyData };
