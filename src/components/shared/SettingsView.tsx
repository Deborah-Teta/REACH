import React, { useState, useContext } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Eye, 
  Moon, 
  Sun, 
  Monitor,
  Smartphone,
  Lock,
  Mail,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsViewProps {
  theme: 'light' | 'dark' | 'system';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'system'>>;
  profile?: any;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme, profile = {} }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundMode, setSoundMode] = useState<'ring' | 'vibrate' | 'mute'>('ring');
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'notifications' | 'preferences' | 'help'>('profile');

  const wrapperClass = theme === 'dark'
    ? 'bg-zinc-950 text-white'
    : theme === 'system'
      ? 'bg-zinc-100 text-zinc-950'
      : 'bg-white text-zinc-950';

  const cardClass = theme === 'dark'
    ? 'bg-zinc-900 border-zinc-800 text-white'
    : theme === 'system'
      ? 'bg-white border-zinc-300 text-zinc-950'
      : 'bg-white border-zinc-200 text-zinc-950';

  const sectionCardClass = `${cardClass} rounded-[2.5rem] border p-8 shadow-sm`;
  
  const getTextColor = (level: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
    if (theme === 'dark') {
      return level === 'primary' ? 'text-white' : level === 'secondary' ? 'text-zinc-400' : 'text-zinc-500';
    } else if (theme === 'system') {
      return level === 'primary' ? 'text-zinc-950' : level === 'secondary' ? 'text-zinc-600' : 'text-zinc-500';
    } else {
      return level === 'primary' ? 'text-zinc-950' : level === 'secondary' ? 'text-zinc-600' : 'text-zinc-500';
    }
  };

  const getBgColor = (variant: 'sidebar' | 'input' | 'hover' = 'input') => {
    if (theme === 'dark') {
      return variant === 'sidebar' ? 'bg-zinc-800' : variant === 'input' ? 'bg-zinc-800' : 'bg-zinc-800';
    } else if (theme === 'system') {
      return variant === 'sidebar' ? 'bg-zinc-200' : variant === 'input' ? 'bg-zinc-100' : 'bg-zinc-100';
    } else {
      return variant === 'sidebar' ? 'bg-zinc-50' : variant === 'input' ? 'bg-zinc-50' : 'bg-emerald-50';
    }
  };

  const getBorderColor = (theme: string) => {
    if (theme === 'dark') return 'border-zinc-700';
    if (theme === 'system') return 'border-zinc-300';
    return 'border-zinc-200';
  };

  const navItems = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ] as const;

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`${wrapperClass} max-w-5xl mx-auto space-y-10 pb-20`}> 
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${getTextColor('primary')}`}>Account Settings</h2>
          <p className={getTextColor('secondary')}>Manage your profile, preferences, and notifications.</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeSection === item.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : `${getBgColor('hover')} ${getTextColor('secondary')} hover:${theme === 'dark' ? 'bg-zinc-700' : theme === 'system' ? 'bg-zinc-200' : 'bg-white dark:bg-zinc-800'}`}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </div>
              <ChevronRight size={18} opacity={activeSection === item.id ? 1 : 0.5} />
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className={sectionCardClass}>
            {activeSection === 'profile' && (
              <>
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
                  <div>
                    <h3 className={`text-2xl font-bold ${getTextColor('primary')}`}>Profile Info</h3>
                    <p className={`${getTextColor('secondary')} mt-2`}>Update your name, email, and appearance settings.</p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-6">
                    <div className={`rounded-3xl border ${getBorderColor(theme)} ${getBgColor('input')} p-6`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold uppercase">
                          {profile?.fullName?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <h4 className={`font-bold text-xl ${getTextColor('primary')}`}>{profile?.fullName || 'User'}</h4>
                          <p className={`text-sm ${getTextColor('secondary')}`}>{profile?.role || 'User'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Full Name</label>
                          <input type="text" defaultValue={profile?.fullName || ''} className={`mt-2 w-full rounded-3xl border ${getBorderColor(theme)} ${getBgColor('input')} px-4 py-3 text-sm ${getTextColor('primary')}`} />
                        </div>
                        <div>
                          <label className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Email Address</label>
                          <input type="email" defaultValue={profile?.email || 'alex.j@reach.com'} readOnly className={`mt-2 w-full rounded-3xl border ${getBorderColor(theme)} ${getBgColor('input')} px-4 py-3 text-sm ${getTextColor('primary')}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-3xl border ${getBorderColor(theme)} ${getBgColor('input')} p-6`}>
                    <h4 className={`font-bold text-lg ${getTextColor('primary')} mb-4`}>Visual Theme</h4>
                    <p className={`text-sm ${getTextColor('secondary')} mb-6`}>Choose a theme for your settings page display.</p>
                    <div className={`flex items-center gap-3 ${theme === 'dark' ? 'bg-zinc-800' : theme === 'system' ? 'bg-zinc-200' : 'bg-emerald-50'} p-2 rounded-3xl`}>
                      {[
                        { id: 'light', icon: Sun, label: 'Light' },
                        { id: 'dark', icon: Moon, label: 'Dark' },
                        { id: 'system', icon: Monitor, label: 'System' }
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id as 'light' | 'dark' | 'system')}
                          className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${theme === option.id ? 'border-emerald-600 bg-white text-emerald-700 shadow-sm' : `border-transparent ${getTextColor('secondary')}`}`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <option.icon size={18} />
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className={`mt-5 text-sm ${getTextColor('secondary')}`}>Light mode uses a bright white background with dark text. System mode uses a soft off-white with matching text.</p>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'security' && (
              <>
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className={`text-2xl font-bold ${getTextColor('primary')}`}>Security</h3>
                    <p className={`${getTextColor('secondary')} mt-2`}>Manage login options and account protection.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className={`rounded-3xl border ${getBorderColor(theme)} ${getBgColor('input')} p-6`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={`text-sm font-bold ${getTextColor('primary')}`}>Change Password</p>
                        <p className={`text-xs ${getTextColor('secondary')}`}>Update your account password securely.</p>
                      </div>
                      <button className={`rounded-2xl border border-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700`}>Update</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
