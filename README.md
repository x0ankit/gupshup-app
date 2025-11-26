# GupShup - Real-time Chat Application 💬

GupShup is a full-stack real-time messaging application built with the **MERN stack**. It enables seamless, instant communication between users with features like typing indicators, read receipts, and image sharing.

![Project Preview](https://via.placeholder.com/800x400?text=App+Screenshot+Here)
*(Add your own screenshots here later!)*

## 🚀 Features

- **Real-time Messaging**: Instant delivery using Socket.io.
- **Online Status**: See who is online in real-time.
- **Typing Indicators**: Visual feedback when someone is typing.
- **Read Receipts**: "Seen" and "Delivered" status updates.
- **Rich Media**: Send images with full-screen preview modal.
- **Authentication**: Secure JWT-based login and signup.
- **Theme Support**: Multiple visual themes (Dark, Light, etc.).
- **Responsive Design**: Optimized for both Desktop and Mobile.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- TailwindCSS & DaisyUI (Styling)
- Zustand (State Management)
- Axios (API Requests)

**Backend:**
- Node.js & Express.js
- MongoDB (Database)
- Socket.io (Real-time Engine)
- Cloudinary (Image Storage)

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the root directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development