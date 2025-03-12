import { Link } from "react-router-dom";
import "./Forbidden.css";

const Forbidden = () => {
    return (
        <div className="forbidden-container">
            <h1 className="forbidden-title">403</h1>
            <h2 className="forbidden-subtitle">Access Denied</h2>
            <p className="forbidden-text">
                You don't have permission to access this page.
            </p>
            <Link to="/" className="forbidden-home-link">
                Go to Homepage
            </Link>
        </div>
    );
};

export default Forbidden;
