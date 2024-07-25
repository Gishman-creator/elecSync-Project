// pages/HistoryTbPages/LineChart.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { scaleLinear, scalePoint, line, curveBasis } from 'd3';
import { Svg, Path, G, Line as SvgLine, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useSocket } from '../../../../context/SocketContext'; 

const LineChart = ({ data, chartHeight, chartMargin, chartWidth }) => {
  const { socket } = useSocket();
  const [chartData, setChartData] = useState(data);
  const [cursorX, setCursorX] = useState(null);
  const [cursorLabel, setCursorLabel] = useState('Label');
  const [cursorConsumption, setCursorConsumption] = useState('0');

  useEffect(() => {
    if (socket) {
      const handleUpdatePower = (update) => {
        // Update the chart data with new power consumption data
        const newData = {
          ...chartData,
          datasets: [{
            ...chartData.datasets[0],
            data: [...chartData.datasets[0].data, update.consumedPower]
          }],
          labels: [...chartData.labels, new Date().toLocaleTimeString()] // Assuming you're using time labels
        };
        setChartData(newData);
      };

      socket.on('updatePower', handleUpdatePower);

      return () => {
        socket.off('updatePower', handleUpdatePower);
      };
    }
  }, [socket, chartData]);

  if (!chartData || !chartData.datasets || !chartData.datasets.length || !chartData.labels || !chartData.labels.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No data available in LineChart.js</Text>
      </View>
    );
  }

  const datasets = chartData.datasets;
  const labels = chartData.labels;
  const highlightLabels = chartData.highlightLabels || labels;
  const fullDates = chartData.fullDates || labels;

  const xDomain = labels;
  const xRange = [chartMargin, chartWidth - chartMargin];
  const xScale = scalePoint().domain(xDomain).range(xRange);

  const values = datasets[0].data;

  const max = Math.max(...values);
  const min = Math.min(...values);

  const yDomain = [min - 1, max + 1];
  const yRange = [chartHeight, 0];
  const yScale = scaleLinear().domain(yDomain).range(yRange);

  const lineGenerator = line()
    .x((d, index) => xScale(labels[index]))
    .y(d => yScale(d))
    .curve(curveBasis);

  const pathData = lineGenerator(values);

  const handleGesture = (event) => {
    const { nativeEvent } = event;
    const { x } = nativeEvent;
    if (x < chartMargin || x > chartWidth - chartMargin) {
      setCursorX(null);
      setCursorLabel('Label');
      setCursorConsumption('0');
      return;
    }

    const labelIndex = Math.round((x - chartMargin) / (chartWidth - 2 * chartMargin) * (labels.length - 1));
    const label = fullDates[labelIndex];
    const consumption = values[labelIndex];
    setCursorX(x);
    setCursorLabel(label);
    setCursorConsumption(consumption);
  };

  return (
    <View>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <View
          className="relative"
          style={{ height: chartHeight + 40, width: chartWidth, margin: chartMargin }}
        >

        <Text className="text-base font-semibold">Total electric used:</Text>

        <View className="flex justify-start">
            <Text className="text-[80px] text-[#f99e00]">{`${cursorConsumption}`}</Text>
            <Text className="text-base font-semibold mb-6">kW used</Text>
        </View>

          <View className="mx-4 my-2 p-2 rounded-lg">
            <Text className="text-center text-base font-bold text-gray-700 mb-2">
              {`${cursorLabel}`}
            </Text>
          </View>

          <Svg height={chartHeight + 40} width={chartWidth}>
            <Defs>
              <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="80%">
                <Stop offset="0%" stopColor="#E5F6FF" />
                <Stop offset="100%" stopColor="#fff" />
              </LinearGradient>
            </Defs>

            <Path
              d={`${pathData} L ${xScale(labels[labels.length - 1])} ${chartHeight} L ${xScale(labels[0])} ${chartHeight} Z`}
              fill="url(#gradient)"
            />

            <Path d={pathData} fill="none" stroke="black" strokeWidth="2" />

            {highlightLabels.map((label, index) => (
              <SvgText
                key={index}
                x={xScale(label)}
                y={chartHeight + 20}
                fontSize={10}
                fill="black"
              >
                {label}
              </SvgText>
            ))}

            {cursorX && cursorLabel && cursorConsumption !== null && (
              <G>
                <SvgLine x1={cursorX} y1={0} x2={cursorX} y2={chartHeight} stroke="#718476" strokeWidth="1" strokeDasharray="4" />
              </G>
            )}
          </Svg>
        </View>
      </PanGestureHandler>
    </View>
  );
};

export default LineChart;
