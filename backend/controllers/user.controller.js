import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

// Get only users that the current user has had conversations with
export const getUserConversations = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all conversations where the current user is involved
    const conversations = await Conversation.find({
      participants: { $in: [loggedInUserId] }
    }).populate({
      path: "participants",
      select: "-password",
      match: { _id: { $ne: loggedInUserId } } // Only include other participants
    });

    // Extract the other participants from conversations
    const conversationUsers = conversations.map(conv => conv.participants[0]);
    
    // Filter out any null values (in case of data inconsistency)
    const filteredUsers = conversationUsers.filter(user => user);

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUserConversations: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Original function to get all users (we'll keep this for reference)
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search users by name
export const searchUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const searchTerm = req.query.name;

    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }

    // Search for users whose fullName contains the search term (case-insensitive)
    const users = await User.find({
      _id: { $ne: loggedInUserId },
      fullName: { $regex: searchTerm, $options: "i" }
    }).select("-password").limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
