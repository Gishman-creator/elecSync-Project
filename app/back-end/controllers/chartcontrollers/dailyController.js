const Power = require('../../models/powerModel'); // Update the path to the model

const getDailyData = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request params
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const data = await Power.find({
      userId: userId, // Filter by userId
      timestamp: { $gte: startDate, $lte: endDate }
    });

    // Create labels for 24 hours in a day
    const labels = Array.from({ length: 24 }, (_, index) => index.toString().padStart(2, '0') + ':00');

    // Initialize dataset with zeros
    const datasets = [{ label: 'Power Consumption', data: Array(24).fill(0) }];

    // Process each entry and accumulate power consumption by hour
    data.forEach(entry => {
      const hourIndex = entry.timestamp.getHours();
      datasets[0].data[hourIndex] += entry.consumedPower;
    });

    // Shift the data to align with the correct hours
    const reorderedLabels = [...labels, '00:00'];
    const dataWith00AtEnd = [...datasets[0].data.slice(1), datasets[0].data[0]];
    const highlightLabels = reorderedLabels.filter((_, index) => index % 6 === 0);

    res.json({ labels: reorderedLabels, datasets: [{ ...datasets[0], data: dataWith00AtEnd }], highlightLabels });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getDailyData };
