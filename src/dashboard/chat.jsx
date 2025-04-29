import React, { useState } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [usersData, setUsersData] = useState([
    {
      id: 1,
      name: 'John Doe',
      profilePic: 'https://via.placeholder.com/50?text=JD',
      lastMessage: 'Hey, I need help with a project.',
      unreadCount: 3,
      chatHistory: [
        { sender: 'user', text: 'Hey, I need help with a project.', time: new Date() },
        { sender: 'bot', text: 'Sure! What do you need help with?', time: new Date() },
        { sender: 'user', text: 'Can you clarify something about the project?', time: new Date() },
        { sender: 'bot', text: 'Of course, what do you need clarification on?', time: new Date() },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      profilePic: 'https://via.placeholder.com/50?text=JS',
      lastMessage: 'Can you tell me more about your services?',
      unreadCount: 1,
      chatHistory: [
        { sender: 'user', text: 'Can you tell me more about your services?', time: new Date() },
        { sender: 'bot', text: 'Of course! What would you like to know?', time: new Date() },
      ],
    },
    {
      id: 3,
      name: 'Dev',
      profilePic: 'https://via.placeholder.com/50?text=AI',
      lastMessage: 'Hello! How can I assist you today?',
      unreadCount: 0,
      chatHistory: [
        { sender: 'bot', text: 'Hello! How can I assist you today?', time: new Date() },
      ],
    },
    {
      id: 4,
      name: 'John Doe',
      profilePic: 'https://via.placeholder.com/50?text=JD',
      lastMessage: 'Hey, I need help with a project.',
      unreadCount: 3,
      chatHistory: [
        { sender: 'user', text: 'Hey, I need help with a project.', time: new Date() },
        { sender: 'bot', text: 'Sure! What do you need help with?', time: new Date() },
        { sender: 'user', text: 'Can you clarify something about the project?', time: new Date() },
        { sender: 'bot', text: 'Of course, what do you need clarification on?', time: new Date() },
      ],
    },
    {
      id: 5,
      name: 'John Doe',
      profilePic: 'https://via.placeholder.com/50?text=JD',
      lastMessage: 'Hey, I need help with a project.',
      unreadCount: 3,
      chatHistory: [
        { sender: 'user', text: 'Hey, I need help with a project.', time: new Date() },
        { sender: 'bot', text: 'Sure! What do you need help with?', time: new Date() },
        { sender: 'user', text: 'Can you clarify something about the project?', time: new Date() },
        { sender: 'bot', text: 'Of course, what do you need clarification on?', time: new Date() },
      ],
    },
    {
      id: 6,
      name: 'John Doe',
      profilePic: 'https://via.placeholder.com/50?text=JD',
      lastMessage: 'Hey, I need help with a project.',
      unreadCount: 3,
      chatHistory: [
        { sender: 'user', text: 'Hey, I need help with a project.', time: new Date() },
        { sender: 'bot', text: 'Sure! What do you need help with?', time: new Date() },
        { sender: 'user', text: 'Can you clarify something about the project?', time: new Date() },
        { sender: 'bot', text: 'Of course, what do you need clarification on?', time: new Date() },
      ],
    },
    {
      id: 7,
      name: 'John Doe',
      profilePic: 'https://via.placeholder.com/50?text=JD',
      lastMessage: 'Hey, I need help with a project.',
      unreadCount: 3,
      chatHistory: [
        { sender: 'user', text: 'Hey, I need help with a project.', time: new Date() },
        { sender: 'bot', text: 'Sure! What do you need help with?', time: new Date() },
        { sender: 'user', text: 'Can you clarify something about the project?', time: new Date() },
        { sender: 'bot', text: 'Of course, what do you need clarification on?', time: new Date() },
      ],
    },
    {
      id: 8,
      name: 'John Doe',
      profilePic: 'https://via.placeholder.com/50?text=JD',
      lastMessage: 'Hey, I need help with a project.',
      unreadCount: 3,
      chatHistory: [
        { sender: 'user', text: 'Hey, I need help with a project.', time: new Date() },
        { sender: 'bot', text: 'Sure! What do you need help with?', time: new Date() },
        { sender: 'user', text: 'Can you clarify something about the project?', time: new Date() },
        { sender: 'bot', text: 'Of course, what do you need clarification on?', time: new Date() },
      ],
    },
    {
      id: 9,
      name: 'John Doe',
      profilePic: 'https://via.placeholder.com/50?text=JD',
      lastMessage: 'Hey, I need help with a project.',
      unreadCount: 3,
      chatHistory: [
        { sender: 'user', text: 'Hey, I need help with a project.', time: new Date() },
        { sender: 'bot', text: 'Sure! What do you need help with?', time: new Date() },
        { sender: 'user', text: 'Can you clarify something about the project?', time: new Date() },
        { sender: 'bot', text: 'Of course, what do you need clarification on?', time: new Date() },
      ],
    },
    {
      id: 10,
      name: 'John Doe',
      profilePic: 'https://via.placeholder.com/50?text=JD',
      lastMessage: 'Hey, I need help with a project.',
      unreadCount: 3,
      chatHistory: [
        { sender: 'user', text: 'Hey, I need help with a project.', time: new Date() },
        { sender: 'bot', text: 'Sure! What do you need help with?', time: new Date() },
        { sender: 'user', text: 'Can you clarify something about the project?', time: new Date() },
        { sender: 'bot', text: 'Of course, what do you need clarification on?', time: new Date() },
      ],
    },
    {
      id: 11,
      name: 'John Doe',
      profilePic: 'https://via.placeholder.com/50?text=JD',
      lastMessage: 'Hey, I need help with a project.',
      unreadCount: 3,
      chatHistory: [
        { sender: 'user', text: 'Hey, I need help with a project.', time: new Date() },
        { sender: 'bot', text: 'Sure! What do you need help with?', time: new Date() },
        { sender: 'user', text: 'Can you clarify something about the project?', time: new Date() },
        { sender: 'bot', text: 'Of course, what do you need clarification on?', time: new Date() },
      ],
    },
  ]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleUserClick = (user) => {
    const updatedUsers = usersData.map((u) =>
      u.id === user.id ? { ...u, unreadCount: 0 } : u
    );
    setUsersData(updatedUsers);
    setActiveUser({ ...user, unreadCount: 0 });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message.trim() && activeUser) {
      const newMessage = { sender: 'user', text: message, time: new Date() };
      const updatedUser = {
        ...activeUser,
        chatHistory: [...activeUser.chatHistory, newMessage],
        lastMessage: message,
      };
      const updatedUsers = usersData.map((user) =>
        user.id === activeUser.id ? updatedUser : user
      );
      setUsersData(updatedUsers);
      setActiveUser(updatedUser);
      e.target.reset();
    }
  };

  const formatTime = (time) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(time);
  };

  const getLastMessageTime = (chatHistory) => {
    const lastMessage = chatHistory[chatHistory.length - 1];
    return lastMessage ? formatTime(lastMessage.time) : '';
  };

  const filteredUsers = usersData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 text-white bg-blue-500 transition-transform hover:scale-110"
          onClick={toggleChat}
          aria-label="Toggle chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      <div
        className={`fixed top-0 right-0 w-full h-full max-w-md bg-white rounded-lg shadow-xl z-40 flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ minHeight: '100vh' }} // Full height for mobile screens
      >
        {/* Header */}
        <div className="p-4 rounded-t-lg text-white flex items-center justify-between bg-blue-500 relative">
          {activeUser ? (
            <>
              <button
                onClick={() => setActiveUser(null)}
                className="text-white hover:bg-blue-700 p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                </svg>
              </button>
              <span className="font-semibold text-sm">{activeUser.name}</span>
            </>
          ) : (
            <>
              <button
        onClick={() => setIsOpen(false)} // Close the chat window when clicking the back button
        className="text-white hover:bg-blue-700 p-2 rounded-full"
      >
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M15 18l-6-6 6-6" />
</svg>

      </button>
              <span className="font-semibold text-lg">Messages</span>
              <div className="relative">
                <button
                  onClick={() => setShowUserSearch(!showUserSearch)}
                  className="text-white hover:bg-blue-700 p-2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                {showUserSearch && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search user..."
                      className="w-full p-2 border-b border-gray-200 text-black"
                    />
                    {searchQuery.length >= 2 ? (
                      filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => {
                              handleUserClick(user);
                              setShowUserSearch(false);
                              setSearchQuery('');
                            }}
                            className="flex items-start gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <img
                              src={user.profilePic}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-black">{user.name}</span>
                              <span className="text-sm text-gray-600">@user{user.id}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500 text-sm">No users found</div>
                      )
                    ) : (
                      <div className="px-3 py-2 text-gray-400 text-sm">Type at least 2 characters...</div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Chat List or Conversation */}
        {!activeUser ? (
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 ">
            {usersData.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500">
                    {user.lastMessage}{' '}
                    <span className="text-xs text-gray-400">{getLastMessageTime(user.chatHistory)}</span>
                  </div>
                </div>
                {user.unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {user.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 p- overflow-y-auto bg-gray-50">
            {activeUser.chatHistory.map((message, index) => (
              <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-indigo-100 text-indigo-900 rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {message.text}
                  <div className="text-xs text-gray-400 mt-1">{formatTime(message.time)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Input */}
        {activeUser && (
          <form onSubmit={handleSendMessage} className="flex items-center p-4 bg-gray-100 rounded-b-lg">
            <input
              name="message"
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-l-lg bg-white border border-gray-300"
            />
            <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-r-lg">
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatBot;