import expressAsyncHandler from "express-async-handler";
import { Message } from "../Models/MessageModel.js";
import { User } from "../Models/Usermodel.js";
import { Chat } from "../Models/chatModel.js";

export const sendMessage = expressAsyncHandler(async (req, res) => {
  //3 thinfs to require while sending message
  //chatId
  //message content
  //sender
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    Chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("Chat");
    // message = await User.populate(message, {
    //   path: "Chat.users",
    //   select: "name pic email",
    // });
    message = await message.populate({
      path: "Chat",
      populate: {
        path: "users",
        select: "name pic email",
      },
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const allMessage = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ Chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("Chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
