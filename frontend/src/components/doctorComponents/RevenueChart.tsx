import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Define the type for the individual monthly revenue item
interface MonthlyRevenueItem {
  month: string; // e.g., '2023-10'
  totalRevenue: number; // Total revenue for the month
}

// Define the props type for the RevenueChart component
interface RevenueChartProps {
  monthlyRevenue: MonthlyRevenueItem[]; // Array of monthly revenue items
}

// Define types for the CustomTooltip props
interface CustomTooltipProps {
  active?: boolean; // Optional prop for active state
  payload?: {
    payload: MonthlyRevenueItem; // The payload should match the MonthlyRevenueItem structure
  }[];
}

// Custom Tooltip Component
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { month, totalRevenue } = payload[0].payload; // Access data
    const year = month.slice(0, 4); // Extract year from month (YYYY-MM format)
    const monthFormatted = month.slice(5); // Extract month (MM format)
    return (
      <div className="bg-white border border-gray-300 rounded shadow-lg p-2">
        <p className="text-black font-bold">{`${monthFormatted}-${year}`}</p>
        <p className="text-black">{`Revenue: $${totalRevenue}`}</p>
      </div>
    );
  }
  return null;
};

const RevenueChart: React.FC<RevenueChartProps> = ({ monthlyRevenue }) => {
  // Get the current date
  const currentDate = new Date();
  
  // Create an array of the last 12 months (including the current month)
  const monthsArray = [];
  for (let i = 0; i < 12; i++) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i);
    const monthString = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    monthsArray.push(monthString);
  }

  // Create a data object for the chart
  const data = monthsArray.map(month => {
    const foundMonth = monthlyRevenue.find(item => item.month === month);
    return {
      month: month, // Keep full YYYY-MM format
      totalRevenue: foundMonth ? foundMonth.totalRevenue : 0, // Default to 0 if no data
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barSize={20}
      >
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="totalRevenue" fill="#8884d8" background={{ fill: '#eee' }} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
