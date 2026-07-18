import AppRoutes from "./routes/AppRoutes";
import { RegisterProvider } from "@/context/RegisterContext";
import { ChatProvider } from "@/context/ChatContext";

function App() {
  
  return (
    <RegisterProvider>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </RegisterProvider>
  );
}

export default App;
