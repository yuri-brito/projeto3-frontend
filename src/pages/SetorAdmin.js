import api from "../api/api.js";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import SpinnerImage from "../components/SpinnerImage.js";
import { Link } from "react-router-dom";
import SetorEdit from "../components/SetorEdit.js";
import SetorDelete from "../components/SetorDelete.js";
import SetorCreate from "../components/SetorCreate.js";

function SetorAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [setorData, setSetorData] = useState({});
  const [search, setSearch] = useState("");

  //api dos dados do setor
  async function fetchingDadosSetor() {
    try {
      const response = await api.get(`/setor/`);
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
            <h4>Gestão Unidades</h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                <ListGroup.Item
                  as={"div"}
                  variant="light"
                  style={{ width: "92vw", marginBottom: "20px" }}
                >
                  <Row>
                    <Col>
                      <FloatingLabel
                        label="Filtrar por NOME ou SIGLA do setor"
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
                    <Col> </Col>
                    <Col>
                      <SetorCreate />
                    </Col>
                  </Row>
                </ListGroup.Item>

                {setorData
                  .filter((setor) => {
                    return (
                      setor.nome.toLowerCase().includes(search.toLowerCase()) ||
                      setor.sigla
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      setor.chefe.name
                        .toString()
                        .includes(search.toLowerCase()) ||
                      setor.substituto.name
                        .toString()
                        .includes(search.toLowerCase())
                    );
                  })
                  .map((obj, index) => {
                    return (
                      <ListGroup.Item
                        as={"div"}
                        action
                        variant="light"
                        style={{ width: "92vw", marginBottom: "10px" }}
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
                              Sigla e Nome
                            </Row>
                            <Row>
                              {obj.sigla} – {obj.nome}
                            </Row>
                          </Col>
                          {obj.chefe.name && (
                            <Col className="ms-3">
                              <Row
                                style={{
                                  fontSize: 11,
                                  fontStyle: "italic",
                                  fontWeight: "bold",
                                }}
                              >
                                Chefe
                              </Row>
                              <Row>{obj.chefe.name}</Row>
                            </Col>
                          )}
                          {obj.substituto.name && (
                            <Col className="ms-3">
                              <Row
                                style={{
                                  fontSize: 11,
                                  fontStyle: "italic",
                                  fontWeight: "bold",
                                }}
                              >
                                Substituto(a)
                              </Row>
                              <Row>{obj.substituto.name}</Row>
                            </Col>
                          )}
                          <Col className="ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Quantidade
                            </Row>
                            <Row>Usuários: {obj.usuarios.length}</Row>
                          </Col>
                          <Col xs={1}>
                            <Button
                              variant="primary"
                              size="sm"
                              className="my-0"
                            >
                              <Link
                                className="text-white text-decoration-none"
                                to={`/setor/${obj._id}`}
                              >
                                <i className="bi bi-ticket-detailed"></i>{" "}
                                Detalhar
                              </Link>
                            </Button>
                          </Col>
                          <Col xs={1}>
                            <SetorEdit setorData={obj} />
                          </Col>
                          <Col xs={1}>
                            <SetorDelete setorData={obj} />
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
    </>
  );
}

export default SetorAdmin;
