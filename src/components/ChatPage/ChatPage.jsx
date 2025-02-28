import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  addDoc,
  orderBy,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Sidebar from "../sidebar";

const ChatPage = () => {
  const { chatId: initialChatId } = useParams();
  const auth = getAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(initialChatId);

  const defaultProfile = "/assets/default1.png"; // Accessing from the public folder

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchChatsWithLastMessage = async () => {
      const q = query(collection(db, "chats"), where("users", "array-contains", auth.currentUser.uid));
      const chatSnapshot = await getDocs(q);

      const chatList = await Promise.all(
        chatSnapshot.docs.map(async (chatDoc) => {
          const chatData = chatDoc.data();
          const otherUserId = chatData.users.find((id) => id !== auth.currentUser.uid);

          // Fetch other user's info
          const userDoc = await getDoc(doc(db, "users", otherUserId));
          const userName = userDoc.exists() ? userDoc.data().name : "Unknown";
          const userProfilePicture = userDoc.exists() && userDoc.data().profilePictureUrl
            ? userDoc.data().profilePictureUrl
            : defaultProfile;

          // Fetch last message in the chat
          const messagesRef = collection(chatDoc.ref, "messages");
          const lastMessageQuery = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
          const lastMessageSnapshot = await getDocs(lastMessageQuery);

          const lastMessage = lastMessageSnapshot.docs.length > 0
            ? lastMessageSnapshot.docs[0].data().text
            : "No messages yet";

          return {
            id: chatDoc.id,
            name: userName,
            profilePictureUrl: userProfilePicture,
            lastMessage,
          };
        })
      );

      setChats(chatList);

      // Automatically set the first chat as active if none is selected
      if (!activeChat && chatList.length > 0) {
        setActiveChat(chatList[0].id);
      }
    };

    fetchChatsWithLastMessage();
  }, [auth.currentUser]);

  useEffect(() => {
    if (!activeChat) return;

    const chatRef = doc(db, "chats", activeChat);
    const messagesRef = collection(chatRef, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [activeChat]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!activeChat) return;

      const chatRef = doc(db, "chats", activeChat);
      const chatSnap = await getDoc(chatRef);
      if (chatSnap.exists()) {
        const userIds = chatSnap.data().users;
        const userDetailsData = {};

        for (const userId of userIds) {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            userDetailsData[userId] = {
              name: userDoc.data().name,
              profilePictureUrl: userDoc.data().profilePictureUrl || defaultProfile,
            };
          }
        }
        setUserDetails(userDetailsData);
      }
    };
    fetchUserDetails();
  }, [activeChat]);

  const sendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    const chatRef = doc(db, "chats", activeChat);
    const messagesRef = collection(chatRef, "messages");
    await addDoc(messagesRef, {
      senderId: auth.currentUser.uid,
      text: message,
      timestamp: new Date(),
    });
    setMessage("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <Sidebar/>
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #ffff;
            border-radius: 4px;
          }
        `}
      </style>

      {/* Sidebar for chat list */}
      <div className="ml-20 w-1/4 bg-gray-800 p-4">
      
        <h2 className="text-xl font-bold text-teal-400 mb-4">Your Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 cursor-pointer rounded-lg flex items-center gap-3 ${
              activeChat === chat.id ? "bg-teal-500" : "bg-gray-700"
            }`}
            onClick={() => setActiveChat(chat.id)}
          >
            <img
              src={chat.profilePictureUrl}
              alt={chat.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p>{chat.name}</p>
              <p className="text-xs text-gray-400">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
        <Button onClick={handleLogout} className="bg-red-500 text-white w-full mt-4">
          Logout
        </Button>
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col items-center p-6">
        <Card className="bg-gray-800 shadow-lg w-full max-w-6xl p-4 flex flex-col">
          <CardContent className="overflow-y-auto h-[75vh] flex flex-col gap-2 pr-2">
            {messages.map((msg) => {
              const isCurrentUser = msg.senderId === auth.currentUser.uid;
              return (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg max-w-xs flex items-center gap-3 ${
                    isCurrentUser
                      ? "bg-teal-500 text-white self-end"
                      : "bg-gray-700 text-white self-start"
                  }`}
                >
                  {!isCurrentUser && (
                    <img
                      src={userDetails[msg.senderId]?.profilePictureUrl}
                      alt={userDetails[msg.senderId]?.name || "Unknown"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm text-gray-300">
                      {userDetails[msg.senderId]?.name || "Unknown"}
                    </p>
                    <p className="text-lg">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
              placeholder="Type a message..."
            />
            <Button
              onClick={sendMessage}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
            >
              Send
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
