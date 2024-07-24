const Power = require('../../models/powerModel'); // Update the path to the model

const getDailyData = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const data = await Power.find({ timestamp: { $gte: startDate } });

    const labels = Array.from({ length: 24 }, (_, index) => index.toString().padStart(2, '0') + ':00');
    const reorderedLabels = [...labels.slice(0), '00:00'];
    const datasets = [{ label: 'Power Consumption', data: Array(24).fill(0) }];

    data.forEach(entry => {
      const hourLabel = entry.timestamp.getHours().toString().padStart(2, '0') + ':00';
      let hourIndex = parseInt(hourLabel.substring(0, 2), 10);
      if (hourIndex === 0) {
        hourIndex = 23;
      } else {
        hourIndex--;
      }
      datasets[0].data[hourIndex] += entry.consumedPower;
    });

    const dataWith00AtEnd = [...datasets[0].data.slice(1), datasets[0].data[0]];
    const highlightLabels = reorderedLabels.filter((_, index) => index % 6 === 0);

    res.json({ labels: reorderedLabels, datasets: [{ ...datasets[0], data: dataWith00AtEnd }], highlightLabels });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getDailyData };
