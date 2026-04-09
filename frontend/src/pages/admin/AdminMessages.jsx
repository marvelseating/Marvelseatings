import { useState, useEffect } from 'react';
import { HiMail, HiPhone, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getContactMessages, markContactRead } from '../../utils/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getContactMessages().then(res => setMessages(res.data.data)).finally(() => setLoading(false));
  }, []);

  const handleRead = async id => {
    try {
      await markContactRead(id);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-800">Contact Messages</h2>
        <p className="text-gray-500 text-sm">{messages.filter(m => !m.isRead).length} unread</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">No messages yet</div>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <div key={msg._id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${!msg.isRead ? 'border-brand/30' : 'border-gray-100'}`}>
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => { setExpanded(expanded === msg._id ? null : msg._id); if (!msg.isRead) handleRead(msg._id); }}>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${msg.isRead ? 'bg-gray-300' : 'bg-brand'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800">{msg.name}</div>
                  <div className="text-gray-400 text-sm truncate">{msg.subject || msg.message?.slice(0, 60)}</div>
                </div>
                <span className="text-gray-400 text-xs shrink-0">{new Date(msg.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              {expanded === msg._id && (
                <div className="border-t border-gray-100 px-5 py-4 space-y-2">
                  <div className="flex gap-4 text-sm">
                    <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 text-brand hover:text-accent"><HiMail className="w-4 h-4" />{msg.email}</a>
                    {msg.phone && <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 text-brand hover:text-accent"><HiPhone className="w-4 h-4" />{msg.phone}</a>}
                  </div>
                  {msg.subject && <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Subject: {msg.subject}</p>}
                  <p className="text-gray-600 text-sm leading-relaxed">{msg.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
