import UserProvider from "./context/UserProvider";
import Routers from "./routes/Router";
import "bootstrap/dist/css/bootstrap.min.css";
const App = () => {
  return (
    <UserProvider>
      <Routers />
    </UserProvider>
  );
};
export default App;
