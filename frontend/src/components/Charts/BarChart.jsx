import React from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const BarChart = ({ 
  data, 
  dataKey, 
  xAxisKey = 'name',
  color = '#3B82F6',
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  bars = [],
  ...props 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} {...props}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
        
        {bars.length > 0 ? (
          bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              fill={bar.color || color}
              name={bar.name || bar.dataKey}
            />
          ))
        ) : (
          <Bar dataKey={dataKey} fill={color} />
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export default BarChart
