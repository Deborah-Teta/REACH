import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle,
  MessageCircle,
  Plus,
  Paperclip,
  Smile,
  MoreVertical,
  User,
  ArrowLeft
} from 'lucide-react';

interface MessageItem {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'approved' | 'rejected' | 'pending';
  lastMessage: string;
  time: string;
  unread: boolean;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Bruce Wayne', email: 'bruce.wayne@wayne.com', company: 'Wayne Enterprises', status: 'approved', lastMessage: 'The funding has been cleared on our end. Looking forward to the next steps.', time: '10:45 AM', unread: true },
  { id: '2', name: 'Sarah Connor', email: 'sarah.connor@cyberdyne.com', company: 'Cyberdyne Systems', status: 'pending', lastMessage: 'Quick question about the TIN verification process.', time: 'Yesterday', unread: false },
  { id: '3', name: 'Tony Stark', email: 'tony.stark@starkindustries.com', company: 'Stark Industries', status: 'pending', lastMessage: 'Let me know if you need any more technical specs.', time: 'Tuesday', unread: false },
  { id: '4', name: 'Peter Parker', email: 'peter.parker@dailybugle.com', company: 'Daily Bugle', status: 'rejected', lastMessage: 'Thank you for the update, although it is disappointing news.', time: '2 Days ago', unread: false },
  { id: '5', name: 'Diana Prince', email: 'diana.prince@themyscira.com', company: 'Themyscira Antiques', status: 'pending', lastMessage: 'Sent over the revised proposal as requested.', time: 'Monday', unread: false },
];

export const MessagesView: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(mockContacts[0]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected'>('all');
  const [conversations, setConversations] = useState<Record<string, MessageItem[]>>({
    '1': [
      { id: 'm1', from: 'them', text: 'The funding has been cleared on our end. Looking forward to the next steps.', time: '10:45 AM' },
      { id: 'm2', from: 'me', text: 'Great, I have approved the final documents.', time: '10:52 AM' }
    ],
    '2': [
      { id: 'm3', from: 'them', text: 'Quick question about the TIN verification process.', time: 'Yesterday' }
    ],
    '3': [
      { id: 'm4', from: 'them', text: 'Let me know if you need any more technical specs.', time: 'Tuesday' }
    ],
    '4': [
      { id: 'm5', from: 'them', text: 'Thank you for the update, although it is disappointing news.', time: '2 Days ago' }
    ],
    '5': [
      { id: 'm6', from: 'them', text: 'Sent over the revised proposal as requested.', time: 'Monday' }
    ],
  });

  const filteredContacts = mockContacts.filter(c => filter === 'all' || c.status === filter);

  const handleSendMessage = () => {
    if (!selectedContact || !message.trim()) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setConversations(prev => ({
      ...prev,
      [selectedContact.id]: [
        ...(prev[selectedContact.id] ?? []),
        { id: `sent-${Date.now()}`, from: 'me', text: message.trim(), time: formattedTime }
      ]
    }));

    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-8">
      {/* Sidebar / Contact List */}
      <div className="w-[380px] flex flex-col bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-emerald-50 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Conversations</h3>
            <button className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100 transition-transform hover:scale-110 active:scale-95">
              <Plus size={18} />
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/50" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..."
              className="w-full bg-emerald-50/50 dark:bg-zinc-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-2 p-1 bg-emerald-50/50 dark:bg-zinc-800/50 rounded-xl">
            {(['all', 'approved', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === f ? 'bg-white dark:bg-zinc-700 text-emerald-600 shadow-sm' : 'text-zinc-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredContacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 rounded-2xl text-left flex gap-3 transition-all ${
                selectedContact?.id === contact.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 dark:shadow-none' : 'hover:bg-emerald-50 dark:hover:bg-zinc-800'
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  selectedContact?.id === contact.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600'
                }`}>
                  {contact.name.charAt(0)}
                </div>
                {contact.unread && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold truncate text-sm">{contact.name}</h4>
                  <span className={`text-[10px] ${selectedContact?.id === contact.id ? 'text-emerald-100' : 'text-zinc-400'}`}>{contact.time}</span>
                </div>
                <p className={`text-xs truncate font-medium mt-0.5 ${selectedContact?.id === contact.id ? 'text-emerald-50' : 'text-zinc-500'}`}>
                  {contact.lastMessage}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  {contact.status === 'approved' ? <CheckCircle2 size={12} className={selectedContact?.id === contact.id ? 'text-emerald-200' : 'text-emerald-600'} /> :
                   contact.status === 'rejected' ? <XCircle size={12} className={selectedContact?.id === contact.id ? 'text-rose-200' : 'text-rose-500'} /> :
                   <MessageCircle size={12} className={selectedContact?.id === contact.id ? 'text-amber-200' : 'text-amber-500'} />}
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedContact?.id === contact.id ? 'text-emerald-200' : 'text-emerald-600/70'}`}>
                    {contact.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 dark:shadow-none overflow-hidden relative">
        {selectedContact ? (
          <>
            {/* Chat Topbar */}
            <div className="p-6 border-b border-emerald-50 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button className="xl:hidden p-2 rounded-lg hover:bg-emerald-50">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 dark:text-emerald-50">{selectedContact.name}</h3>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{selectedContact.email}</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{selectedContact.company}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl hover:bg-emerald-50 text-emerald-600">
                  <Filter size={20} />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-emerald-50 text-emerald-600">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-emerald-50/20 dark:bg-zinc-950/20">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-emerald-900/30 dark:text-emerald-100/30 uppercase tracking-[0.2em] mb-4">Email Conversation</span>
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-6 border-t border-emerald-50 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-xl text-emerald-600 hover:bg-emerald-50">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 bg-emerald-50/50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="p-2.5 rounded-xl text-emerald-600 hover:bg-emerald-50">
                  <Smile size={20} />
                </button>
                <button 
                  onClick={handleSendMessage}
                  className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

