import React from 'react';
import { 
  LayoutDashboard, Calendar, Users, Briefcase, UserCheck, 
  CreditCard, BarChart3, Settings, Search, Bell, Plus, 
  MoreVertical, Star, TrendingUp 
} from 'lucide-react';

const Admin = () => {
  const colors = {
    navyBg: "#061521",
    cardBg: "#0d2131",
    gold: "#f1d49b",
    textCream: "#fff7ee",
    textMuted: "#8a9ba8"
  };

  return (
    <div className="d-flex" style={{ backgroundColor: colors.navyBg, minHeight: "100vh", color: colors.textCream }}>
      {/* Custom Global CSS */}
      <style>{`
        .sidebar { width: 260px; border-right: 1px solid rgba(241, 212, 155, 0.1); }
        .nav-item-custom { padding: 10px 20px; color: ${colors.textMuted}; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 12px; font-size: 0.95rem; }
        .nav-item-custom:hover, .nav-item-active { color: ${colors.gold}; background: linear-gradient(90deg, rgba(241,212,155,0.1) 0%, transparent 100%); border-left: 3px solid ${colors.gold}; }
        .glass-card { background: ${colors.cardBg}; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; }
        .btn-gold { background: ${colors.gold}; color: #000; border: none; font-weight: 600; padding: 8px 16px; border-radius: 8px; }
        .type-pill { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; background: rgba(255,255,255,0.05); }
        .progress-bar-gold { background-color: ${colors.gold}; height: 6px; border-radius: 10px; }
        .table { --bs-table-bg: transparent; --bs-table-color: ${colors.textCream}; }
        .status-dot { height: 8px; width: 8px; border-radius: 50%; display: inline-block; margin-right: 8px; }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar d-flex flex-column p-3">
        <div className="d-flex align-items-center gap-2 mb-5 px-3">
          <div style={{ backgroundColor: colors.gold, color: colors.navyBg, padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold' }}>E</div>
          <h4 className="mb-0 fw-bold" style={{ color: colors.gold, letterSpacing: '1px' }}>Eventura</h4>
        </div>

        <small className="text-uppercase opacity-50 px-3 mb-3" style={{ fontSize: '0.7rem' }}>Main</small>
        <div className="nav-item-custom nav-item-active"><LayoutDashboard size={18}/> Dashboard</div>
        <div className="nav-item-custom d-flex justify-content-between">
          <div className="d-flex align-items-center gap-2"><Calendar size={18}/> All Events</div>
          <span className="badge rounded-pill text-dark" style={{ backgroundColor: colors.gold, fontSize: '0.7rem' }}>12</span>
        </div>
        <div className="nav-item-custom"><Briefcase size={18}/> Bookings</div>
        <div className="nav-item-custom"><Users size={18}/> Clients</div>
        <div className="nav-item-custom mb-4"><Star size={18}/> Services</div>

        <small className="text-uppercase opacity-50 px-3 mb-3" style={{ fontSize: '0.7rem' }}>Management</small>
        <div className="nav-item-custom"><UserCheck size={18}/> Vendors</div>
        <div className="nav-item-custom d-flex justify-content-between">
          <div className="d-flex align-items-center gap-2"><CreditCard size={18}/> Payments</div>
          <span className="badge rounded-pill text-dark" style={{ backgroundColor: colors.gold, fontSize: '0.7rem' }}>3</span>
        </div>
        <div className="nav-item-custom"><BarChart3 size={18}/> Reports</div>
        <div className="nav-item-custom mb-auto"><Settings size={18}/> Settings</div>

        {/* User Profile Footer */}
        <div className="mt-auto d-flex align-items-center gap-3 p-3 border-top border-secondary border-opacity-25">
          <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: colors.gold, color: colors.navyBg, fontWeight: 'bold' }}>AR</div>
          <div>
            <div className="small fw-bold">Arjun Rajan</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Super Admin</div>
          </div>
          <MoreVertical size={16} className="ms-auto text-muted" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Good evening, Arjun ✨</h2>
            <small className="text-muted">Friday, 27 March 2026 • 3 events this week</small>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <input type="text" className="form-control bg-dark border-0 text-white ps-5" placeholder="Search events, clients..." style={{ width: 300, borderRadius: '10px' }} />
              <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            </div>
            <div className="p-2 glass-card rounded-circle"><Bell size={18}/></div>
            <button className="btn btn-gold d-flex align-items-center gap-2"><Plus size={18}/> New Booking</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total bookings', val: '48', growth: '+ 12% this month', icon: <Calendar/> },
            { label: 'Revenue this month', val: '₹8.4L', growth: '↑ 8.3% vs last month', icon: <CreditCard/> },
            { label: 'Active clients', val: '214', growth: '↑ 5 new this week', icon: <Users/> },
            { label: 'Avg. client rating', val: '4.9', growth: '↑ 0.1 this quarter', icon: <Star/> },
          ].map((stat, i) => (
            <div className="col-md-3" key={i}>
              <div className="glass-card">
                <div className="d-flex justify-content-between mb-3">
                  <div className="p-2 rounded" style={{ background: 'rgba(241,212,155,0.1)', color: colors.gold }}>{stat.icon}</div>
                </div>
                <h3 className="fw-bold mb-1">{stat.val}</h3>
                <div className="text-muted small mb-2">{stat.label}</div>
                <div className="small" style={{ color: '#4ade80' }}><TrendingUp size={12}/> {stat.growth}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="row g-4">
          {/* Table Area */}
          <div className="col-lg-8">
            <div className="glass-card h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Upcoming events</h5>
                <small className="text-muted" style={{ cursor: 'pointer' }}>View all →</small>
              </div>
              <table className="table table-hover">
                <thead className="text-muted small">
                  <tr>
                    <th>EVENT</th>
                    <th>TYPE</th>
                    <th>DATE</th>
                    <th>PACKAGE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                  {[
                    { name: 'Priya & Rohan Wedding', type: 'Wedding', date: 'Apr 4, 2026', pkg: 'Royal', status: 'Confirmed', color: '#4ade80' },
                    { name: "Aanya's 1st Birthday", type: 'Birthday', date: 'Apr 9, 2026', pkg: 'Grand', status: 'Confirmed', color: '#4ade80' },
                    { name: 'TechFlow Corp Gala', type: 'Corporate', date: 'Apr 14, 2026', pkg: 'Custom', status: 'Planning', color: '#60a5fa' },
                    { name: 'Meera Baby Shower', type: 'Baby Shower', date: 'Apr 18, 2026', pkg: 'Basic', status: 'Pending', color: '#fbbf24' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="py-3">{row.name}</td>
                      <td className="py-3"><span className="type-pill">{row.type}</span></td>
                      <td className="py-3">{row.date}</td>
                      <td className="py-3">{row.pkg}</td>
                      <td className="py-3">
                        <span className="status-dot" style={{ backgroundColor: row.color }}></span>
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panels */}
          <div className="col-lg-4">
            <div className="glass-card mb-4">
              <h5 className="mb-4">Top services</h5>
              {[
                { name: 'Catering', val: 88 },
                { name: 'Photography', val: 74 },
                { name: 'Decoration', val: 68 },
              ].map((serv, i) => (
                <div className="mb-3" key={i}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{serv.name}</span>
                    <span className="text-muted">{serv.val}%</span>
                  </div>
                  <div className="progress bg-dark" style={{ height: '6px' }}>
                    <div className="progress-bar-gold" style={{ width: `${serv.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card">
              <h5 className="mb-4">Recent activity</h5>
              <div className="small border-start border-secondary border-opacity-25 ps-3 position-relative">
                <div className="mb-3">
                  <div className="fw-bold">Priya & Rohan</div>
                  <div className="text-muted">Confirmed full payment for Royal Wedding package</div>
                  <div className="text-muted x-small opacity-50">2 hours ago</div>
                </div>
                <div>
                  <div className="fw-bold">TechFlow Corp</div>
                  <div className="text-muted">Updated event brief — added 80 extra guests</div>
                  <div className="text-muted x-small opacity-50">Yesterday, 4:32 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;