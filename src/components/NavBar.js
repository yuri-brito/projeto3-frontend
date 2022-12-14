import { useContext } from "react";
import { Col, Container, Nav, Navbar, Row, Button } from "react-bootstrap";
import { AuthContext } from "../contexts/authContext";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

function NavBar() {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);

  function logOut() {
    localStorage.removeItem("loggedUser");
    setLoggedUser(null);
    <Navigate to={"/"} />;
  }

  return (
    <Navbar
      style={{
        backgroundColor: "RGBA(164,184,255,0.42)",
        boxShadow:
          "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
        animation: "fadein 1.5s",
      }}
    >
      {loggedUser ? (
        <Col
          className="mx-2 d-flex flex-row align-items-end justify-content-between"
          style={{ animation: "fadein 1.5s" }}
        >
          <Col className="d-flex flex-row align-items-end justify-content-end">
            <Col>
              <img alt="SisPro logo" src={logo} width="100" height="80" />
            </Col>
            <Col className="d-flex flex-column align-items-start justify-content-center">
              <Row className="d-flex flex-row align-items-center justify-content-center">
                <Navbar.Brand className="ms-3">
                  <Link
                    to="/"
                    style={{ textDecoration: "none", color: "black" }}
                    className="text-left"
                  >
                    <b>SisPro</b> - Sistema de Produtividade
                  </Link>
                </Navbar.Brand>
              </Row>
              <Row>
                <Nav className="ms-4">
                  <Nav.Link as={"div"} className="px-1 py-0">
                    <Link to="/profile">
                      <Button className="py-0" size="sm" variant="primary">
                        Home?
                      </Button>
                    </Link>
                  </Nav.Link>
                  <Nav.Link as={"div"} className="px-1 py-0">
                    <Link to="/tarefas" style={{ padding: 0 }}>
                      <Button className="py-0" size="sm" variant="primary">
                        Tarefas
                      </Button>
                    </Link>
                  </Nav.Link>
                  {loggedUser.user.role === "admin" && (
                    // <Nav.Link href="/adminsetor">Setor</Nav.Link>
                    <Nav.Link as={"div"} className="px-1 py-0">
                      <Link to="/adminsetor">
                        <Button className="py-0" size="sm" variant="primary">
                          Setores
                        </Button>
                      </Link>
                    </Nav.Link>
                  )}
                  {loggedUser.user.role === "gestor" && (
                    <Nav.Link as={"div"} className="px-1 py-0">
                      <Link to={`/setor/${loggedUser.user.setor._id}`}>
                        <Button className="py-0" size="sm" variant="primary">
                          Setor
                        </Button>
                      </Link>
                    </Nav.Link>
                  )}
                  {loggedUser.user.role !== "usuario" && (
                    <Nav.Link as={"div"} className="px-1 py-0">
                      <Link to="/atividades">
                        <Button className="py-0" size="sm" variant="primary">
                          Atividades
                        </Button>
                      </Link>
                    </Nav.Link>
                  )}
                  {loggedUser.user.role !== "usuario" && (
                    <Nav.Link as={"div"} className="px-1 py-0">
                      <Link to="/deducoes">
                        <Button className="py-0" size="sm" variant="primary">
                          Deduções
                        </Button>
                      </Link>
                    </Nav.Link>
                  )}
                  {loggedUser.user.role === "admin" && (
                    <Nav.Link as={"div"} className="px-1 py-0">
                      <Link to="/usuarios">
                        <Button className="py-0" size="sm" variant="primary">
                          Usuários
                        </Button>
                      </Link>
                    </Nav.Link>
                  )}
                </Nav>
              </Row>
            </Col>
          </Col>

          <Col className="d-flex flex-column align-items-end justify-content-center">
            <Row className="m-0"> Olá, {loggedUser.user.name} </Row>
            <Row className="m-0 w-50">
              <Col className="px-0 py-0">
                <Nav.Link as={"div"} className="px-1 py-0 w-100">
                  <Link to="/profile" style={{ textDecoration: "none" }}>
                    <Button className="py-0 w-100" size="sm" variant="success">
                      <i className="bi bi-person"></i> Perfil
                    </Button>
                  </Link>
                </Nav.Link>
                {/* <Link
                  to={"/profile"}
                  style={{ textDecoration: "none", color: "grey" }}
                >
                  <div>Perfil</div>
                </Link> */}
              </Col>
              <Col className="px-0 py-0">
                <Nav.Link as={"div"} className="px-1 py-0 w-100">
                  <Link to="/" style={{ textDecoration: "none" }}>
                    <Button
                      onClick={logOut}
                      className="py-0 w-100"
                      size="sm"
                      variant="dark"
                    >
                      <i className="bi bi-box-arrow-right"></i> Sair
                    </Button>
                  </Link>
                </Nav.Link>
              </Col>
            </Row>
          </Col>
        </Col>
      ) : (
        <Col className="mx-2 d-flex flex-row align-items-end justify-content-start">
          <Row className="d-flex flex-row align-items-center justify-content-start">
            <Col>
              <img alt="SisPro logo" src={logo} width="100" height="80" />
            </Col>
            <Col>
              <Navbar.Brand className="ms-0">
                <b>SisPro</b> - Sistema de Produtividade
              </Navbar.Brand>
            </Col>
          </Row>
        </Col>
      )}
    </Navbar>
  );
}

export default NavBar;
