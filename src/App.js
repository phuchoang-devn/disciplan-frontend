import './variables.css'
import env from './env';
import Login from "./login"
import Home from "./home"
import HomeDay from './components/home_day';
import HomeWeek from './components/home_week';
import HomeYear from './components/home_year';
import HomeMonth from './components/home_month';
import NoPage from './components/no_page';

import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [email, setEmail] = useState("");

  const initalFetch = useRef(false);

  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem("disciplan_user"));

    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false);
      return
    }

    if (initalFetch.current) return;
    initalFetch.current = true;
    // If the token exists, verify it with the auth server to see if it is valid
    fetch("http://" + env.BACKEND_SERVER + "/users/verify", {
      method: "POST",
      headers: {
        'Authorization': user.token
      }
    })
      .then(r => {
        if (r.ok) return r.json();
        throw new Error('Invalid Token');
      })
      .then(r => {
        setLoggedIn("success" === r.message);
        setEmail(user.email || "");
      })
      .catch(e => {
        setLoggedIn(false);
        console.log(e.message);
      })
  }, [])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}>
          <Route index path="week" element={<HomeWeek />} />
          <Route path="day" element={<HomeDay />} />
          <Route path="month" element={<HomeMonth />} />
          <Route path="year" element={<HomeYear />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route
          path="/login"
          element={
            <Login
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              setEmail={setEmail}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )

}

export default App;
