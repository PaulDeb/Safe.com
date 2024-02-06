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
import About from "./components/account/About";
import Progression from "./components/Progression";
import CoursList from "./components/cours/CoursList";
import NewCours from "./components/cours/NewCours";
import LessonList from "./components/lesson/LessonList";
import LessonEditor from "./components/lesson/LessonEditor";
import LessonView from "./components/lesson/LessonView";

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
					<Route path="about" element={<About/>}/>
				</Route>
				<Route path="progression" element={<PrivateRoute element={<Progression/>} /> } />
				<Route path="cours" element={<PrivateRoute element={<CoursList/>} /> } />
				<Route path="cours/" >
					<Route index element={<PrivateRoute element={<CoursList/>} /> } />
					<Route path="new" element={<PrivateRoute element={<NewCours/>} /> } />
					<Route path=":coursId/lessons">
						<Route index element={<PrivateRoute element={<LessonList />} />} />
						<Route path=":lessonId" element={<PrivateRoute element={<LessonView />} /> } />
						<Route path=":lessonId/edit" element={<PrivateRoute element={<LessonEditor />} /> } />
					</Route>
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