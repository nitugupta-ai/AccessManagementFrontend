import { useNavigate } from "react-router-dom";
import "./Landing.css"; 

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-card">
                <h1 className="landing-title">
                    Welcome to <span className="highlight">Access Management Tool</span>
                </h1>
                <p className="landing-description">
                    Securely manage roles, users, and access permissions.
                </p>
                <div className="button-group">
                    <button className="btn btn-login" onClick={() => navigate("/login")}>
                        Login
                    </button>
                    <button className="btn btn-register" onClick={() => navigate("/register")}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
