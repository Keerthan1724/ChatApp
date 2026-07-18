import { useEffect, useRef, useState } from "react";

export default function useSocket(conversationId, token, onMessage, onPresenceChange) {
  const socketRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const onMessageRef = useRef(onMessage);
  const onPresenceChangeRef = useRef(onPresenceChange);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onPresenceChangeRef.current = onPresenceChange;
  }, [onMessage, onPresenceChange]);

  useEffect(() => {
    if (!conversationId || !token) return;

    const wsTargetHost = "127.0.0.1:8000";
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    const socket = new WebSocket(
      `${protocol}://${wsTargetHost}/ws/chat/${conversationId}/?token=${token}`,
    );

    socket.onopen = () => {
      setIsReady(true);
      console.info("WebSocket connected securely to conversation:", conversationId);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WS DATA RECEIVED:", data);

      if (data.type === "new_message") {
        console.log("MESSAGE content:", data.message);
        onMessageRef.current?.(conversationId, data.message);
      }

      if (data.type === "presence_change" && data.presence) {
        console.log("PRESENCE state change:", data.presence);
        onPresenceChangeRef.current?.(data.presence);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket exception encountered:", error);
    };

    socket.onclose = (event) => {
      setIsReady(false);
      console.warn(`WebSocket connection closed. Code: ${event.code}`);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
      setIsReady(false);
    };
  }, [conversationId, token]); 

  const sendMessage = (content) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("Unable to send text: WS state is not currently open.");
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "send_message",
        content,
      }),
    );
  };

  return {
    socketRef,
    isReady,
    sendMessage,
  };
}