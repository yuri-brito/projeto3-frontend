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
  OverlayTrigger,
  Tooltip,
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
  const [reload, setReload] = useState(true);
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
  }, [reload]);
  async function handleAtividadeStatus(e, atividadeId) {
    const newStatus = e.target.checked;

    try {
      await api.put(`/atividade/edit/${atividadeId}`, { ativa: newStatus });
      if (newStatus) {
        toast.success("Atividade ativada para o setor");
      } else {
        toast.success("Atividade desativada para o setor");
      }
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
            <h4>Gest??o das Atividades</h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                <ListGroup.Item
                  as={"div"}
                  action
                  variant="light"
                  style={{ width: "92vw", marginBottom: 20 }}
                >
                  <Row>
                    <Col>
                      <FloatingLabel
                        label="Filtrar por T??tulo, descri????o ou horas esperadas..."
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
                    <Col className="d-flex justify-content-center align-items-center">
                      {loggedUser.user.role === "gestor" && (
                        <AtividadeCreate
                          reload={reload}
                          setReload={setReload}
                        />
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
                  .reverse()
                  .map((obj, index) => {
                    return (
                      <ListGroup.Item
                        as={"div"}
                        action
                        variant="light"
                        style={{
                          width: "92vw",
                          marginBottom: 10,
                          animation: "fadein 1.5s",
                        }}
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
                              T??tulo
                            </Row>
                            {obj.titulo.length < 15 ? (
                              <Row style={{ textAlign: "left" }}>
                                {obj.titulo}
                              </Row>
                            ) : (
                              <Row style={{ textAlign: "left" }}>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-top`}>
                                      {obj.titulo}
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
                                    {obj.titulo.slice(0, 15)}...
                                  </Card.Text>
                                </OverlayTrigger>
                              </Row>
                            )}
                          </Col>
                          <Col className="col-2 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Descri????o
                            </Row>
                            {obj.descricao && (
                              <div>
                                {obj.descricao.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.descricao}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.descricao}
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
                                        {obj.descricao.slice(0, 15)}...
                                      </Card.Text>
                                    </OverlayTrigger>
                                  </Row>
                                )}
                              </div>
                            )}
                          </Col>
                          <Col className="col-2 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Horas Estimadas
                            </Row>
                            {obj.horasEsperadas && (
                              <Row>{obj.horasEsperadas}</Row>
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
                              Ativa
                            </Row>
                            <Row>
                              <Form.Check
                                className="p-0"
                                style={{ textAlign: "left" }}
                                type="checkbox"
                                defaultChecked={obj.ativa}
                                onChange={(e) =>
                                  handleAtividadeStatus(e, obj._id)
                                }
                              ></Form.Check>
                              {obj.active}
                            </Row>
                          </Col>

                          <Col className="col-2 d-flex justify-content-center align-items-end">
                            <AtividadeEdit
                              atividadeData={obj}
                              reload={reload}
                              setReload={setReload}
                            />
                          </Col>
                          <Col className="col-2 d-flex justify-content-center align-items-end">
                            <AtividadeDelete
                              atividadeData={obj}
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

export default Atividades;
