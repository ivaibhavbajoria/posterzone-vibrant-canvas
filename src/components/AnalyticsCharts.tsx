
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

// Sample data for analytics charts
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

const AnalyticsCharts = () => {
  return (
    <div className="space-y-8">
      {/* Sales Bar Chart */}
      <div className="w-full">
        <h4 className="text-md font-semibold mb-3">Monthly Sales Count</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart
              data={salesData}
              margin={{
                top: 20,
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
        </div>
      </div>

      {/* Revenue Line Chart */}
      <div className="w-full">
        <h4 className="text-md font-semibold mb-3">Revenue Trend</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{
                top: 20,
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
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="w-full">
        <h4 className="text-md font-semibold mb-3">Category Distribution</h4>
        <div className="h-64 w-full flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
