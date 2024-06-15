import { TopBar } from "./Components/Header/NavBar/TopBar/TopBar";
import { NavBar } from "./Components/Header/NavBar/NavBar";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { About } from "./pages/About/About";
import { Courses } from "./pages/Courses/Courses";
import { OnCampus } from "./pages/Degrees/OnCampus";
import { Online } from "./pages/Degrees/Online";
import { Portal } from "./pages/Students/Portal";
import { Services } from "./pages/Students/Services";
import { Info } from "./pages/NewStudents/Info";
import { Requirements } from "./pages/NewStudents/Requirements";
import { ChatBox } from "./Components/ChatBox/ChatBox";
import { Footer } from "./Components/Footer/Footer";
import { Login } from "./pages/Count/Login";
import { Inscription } from "./pages/Inscription/Inscription";
import { Category } from "./Components/Category/Category";
import { Register } from "./pages/Count/Register";
import { DisplayDegree } from "./Components/DisplayDegree/DisplayDegree";

export const App: React.FC = () => {
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
        <Route path="/career/:careerId" element={<DisplayDegree />} />
      </Routes>

      <Footer />
      <ChatBox />
    </>
  );
};
