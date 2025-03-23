import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Handle system chat (we don't actually save system messages to the database)
    if (receiverId === "system") {
      // Create a fake message response but don't save it
      const systemMessage = {
        _id: "system-" + Date.now(),
        senderId,
        receiverId: "system",
        message,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return res.status(201).json(systemMessage);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();

    //This will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    //FROM HERE I WILL IMPLEMENT SOCKET IO FUNCTIONALITY

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      //io.to(<socket_Id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller : ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Handle system chat (no need to query database for system chat)
    if (userToChatId === "system") {
      return res.status(200).json([]);
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); //potulate, gives actual messages not message refrence

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller : ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
