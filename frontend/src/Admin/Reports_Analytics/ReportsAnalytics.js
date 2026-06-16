import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  Layers, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  FileSpreadsheet
} from 'lucide-react';
import AdminLayout from '../../Pages/Admin/Layout/AdminLayout';
import './Reports.css'

// Mock transactional metrics categorized by Timeframes
const TIMEFRAME_DATA = {
  "This Month": {
    revenue: 252500,
    revenueChange: "+12.4%",
    revenueUp: true,
    bookings: 8,
    bookingsChange: "+4%",
    bookingsUp: true,
    clients: 12,
    clientsChange: "+8.2%",
    clientsUp: true,
    vendors: 7,
    chartRevenue: [32000, 45000, 28000, 65000, 52000, 30500],
    categoryShare: [
      { name: "Marriage Events", percentage: 55, count: 4, revenue: 145000 },
      { name: "Birthday Parties", percentage: 30, count: 3, revenue: 82500 },
      { name: "Corporate Galas", percentage: 15, count: 1, revenue: 25000 }
    ]
  },
  "This Year": {
    revenue: 1850000,
    revenueChange: "+24.8%",
    revenueUp: true,
    bookings: 62,
    bookingsChange: "+18.5%",
    bookingsUp: true,
    clients: 142,
    clientsChange: "+14.1%",
    clientsUp: true,
    vendors: 22,
    chartRevenue: [120000, 145000, 180000, 210000, 195000, 240000],
    categoryShare: [
      { name: "Marriage Events", percentage: 60, count: 38, revenue: 1110000 },
      { name: "Corporate Galas", percentage: 25, count: 15, revenue: 462500 },
      { name: "Birthday Parties", percentage: 15, count: 9, revenue: 277500 }
    ]
  }
};

const ReportsAnalytics = () => {
  const [timeframe, setTimeframe] = useState("This Month");
  const [data, setData] = useState(TIMEFRAME_DATA["This Month"]);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle mock dynamic recalculations on timeframe switch
  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(() => {
      setData(TIMEFRAME_DATA[timeframe]);
      setLoading(false);
    }, 450);
    return () => clearTimeout(delay);
  }, [timeframe]);

  // Handle mock report sheet compile trigger
  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Eventura Ledger Report generated successfully! Your download will begin shortly.");
    }, 1500);
  };

  return (
    <AdminLayout>
      {}
      <div className="analyticsPage">
        {/* Module Header Container */}
        <div className="analyticsPage-header">
          <div>
            <h2>Reports & Performance Analytics</h2>
            <p>Trace organizational profitability, operational performance indexes, and service category splits.</p>
          </div>
          
          {/* Timeframe Filters Row */}
          <div className="analyticsPage-actions">
            <div className="timeframe-selector">
              <Filter size={14} className="filter-icon" />
              <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                <option value="This Month">This Month (June 2026)</option>
                <option value="This Year">This Year (2026)</option>
              </select>
            </div>

            <button 
              className={`btn-export ${isExporting ? 'exporting' : ''}`} 
              onClick={handleExportCSV}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="mini-spinner"></div>
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet size={16} />
                  <span>Export Sheet Ledger</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Indicator Overlay for data swapping */}
        {loading ? (
          <div className="analytics-loading-screen">
            <div className="pulse-loader"></div>
            <p>Syncing event balance sheets and analytics nodes...</p>
          </div>
        ) : (
          <>
            {/* KPI Metrics Cards Row */}
            <div className="analytics-kpiGrid">
              {/* Card 1: Revenue Balance */}
              <div className="kpi-card">
                <div className="kpi-icon-wrapper">
                  <DollarSign size={20} className="kpi-icon" />
                </div>
                <div className="kpi-details">
                  <span className="kpi-title">Gross Revenue Received</span>
                  <h3 className="kpi-value">₹{data.revenue.toLocaleString()}</h3>
                  <div className={`kpi-change ${data.revenueUp ? 'up' : 'down'}`}>
                    {data.revenueUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{data.revenueChange} relative trend</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Event Count */}
              <div className="kpi-card">
                <div className="kpi-icon-wrapper">
                  <Calendar size={20} className="kpi-icon" />
                </div>
                <div className="kpi-details">
                  <span className="kpi-title">Bookings Conducted</span>
                  <h3 className="kpi-value">{data.bookings} Events</h3>
                  <div className={`kpi-change ${data.bookingsUp ? 'up' : 'down'}`}>
                    {data.bookingsUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{data.bookingsChange} active volume</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Active Client Database */}
              <div className="kpi-card">
                <div className="kpi-icon-wrapper">
                  <Users size={20} className="kpi-icon" />
                </div>
                <div className="kpi-details">
                  <span className="kpi-title">Active Consumers</span>
                  <h3 className="kpi-value">{data.clients} Members</h3>
                  <div className={`kpi-change ${data.clientsUp ? 'up' : 'down'}`}>
                    {data.clientsUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{data.clientsChange} subscriber growth</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Vendor Pool Network */}
              <div className="kpi-card">
                <div className="kpi-icon-wrapper">
                  <Layers size={20} className="kpi-icon" />
                </div>
                <div className="kpi-details">
                  <span className="kpi-title">Active Service Partners</span>
                  <h3 className="kpi-value">{data.vendors} Agencies</h3>
                  <div className="kpi-change up">
                    <TrendingUp size={14} />
                    <span>Steady partner pool</span>
                  </div>
                </div>
              </div>
            </div>

            {}
            {/* Main Visualizations Grid */}
            <div className="analytics-visualsGrid">
              {/* Chart Panel 1: Pure CSS bar graphs */}
              <div className="chart-panel card-bg">
                <div className="panel-header">
                  <h4>Revenue Inflow Curve</h4>
                  <span>Trend History (Recent Cycles)</span>
                </div>
                <div className="panel-body">
                  <div className="bar-chart-container">
                    {data.chartRevenue.map((val, idx) => {
                      const maxVal = Math.max(...data.chartRevenue);
                      const barPercentage = (val / maxVal) * 85; // capped below max scale top
                      return (
                        <div className="chart-bar-group" key={idx}>
                          <div className="bar-value-tooltip">₹{(val/1000).toFixed(0)}k</div>
                          <div className="chart-bar-wrapper">
                            <div className="chart-bar-fill" style={{ height: `${barPercentage}%` }}></div>
                          </div>
                          <span className="chart-bar-label">Cycle {idx + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chart Panel 2: Popular Service Category Progress Meters */}
              <div className="chart-panel card-bg">
                <div className="panel-header">
                  <h4>Category Conversion Split</h4>
                  <span>Revenue generation by market niche</span>
                </div>
                <div className="panel-body">
                  <div className="progress-metrics-list">
                    {data.categoryShare.map((category, idx) => (
                      <div className="progress-metric-item" key={idx}>
                        <div className="metric-label-row">
                          <strong>{category.name}</strong>
                          <span>₹{category.revenue.toLocaleString()} ({category.percentage}%)</span>
                        </div>
                        <div className="gauge-track">
                          <div className="gauge-fill" style={{ width: `${category.percentage}%` }}></div>
                        </div>
                        <small className="metric-detail-lbl">Total associated: {category.count} active reservations</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {}
            {/* Top performing audit table summary */}
            <div className="performance-summary-panel card-bg">
              <div className="panel-header">
                <h4>Top Event Allocations</h4>
                <p>Leading events based on client reviews, vendor integration limits, and cash turnover.</p>
              </div>
              <table className="performance-table">
                <thead>
                  <tr>
                    <th>Event Category ID</th>
                    <th>Niche Sub-type</th>
                    <th>Average Event Volume</th>
                    <th>Operational Margin</th>
                    <th>Quality Index Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CAT-MAR-01</td>
                    <td>Royal & Heritage Weddings</td>
                    <td>24 Events / Year</td>
                    <td className="gold-text">68% Profitability Margin</td>
                    <td>⭐️ 4.9 / 5.0 (Excellent)</td>
                  </tr>
                  <tr>
                    <td>CAT-BTH-02</td>
                    <td>Kids & Teen Birthday Celebrations</td>
                    <td>14 Events / Year</td>
                    <td className="gold-text">42% Profitability Margin</td>
                    <td>⭐️ 4.7 / 5.0 (Very Good)</td>
                  </tr>
                  <tr>
                    <td>CAT-COR-03</td>
                    <td>Corporate Conclaves & Galas</td>
                    <td>8 Events / Year</td>
                    <td className="gold-text">54% Profitability Margin</td>
                    <td>⭐️ 4.5 / 5.0 (Standard)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
       
      </div>
    </AdminLayout>
  );
};

export default ReportsAnalytics;