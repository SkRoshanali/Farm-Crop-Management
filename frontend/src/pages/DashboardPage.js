import React, { useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Tooltip, Legend, Filler
} from 'chart.js';
import { useApi } from '../hooks/useApi';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/common/StatCard';
import { MdPeople, MdGrass, MdLandscape, MdAssignment } from 'react-icons/md';
import { formatCurrency } from '../utils/formatUtils';
import './DashboardPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Tooltip, Legend, Filler);

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } },
    y: { grid: { color: '#f3f4f6' }, ticks: { font: { family: 'Outfit' } } },
  }
};

export default function DashboardPage() {
  const { data, loading } = useApi(dashboardService.getSummary);

  const totalRevenue = useMemo(() => {
    if (!data?.records) return 0;
    return data.records.reduce((s, r) => s + (Number(r.revenueGenerated) || 0), 0);
  }, [data]);

  const cropDoughnut = useMemo(() => {
    if (!data?.records) return null;
    const counts = {};
    data.records.forEach(r => { counts[r.cropName] = (counts[r.cropName] || 0) + 1; });
    return {
      labels: Object.keys(counts),
      datasets: [{ data: Object.values(counts),
        backgroundColor: ['#3aa86a','#56c484','#2d8653','#1a6b3c','#f59e0b','#3b82f6'],
        borderWidth: 0 }]
    };
  }, [data]);

  const fieldBar = useMemo(() => {
    if (!data?.records) return null;
    const yieldMap = {};
    data.records.forEach(r => {
      if (r.fieldName) yieldMap[r.fieldName] = (yieldMap[r.fieldName] || 0) + (r.yieldKg || 0);
    });
    const labels = Object.keys(yieldMap).slice(0, 8);
    return {
      labels,
      datasets: [{ label: 'Yield (kg)', data: labels.map(l => yieldMap[l]),
        backgroundColor: '#3aa86a', borderRadius: 6 }]
    };
  }, [data]);

  const monthLine = useMemo(() => {
    if (!data?.records) return null;
    const months = {};
    data.records.forEach(r => {
      if (r.plantingDate) {
        const m = new Date(r.plantingDate).toLocaleString('en-US', { month: 'short', year: '2-digit' });
        months[m] = (months[m] || 0) + 1;
      }
    });
    const labels = Object.keys(months).slice(-8);
    return {
      labels,
      datasets: [{ label: 'Records', data: labels.map(l => months[l]),
        fill: true, borderColor: '#3aa86a',
        backgroundColor: 'rgba(58,168,106,.1)', tension: .4,
        pointBackgroundColor: '#3aa86a', pointRadius: 5 }]
    };
  }, [data]);

  const STATS = [
    { title: 'Total Farmers',      value: data?.farmers?.length,  icon: <MdPeople />,     color: '#3aa86a' },
    { title: 'Total Crops',        value: data?.crops?.length,    icon: <MdGrass />,      color: '#f59e0b' },
    { title: 'Total Fields',       value: data?.fields?.length,   icon: <MdLandscape />,  color: '#3b82f6' },
    { title: 'Total Crop Records', value: data?.records?.length,  icon: <MdAssignment />, color: '#a855f7' },
  ];

  if (loading) return (
    <div className="dash-loading">
      {[0,1,2,3].map(i => <div key={i} className="dash-skeleton" />)}
    </div>
  );

  return (
    <div className="dashboard fade-in">
      <div className="dash-stats">
        {STATS.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="dash-revenue">
        <div className="dash-revenue__card">
          <p>Total Revenue</p>
          <h2>{formatCurrency(totalRevenue)}</h2>
        </div>
        <div className="dash-revenue__card">
          <p>Harvested Records</p>
          <h2>{data?.records?.filter(r => r.status === 'HARVESTED').length || 0}</h2>
        </div>
        <div className="dash-revenue__card">
          <p>Active Fields</p>
          <h2>{data?.fields?.length || 0}</h2>
        </div>
      </div>

      <div className="dash-charts">
        <div className="dash-chart-card">
          <h3>Crop Distribution</h3>
          <div className="dash-chart-wrap" style={{ height: 240 }}>
            {cropDoughnut
              ? <Doughnut data={cropDoughnut} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { family: 'Outfit' }, boxWidth: 14 } } } }} />
              : <p className="dash-no-data">No data</p>}
          </div>
        </div>

        <div className="dash-chart-card">
          <h3>Yield by Field (kg)</h3>
          <div className="dash-chart-wrap" style={{ height: 240 }}>
            {fieldBar ? <Bar data={fieldBar} options={CHART_OPTS} /> : <p className="dash-no-data">No data</p>}
          </div>
        </div>

        <div className="dash-chart-card dash-chart-card--full">
          <h3>Monthly Crop Records</h3>
          <div className="dash-chart-wrap" style={{ height: 220 }}>
            {monthLine
              ? <Line data={monthLine} options={{ ...CHART_OPTS, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } }, y: { grid: { color: '#f3f4f6' }, ticks: { font: { family: 'Outfit' } } } } }} />
              : <p className="dash-no-data">No records yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
