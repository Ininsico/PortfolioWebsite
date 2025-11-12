import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const BlogPlatform = () => {
    const [socket, setSocket] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('feed');
    const [groups, setGroups] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const [callModal, setCallModal] = useState(false);
    const [callLink, setCallLink] = useState('');
    const navigate = useNavigate();

    const API_URL = 'http://localhost:3001/api';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
            initializeSocket(token);
            loadInitialData(token);
        }
    }, []);

    const initializeSocket = (token) => {
        const newSocket = io('http://localhost:3001', {
            auth: { token }
        });
        
        setSocket(newSocket);

        newSocket.on('newPost', (post) => {
            setPosts(prev => [post, ...prev]);
        });

        newSocket.on('postLiked', ({ postId, likes }) => {
            setPosts(prev => prev.map(post => 
                post._id === postId ? { ...post, likes } : post
            ));
        });

        newSocket.on('userJoined', (userData) => {
            setOnlineUsers(prev => [...prev, userData]);
        });

        newSocket.on('userLeft', (userId) => {
            setOnlineUsers(prev => prev.filter(user => user._id !== userId));
        });

        newSocket.on('onlineUsers', (users) => {
            setOnlineUsers(users);
        });

        newSocket.on('newGroup', (group) => {
            setGroups(prev => [...prev, group]);
        });

        newSocket.on('newSession', (session) => {
            setSessions(prev => [...prev, session]);
        });

        newSocket.on('newMessage', ({ groupId, message }) => {
            setMessages(prev => ({
                ...prev,
                [groupId]: [...(prev[groupId] || []), message]
            }));
        });

        return () => newSocket.close();
    };

    const loadInitialData = async (token) => {
        setLoading(true);
        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [postsRes, groupsRes, sessionsRes, usersRes] = await Promise.all([
                fetch(`${API_URL}/posts`, { headers }),
                fetch(`${API_URL}/groups`, { headers }),
                fetch(`${API_URL}/sessions`, { headers }),
                fetch(`${API_URL}/users/online`, { headers })
            ]);

            if (postsRes.ok) setPosts((await postsRes.json()).posts || []);
            if (groupsRes.ok) setGroups((await groupsRes.json()).groups || []);
            if (sessionsRes.ok) setSessions((await sessionsRes.json()).sessions || []);
            if (usersRes.ok) setOnlineUsers((await usersRes.json()).users || []);

        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!newPost.trim() || !socket) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newPost })
            });

            if (response.ok) {
                setNewPost('');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const createGroup = async (groupName, isPrivate = false) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/groups`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: groupName, 
                    isPrivate,
                    description: `${groupName} - ${isPrivate ? 'Private' : 'Public'} group` 
                })
            });
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const joinGroup = async (groupId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/groups/${groupId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error joining group:', error);
        }
    };

    const createSession = async (sessionName, isPrivate = false) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/sessions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: sessionName,
                    description: `${sessionName} - ${isPrivate ? 'Private' : 'Public'} session`,
                    isPrivate
                })
            });

            if (response.ok) {
                const session = await response.json();
                const callUrl = `https://comsatsconnect.vercel.app/room/${session.session._id}`;
                setCallLink(callUrl);
                setCallModal(true);
            }
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    const sendMessage = async (groupId) => {
        if (!newMessage.trim() || !socket) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/groups/${groupId}/message`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newMessage })
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const joinSession = (session) => {
        const callUrl = `https://comsatsconnect.vercel.app/room/${session._id}`;
        setCallLink(callUrl);
        setCallModal(true);
    };

    const startVideoCall = (groupId) => {
        const callUrl = `https://comsatsconnect.vercel.app/room/${groupId}`;
        setCallLink(callUrl);
        setCallModal(true);
    };

    const handleLogin = () => navigate('/login');
    const handleSignup = () => navigate('/signup');

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setPosts([]);
            setGroups([]);
            setSessions([]);
            setOnlineUsers([]);
            if (socket) socket.close();
        }
    };

    // POST COMPONENT - Using About page styling
    const Post = ({ post }) => (
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-cyan-500/20 group hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-xl">
                        {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <div className="font-black text-white text-xl tracking-wide">{post.author?.username || 'Unknown'}</div>
                        <div className="text-cyan-300 text-sm font-medium">
                            {new Date(post.createdAt).toLocaleString()}
                        </div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-white/10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                    </svg>
                </button>
            </div>
            
            <div className="text-gray-200 text-lg mb-8 leading-relaxed font-light">{post.content}</div>
            
            <div className="flex items-center justify-between text-gray-400 border-t border-cyan-500/20 pt-6">
                <button 
                    onClick={() => handleLike(post._id)}
                    className="flex items-center space-x-3 hover:text-cyan-400 transition-colors px-4 py-3 rounded-xl hover:bg-cyan-500/10 group/like"
                >
                    <span className="text-xl group-hover/like:scale-110 transition-transform">❤️</span>
                    <span className="font-black text-white">{post.likes?.length || 0}</span>
                </button>
                <button className="flex items-center space-x-3 hover:text-purple-400 transition-colors px-4 py-3 rounded-xl hover:bg-purple-500/10 group/comment">
                    <span className="text-xl group-hover/comment:scale-110 transition-transform">💬</span>
                    <span className="font-black text-white">{post.comments?.length || 0}</span>
                </button>
                <button className="flex items-center space-x-3 hover:text-green-400 transition-colors px-4 py-3 rounded-xl hover:bg-green-500/10 group/share">
                    <span className="text-xl group-hover/share:scale-110 transition-transform">🔄</span>
                    <span className="font-black text-white">{post.shares || 0}</span>
                </button>
            </div>
        </div>
    );

    // GROUP CHAT COMPONENT
    const GroupChat = ({ group }) => (
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl h-[600px] flex flex-col border border-cyan-500/20">
            <div className="p-6 border-b border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                        {group.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-black text-white text-xl tracking-wide">{group.name}</h3>
                        <p className="text-cyan-300 text-sm font-medium">{group.members?.length || 0} members</p>
                    </div>
                </div>
                <button 
                    onClick={() => startVideoCall(group._id)}
                    className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    📹 Video Call
                </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {(messages[group._id] || []).map((message, index) => (
                    <div key={index} className="flex items-start space-x-4 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-sm">
                            {message.author?.username?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="font-black text-cyan-400 text-sm tracking-wide">{message.author?.username}</div>
                            <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-gray-200 border border-cyan-500/20 group-hover:border-cyan-400/40 transition-all duration-300">
                                {message.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 border-t border-cyan-500/20">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-cyan-500/20 rounded-2xl px-6 py-4 text-white placeholder-cyan-300 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage(group._id)}
                    />
                    <button
                        onClick={() => sendMessage(group._id)}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );

    // GROUP CARD COMPONENT
    const GroupCard = ({ group }) => (
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-cyan-500/20 group hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                        {group.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-black text-white text-2xl tracking-wide">{group.name}</h3>
                        <p className="text-cyan-300 font-medium">{group.members?.length || 0} members • {group.channels?.length || 0} channels</p>
                    </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-black border ${
                    group.isPrivate 
                        ? 'bg-red-500/20 text-red-400 border-red-400/30' 
                        : 'bg-green-500/20 text-green-400 border-green-400/30'
                }`}>
                    {group.isPrivate ? 'Private' : 'Public'}
                </span>
            </div>
            
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">{group.description}</p>
            
            <div className="flex space-x-4">
                <button 
                    onClick={() => setSelectedGroup(group)}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    Open Chat
                </button>
                <button 
                    onClick={() => startVideoCall(group._id)}
                    className="px-8 bg-gradient-to-r from-green-500 to-cyan-500 text-white py-4 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
                >
                    <span>📹</span>
                    <span>Call</span>
                </button>
            </div>
        </div>
    );

    // SESSION CARD COMPONENT
    const SessionCard = ({ session }) => (
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-purple-500/20 group hover:border-purple-400/40 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">
                        🎥
                    </div>
                    <div>
                        <h3 className="font-black text-white text-2xl tracking-wide">{session.name}</h3>
                        <p className="text-cyan-300 font-medium">Host: {session.host?.username} • {session.participants?.length || 0} participants</p>
                    </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-black border ${
                    session.isPrivate 
                        ? 'bg-red-500/20 text-red-400 border-red-400/30' 
                        : 'bg-green-500/20 text-green-400 border-green-400/30'
                }`}>
                    {session.isPrivate ? 'Private' : 'Public'}
                </span>
            </div>
            
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">{session.description}</p>
            
            <div className="flex space-x-4">
                <button 
                    onClick={() => joinSession(session)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                >
                    <span>🎥</span>
                    <span>Join Session</span>
                </button>
            </div>
        </div>
    );

    // CALL MODAL COMPONENT
    const CallModal = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-cyan-500/30">
                <h3 className="text-2xl font-black text-white mb-4 text-center tracking-wide">Join Video Call</h3>
                <p className="text-cyan-300 text-center mb-6">Click the link below to join the video call session:</p>
                
                <div className="bg-black/50 rounded-xl p-4 mb-6 border border-cyan-500/20">
                    <code className="text-cyan-400 font-mono text-sm break-all">{callLink}</code>
                </div>
                
                <div className="flex space-x-4">
                    <button
                        onClick={() => window.open(callLink, '_blank')}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Join Now
                    </button>
                    <button
                        onClick={() => setCallModal(false)}
                        className="flex-1 bg-gray-600 text-white py-4 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-cyan-400 text-xl font-black tracking-wide">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-150"></div>
            </div>

            {/* Header */}
            <header className="relative bg-white/5 backdrop-blur-lg border-b border-cyan-500/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                            C
                        </div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                            COMSATS CONNECT
                        </h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-3 bg-cyan-500/20 rounded-2xl px-6 py-3 border border-cyan-400/30">
                                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-sm">
                                        {user.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span className="text-white font-black tracking-wide">{user.username}</span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={handleLogin}
                                    className="text-cyan-400 hover:text-cyan-300 font-black tracking-wide transition-colors"
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={handleSignup}
                                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className="relative max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Navigation */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-cyan-500/20">
                            <nav className="space-y-3">
                                {[
                                    { id: 'feed', icon: '🏠', label: 'Feed' },
                                    { id: 'groups', icon: '👥', label: 'Groups' },
                                    { id: 'sessions', icon: '🎥', label: 'Sessions' },
                                    { id: 'profile', icon: '👤', label: 'Profile' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-4 p-4 rounded-xl font-black tracking-wide transition-all duration-300 ${
                                            activeTab === tab.id 
                                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg' 
                                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="text-xl">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Online Users */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-cyan-500/20">
                            <h3 className="text-lg font-black text-white mb-4 tracking-wide flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>Online Now ({onlineUsers.length})</span>
                            </h3>
                            <div className="space-y-3">
                                {onlineUsers.map(user => (
                                    <div key={user._id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-black text-sm">
                                                {user.username?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                                        </div>
                                        <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">{user.username}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {selectedGroup ? (
                            <GroupChat group={selectedGroup} />
                        ) : (
                            <>
                                {/* Create Post */}
                                {activeTab === 'feed' && user && (
                                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-500">
                                        <div className="flex items-center space-x-4 mb-6">
                                            <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                                                {user.username?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-black text-white text-xl tracking-wide">{user.username}</div>
                                                <div className="text-cyan-300 text-sm font-medium">Share your thoughts...</div>
                                            </div>
                                        </div>
                                        
                                        <textarea
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                            placeholder="What's happening in your world?"
                                            className="w-full bg-white/5 border border-cyan-500/20 rounded-2xl p-6 text-white placeholder-cyan-300 resize-none focus:outline-none focus:border-cyan-400 transition-all duration-300"
                                            rows="3"
                                        />
                                        <div className="flex justify-between items-center mt-6">
                                            <div className="flex space-x-3">
                                                {['📷', '🎥', '📊', '😊'].map((icon, index) => (
                                                    <button key={index} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-400 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 flex items-center justify-center hover:scale-110">
                                                        {icon}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={handleCreatePost}
                                                disabled={!newPost.trim()}
                                                className={`px-8 py-4 rounded-xl font-black transition-all duration-300 ${
                                                    newPost.trim() 
                                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:scale-105 shadow-lg' 
                                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Content Area */}
                                <div>
                                    {activeTab === 'feed' && posts.map(post => (
                                        <Post key={post._id} post={post} />
                                    ))}

                                    {activeTab === 'groups' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-8">
                                                <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                                                    Groups & Chats
                                                </h2>
                                                {user && (
                                                    <div className="flex space-x-4">
                                                        <button 
                                                            onClick={() => {
                                                                const groupName = prompt('Enter public group name:');
                                                                if (groupName) createGroup(groupName, false);
                                                            }}
                                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                                                        >
                                                            Create Public Group
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                const groupName = prompt('Enter private group name:');
                                                                if (groupName) createGroup(groupName, true);
                                                            }}
                                                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                                                        >
                                                            Create Private Group
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {groups.map(group => (
                                                <GroupCard key={group._id} group={group} />
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'sessions' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-8">
                                                <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                                                    Video Sessions
                                                </h2>
                                                {user && (
                                                    <div className="flex space-x-4">
                                                        <button 
                                                            onClick={() => {
                                                                const sessionName = prompt('Enter public session name:');
                                                                if (sessionName) createSession(sessionName, false);
                                                            }}
                                                            className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                                                        >
                                                            Public Session
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                const sessionName = prompt('Enter private session name:');
                                                                if (sessionName) createSession(sessionName, true);
                                                            }}
                                                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg"
                                                        >
                                                            Private Session
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {sessions.map(session => (
                                                <SessionCard key={session._id} session={session} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Actions */}
                        {user && (
                            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-cyan-500/20">
                                <h3 className="text-lg font-black text-white mb-4 tracking-wide">Quick Actions</h3>
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => {
                                            const groupName = prompt('Enter private group name:');
                                            if (groupName) createGroup(groupName, true);
                                        }}
                                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                                    >
                                        <span>👥</span>
                                        <span>Private Group</span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const sessionName = prompt('Enter private session name:');
                                            if (sessionName) createSession(sessionName, true);
                                        }}
                                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                                    >
                                        <span>🎥</span>
                                        <span>Private Session</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Platform Stats */}
                        <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-6 border border-cyan-500/30">
                            <h3 className="text-lg font-black text-white mb-4 tracking-wide">Platform Stats</h3>
                            <div className="space-y-3 text-cyan-300">
                                <div className="flex justify-between items-center">
                                    <span>Online Users</span>
                                    <span className="font-black text-white">{onlineUsers.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Total Posts</span>
                                    <span className="font-black text-white">{posts.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Active Groups</span>
                                    <span className="font-black text-white">{groups.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Live Sessions</span>
                                    <span className="font-black text-white">{sessions.filter(s => s.isActive).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call Modal */}
            {callModal && <CallModal />}
        </div>
    );
};

export default BlogPlatform;