import { TopBar } from "./Components/Header/NavBar/TopBar/TopBar";
import { NavBar } from "./Components/Header/NavBar/NavBar";
import { Route, Routes } from "react-router-dom";
import { Home } from "../src/pages/Home/Home";
import { About } from "../src/pages/About/About";
import { Courses } from "../src/pages/Courses/Courses";
import { OnCampus } from "../src/pages/Degrees/OnCampus";
import { Online } from "../src/pages/Degrees/Online";
import { Portal } from "../src/pages/Students/Portal";
import { Services } from "../src/pages/Students/Services";
import { Info } from "../src/pages/NewStudents/Info";
import { Requirements } from "../src/pages/NewStudents/Requirements";
import { ChatBox } from "../src/Components/ChatBox/ChatBox";
import { Footer } from "../src/Components/Footer/Footer";
import { Login } from "./pages/Count/Login";
import { Inscription } from "../src/pages/Inscription/Inscription";
import { Category } from "../src/Components/Category/Category";
import { Register } from "../src/pages/Count/Register";

export const App = () => {
  return (
    <>
      <TopBar />
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/requisitos" element={<Requirements />} />
        <Route path="/online" element={<Online />} />
        <Route path="/presenciales" element={<OnCampus />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscripciones" element={<Inscription />} />
        <Route path="/area/:category" element={<Category />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
      <ChatBox />
    </>
  );
};
