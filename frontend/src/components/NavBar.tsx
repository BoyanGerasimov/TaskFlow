import React, { useState } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
const NavBar = ({
  isAuthenticated,
  onLogout
}) => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };
  return <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Project Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && <>
                <Nav.Link as={Link} to="/projects">
                  Projects
                </Nav.Link>
                <Nav.Link as={Link} to="/tasks">
                  Tasks
                </Nav.Link>
              </>}
          </Nav>
          <Nav>
            {isAuthenticated ? <div className="d-flex align-items-center">
                <Dropdown show={showSettings} onToggle={isOpen => setShowSettings(isOpen)}>
                  <Dropdown.Toggle as="div" id="settings-dropdown" className="bg-transparent border-0 p-0 me-3" style={{
                cursor: 'pointer'
              }}>
                    <SettingsIcon size={20} color="white" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item as={Link} to="/projects/archived">
                      View Archives
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </div> : <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>;
};
export default NavBar;