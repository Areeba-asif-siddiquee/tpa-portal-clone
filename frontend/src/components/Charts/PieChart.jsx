import React from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']

const PieChart = ({ 
  data, 
  dataKey = 'value',
  nameKey = 'name',
  colors = COLORS,
  height = 300,
  innerRadius = 0,
  outerRadius = 100,
  paddingAngle = 5,
  showTooltip = true,
  showLegend = true,
  centerX = '50%',
  centerY = '50%',
  ...props 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart {...props}>
        <Pie
          data={data}
          cx={centerX}
          cy={centerY}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colors[index % colors.length]} 
            />
          ))}
        </Pie>
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export default PieChart
