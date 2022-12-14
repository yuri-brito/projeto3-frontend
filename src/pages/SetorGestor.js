import api from "../api/api.js";
import toast from "react-hot-toast";
import { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  NavLink,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { AuthContext } from "../contexts/authContext";
import SpinnerImage from "../components/SpinnerImage.js";
import { Link, useParams } from "react-router-dom";

function SetorGestor() {
  const [isLoading, setIsLoading] = useState(true);
  const [setorData, setSetorData] = useState({});
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const { setorId } = useParams();

  //api dos dados do setor
  async function fetchingDadosSetor() {
    try {
      const response = await api.get(`/setor/${setorId}`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setSetorData(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  useEffect(() => {
    fetchingDadosSetor();
  }, []);

  async function handleUserStatus(e, userId) {
    const newStatus = e === "on" ? false : true;

    try {
      await api.put(`/user/edit/${userId}`, { active: newStatus });
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente!");
    }
  }

  function handleSearch(e) {
    setSearch(e.target.value);
  }
  console.log(setorData.usuarios);
  return (
    <>
      {isLoading ? (
        <SpinnerImage />
      ) : (
        <Card
          bg="light"
          style={{
            width: "95vw",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 30,
            marginBottom: 30,
            animation: "fadein 1.5s",
            boxShadow:
              "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
          }}
        >
          <Card.Header>
            <h4>
              {setorData.sigla} - {setorData.nome}
            </h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                {loggedUser.user.role === "gestor" && (
                  <ListGroup.Item
                    as={"div"}
                    variant="light"
                    style={{
                      width: "92vw",
                      height: "20vh",
                      marginBottom: "20px",
                    }}
                  >
                    dashboard do Gestor
                  </ListGroup.Item>
                )}

                <ListGroup.Item
                  as={"div"}
                  variant="light"
                  style={{ width: "92vw", marginBottom: "20px" }}
                >
                  <Row className="justify-content-md-center">
                    <Col>
                      <FloatingLabel
                        label="Filtrar por Nome, E-mail ou Perfil do usuário"
                        className="ms-3"
                      >
                        <Form.Control
                          type="text"
                          value={search}
                          onChange={handleSearch}
                          placeholder="..."
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {setorData.usuarios
                  .filter((user) => {
                    return (
                      user.name.toLowerCase().includes(search.toLowerCase()) ||
                      user.email.toLowerCase().includes(search.toLowerCase()) ||
                      user.role.toLowerCase().includes(search.toLowerCase())
                    );
                  })
                  .map((obj, index) => {
                    if (obj.role === "usuario") {
                      obj.role = "Usuário";
                    }
                    if (obj.role === "gestor") {
                      obj.role = "Gestor";
                    }
                    if (obj.role === "admin") {
                      obj.role = "Admin";
                    }
                    return (
                      <ListGroup.Item
                        as={"div"}
                        action
                        variant="light"
                        style={{ width: "92vw", marginBottom: "10px" }}
                        key={index}
                      >
                        <Row>
                          <Col className="col-2 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Nome
                            </Row>
                            {obj.name.length < 15 ? (
                              <Row style={{ textAlign: "left" }}>
                                {obj.name}
                              </Row>
                            ) : (
                              <Row style={{ textAlign: "left" }}>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-top`}>
                                      {obj.name}
                                    </Tooltip>
                                  }
                                >
                                  <Card.Text
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                      textAlign: "left",
                                    }}
                                  >
                                    {obj.name.slice(0, 15)}...
                                  </Card.Text>
                                </OverlayTrigger>
                              </Row>
                            )}
                          </Col>
                          <Col className="ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              e-mail
                            </Row>
                            {obj.email.length < 15 ? (
                              <Row style={{ textAlign: "left" }}>
                                {obj.email}
                              </Row>
                            ) : (
                              <Row style={{ textAlign: "left" }}>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-top`}>
                                      {obj.email}
                                    </Tooltip>
                                  }
                                >
                                  <Card.Text
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                      textAlign: "left",
                                    }}
                                  >
                                    {obj.email.slice(0, 15)}...
                                  </Card.Text>
                                </OverlayTrigger>
                              </Row>
                            )}
                          </Col>
                          <Col className="col-1 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Perfil
                            </Row>
                            <Row>{obj.role}</Row>
                          </Col>
                          {loggedUser.user.role === "gestor" && (
                            <Col className="ms-3">
                              <Row
                                style={{
                                  fontSize: 11,
                                  fontStyle: "italic",
                                  fontWeight: "bold",
                                }}
                              >
                                Tarefas concluídas
                              </Row>
                              <Row>ProgressBar1</Row>
                            </Col>
                          )}
                          {loggedUser.user.role === "gestor" && (
                            <Col className="ms-3">
                              <Row
                                style={{
                                  fontSize: 11,
                                  fontStyle: "italic",
                                  fontWeight: "bold",
                                }}
                              >
                                Tarefas validadas
                              </Row>
                              <Row>ProgressBar2</Row>
                            </Col>
                          )}
                          {loggedUser.user.role === "gestor" ? (
                            <Col className="d-flex justify-content-center align-items-end">
                              <Link
                                to="/tarefa/detail"
                                style={{ textDecoration: "none" }}
                              >
                                <Button variant="primary" size="sm">
                                  <i className="bi bi-ticket-detailed"></i>{" "}
                                  Detalhar
                                </Button>
                              </Link>
                            </Col>
                          ) : (
                            <Col className="d-flex justify-content-center align-items-end">
                              <Link
                                to="/user/detail"
                                style={{ textDecoration: "none" }}
                              >
                                <Button variant="primary" size="sm">
                                  <i className="bi bi-ticket-detailed"></i>{" "}
                                  Detalhar
                                </Button>
                              </Link>
                            </Col>
                          )}
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Container>
          </Card.Body>
          {loggedUser.user.role === "admin" && (
            <Button variant="secondary">
              <NavLink as={"div"}>
                <Link
                  to={"/adminsetor"}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <i className="bi bi-arrow-return-left"></i> Voltar
                </Link>
              </NavLink>
            </Button>
          )}
        </Card>
      )}
    </>
  );
}

export default SetorGestor;
