import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // profilePhoto
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await User.find({
            $and: [
                { 
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        { fullName: { $regex: query, $options: 'i' } }
                    ]
                },
                { isSystemUser: { $ne: true } }
            ]
        }).select("-password");

        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error searching users" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            });
        };

        // Simple password comparison
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            });
        };

        // Handle welcome message logic if needed
        await handleWelcomeMessage(user);

        // Create a simple token with just the userId
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' } // Longer expiration for simplicity
        );

        // Set cookie with simpler options
        res.cookie("token", token, { 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            path: '/'
        });

        // Return user data with token for client-side storage
        return res.status(200).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            hasSeenWelcome: user.hasSeenWelcome,
            token: token // Include token in response for client-side storage
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error during login" });
    }
}

// Helper function to handle welcome message
async function handleWelcomeMessage(user) {
    try {
        // Reset hasSeenWelcome if user logs in again
        if (user.hasSeenWelcome) {
            user.hasSeenWelcome = false;
            await user.save();
        }

        // Check if user is logging in for the first time
        if (!user.hasSeenWelcome) {
            // Find or create system user
            let systemUser = await User.findOne({ isSystemUser: true });
            if (!systemUser) {
                systemUser = await User.create({
                    fullName: "ChatterBox System",
                    username: "system",
                    password: await bcrypt.hash(Math.random().toString(36), 10),
                    gender: "system",
                    isSystemUser: true,
                    profilePhoto: "https://avatar.iran.liara.run/public/boy?username=system"
                });
            }

            // Create welcome message
            const Message = mongoose.model('Message');
            await Message.create({
                senderId: systemUser._id,
                receiverId: user._id,
                message: "Welcome to ChatterBox! Start chatting by searching for users in the search box."
            });

            // Mark user as having seen welcome message
            user.hasSeenWelcome = true;
            await user.save();
        }
    } catch (error) {
        console.error("Error handling welcome message:", error);
        // Continue even if welcome message fails
    }
}

export const logout = (req, res) => {
    try {
        // Simple cookie clearing
        res.cookie("token", "", { maxAge: 0 });
        return res.status(200).json({
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error during logout" });
    }
}

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Error fetching user" });
    }
};
