const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Failed:', err.message));

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: '/uploads/profilepics/DefaultPic.jpeg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', userSchema);

// Post Schema
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 3000
  },
  media: [
    {
      url: String,
      mediaType: {
        type: String,
        enum: ['image', 'video', 'pdf']
      }
    }
  ],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
  }],
  reposts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  isRepost: {
    type: Boolean,
    default: false
  },
  originalPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

// Group Schema
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  privacy: { type: String, enum: ['public', 'private'], default: 'public' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  onlineMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Group Message Schema
const groupMessageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'image', 'video', 'pdf', 'file'], default: 'text' },
  fileUrl: { type: String, default: null },
  fileName: { type: String, default: null },
  fileSize: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model('Group', groupSchema);
const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log('Gmail connection FAILED:', error);
  } else {
    console.log('Gmail is ready to send emails');
  }
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header required" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// File upload configurations
const uploadDir = 'uploads/profilepics';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.params.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

const mediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const mediaDir = 'uploads/posts';
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }
    cb(null, mediaDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const mediaupload = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files allowed'), false);
    }
  }
});

// Group file upload
const groupFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const groupDir = 'uploads/groups';
    if (!fs.existsSync(groupDir)) fs.mkdirSync(groupDir, { recursive: true });
    cb(null, groupDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'group-' + req.params.groupId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const groupFileUpload = multer({
  storage: groupFileStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') ||
      file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images, videos, PDFs allowed'), false);
    }
  }
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user) return next(new Error('User not found'));

    socket.data.userId = user._id.toString();
    socket.data.username = user.username;
    socket.data.profilePicture = user.profilePicture;
    next();
  } catch (error) {
    next(new Error('Auth failed'));
  }
});

// Socket events
io.on('connection', (socket) => {
  console.log('User connected:', socket.data.username);

  socket.on('join_group', async (groupId) => {
    try {
      socket.join(`group_${groupId}`);
      await Group.findByIdAndUpdate(groupId, {
        $addToSet: { onlineMembers: socket.data.userId }
      });

      const user = await User.findById(socket.data.userId);
      socket.to(`group_${groupId}`).emit('user_joined', {
        userId: socket.data.userId,
        username: socket.data.username,
        profilePicture: user?.profilePicture || '/uploads/profilepics/DefaultPic.jpeg'
      });
    } catch (error) {
      console.error('Join group error:', error);
    }
  });

  socket.on('leave_group', async (groupId) => {
    try {
      socket.leave(`group_${groupId}`);
      await Group.findByIdAndUpdate(groupId, {
        $pull: { onlineMembers: socket.data.userId }
      });
      socket.to(`group_${groupId}`).emit('user_left', {
        userId: socket.data.userId,
        username: socket.data.username
      });
    } catch (error) {
      console.error('Leave group error:', error);
    }
  });

  socket.on('send_group_message', async (data) => {
    try {
      const { groupId, content, messageType } = data;
      const message = new GroupMessage({
        groupId,
        userId: socket.data.userId,
        username: socket.data.username,
        content,
        messageType: messageType || 'text'
      });
      await message.save();

      io.to(`group_${groupId}`).emit('receive_group_message', {
        id: message._id,
        content: message.content,
        messageType: message.messageType,
        username: message.username,
        userId: message.userId,
        profilePicture: socket.data.profilePicture,
        createdAt: message.createdAt,
        likes: message.likes.length
      });
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('like_group_message', async (data) => {
    try {
      const { messageId, groupId } = data;
      const message = await GroupMessage.findById(messageId);

      if (!message) {
        return socket.emit('error', { message: 'Message not found' });
      }

      const likeIndex = message.likes.indexOf(socket.data.userId);
      if (likeIndex > -1) {
        message.likes.splice(likeIndex, 1);
      } else {
        message.likes.push(socket.data.userId);
      }

      await message.save();

      io.to(`group_${groupId}`).emit('message_liked', {
        messageId: message._id,
        likes: message.likes.length,
        isLiked: message.likes.includes(socket.data.userId)
      });
    } catch (error) {
      console.error('Like message error:', error);
      socket.emit('error', { message: 'Failed to like message' });
    }
  });

  socket.on('typing_start', (data) => {
    socket.to(`group_${data.groupId}`).emit('user_typing', {
      userId: socket.data.userId,
      username: socket.data.username,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`group_${data.groupId}`).emit('user_typing', {
      userId: socket.data.userId,
      username: socket.data.username,
      isTyping: false
    });
  });

  socket.on('disconnect', async () => {
    try {
      await Group.updateMany(
        { onlineMembers: socket.data.userId },
        { $pull: { onlineMembers: socket.data.userId } }
      );
      console.log('User disconnected:', socket.data.username);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
});

// ==================== API ROUTES ====================

// Contact routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required!'
      });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `PORTFOLIO CONTACT: ${subject}`,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <div>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Message sent successfully!',
      id: contact._id
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error. Try again later.'
    });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
  }
});

// Auth routes
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists!`
      });
    }

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password
    });

    await newUser.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: newUser.email,
        subject: "Thanks for Signing up",
        html: `
          <div>
            <h2>Welcome aboard, ${newUser.username}!</h2>
            <div>
              <p>Your account has been successfully created.</p>
              <p><strong>Username:</strong> ${newUser.username}</p>
              <p><strong>Email:</strong> ${newUser.email}</p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.log('Failed to send welcome email:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error("Signup error:", error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// User routes
app.get('/api/users/:userId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('User profile error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
app.put('/api/users/:userId/profilepic', upload.single('profilepic'), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (decoded.userId !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.profilePicture && user.profilePicture !== '/uploads/profilepics/DefaultPic.jpeg') {
      const oldFilePath = path.join('uploads', 'profilepics', path.basename(user.profilePicture));
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    user.profilePicture = `/uploads/profilepics/${req.file.filename}`;
    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      profilePicture: user.profilePicture
    });

  } catch (error) {
    console.error('Profile picture update error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.delete('/api/users/:userId/profilepic', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization header provided"
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (decoded.userId !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.profilePicture && user.profilePicture !== '/uploads/profilepics/DefaultPic.jpeg') {
      const filePath = path.join('uploads', 'profilepics', path.basename(user.profilePicture));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.profilePicture = '/uploads/profilepics/DefaultPic.jpeg';
    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Profile picture reset to default",
      profilePicture: user.profilePicture
    });

  } catch (error) {
    console.error("Profile picture delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Post routes
app.post('/api/posts', authenticateToken, mediaupload.array('media', 10), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    const mediaFiles = req.files ? req.files.map(file => ({
      url: `/uploads/posts/${file.filename}`,
      mediaType: file.mimetype.startsWith('image/') ? 'image' : 'video'
    })) : [];

    const post = new Post({
      userId: req.userId,
      username: req.user.username,
      content: content.trim(),
      media: mediaFiles
    });

    await post.save();
    await post.populate('userId', 'username profilePicture');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: {
        id: post._id,
        content: post.content,
        media: post.media,
        username: post.username,
        profilePicture: req.user.profilePicture,
        likes: post.likes.length,
        comments: post.comments.length,
        reposts: post.reposts.length,
        createdAt: post.createdAt,
        isLiked: false,
        isReposted: false
      }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

app.get('/api/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });

    const postsWithUserData = posts.map(post => ({
      id: post._id,
      content: post.content,
      media: post.media,
      username: post.username,
      profilePicture: post.userId.profilePicture,
      likes: post.likes.length,
      comments: post.comments.length,
      reposts: post.reposts.length,
      createdAt: post.createdAt,
      isLiked: post.likes.includes(req.userId),
      isReposted: post.reposts.includes(req.userId)
    }));

    res.json({
      success: true,
      posts: postsWithUserData
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
});

app.post('/api/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likeIndex = post.likes.indexOf(req.userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.userId);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
      isLiked: post.likes.includes(req.userId)
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like post'
    });
  }
});

app.post('/api/posts/:postId/comment', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      userId: req.userId,
      username: req.user.username,
      content: content.trim()
    });

    await post.save();
    await post.populate('userId', 'username profilePicture');

    res.json({
      success: true,
      message: 'Comment added successfully',
      comments: post.comments
    });
  } catch (error) {
    console.error('Comment post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
});

app.get('/api/users/:userId/posts', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const posts = await Post.find({ userId: userId })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });

    const postsWithUserData = posts.map(post => ({
      id: post._id,
      content: post.content,
      media: post.media,
      username: post.username,
      profilePicture: post.userId.profilePicture,
      likes: post.likes.length,
      comments: post.comments.length,
      reposts: post.reposts.length,
      createdAt: post.createdAt,
      isLiked: post.likes.includes(req.userId),
      isReposted: post.reposts.includes(req.userId)
    }));

    res.json({
      success: true,
      posts: postsWithUserData,
      user: {
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        totalPosts: posts.length
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user posts'
    });
  }
});

app.get('/api/users/:userId/post-stats', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const totalPosts = await Post.countDocuments({ userId: userId });
    const totalLikes = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $project: { likesCount: { $size: "$likes" } } },
      { $group: { _id: null, total: { $sum: "$likesCount" } } }
    ]);

    const totalComments = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $project: { commentsCount: { $size: "$comments" } } },
      { $group: { _id: null, total: { $sum: "$commentsCount" } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalPosts,
        totalLikes: totalLikes[0]?.total || 0,
        totalComments: totalComments[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get user post stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user post statistics'
    });
  }
});

app.delete('/api/posts/:postId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    if (post.media && post.media.length > 0) {
      post.media.forEach(media => {
        const filePath = path.join('uploads', 'posts', path.basename(media.url));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post'
    });
  }
});

// Group routes
app.post('/api/groups', authenticateToken, async (req, res) => {
  try {
    const { name, description, category, privacy } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Group name required' });

    const group = new Group({
      name,
      description,
      category,
      privacy,
      admin: req.userId,
      members: [req.userId]
    });
    await group.save();

    await group.populate('admin', 'username profilePicture');
    await group.populate('members', 'username profilePicture');

    res.status(201).json({
      success: true,
      message: 'Group created',
      group
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ success: false, message: 'Failed to create group' });
  }
});

app.get('/api/groups', authenticateToken, async (req, res) => {
  try {
    const groups = await Group.find({ privacy: 'public' })
      .populate('admin', 'username profilePicture')
      .populate('members', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json({ success: true, groups });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch groups' });
  }
});

app.get('/api/groups/:groupId', authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('admin', 'username profilePicture')
      .populate('members', 'username profilePicture')
      .populate('onlineMembers', 'username profilePicture');
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.privacy === 'private' && !group.members.some(member => member._id.toString() === req.userId)) {
      return res.status(403).json({ success: false, message: 'Access denied to private group' });
    }

    res.json({ success: true, group });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch group' });
  }
});

app.post('/api/groups/:groupId/join', authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.members.includes(req.userId)) {
      return res.status(400).json({ success: false, message: 'Already member' });
    }

    group.members.push(req.userId);
    await group.save();

    await group.populate('admin', 'username profilePicture');
    await group.populate('members', 'username profilePicture');

    res.json({ success: true, message: 'Joined group', group });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ success: false, message: 'Failed to join group' });
  }
});

app.post('/api/groups/:groupId/leave', authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.admin.toString() === req.userId) {
      return res.status(400).json({ success: false, message: 'Admin cannot leave' });
    }

    group.members = group.members.filter(memberId => memberId.toString() !== req.userId);
    group.onlineMembers = group.onlineMembers.filter(memberId => memberId.toString() !== req.userId);
    await group.save();

    res.json({ success: true, message: 'Left group' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ success: false, message: 'Failed to leave group' });
  }
});

app.get('/api/users/:userId/groups', authenticateToken, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.userId })
      .populate('admin', 'username profilePicture')
      .populate('members', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json({ success: true, groups });
  } catch (error) {
    console.error('Get user groups error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user groups' });
  }
});

app.post('/api/groups/:groupId/messages', authenticateToken, async (req, res) => {
  try {
    const { content, messageType } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Message content required' });

    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (!group.members.some(member => member._id.toString() === req.userId)) {
      return res.status(403).json({ success: false, message: 'Not member' });
    }

    const message = new GroupMessage({
      groupId: req.params.groupId,
      userId: req.userId,
      username: req.user.username,
      content: content.trim(),
      messageType: messageType || 'text'
    });
    await message.save();

    res.json({
      success: true,
      message: 'Message sent',
      messageData: {
        id: message._id,
        content: message.content,
        messageType: message.messageType,
        username: message.username,
        userId: message.userId,
        profilePicture: req.user.profilePicture,
        createdAt: message.createdAt,
        likes: message.likes.length
      }
    });
  } catch (error) {
    console.error('Send group message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

app.get('/api/groups/:groupId/messages', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (!group.members.some(member => member._id.toString() === req.userId)) {
      return res.status(403).json({ success: false, message: 'Not member' });
    }

    const messages = await GroupMessage.find({ groupId: req.params.groupId })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await GroupMessage.countDocuments({ groupId: req.params.groupId });

    const messagesWithLikes = messages.map(message => ({
      id: message._id,
      content: message.content,
      messageType: message.messageType,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileSize: message.fileSize,
      username: message.username,
      userId: message.userId,
      profilePicture: message.userId?.profilePicture,
      createdAt: message.createdAt,
      likes: message.likes.length,
      isLiked: message.likes.includes(req.userId)
    }));

    res.json({
      success: true,
      messages: messagesWithLikes.reverse(),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages
      }
    });
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

app.post('/api/groups/:groupId/upload', authenticateToken, groupFileUpload.single('file'), async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (!group.members.some(member => member._id.toString() === req.userId)) {
      return res.status(403).json({ success: false, message: 'Not member' });
    }

    if (!req.file) return res.status(400).json({ success: false, message: 'No file' });

    const message = new GroupMessage({
      groupId: req.params.groupId,
      userId: req.userId,
      username: req.user.username,
      content: req.file.originalname,
      messageType: getFileType(req.file.mimetype),
      fileUrl: `/uploads/groups/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
    await message.save();

    res.json({
      success: true,
      message: 'File uploaded',
      messageData: {
        id: message._id,
        content: message.content,
        messageType: message.messageType,
        fileUrl: message.fileUrl,
        fileName: message.fileName,
        fileSize: message.fileSize,
        username: message.username,
        userId: message.userId,
        profilePicture: req.user.profilePicture,
        createdAt: message.createdAt,
        likes: message.likes.length
      }
    });
  } catch (error) {
    console.error('Upload group file error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload file' });
  }
});

app.post('/api/groups/messages/:messageId/like', authenticateToken, async (req, res) => {
  try {
    const message = await GroupMessage.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const likeIndex = message.likes.indexOf(req.userId);
    if (likeIndex > -1) {
      message.likes.splice(likeIndex, 1);
    } else {
      message.likes.push(req.userId);
    }

    await message.save();

    res.json({
      success: true,
      likes: message.likes.length,
      isLiked: message.likes.includes(req.userId)
    });
  } catch (error) {
    console.error('Like group message error:', error);
    res.status(500).json({ success: false, message: 'Failed to like message' });
  }
});

app.delete('/api/groups/:groupId', authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.admin.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Only admin can delete group' });
    }

    await GroupMessage.deleteMany({ groupId: req.params.groupId });
    await Group.findByIdAndDelete(req.params.groupId);

    res.json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete group' });
  }
});

app.put('/api/groups/:groupId', authenticateToken, async (req, res) => {
  try {
    const { name, description, category, privacy } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.admin.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Only admin can update group' });
    }

    if (name) group.name = name;
    if (description) group.description = description;
    if (category) group.category = category;
    if (privacy) group.privacy = privacy;

    group.updatedAt = new Date();
    await group.save();

    await group.populate('admin', 'username profilePicture');
    await group.populate('members', 'username profilePicture');

    res.json({
      success: true,
      message: 'Group updated successfully',
      group
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ success: false, message: 'Failed to update group' });
  }
});

// Utility function
function getFileType(mimetype) {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype === 'application/pdf') return 'pdf';
  return 'file';
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
  }
  res.status(500).json({
    success: false,
    message: error.message
  });
});
// Note Schema
const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#1f2937'
  },
  attachments: [{
    filename: String,
    originalName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  wordCount: {
    type: Number,
    default: 0
  },
  lastEdited: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Folder Schema
const folderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    default: '',
    maxlength: 500
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  noteCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Note = mongoose.model('Note', noteSchema);
const Folder = mongoose.model('Folder', folderSchema);
// Notes file upload configuration
const notesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const notesDir = 'uploads/notes';
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir, { recursive: true });
    }
    cb(null, notesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'note-' + req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const notesUpload = multer({
  storage: notesStorage,
  limits: {
    fileSize: 1 * 1024 * 1024 * 1024 // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for notes attachments
    cb(null, true);
  }
});
// Create folder
app.post('/api/folders', authenticateToken, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required'
      });
    }

    const folder = new Folder({
      userId: req.userId,
      name: name.trim(),
      description: description?.trim() || '',
      color: color || '#3b82f6'
    });

    await folder.save();

    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      folder
    });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create folder'
    });
  }
});

// Get user folders
app.get('/api/folders', authenticateToken, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.userId })
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({
      success: true,
      folders
    });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch folders'
    });
  }
});

// Update folder
app.put('/api/folders/:folderId', authenticateToken, async (req, res) => {
  try {
    const { name, description, color, isPinned } = req.body;
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      userId: req.userId
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    if (name) folder.name = name.trim();
    if (description !== undefined) folder.description = description.trim();
    if (color) folder.color = color;
    if (isPinned !== undefined) folder.isPinned = isPinned;

    await folder.save();

    res.json({
      success: true,
      message: 'Folder updated successfully',
      folder
    });
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update folder'
    });
  }
});

// Delete folder
app.delete('/api/folders/:folderId', authenticateToken, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      userId: req.userId
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Move all notes in this folder to root (no folder)
    await Note.updateMany(
      { folderId: req.params.folderId, userId: req.userId },
      { $set: { folderId: null } }
    );

    await Folder.findByIdAndDelete(req.params.folderId);

    res.json({
      success: true,
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete folder'
    });
  }
});
// Create note
app.post('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { title, content, folderId, tags, color } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Note title is required'
      });
    }

    // Verify folder belongs to user if provided
    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, userId: req.userId });
      if (!folder) {
        return res.status(404).json({
          success: false,
          message: 'Folder not found'
        });
      }
    }

    const wordCount = content ? content.trim().split(/\s+/).length : 0;

    const note = new Note({
      userId: req.userId,
      title: title.trim(),
      content: content || '',
      folderId: folderId || null,
      tags: tags || [],
      color: color || '#1f2937',
      wordCount
    });

    await note.save();

    // Update folder note count if applicable
    if (folderId) {
      await Folder.findByIdAndUpdate(folderId, {
        $inc: { noteCount: 1 }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create note'
    });
  }
});

// Get user notes with filtering and pagination
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const {
      folderId,
      search,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'lastEdited',
      sortOrder = 'desc'
    } = req.query;

    const query = { userId: req.userId };

    // Filter by folder
    if (folderId === 'null' || folderId === '') {
      query.folderId = null;
    } else if (folderId) {
      query.folderId = folderId;
    }

    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const notes = await Note.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Note.countDocuments(query);

    res.json({
      success: true,
      notes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotes: total
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes'
    });
  }
});

// Get single note
app.get('/api/notes/:noteId', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch note'
    });
  }
});

// Update note
app.put('/api/notes/:noteId', authenticateToken, async (req, res) => {
  try {
    const { title, content, folderId, tags, color, isPinned } = req.body;
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    const oldFolderId = note.folderId;

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) {
      note.content = content;
      note.wordCount = content ? content.trim().split(/\s+/).length : 0;
    }
    if (folderId !== undefined) note.folderId = folderId;
    if (tags !== undefined) note.tags = tags;
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;

    note.lastEdited = new Date();

    await note.save();

    // Update folder counts if folder changed
    if (oldFolderId?.toString() !== note.folderId?.toString()) {
      if (oldFolderId) {
        await Folder.findByIdAndUpdate(oldFolderId, {
          $inc: { noteCount: -1 }
        });
      }
      if (note.folderId) {
        await Folder.findByIdAndUpdate(note.folderId, {
          $inc: { noteCount: 1 }
        });
      }
    }

    res.json({
      success: true,
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update note'
    });
  }
});

// Delete note
app.delete('/api/notes/:noteId', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Delete attached files
    if (note.attachments && note.attachments.length > 0) {
      note.attachments.forEach(attachment => {
        const filePath = path.join('uploads', 'notes', path.basename(attachment.fileUrl));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    const folderId = note.folderId;
    await Note.findByIdAndDelete(req.params.noteId);

    // Update folder count if note was in a folder
    if (folderId) {
      await Folder.findByIdAndUpdate(folderId, {
        $inc: { noteCount: -1 }
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete note'
    });
  }
});
// Upload attachment to note
app.post('/api/notes/:noteId/attachments', authenticateToken, notesUpload.array('files', 5), async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const attachments = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/notes/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size
    }));

    note.attachments.push(...attachments);
    await note.save();

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      attachments
    });
  } catch (error) {
    console.error('Upload attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
});

// Delete attachment
app.delete('/api/notes/:noteId/attachments/:attachmentId', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    const attachment = note.attachments.id(req.params.attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    // Delete file from filesystem
    const filePath = path.join('uploads', 'notes', path.basename(attachment.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    attachment.remove();
    await note.save();

    res.json({
      success: true,
      message: 'Attachment deleted successfully'
    });
  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete attachment'
    });
  }
});

// Download attachment
app.get('/api/notes/:noteId/attachments/:attachmentId/download', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    const attachment = note.attachments.id(req.params.attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    const filePath = path.join('uploads', 'notes', attachment.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('Download attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file'
    });
  }
});
// Get notes statistics
app.get('/api/users/:userId/notes-stats', authenticateToken, async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({ userId: req.params.userId });
    const totalFolders = await Folder.countDocuments({ userId: req.params.userId });
    const pinnedNotes = await Note.countDocuments({ userId: req.params.userId, isPinned: true });

    // Get total word count
    const wordStats = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: null, totalWords: { $sum: "$wordCount" } } }
    ]);

    // Get notes per folder
    const folderStats = await Folder.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $project: { name: 1, noteCount: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalNotes,
        totalFolders,
        pinnedNotes,
        totalWords: wordStats[0]?.totalWords || 0,
        folderStats
      }
    });
  } catch (error) {
    console.error('Get notes stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes statistics'
    });
  }
});
// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});