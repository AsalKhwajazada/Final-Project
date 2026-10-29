import { useState, useEffect, useRef } from 'react';
import { notify } from '../utils/toast';

const INITIAL_CONVERSATIONS = {
  sara: {
    id: 'sara',
    name: 'Sara Ahmadi',
    initials: 'SA',
    color: 'pink',
    status: 'Online now',
    role: 'UI/UX Student',
    unread: true,
    messages: [
      { id: 1, from: 'in', text: 'Hey! How is your UI/UX assignment going?', time: '10:35 AM' },
      { id: 2, from: 'out', text: 'Hi Sara! It’s going well. I’m working on the color hierarchy and spacing now.', time: '10:38 AM' },
      { id: 3, from: 'in', text: 'I shared the color palette with you. Hope this helps! 🎨', time: '10:42 AM' },
      { id: 4, from: 'file', text: 'Mobile-Color-Palette.png', size: '1.8 MB', time: '10:43 AM' },
      { id: 5, from: 'out', text: 'This is perfect, thank you so much! 💜', time: '10:44 AM' }
    ]
  },
  group: {
    id: 'group',
    name: 'Design Study Group',
    initials: 'DG',
    color: 'blue',
    status: '4 members · Group chat',
    role: 'Classroom Group',
    unread: false,
    messages: [
      { id: 1, from: 'in', text: 'Welcome everyone to the Blender 3D group! Feel free to share your WIP models.', time: 'Yesterday' },
      { id: 2, from: 'out', text: 'Excited to learn lighting and texture mapping together.', time: 'Yesterday' },
      { id: 3, from: 'in', text: 'Mina: Great work on the low-poly models everyone! ✨', time: 'Yesterday' }
    ]
  },
  mina: {
    id: 'mina',
    name: 'Mina Rahimi',
    initials: 'MR',
    color: 'purple',
    status: 'Last seen yesterday',
    role: 'Graphic Designer',
    unread: false,
    messages: [
      { id: 1, from: 'in', text: 'I looked at your latest poster draft. The typography scale is much clearer now!', time: 'Yesterday' },
      { id: 2, from: 'out', text: 'Thank you Mina! I followed the grid system from chapter 3.', time: 'Yesterday' }
    ]
  },
  ahmad: {
    id: 'ahmad',
    name: 'Ahmad Noori',
    initials: 'AN',
    color: 'green',
    status: 'Last seen Monday',
    role: 'Motion Student',
    unread: false,
    messages: [
      { id: 1, from: 'in', text: 'Can you share the project brief for next week?', time: 'Monday' },
      { id: 2, from: 'out', text: 'Sure thing, you can download it directly from the Assignments tab!', time: 'Monday' }
    ]
  }
};

export default function StudentChatPage() {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('gdh-student-chat-conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CONVERSATIONS;
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeChatId, setActiveChatId] = useState('sara');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'unread'
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showMobileThread, setShowMobileThread] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('gdh-student-chat-conversations', JSON.stringify(conversations));
  }, [conversations]);

  const activeChat = conversations[activeChatId] || conversations.sara;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, activeChatId]);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setShowMobileThread(true);
    // Mark as read
    if (conversations[chatId]?.unread) {
      setConversations(prev => ({
        ...prev,
        [chatId]: { ...prev[chatId], unread: false }
      }));
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: Date.now(),
      from: 'out',
      text: inputText.trim(),
      time: timeString
    };

    setConversations(prev => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        messages: [...prev[activeChatId].messages, newMsg]
      }
    }));

    setInputText('');
  };

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  const handleAttach = () => {
    notify('File upload simulated: "Project_Wireframe_v2.fig" attached.', 'info');
  };

  const conversationList = Object.values(conversations).filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterTab === 'all' || (filterTab === 'unread' && c.unread);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`student-chat-layout ${showMobileThread ? 'mobile-show-thread' : 'mobile-show-contacts'}`}>
      {/* Sidebar: Conversations List */}
      <aside className="chat-contacts-pane">
        <div className="contacts-header">
          <div className="contacts-title-row">
            <h2>Messages</h2>
            <button 
              type="button" 
              className="new-chat-btn"
              onClick={() => notify('Start a new direct message with any student from your classes.')}
              title="New message"
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>

          <div className="contacts-search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="contacts-tab-filter">
            <button 
              type="button" 
              className={`filter-pill ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              All Messages
            </button>
            <button 
              type="button" 
              className={`filter-pill ${filterTab === 'unread' ? 'active' : ''}`}
              onClick={() => setFilterTab('unread')}
            >
              Unread
            </button>
          </div>
        </div>

        <div className="contacts-list">
          {conversationList.map((chat) => (
            <div
              key={chat.id}
              className={`contact-item ${chat.id === activeChatId ? 'active' : ''}`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className={`contact-avatar bg-${chat.color}`}>
                {chat.initials}
                {chat.status.includes('Online') && <span className="online-dot"></span>}
              </div>
              <div className="contact-info">
                <div className="contact-name-row">
                  <strong>{chat.name}</strong>
                  <span className="contact-time">
                    {chat.messages[chat.messages.length - 1]?.time}
                  </span>
                </div>
                <p className="contact-last-msg">
                  {chat.messages[chat.messages.length - 1]?.text}
                </p>
              </div>
              {chat.unread && <span className="unread-badge"></span>}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Conversation Area */}
      <section className="chat-main-area">
        {/* Active Contact Header */}
        <div className="chat-thread-header">
          <div className="thread-user-info">
            <button 
              type="button" 
              className="mobile-back-chat-btn"
              onClick={() => setShowMobileThread(false)}
              title="Back to messages"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className={`contact-avatar bg-${activeChat.color}`}>
              {activeChat.initials}
            </div>
            <div>
              <h3>{activeChat.name}</h3>
              <p className="thread-user-status">
                <i className="fa-solid fa-circle text-success"></i> {activeChat.status} · {activeChat.role}
              </p>
            </div>
          </div>

          <div className="thread-header-actions">
            <button 
              type="button" 
              className="chat-header-btn"
              onClick={() => notify('Starting voice room with ' + activeChat.name)}
              title="Voice call"
            >
              <i className="fa-solid fa-phone"></i>
            </button>
            <button 
              type="button" 
              className="chat-header-btn"
              onClick={() => notify('Starting video share session with ' + activeChat.name)}
              title="Video call"
            >
              <i className="fa-solid fa-video"></i>
            </button>
            <button 
              type="button" 
              className="chat-header-btn"
              onClick={() => {
                setIsMuted(!isMuted);
                notify(isMuted ? 'Chat notifications unmuted' : 'Chat muted');
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <i className={`fa-solid ${isMuted ? 'fa-bell-slash text-danger' : 'fa-bell'}`}></i>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="chat-messages-container">
          <div className="chat-date-separator">
            <span>Today</span>
          </div>

          {activeChat.messages.map((msg) => (
            <div key={msg.id} className={`chat-message-row ${msg.from === 'out' ? 'outgoing' : 'incoming'}`}>
              {msg.from === 'in' && (
                <div className={`chat-msg-avatar bg-${activeChat.color}`}>
                  {activeChat.initials}
                </div>
              )}

              <div className="chat-bubble-wrap">
                {msg.from === 'file' ? (
                  <div className="file-attachment-card">
                    <div className="file-icon"><i className="fa-solid fa-file-image"></i></div>
                    <div className="file-info">
                      <strong>{msg.text}</strong>
                      <small>{msg.size}</small>
                    </div>
                    <button 
                      type="button" 
                      className="download-file-btn"
                      onClick={() => notify('File preview opened (demo).')}
                    >
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </div>
                ) : (
                  <div className="chat-message-bubble">
                    <p>{msg.text}</p>
                  </div>
                )}
                <div className="chat-msg-meta">
                  <span className="msg-time">{msg.time}</span>
                  {msg.from === 'out' && (
                    <i className="fa-solid fa-check-double text-primary read-receipt"></i>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <form className="chat-composer-bar" onSubmit={handleSendMessage}>
          <button 
            type="button" 
            className="composer-icon-btn"
            onClick={handleAttach}
            title="Attach design file"
          >
            <i className="fa-solid fa-paperclip"></i>
          </button>

          <div className="emoji-quick-menu">
            {['😊', '🎨', '🚀', '👍', '🔥'].map((emoji) => (
              <button 
                key={emoji} 
                type="button" 
                className="emoji-pill-btn" 
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <input 
            type="text" 
            className="composer-input"
            placeholder={`Message ${activeChat.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button 
            type="submit" 
            className="btn-send-message"
            disabled={!inputText.trim()}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </section>

      {/* Right Side: Participant Overview */}
      <aside className="chat-details-panel">
        <div className="details-card">
          <div className={`details-avatar-large bg-${activeChat.color}`}>
            {activeChat.initials}
          </div>
          <h3>{activeChat.name}</h3>
          <p className="details-role">{activeChat.role}</p>
          <p className="details-location"><i className="fa-solid fa-location-dot"></i> GraphicDesignHUB Campus</p>
        </div>

        <div className="details-section">
          <h4>Shared Media & Files (3)</h4>
          <div className="shared-files-list">
            <div className="shared-file-item">
              <i className="fa-solid fa-file-image text-pink"></i>
              <div>
                <strong>Color-Palette.png</strong>
                <small>1.8 MB · Today</small>
              </div>
            </div>
            <div className="shared-file-item">
              <i className="fa-solid fa-file-pdf text-purple"></i>
              <div>
                <strong>UI_Guidelines_v3.pdf</strong>
                <small>4.2 MB · March 18</small>
              </div>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4>Enrolled Classes</h4>
          <span className="badge-class-item">UI/UX Design Masterclass</span>
          <span className="badge-class-item">Blender 3D Suite</span>
        </div>
      </aside>
    </div>
  );
}
