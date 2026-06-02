import { LoginProvider } from "./context/LoginContextProvider";
import { BoxProvider } from "./context/BoxContextProvider";

import { AppRoutes } from "./routes/AppRoutes";

function App() {

  return (

    <LoginProvider>

      <BoxProvider>

        <AppRoutes />

      </BoxProvider>

    </LoginProvider>

  );
}

export default App;