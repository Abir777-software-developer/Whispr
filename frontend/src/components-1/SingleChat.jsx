import { Text, Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider.jsx";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getSender, getSenderFull } from "../config/Chatlogic.jsx";
import Profilemodal from "./miscellaneous/Profilemodal.jsx";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal.jsx";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { toaster } from ".././components/ui/toaster.jsx";
import "./Styles.css";
import ScrollableChat from "./ScrollableChat.jsx";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/ani.json";

// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = "https://whispr-backend-rr1w.onrender.com";

var socket, selectedChatcompare;
function SingleChat({ fetchagain, setfetchagain }) {
  const { user, selectedChat, setSelectedChat, notification, setnotification } =
    ChatState() || {};
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState("");
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, settyping] = useState(false);
  const [istyping, setistyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setloading(true);

      const { data } = await axios.get(
        `https://whispr-backend-rr1w.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      // console.log(messages);

      setmessages(data);
      setloading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toaster.create({
        title: "Error occured",
        description: "failed to load the chats",
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConnected(true));
    socket.on("typing", () => setistyping(true));
    socket.on("stop typing", () => setistyping(false));
  }, []);
  useEffect(() => {
    fetchMessages();
    selectedChatcompare = selectedChat;
  }, [selectedChat]);

  // console.log(notification, "-------");
  // console.log(typeof notification);

  //receiving the message
  useEffect(() => {
    socket.on("message received", (newmessagereceived) => {
      if (
        !selectedChatcompare ||
        selectedChatcompare._id !== newmessagereceived.Chat._id
      ) {
        //give notifications
        if (!notification.includes(newmessagereceived)) {
          setnotification([newmessagereceived, ...notification]);
          setfetchagain(!fetchagain);
        }
      } else {
        setmessages([...messages, newmessagereceived]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newmessage) {
      socket.emit("stop typing", selectedChat._id);
      event.preventDefault();
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewmessage("");

        const { data } = await axios.post(
          "https://whispr-backend-rr1w.onrender.com/api/message",
          {
            content: newmessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);

        socket.emit("new message", data);
        setmessages([...messages, data]);
      } catch (error) {
        toaster.create({
          title: "Error occured",
          description: "failed to send the chats",
          type: "error",
          duration: 5000,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setnewmessage(e.target.value);

    // Typing handler logic
    if (!socketConnected) return;

    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lasttypingtime = new Date().getTime();
    var timerlength = 3000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var timediff = timenow - lasttypingtime;

      if (timediff >= timerlength && typing) {
        socket.emit("stop typing", selectedChat._id);
        settyping(false);
      }
    }, timerlength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="cursive"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Button
              size="xs"
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <Profilemodal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchagain={fetchagain}
                  setfetchagain={setfetchagain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              <VStack gap="4">
                <Field.Root orientation="horizontal" id="namefield" mt={3}>
                  {/* <Field.Label>Name</Field.Label> */}
                  {/* <Text fontsize="md" fontweight="bold">
                        Name
                      </Text> */}
                  {istyping ? (
                    <div>
                      <Lottie
                        options={defaultOptions}
                        width={70}
                        style={{ marginBottom: 15, marginLeft: 0 }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <Input
                    variant="filled"
                    onKeyDown={sendMessage}
                    id="enter-mess"
                    placeholder="Enter a message"
                    value={newmessage}
                    onChange={typingHandler}
                  />
                  {/* <Button
                    variant="solid"
                    bg="blue"
                    color="white"
                    ml={1}
                    onClick={handleRename}
                    loading={renameLoading}
                  >
                    Update
                  </Button> */}
                </Field.Root>
              </VStack>
            </form>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="cursive">
            Click on a User to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
