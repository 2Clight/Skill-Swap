import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, addDoc, orderBy, query } from "firebase/firestore";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const ChatPage = () => {
  const { chatId } = useParams();
  const auth = getAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);
      if (chatSnap.exists()) {
        const userIds = chatSnap.data().users;
        const usernamesData = {};
        for (const userId of userIds) {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            usernamesData[userId] = userDoc.data().name;
          }
        }
        setUsernames(usernamesData);
      }
    };
    fetchUsernames();
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const chatRef = doc(db, "chats", chatId);
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
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
         <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
            
          }
          ::-webkit-scrollbar-thumb {
            background-color: white;
            border-radius: 4px;
           
          }
        `}
      </style>
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-teal-400">Chat</h1>
        <Button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Logout</Button>
      </div>
      <Card className="bg-gray-800 shadow-lg w-full max-w-2xl p-4 flex flex-col">
        <CardContent className="overflow-y-auto max-h-[60vh] flex flex-col gap-2 px-2">
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === auth.currentUser.uid;
            return (
              <div
                key={msg.id}
                className={`p-3 rounded-lg max-w-xs ${
                  isCurrentUser ? "bg-teal-500 text-white self-end" : "bg-gray-700 text-white self-start"
                }`}
              >
                <p className="text-sm text-gray-300">{usernames[msg.senderId] || "Unknown"}</p>
                <p className="text-lg">{msg.text}</p>
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
          <Button onClick={sendMessage} className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
