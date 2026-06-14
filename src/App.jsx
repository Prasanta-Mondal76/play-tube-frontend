import { LoginProvider } from "./context/LoginContextProvider";
import { BoxProvider } from "./context/BoxContextProvider";
import { SocketContextProvider } from "./context/SocketContextProvider";
import { Toaster } from "react-hot-toast";

import { AppRoutes } from "./routes/AppRoutes";

function App() {

  return (

    <LoginProvider>

      <SocketContextProvider>

        <BoxProvider>

          <AppRoutes />

          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#18181b",
                color: "#fff",
                border: "1px solid #3f3f46",
              },
            }}
          />

        </BoxProvider>
        
      </SocketContextProvider>

    </LoginProvider>

  );
}

export default App;