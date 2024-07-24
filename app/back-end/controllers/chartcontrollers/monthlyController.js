const Power = require('../../models/powerModel'); // Update the path to the model

const formatDate = (date) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

const formatDay = (date) => {
  return date.getDate().toString().padStart(2, '0'); // Only show the day
};

const getMonthlyData = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(1); // Start of the month

    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Start of next month
    endDate.setDate(0); // End of the month

    const data = await Power.find({ timestamp: { $gte: startDate, $lt: endDate } });

    const labels = [];
    const dataPoints = [];
    const fullDates = []; // To store the full dates for cursor labels

    // Populate labels, dataPoints, and fullDates
    for (let day = 1; day <= endDate.getDate(); day++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth(), day);
      const formattedDate = formatDate(date);
      const dayLabel = formatDay(date);

      labels.push(dayLabel);
      fullDates.push(formattedDate);

      // Initialize dataPoints
      dataPoints.push(0);
    }

    // Aggregate consumption for each day
    data.forEach(entry => {
      const date = new Date(entry.timestamp);
      const day = date.getDate() - 1; // Zero-based index
      if (day >= 0 && day < dataPoints.length) {
        dataPoints[day] += entry.consumedPower;
      }
    });

    // Ensure the 1st day is always highlighted
    const highlightLabels = labels.filter((_, index) => (index + 1) % 6 === 0 || index === 0);

    // Send response with labels, datasets, highlightLabels, and fullDates
    res.json({ labels, datasets: [{ label: 'Power Consumption', data: dataPoints }], highlightLabels, fullDates });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getMonthlyData };
