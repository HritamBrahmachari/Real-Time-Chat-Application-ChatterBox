import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import mongoose from "mongoose";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        

        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO - Check if receiver is online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            // Find sender info to send along with the message
            const senderInfo = await User.findById(senderId)
                .select('fullName username profilePhoto gender');
                
            // Send message and sender info for new conversations
            io.to(receiverSocketId).emit("newMessage", {
                ...newMessage.toObject(),
                senderInfo
            });
        }
        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending message" });
    }
}

export const getSystemMessages = async (req, res) => {
    try {
        const userId = req.id;
        
        // Find system user
        const systemUser = await User.findOne({ isSystemUser: true });
        if (!systemUser) {
            return res.status(200).json([]);
        }

        // Get messages from system user
        const messages = await Message.find({
            $or: [
                { senderId: systemUser._id, receiverId: userId },
                { senderId: userId, receiverId: systemUser._id }
            ]
        }).populate('senderId', 'fullName profilePhoto isSystemUser');

        // Set selectedUser to system user for message display
        const response = {
            messages,
            systemUser: {
                _id: systemUser._id,
                fullName: systemUser.fullName,
                profilePhoto: systemUser.profilePhoto,
                isSystemUser: true
            }
        };

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching system messages" });
    }
};

export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 
        return res.status(200).json(conversation?.messages || []);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching messages" });
    }
}

export const getRecentConversations = async (req, res) => {
    try {
        const userId = req.id;
        
        // Check if userId is valid
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Valid user ID is required" });
        }
        
        // Find conversations where the user is a participant
        const conversations = await Conversation.find({
            participants: userId
        }).populate({
            path: 'participants',
            match: { _id: { $ne: userId } }, // Exclude the current user
            select: 'fullName username profilePhoto gender isSystemUser'
        });
        
        // Extract the other participants (the people the user has chatted with)
        const chatPartners = conversations.map(conv => {
            // Filter out undefined participants (in case there are any)
            const validParticipants = conv.participants.filter(p => p);
            return validParticipants.length > 0 ? validParticipants[0] : null;
        }).filter(partner => partner !== null);
        
        console.log(`Found ${chatPartners.length} recent conversations for user ${userId}`);
        
        return res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error fetching conversations:", error);
        return res.status(500).json({ message: "Error fetching conversations" });
    }
}
