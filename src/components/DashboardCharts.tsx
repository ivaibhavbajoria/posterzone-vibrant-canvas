
import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

// Sample data for dashboard charts
const salesData = [
  { name: 'Jan', count: 400, sales: 2400 },
  { name: 'Feb', count: 300, sales: 1398 },
  { name: 'Mar', count: 200, sales: 9800 },
  { name: 'Apr', count: 278, sales: 3908 },
  { name: 'May', count: 189, sales: 4800 },
  { name: 'Jun', count: 239, sales: 3800 },
];

const categoryData = [
  { name: 'Nature', value: 400 },
  { name: 'Abstract', value: 300 },
  { name: 'Vintage', value: 300 },
  { name: 'Sports', value: 200 },
];

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const SalesBarChart = ({ data = salesData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export const SalesLineChart = ({ data = salesData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const CategoryPieChart = ({ data = categoryData, colors: chartColors = colors }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  );
};

// Default export component that combines all charts
const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-80">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <SalesBarChart />
      </div>
      <div className="h-80">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <SalesLineChart />
      </div>
      <div className="h-80 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
        <CategoryPieChart />
      </div>
    </div>
  );
};

export default DashboardCharts;
