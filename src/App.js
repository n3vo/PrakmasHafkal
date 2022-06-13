import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Signature } from "./Signature";
import { Step3 } from "./Step3";
import { Result } from "./Result";
import { Header } from "./components/Header";
import PrivateRoute from './components/routing/PrivateRoute.jsx';


function App() {
  return (
    <>
      <Header />
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route element={<PrivateRoute />}>
          <Route path="/step1" element={<Step1 />} />
          <Route path="/Signature" element={<Signature />} />
          <Route path="/step2" element={<Step2/>} />
          <Route path="/step3" element={<Step3/>} />
          <Route path="/result" element={<Result/>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
