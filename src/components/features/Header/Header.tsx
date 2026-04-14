import { type FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../ui/Button/Button";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";
import { useAuthentication } from "../../../context/AuthenticationContext";
import {
  homePath,
  dashboardDoctorPath,
  dashboardPatientPath,
  doctorsPath,
  authLoginPath,
} from "../../../utils/path";
import "./styles.css";

export const Header: FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, isLoading } = useAuthentication();

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      logout();
      handleRedirect(homePath);
    } catch (error) {
      console.error("Failed to notify backend of logout:", error);
    }
  };

  const handleProfileRedirect = (user: { role?: string } | null) => {
    if (user?.role === "doctor") {
      navigate(dashboardDoctorPath);
    } else {
      navigate(dashboardPatientPath);
    }
  };

  const showDoctorsButton = user?.role === "owner";
  const avatarStorageKey = user?.id ? `avatar-${user.role}-${user.id}` : undefined;

  const menuItems = [
    {
      label: "My profile",
      redirect: () => handleProfileRedirect(user),
    },
    {
      label: "Logout",
      redirect: () => handleLogout(),
    },
  ];

  return (
    <header className="site-header">
      <div className="container">
        <div className="header__left">
          <Link className="logo" to={homePath}>
            <span className="logo__mark">🐾</span>
            <span className="logo__text">HealthyPaws</span>
          </Link>
        </div>
        <div className="header__right">
          <nav className="header__nav" aria-label="Primary">
            <Link to={homePath} className="nav__link">
              Home
            </Link>
            {showDoctorsButton && (
              <Link to={doctorsPath} className="nav__link">
                Doctors
              </Link>
            )}
          </nav>
          {isLoading ? (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                animation: "pulse 1.5s infinite",
              }}
            />
          ) : isLoggedIn ? (
            <ProfilePicture
              menuItems={menuItems}
              avatarStorageKey={avatarStorageKey}
            />
          ) : (
            <Button
              onClick={() => handleRedirect(authLoginPath)}
              text="Login"
              color="default"
              size="md"
            />
          )}
        </div>
      </div>
    </header>
  );
};
