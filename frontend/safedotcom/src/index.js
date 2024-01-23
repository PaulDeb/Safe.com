import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import Home from "./components/Home";
import Header from "./components/Header";
import PrivateRoute from "./tools/PrivateRoute";
import NotFoundError from "./components/NotFoundError";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Profile from "./components/account/Profile";
import Cours from "./components/account/Cours";
import About from "./components/account/About";

import "./css/index.css";
import 'react-notifications/lib/notifications.css';

const App = () => {
  return (
    <BrowserRouter>
    	<NotificationContainer/>
    	<Routes>
			<Route path="/" element={<Header />}>
				<Route index element={<Home />} />
				<Route path="home" element={<Home />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="account/" element={<PrivateRoute element={<Account />} /> }>
					<Route index element={<Profile/>}/>
					<Route path="profile" element={<Profile/>}/>
					<Route path="cours" element={<Cours/>}/>
					<Route path="about" element={<About/>}/>
				</Route>
				<Route path="*" element={<NotFoundError />} />
        	</Route>
      	</Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;