import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Table, 
  Filter, 
  Calendar,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FileIcon
} from 'lucide-react';

const mockReports = [
  { id: 'R-001', name: 'May Funding Summary', type: 'PDF', date: '2024-05-01', size: '2.4 MB', status: 'ready' },
  { id: 'R-002', name: 'Business Loan Breakdown', type: 'EXCEL', date: '2024-04-28', size: '1.1 MB', status: 'ready' },
  { id: 'R-003', name: 'Rejected Applications Audit', type: 'CSV', date: '2024-04-25', size: '450 KB', status: 'ready' },
  { id: 'R-004', name: 'Quarterly Risk Assessment', type: 'PDF', date: '2024-04-15', size: '5.8 MB', status: 'ready' },
];

const mockRecentActivity = [
  { id: '1', applicant: 'Bruce Wayne', company: 'Wayne Enterprises', amount: '$1.2M', status: 'approved', date: 'Just now' },
  { id: '2', applicant: 'Peter Parker', company: 'Daily Bugle', amount: '$5,000', status: 'rejected', date: '2 hours ago' },
  { id: '3', applicant: 'Sarah Connor', company: 'Cyberdyne', amount: '$75,000', status: 'approved', date: 'Yesterday' },
];

export const ReportsView: React.FC<{ theme: 'light' | 'dark' | 'system' }> = ({ theme }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeExportMenu, setActiveExportMenu] = useState<string | null>(null);

  const getCardClass = () => {
    if (theme === 'dark') return 'bg-zinc-900 border-zinc-800 text-white';
    if (theme === 'system') return 'bg-white border-zinc-300 text-zinc-950';
    return 'bg-white border-zinc-200 text-zinc-950';
  };

  const getTextColor = (level: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
    if (theme === 'dark') {
      return level === 'primary' ? 'text-white' : level === 'secondary' ? 'text-zinc-400' : 'text-zinc-500';
    } else if (theme === 'system') {
      return level === 'primary' ? 'text-zinc-950' : level === 'secondary' ? 'text-zinc-600' : 'text-zinc-500';
    } else {
      return level === 'primary' ? 'text-zinc-950' : level === 'secondary' ? 'text-zinc-600' : 'text-zinc-500';
    }
  };

  const getBgColor = (variant: 'input' | 'hover' = 'input') => {
    if (theme === 'dark') {
      return variant === 'input' ? 'bg-zinc-800' : 'bg-zinc-800';
    } else if (theme === 'system') {
      return variant === 'input' ? 'bg-zinc-100' : 'bg-zinc-100';
    } else {
      return variant === 'input' ? 'bg-zinc-50' : 'bg-emerald-50';
    }
  };

  const handleExport = (reportName: string, type?: string) => {
    setActiveExportMenu(null);
    setIsExporting(true);
    const exportType = type ?? reportName;
    const reportLabel = type ? reportName : 'All Reports';

    setTimeout(() => {
      setIsExporting(false);
      alert(`${reportLabel} ${exportType} export completed successfully! Check your downloads.`);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-3xl font-bold ${getTextColor('primary')}`}>Reports & Analytics</h2>
          <p className={`${getTextColor('secondary')} mt-1`}>Export your reviewed loan data into professional formats.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 p-1 rounded-2xl ${getBgColor('input')}`}>
            <button 
              onClick={() => handleExport('PDF')}
              disabled={isExporting}
              className={`px-4 py-2 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-white'} text-emerald-600 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2 hover:bg-emerald-50 transition-all disabled:opacity-50`}
            >
              <FileIcon size={16} /> PDF
            </button>
            <button 
              onClick={() => handleExport('Excel')}
              disabled={isExporting}
              className={`px-4 py-2 ${getTextColor('secondary')} text-sm font-bold flex items-center gap-2 hover:${theme === 'dark' ? 'bg-zinc-700' : 'bg-white'} rounded-xl transition-all disabled:opacity-50`}
            >
              <FileSpreadsheet size={16} /> Excel
            </button>
            <button 
              onClick={() => handleExport('CSV')}
              disabled={isExporting}
              className={`px-4 py-2 ${getTextColor('secondary')} text-sm font-bold flex items-center gap-2 hover:${theme === 'dark' ? 'bg-zinc-700' : 'bg-white'} rounded-xl transition-all disabled:opacity-50`}
            >
              <Table size={16} /> CSV
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Reports List */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`${getCardClass()} rounded-[2.5rem] shadow-sm overflow-hidden`}>
            <div className={`p-8 border-b ${theme === 'dark' ? 'border-zinc-800' : 'border-emerald-50'} flex items-center justify-between bg-emerald-950`}>
              <h3 className="font-bold text-xl text-white">Reports</h3>
              <button className="text-white font-bold text-sm hover:text-emerald-200">View All</button>
            </div>
            <div className={`divide-y ${theme === 'dark' ? 'divide-zinc-800' : 'divide-emerald-50'}`}>
              {mockReports.map(report => (
                <div key={report.id} className={`relative p-6 hover:${theme === 'dark' ? 'bg-zinc-800/50' : 'bg-emerald-50/50'} transition-colors flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${
                      report.type === 'PDF' ? 'bg-rose-50 text-rose-500' : 
                      report.type === 'EXCEL' ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                      {report.type === 'PDF' ? <FileText size={24} /> : report.type === 'EXCEL' ? <FileSpreadsheet size={24} /> : <Table size={24} />}
                    </div>
                    <div>
                      <h4 className={`font-bold ${getTextColor('primary')}`}>{report.name}</h4>
                      <p className={`text-xs ${getTextColor('tertiary')} font-medium`}>{report.date} • {report.size}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveExportMenu(prev => prev === report.id ? null : report.id)}
                      className={`p-3 ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-emerald-100'} border rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm`}
                    >
                      <Download size={20} />
                    </button>
                    {activeExportMenu === report.id && (
                      <div className={`absolute right-0 top-full mt-2 w-40 rounded-[1.5rem] ${getCardClass()} border shadow-2xl z-20 overflow-hidden ${theme === 'dark' ? 'border-zinc-700' : 'border-emerald-100'}`}>
                        {['PDF', 'CSV', 'DOCX'].map(type => (
                          <button
                            key={type}
                            onClick={() => handleExport(report.name, type)}
                            className={`w-full text-left px-4 py-3 text-sm font-semibold ${getTextColor('primary')} hover:${theme === 'dark' ? 'bg-zinc-800' : 'bg-emerald-50'} transition`}
                          >
                            Download {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Mini-table */}
        <div className="space-y-6">
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-200 dark:shadow-none">
            <CheckCircle2 className="absolute -right-6 -top-6 w-32 h-32 opacity-10" />
            <h3 className="font-bold text-xl mb-2 relative z-10">Real-time Sync</h3>
            <p className="text-emerald-100 text-sm mb-6 relative z-10">Your report data updates instantly as you approve or reject loans.</p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Last Sync</span>
              <p className="font-bold text-lg">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className={`${getCardClass()} rounded-[2.5rem] shadow-sm p-8`}>
            <h3 className={`font-bold text-xl mb-6 ${getTextColor('primary')}`}>Recent Activities</h3>
            <div className="space-y-6">
              {mockRecentActivity.map(activity => (
                <div key={activity.id} className={`flex items-center justify-between border-b ${theme === 'dark' ? 'border-zinc-800' : 'border-emerald-50'} pb-4 last:border-b-0 last:pb-0`}>
                  <div>
                    <h4 className={`font-bold text-sm ${getTextColor('primary')}`}>{activity.applicant}</h4>
                    <p className={`text-xs ${getTextColor('tertiary')}`}>{activity.company}</p>
                    <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase ${
                      activity.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {activity.status === 'approved' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      {activity.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-sm">{activity.amount}</p>
                    <p className={`text-[10px] ${getTextColor('tertiary')} mt-1`}>{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className={`w-full mt-8 py-3 text-emerald-600 text-sm font-bold border-2 border-dashed border-emerald-100 rounded-2xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2`}>
               View All History <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
