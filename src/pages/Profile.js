import { useContext } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { parseISO, format } from "date-fns";
import profilePlaceholder from "../assets/profilePlaceholder.png";
import TrocaEmail from "../components/TrocaEmail";
function Profile() {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  function signOut() {
    localStorage.removeItem("loggedUser");
    setLoggedUser(null);
    navigate("/");
  }
  return (
    <div>
      <Container className="mt-5" style={{ animation: "fadein 1.5s" }}>
        <Row>
          <Col className="d-flex flex-column align-items-end justify-content-center">
            <img
              src={profilePlaceholder}
              alt="imagem de perfil"
              width={200}
              style={{ borderRadius: 12 }}
            />
          </Col>
          <Col className="d-flex flex-column align-items-center justify-content-center">
            <h1>{loggedUser.user.name}</h1>
            <h6 className="fw-bold text-muted">
              Cadastrado no SisPro desde -
              {format(parseISO(loggedUser.user.createdAt), "dd/MM/yyyy")}
            </h6>
          </Col>
        </Row>
        <Card className="mt-5">
          <Card.Header>
            <h5 className="fw-bold m-0 py-1">Dados Cadastrais</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <Card.Title>Nome Completo</Card.Title>
                <Card.Text>{loggedUser.user.name}</Card.Text>
              </Col>
              <Col>
                <Card.Title>Status</Card.Title>
                <Card.Text>
                  {loggedUser.user.active
                    ? "Servidor Ativo"
                    : "Servidor Inativo"}
                </Card.Text>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Card.Title>Endereço de e-mail</Card.Title>
                <Card.Text>{loggedUser.user.email}</Card.Text>
              </Col>
              <Col>
                <Card.Title>Perfil</Card.Title>
                {loggedUser.user.role === "admin" && (
                  <Card.Text>Administrador</Card.Text>
                )}
                {loggedUser.user.role === "gestor" && (
                  <Card.Text>Gestor</Card.Text>
                )}
                {loggedUser.user.role === "usuario" && (
                  <Card.Text>Usuário</Card.Text>
                )}
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Card.Title>Setor</Card.Title>
                <Card.Text>
                  {loggedUser.user.setor.sigla} - {loggedUser.user.setor.nome}
                </Card.Text>
              </Col>
              <Col>
                <Card.Title>Tarefas cadastradas</Card.Title>
                <Card.Text>{loggedUser.user.tarefas.length}</Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Row className="my-4">
          <Col>
            <TrocaEmail />
          </Col>
          <Col>
            <Button variant="dark" onClick={signOut}>
              Logout <i className="bi bi-box-arrow-right"></i>
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;
