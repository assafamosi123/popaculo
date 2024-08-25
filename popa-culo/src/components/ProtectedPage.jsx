import { Navigate } from "react-router-dom";


const ProtectedPage = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedPage