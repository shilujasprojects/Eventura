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
import { toast, ToastContainer } from 'react-toastify';
import AdminLayout from '../../Pages/Admin/Layout/AdminLayout';
import './Reports.css'

const API_BASE_URL = 'http://localhost:5000/api';

// Turns a preset name into an actual { start, end } date range.
// This is the piece that makes "Last Month" / "Last Year" possible —
// the backend doesn't know about presets at all, it just gets two dates.
function getRangeForPreset(preset, customStart, customEnd) {
  const now = new Date();

  switch (preset) {
    case "Last Month":
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0),
      };
    case "This Year":
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31),
      };
    case "Last Year":
      return {
        start: new Date(now.getFullYear() - 1, 0, 1),
        end: new Date(now.getFullYear() - 1, 11, 31),
      };
    case "Custom Range":
      return {
        start: customStart ? new Date(customStart) : new Date(now.getFullYear(), now.getMonth(), 1),
        end: customEnd ? new Date(customEnd) : now,
      };
    case "This Month":
    default:
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
  }
}

// Formats a Date as YYYY-MM-DD using its LOCAL date parts.
// (date.toISOString() converts to UTC first, which shifts the day
// backwards for anyone in a timezone ahead of UTC — e.g. IST — so
// "Aug 1st" was turning into "07-31". This avoids that.)
const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ReportsAnalytics = () => {
  const [preset, setPreset] = useState("This Month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const { start, end } = getRangeForPreset(preset, customStart, customEnd);
  const startParam = toDateInputValue(start);
  const endParam = toDateInputValue(end);

  // For "Custom Range", wait until both dates are picked before fetching
  const isCustomIncomplete = preset === "Custom Range" && (!customStart || !customEnd);

  useEffect(() => {
    if (isCustomIncomplete) return;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/reports?startDate=${startParam}&endDate=${endParam}`
        );
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load reports");
        }

        setData(result.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error(err.message || "Couldn't load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startParam, endParam, isCustomIncomplete]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/reports/export?startDate=${startParam}&endDate=${endParam}`
      );

      const contentType = res.headers.get('content-type') || '';

      // If the backend hit an error, it responds with JSON, not a
      // spreadsheet. Catch that here instead of saving the error
      // message as a fake ".xlsx" file.
      if (!res.ok || contentType.includes('application/json')) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || "Failed to generate the report file");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `eventura-report-${startParam}-to-${endParam}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminLayout>
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
              <select value={preset} onChange={(e) => setPreset(e.target.value)}>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="This Year">This Year</option>
                <option value="Last Year">Last Year</option>
                <option value="Custom Range">Custom Range</option>
              </select>
            </div>

            {preset === "Custom Range" && (
              <div className="custom-range-picker">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
                <span>to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </div>
            )}

            <button
              className={`btn-export ${isExporting ? 'exporting' : ''}`}
              onClick={handleExportExcel}
              disabled={isExporting || loading || !data || isCustomIncomplete}
            >
              {isExporting ? (
                <>
                  <div className="mini-spinner"></div>
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet size={16} />
                  <span>Export Excel Sheet</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom range not yet picked */}
        {isCustomIncomplete && (
          <div className="analytics-loading-screen">
            <p>Pick a start and end date to load the report.</p>
          </div>
        )}

        {/* Loading state */}
        {!isCustomIncomplete && loading && (
          <div className="analytics-loading-screen">
            <div className="pulse-loader"></div>
            <p>Syncing event balance sheets and analytics nodes...</p>
          </div>
        )}

        {/* Error state */}
        {!isCustomIncomplete && !loading && error && (
          <div className="analytics-loading-screen">
            <p>Couldn't load report data. {error}</p>
          </div>
        )}

        {/* Loaded state */}
        {!isCustomIncomplete && !loading && !error && data && (
          <>
            <div className="analytics-kpiGrid">
              <div className="kpi-card">
                <div className="kpi-icon-wrapper">
                  <DollarSign size={20} className="kpi-icon" />
                </div>
                <div className="kpi-details">
                  <span className="kpi-title">Gross Revenue Received</span>
                  <h3 className="kpi-value">₹{data.revenue.toLocaleString()}</h3>
                  <div className={`kpi-change ${data.revenueUp ? 'up' : 'down'}`}>
                    {data.revenueUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{data.revenueChange} vs previous period</span>
                  </div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrapper">
                  <Calendar size={20} className="kpi-icon" />
                </div>
                <div className="kpi-details">
                  <span className="kpi-title">Bookings Conducted</span>
                  <h3 className="kpi-value">{data.bookings} Events</h3>
                  <div className={`kpi-change ${data.bookingsUp ? 'up' : 'down'}`}>
                    {data.bookingsUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{data.bookingsChange} vs previous period</span>
                  </div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrapper">
                  <Users size={20} className="kpi-icon" />
                </div>
                <div className="kpi-details">
                  <span className="kpi-title">New Clients</span>
                  <h3 className="kpi-value">{data.clients} Members</h3>
                  <div className={`kpi-change ${data.clientsUp ? 'up' : 'down'}`}>
                    {data.clientsUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{data.clientsChange} vs previous period</span>
                  </div>
                </div>
              </div>

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

            <div className="analytics-visualsGrid">
              <div className="chart-panel card-bg">
                <div className="panel-header">
                  <h4>Revenue Inflow Curve</h4>
                  <span>{data.rangeLabel}</span>
                </div>
                <div className="panel-body">
                  {data.chartRevenue.every((point) => point.value === 0) ? (
                    <p className="empty-state-text">No revenue recorded for this period yet.</p>
                  ) : (
                    <div className="bar-chart-container">
                      {data.chartRevenue.map((point, idx) => {
                        const maxVal = Math.max(...data.chartRevenue.map((p) => p.value), 1);
                        const barPercentage = (point.value / maxVal) * 85;
                        return (
                          <div className="chart-bar-group" key={idx}>
                            <div className="bar-value-tooltip">₹{(point.value / 1000).toFixed(0)}k</div>
                            <div className="chart-bar-wrapper">
                              <div className="chart-bar-fill" style={{ height: `${barPercentage}%` }}></div>
                            </div>
                            <span className="chart-bar-label">{point.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="chart-panel card-bg">
                <div className="panel-header">
                  <h4>Category Conversion Split</h4>
                  <span>Revenue generation by market niche</span>
                </div>
                <div className="panel-body">
                  {data.categoryShare.length === 0 ? (
                    <p className="empty-state-text">No bookings in this period yet.</p>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>

            <div className="performance-summary-panel card-bg">
              <div className="panel-header">
                <h4>Top Event Categories</h4>
                <p>All-time performance ranked by total revenue generated.</p>
              </div>
              {data.topCategories.length === 0 ? (
                <p className="empty-state-text">No booking history yet.</p>
              ) : (
                <table className="performance-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Bookings</th>
                      <th>Total Revenue</th>
                      <th>Avg Booking Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topCategories.map((cat, idx) => (
                      <tr key={idx}>
                        <td data-label="Category">{cat.categoryName}</td>
                        <td data-label="Total Bookings">{cat.totalBookings}</td>
                        <td data-label="Total Revenue" className="gold-text">₹{cat.totalRevenue.toLocaleString()}</td>
                        <td data-label="Avg Booking Value">₹{cat.avgBookingValue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000}  />
    </AdminLayout>
  );
};

export default ReportsAnalytics;