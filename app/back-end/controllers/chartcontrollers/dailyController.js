const Power = require('../../models/powerModel'); // Update the path to the model

const getDailyData = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request params
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Start of the day
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // End of the day

    // Fetch data for the specific userId and date range
    const data = await Power.find({
      userId: userId,
      timestamp: { $gte: startDate, $lte: endDate }
    });

    // Initialize the dataset with zero consumption for each hour of the day
    const labels = Array.from({ length: 24 }, (_, index) => index.toString().padStart(2, '0') + ':00');
    const hourlyData = Array(24).fill(0);

    // Accumulate power consumption for each hour
    data.forEach(entry => {
      const hourIndex = entry.timestamp.getHours();
      hourlyData[hourIndex] += entry.consumedPower;
    });

    // Do not include '00:00' at the end
    const reorderedLabels = labels; // No modification needed
    const dataWith00AtEnd = hourlyData; // No modification needed

    // Highlight every 6th label for readability
    const highlightLabels = reorderedLabels.filter((_, index) => index % 6 === 0);

    res.json({
      labels: reorderedLabels,
      datasets: [{ label: 'Power Consumption', data: dataWith00AtEnd }],
      highlightLabels
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getDailyData };
