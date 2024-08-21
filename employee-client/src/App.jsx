import "./App.css";
import MainLayout from "./layout/MainLayout";
import AuthContextProvider from "./lib/context/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}

export default App;
