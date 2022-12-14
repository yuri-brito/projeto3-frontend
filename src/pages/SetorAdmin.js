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
  OverlayTrigger,
  Row,
  Tooltip,
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
  const [reload, setReload] = useState(true);

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
  }, [reload]);

  function handleSearch(e) {
    setSearch(e.target.value);
  }
  console.log(setorData);
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
            <h4>Gestão de Setores</h4>
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
                    <Col className="col-6">
                      <FloatingLabel
                        label="Filtrar por Nome, Chefe e Substituto do setor..."
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
                    <Col className="col-6">
                      <SetorCreate reload={reload} setReload={setReload} />
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
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      setor.substituto.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    );
                  })
                  .reverse()
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
                          <Col className="col-2 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Sigla e Nome
                            </Row>
                            {`${obj.sigla} – ${obj.nome}`.length < 15 ? (
                              <Row style={{ textAlign: "left" }}>
                                {`${obj.sigla} – ${obj.nome}`}
                              </Row>
                            ) : (
                              <Row style={{ textAlign: "left" }}>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-top`}>
                                      {`${obj.sigla} – ${obj.nome}`}
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
                                    {`${obj.sigla} – ${obj.nome}`.slice(0, 15)}
                                    ...
                                  </Card.Text>
                                </OverlayTrigger>
                              </Row>
                            )}
                          </Col>

                          <Col className="col-2">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Chefe
                            </Row>
                            {obj.chefe.name && (
                              <div>
                                {obj.chefe.name.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.chefe.name}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.chefe.name}
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
                                        {obj.chefe.name.slice(0, 15)}...
                                      </Card.Text>
                                    </OverlayTrigger>
                                  </Row>
                                )}
                              </div>
                            )}
                          </Col>

                          <Col className="col-2">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Substituto(a)
                            </Row>
                            {obj.substituto.name && (
                              <div>
                                {obj.substituto.name.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.substituto.name}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.substituto.name}
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
                                        {obj.substituto.name.slice(0, 15)}...
                                      </Card.Text>
                                    </OverlayTrigger>
                                  </Row>
                                )}
                              </div>
                            )}
                          </Col>

                          <Col className="col-1">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Usuários
                            </Row>
                            <Row>{obj.usuarios.length}</Row>
                          </Col>
                          <Col className="p-0 d-flex justify-content-center align-items-end">
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
                          <Col className="p-0 d-flex justify-content-center align-items-end">
                            <SetorEdit
                              setorData={obj}
                              reload={reload}
                              setReload={setReload}
                            />
                          </Col>
                          <Col className="p-0 d-flex justify-content-center align-items-end">
                            <SetorDelete
                              setorData={obj}
                              reload={reload}
                              setReload={setReload}
                            />
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
