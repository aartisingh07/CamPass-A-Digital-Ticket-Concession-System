import { Navigate, useLocation } from "react-router-dom";

const ProtectedStudentRoute = ({ children }) => {
  const student = JSON.parse(localStorage.getItem("student"));
  const location = useLocation();

  if (!student) {
    return <Navigate to="/student-login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedStudentRoute;