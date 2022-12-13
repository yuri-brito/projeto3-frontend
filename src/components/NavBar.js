import { useContext } from "react";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import { AuthContext } from "../contexts/authContext";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

function NavBar() {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const userData = loggedUser;

  function logOut() {
    localStorage.removeItem("loggedUser");
    setLoggedUser(null);
    <Navigate to={"/"} />;
  }

  return (
    <Container className="d-flex flex-column align-items-start justify-content-center">
      <Row>
        <Col>
          <img alt="SisPro logo" src={logo} width="100" height="80" />
        </Col>
        <Col>
          <Row>
            <i>SisPro - Sistema de Produtividade</i>
          </Row>
          <Row>
            <Navbar>
              {userData && (
                <Nav>
                  <Nav.Link href="#home">Home?</Nav.Link>
                  <Nav.Link href="/tarefas">Tarefas</Nav.Link>
                  {userData.user.role === "admin" && (
                    <Nav.Link href="/adminsetor">Setor</Nav.Link>
                  )}
                  {userData.user.role === "gestor" && (
                    <Nav.Link href={`/setor/${userData.user.setor._id}`}>
                      Setor
                    </Nav.Link>
                  )}
                  {userData.user.role !== "usuario" && (
                    <Nav.Link href="/atividades">Atividades</Nav.Link>
                  )}
                  {userData.user.role !== "usuario" && (
                    <Nav.Link href="/deducoes">Deduções</Nav.Link>
                  )}
                  {userData.user.role === "admin" && (
                    <Nav.Link href="/usuarios">Usuários</Nav.Link>
                  )}
                </Nav>
              )}
            </Navbar>
          </Row>
        </Col>
        {userData && (
          <Col>
            <Row> Olá, {userData.user.name} </Row>
            <Row>
              <Link
                to={"/profile"}
                style={{ textDecoration: "none", color: "grey" }}
              >
                <div>Perfil</div>
              </Link>
              <Link
                to={"/"}
                onClick={logOut}
                style={{ textDecoration: "none", color: "grey" }}
              >
                <div>Logout</div>
              </Link>
            </Row>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default NavBar;
