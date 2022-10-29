import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";

import { store } from "./app/store";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Create from "./pages/Create";
import View from "./pages/View";

import Header from "./components/Header";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="create" element={<Create />} />
            <Route path="view/:id" element={<View />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* <Footer /> */}
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
