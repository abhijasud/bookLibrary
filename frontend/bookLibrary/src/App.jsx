import { createContext, useEffect, useState } from 'react'
import { lookInSession } from './common/session';
import Navbar from './components/Navbar';
import { Route, Routes } from "react-router-dom";
import UserAuthForm from './components/UserAuthForm';
import HomePage from './components/HomePage';
import CreateBookForm from './components/CreateBookForm';
import Improvments from './components/Improvments';

export const UserContext = createContext({});

function App() {

  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {

    let userInSession = lookInSession("user");

    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });


  }, [])

  return (

    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>

        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
        </Route>

        <Route path='/create' element={<CreateBookForm />} />
        <Route path='/possibleImprovments' element={<Improvments />} />

      </Routes>
    </UserContext.Provider>

  )
}

export default App
