import api from "../api/api.js";
import toast from "react-hot-toast";
import { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  ListGroup,
  Row,
  Form,
} from "react-bootstrap";
import SpinnerImage from "../components/SpinnerImage.js";
import { Link, useParams } from "react-router-dom";
import AtividadeCreate from "../components/AtividadeCreate.js";
import AtividadeEdit from "../components/AtividadeEdit.js";
import AtividadeDelete from "../components/AtividadeDelete.js";
import { AuthContext } from "../contexts/authContext.js";
function Atividades() {
  const [isLoading, setIsLoading] = useState(true);
  const [atividades, setAtividades] = useState([]);
  const [search, setSearch] = useState("");
  const { loggedUser } = useContext(AuthContext);
  //api dos dados do setor
  async function fetchingAtividades() {
    try {
      const response = await api.get(`/atividade/`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setAtividades(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  useEffect(() => {
    fetchingAtividades();
  }, []);
  async function handleUserStatus(e, userId) {
    const newStatus = e === "on" ? false : true;

    try {
      await api.put(`/user/edit/${userId}`, { active: newStatus });
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  function handleSearch(e) {
    setSearch(e.target.value);
  }

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
            <h4>Gestão das Atividades</h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                <ListGroup.Item
                  action
                  variant="light"
                  style={{ width: "92vw", marginBottom: 20 }}
                >
                  <Row>
                    <Col>
                      <FloatingLabel
                        label="Filtrar por Título, descrição ou horas esperadas..."
                        className="ms-3"
                      >
                        <Form.Control
                          type="text"
                          value={search}
                          onChange={handleSearch}
                          placeholder="Insira a hora esperada"
                        />
                      </FloatingLabel>
                    </Col>
                    <Col>
                      {loggedUser.role === "gestor" && (
                        <Button className="my-0" variant="success" size="sm">
                          Criar nova atividade{" "}
                          <i className="bi bi-plus-square-dotted"></i>
                        </Button>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {atividades
                  .filter((atividade) => {
                    return (
                      atividade.titulo
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      atividade.descricao
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      atividade.horasEsperadas
                        .toString()
                        .includes(search.toLowerCase())
                    );
                  })
                  .map((obj, index) => {
                    return (
                      <ListGroup.Item
                        action
                        variant="light"
                        style={{ width: "92vw", marginBottom: 10 }}
                        key={index}
                      >
                        <Row>
                          <Col className="ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Título
                            </Row>
                            <Row>{obj.titulo}</Row>
                          </Col>
                          <Col className="ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Descrição
                            </Row>
                            {obj.descricao && <Row>{obj.descricao}</Row>}
                          </Col>
                          <Col className="ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Horas Esperadas
                            </Row>
                            {obj.horasEsperadas && (
                              <Row>{obj.horasEsperadas}</Row>
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
                              Ativo
                            </Row>
                            <Row>
                              <Form.Check
                                className="p-0"
                                style={{ textAlign: "left" }}
                                type="checkbox"
                                value={obj.active}
                              ></Form.Check>
                              {obj.active}
                            </Row>
                          </Col>
                          <Col className="d-flex justify-content-center align-items-end">
                            <Button variant="primary" size="sm">
                              <Link
                                className="text-white text-decoration-none"
                                to={`/atividade/${obj._id}`}
                              >
                                <i className="bi bi-ticket-detailed"></i>{" "}
                                Detalhar
                              </Link>
                            </Button>
                          </Col>

                          <Col className="d-flex justify-content-center align-items-end">
                            <AtividadeEdit setorAtividade={obj} />
                          </Col>
                          <Col className="d-flex justify-content-center align-items-end">
                            <AtividadeDelete setorAtividade={obj} />
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Container>
          </Card.Body>
        </Card>
      )}
      ;
    </>
  );
}

export default Atividades;
