import { LoginProvider } from "./context/LoginContextProvider";
import { AuthProvider } from "./context/AuthContextProvider";

import { AppRoutes } from "./routes/AppRoutes";

function App() {

  return (

    <LoginProvider>

      <AuthProvider>

        <AppRoutes />

      </AuthProvider>

    </LoginProvider>

  );
}

export default App;