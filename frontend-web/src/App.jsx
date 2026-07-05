import AppRoutes from "./routes/AppRoutes";
import { RegisterProvider } from "@/context/RegisterContext";

function App() {
  return (
    <RegisterProvider>
      <AppRoutes />
    </RegisterProvider>
  );
}

export default App;