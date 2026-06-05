import { LoginProvider } from "./context/LoginContextProvider";
import { BoxProvider } from "./context/BoxContextProvider";
import { Toaster } from "react-hot-toast";

import { AppRoutes } from "./routes/AppRoutes";

function App() {

  return (

    <LoginProvider>

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

    </LoginProvider>

  );
}

export default App;