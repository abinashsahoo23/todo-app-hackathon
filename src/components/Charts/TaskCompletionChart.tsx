import React, { useEffect, useState } from 'react';
import { format, parseISO, isWeekend } from 'date-fns';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, ReferenceLine, Label
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

interface ChartData {
  date: string;
  count: number;
}

interface TaskCompletionChartProps {
  data: ChartData[];
}

const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ data }) => {
  const { themeColors } = useTheme();
  const [chartData, setChartData] = useState<(ChartData & { isWeekend: boolean, tooltipLabel: string })[]>([]);
  const [peakDay, setPeakDay] = useState<{ date: string; count: number }>({ date: '', count: 0 });
  
  useEffect(() => {
    // Process data for chart rendering
    const processedData = data.map(item => {
      const date = parseISO(item.date);
      return {
        ...item,
        isWeekend: isWeekend(date),
        tooltipLabel: format(date, 'EEEE, MMM do')
      };
    });
    
    setChartData(processedData);
    
    // Find peak productivity day
    if (data.length > 0) {
      const peak = [...data].sort((a, b) => b.count - a.count)[0];
      setPeakDay(peak);
    }
  }, [data]);

  const formatXAxis = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, 'M/d');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = parseISO(label);
      const isWeekendDay = isWeekend(date);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-md border border-gray-100 dark:border-gray-700">
          <p className="font-medium text-sm text-gray-900 dark:text-white">
            {format(date, 'EEEE, MMMM do')}
            {isWeekendDay && <span className="ml-2 text-blue-500">Weekend</span>}
          </p>
          <p className="text-lg font-bold" style={{ color: themeColors.primary }}>
            {payload[0].value} {payload[0].value === 1 ? 'task' : 'tasks'} completed
          </p>
        </div>
      );
    }
    
    return null;
  };

  // Weekend reference areas
  const weekendAreas = chartData
    .filter(day => day.isWeekend)
    .map((day, index) => (
      <ReferenceLine
        key={`weekend-${index}`}
        x={day.date}
        stroke="none"
        isFront={false}
      >
        <Label
          value="Weekend"
          position="insideTop"
          fill={themeColors.textSecondary}
          fontSize={10}
          opacity={0.6}
        />
      </ReferenceLine>
    ));

  return (
    <div className="h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 5, bottom: 25 }}
        >
          {/* Weekend shade background for all weekend days */}
          {chartData.map((entry, index) => (
            entry.isWeekend ? (
              <ReferenceLine
                key={`weekend-shade-${index}`}
                x={entry.date}
                stroke="#f3f4f6"
                strokeWidth={30}
                strokeOpacity={0.5}
                isFront={false}
              />
            ) : null
          ))}
          
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            stroke={themeColors.textSecondary}
            minTickGap={15}
          />
          
          <YAxis 
            allowDecimals={false}
            stroke={themeColors.textSecondary}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Area with gradient fill */}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <Area
            type="monotone"
            dataKey="count"
            stroke="none"
            fill="url(#colorGradient)"
            animationDuration={1500}
          />
          
          {/* Peak day marker */}
          {peakDay.date && (
            <ReferenceLine
              x={peakDay.date}
              stroke={themeColors.accent}
              strokeWidth={2}
              label={{
                value: "Peak",
                position: "top",
                fill: themeColors.accent
              }}
            />
          )}
          
          {/* Main line on top */}
          <Line
            type="monotone"
            dataKey="count"
            stroke={themeColors.primary}
            strokeWidth={2}
            dot={{ stroke: themeColors.primary, strokeWidth: 2, r: 4, fill: 'white' }}
            activeDot={{ stroke: themeColors.primary, strokeWidth: 2, r: 6, fill: 'white' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskCompletionChart; 