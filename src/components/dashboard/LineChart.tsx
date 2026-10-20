'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

export interface LineSeries {
  label: string;
  data: number[];
  color: string;
  fill?: boolean;
}

export interface LineChartProps {
  labels: string[];
  series: LineSeries[];
  height?: number;
  yFormatter?: (v: number) => string;
  showLegend?: boolean;
  showGrid?: boolean;
}

const defaultColors = {
  emerald: { line: 'rgb(16, 185, 129)', fill: 'rgba(16, 185, 129, 0.12)' },
  amber: { line: 'rgb(245, 158, 11)', fill: 'rgba(245, 158, 11, 0.10)' },
  blue: { line: 'rgb(59, 130, 246)', fill: 'rgba(59, 130, 246, 0.10)' },
  rose: { line: 'rgb(244, 63, 94)', fill: 'rgba(244, 63, 94, 0.10)' },
};

function parseColor(color: string) {
  if (color.includes('emerald')) return defaultColors.emerald;
  if (color.includes('amber')) return defaultColors.amber;
  if (color.includes('blue')) return defaultColors.blue;
  if (color.includes('rose')) return defaultColors.rose;
  return defaultColors.emerald;
}

export default function LineChart({
  labels,
  series,
  height = 280,
  yFormatter,
  showLegend = true,
  showGrid = true,
}: LineChartProps) {
  const datasets = series.map((s) => {
    const c = parseColor(s.color);
    return {
      label: s.label,
      data: s.data,
      borderColor: c.line,
      backgroundColor: s.fill !== false ? c.fill : 'transparent',
      borderWidth: 2.5,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: c.line,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      tension: 0.4,
      fill: s.fill !== false,
    };
  });

  const data = { labels, datasets };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        align: 'end',
        labels: {
          color: '#475569',
          font: { size: 11, weight: 600 },
          boxWidth: 10,
          boxHeight: 10,
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
        titleFont: { size: 12, weight: 700 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        callbacks: yFormatter
          ? { label: (ctx: any) => `${ctx.dataset.label}: ${yFormatter(ctx.parsed.y)}` }
          : undefined,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#64748b', font: { size: 10, weight: 500 } },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: showGrid,
          color: 'rgba(148, 163, 184, 0.15)',
          lineWidth: 1,
        },
        border: { display: false },
        ticks: {
          color: '#64748b',
          font: { size: 10, weight: 500 },
          callback: yFormatter ? (v: number) => yFormatter(v) : undefined,
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
}