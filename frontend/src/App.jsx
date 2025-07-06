import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import Landing from "./pages/Landing";
import DiscussionPage from "./pages/DiscussionPage";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import Sheets from "./pages/Sheets";
import AdminUpdate from "./components/AdminUpdate";
import ProfileUpdate from "./components/ProfileUpdate";
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Landing></Landing> : <Navigate to="/signup" />
          }
        ></Route>
        <Route
          path="/problems"
          element={
            isAuthenticated ? <Homepage></Homepage> : <Navigate to="/signup" />
          }
        ></Route>
        <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile></Profile> : <Navigate to="/signup" />
          }
        ></Route>
        <Route
          path="/resources"
          element={
            isAuthenticated ? (
              <Resources></Resources>
            ) : (
              <Navigate to="/signup" />
            )
          }
        ></Route>
        <Route
          path="/sheets"
          element={
            isAuthenticated ? <Sheets></Sheets> : <Navigate to="/signup" />
          }
        ></Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login></Login>}
        ></Route>
        <Route
          path="/discuss"
          element={isAuthenticated ? <DiscussionPage /> : <Signup></Signup>}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup></Signup>}
        ></Route>
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Admin />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/create"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/delete"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminDelete />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/video"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminVideo />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/upload/:problemId"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpload />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/update"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpdate />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/user/update/:id"
          element={isAuthenticated ? <ProfileUpdate /> : <Navigate to="/" />}
        />
        <Route path="/problem/:problemId" element={<ProblemPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
