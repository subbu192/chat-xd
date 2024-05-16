const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const connectDb = require('./libs/db');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const frndRoutes = require('./routes/frnd');
const chatRoutes = require('./routes/chat');

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000"
    }
});
const PORT = 4000;

const authMiddleware = async (req, res, next) => {
    const url = req.url;
    if (url.startsWith('/auth')) {
        next();
    } else {
        const authorizationHeader = req.header("Authorization");
        const userData = req.body.userData;

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid authorization header" });
        } else {
            const token = authorizationHeader.replace("Bearer ", "");

            if (!token) {
                return res
                    .status(401)
                    .json({ success: false, message: "Authorization token not found" });
            } else {
                try {
                    const decoded = jwt.verify(token,process.env.JWT_SECRET);
                    if (decoded == JSON.stringify(userData)) {
                        next();
                    } else {
                        return res.status(401).json({ success: false, message: "Authentication failed" });
                    }
                    next();
                } catch (err) {
                    console.error(err);
                    return res.status(401).json({ success: false, message: "Invalid token" });
                }
            }
        }
    }

    next();
}

app.use(cors());
app.use(express.json());
// app.use(authMiddleware);
app.use('/auth', authRoutes);
app.use('/frnds', frndRoutes);
app.use('/chats', chatRoutes);

io.on('connection', (socket) => {
    console.log('A User Connected');

    socket.on('addFriend', (userName) => {
        console.log('Friend Added: ' + userName);
    })

    socket.on('join', (userData) => {
        socket.join(userData.userPhone);
        console.log(userData.userPhone, 'joined the Server');
    })

    socket.on('leave', (userData) => {
        socket.leave(userData.userPhone);
    })

    socket.on('addFriend', (reqData) => {
        io.to(reqData.toID).emit('newFrndReq', reqData.fromData);
    })

    socket.on('updateFR', (from, to, status) => {
        if (status == 'accept') {
            io.to(from.userPhone).emit('addContact', to);
            io.to(to.userPhone).emit('addContact', from);
        } else {
            console.log('User Rejected FR.');
        }
    })

    socket.on('sendMsg', (msgData) => {
        io.to(msgData.toID).emit('gotMsg', msgData);
        io.to(msgData.fromID).emit('gotMsg', msgData);
    });

    socket.on('removeFrnd', (fromID, toID) => {
        io.to(fromID).emit('rmFrnd', toID);
        io.to(toID).emit('rmFrnd', fromID);
        console.log('Unfriended successfully 2.');
    })
});

const startServer = async () => {
    if (await connectDb()) {
        server.listen(PORT, () => {
            console.log('Server Started at PORT: 4000');
        })
    } else {
        console.log('Server Failed to start.');
    }
}

startServer();