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
  ProgressBar,
} from "react-bootstrap";
import { startOfMonth, endOfMonth, parseISO, set } from "date-fns";
import { AuthContext } from "../contexts/authContext";
import SpinnerImage from "../components/SpinnerImage.js";
import { Link, useParams } from "react-router-dom";
import DashUser from "../components/DashUser.js";
import TarefaCreate from "../components/TarefaCreate.js";
import TarefaEdit from "../components/TarefaEdit.js";
import TarefaDelete from "../components/TarefaDelete.js";
import TarefaDetail from "../components/TarefaDetail.js";

function Tarefas() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const { loggedUser } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(true);
  const [datas, setDatas] = useState({
    dataInicial: startOfMonth(new Date()),
    dataFinal: endOfMonth(new Date()),
  });
  const [metaPeriodo, setMetaPeriodo] = useState(0);

  //api dos dados do setor
  async function fetchingDadosUser() {
    try {
      const response = await api.get(`/tarefa/lista`);
      // const tempo = (ms) => {
      //   return new Promise((resolve) => setTimeout(resolve, ms));
      // };
      // await tempo(2000);
      setUserData(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  useEffect(() => {
    fetchingDadosUser();
  }, [reload]);

  function handleSearch(e) {
    setSearch(e.target.value);
  }
  async function handleConcluidaStatus(e, tarefaId) {
    const newStatus = e.target.checked;

    try {
      await api.put(`/tarefa/edit/${tarefaId}`, { concluida: newStatus });
      if (newStatus) {
        toast.success("Conclusão cadastrada");
      } else {
        toast.success("Conclusão descadastrada");
      }
      setReload(!reload);
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
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
            <h4>{loggedUser.user.name}</h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                <DashUser
                  userData={userData}
                  datas={datas}
                  setDatas={setDatas}
                  metaPeriodo={metaPeriodo}
                  setMetaPeriodo={setMetaPeriodo}
                />
                <ListGroup.Item
                  as={"div"}
                  variant="light"
                  style={{ width: "92vw", marginBottom: "20px" }}
                >
                  <Row className="justify-content-md-center">
                    <Col>
                      <FloatingLabel
                        label="Filtrar por Atividade/Dedução, Observação"
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
                    <Col className="col-6 d-flex justify-content-center align-items-center">
                      <TarefaCreate reload={reload} setReload={setReload} />
                    </Col>
                  </Row>
                </ListGroup.Item>

                {userData
                  .filter((tarefa) => {
                    let titulo = "";
                    if (tarefa.atividade) {
                      titulo = tarefa.atividade.titulo;
                    }
                    if (tarefa.deducao) {
                      titulo = tarefa.deducao.titulo;
                    }
                    return (
                      titulo.toLowerCase().includes(search.toLowerCase()) ||
                      tarefa.observacao
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      tarefa.horas.toString().includes(search.toLowerCase())
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
                              Título
                            </Row>
                            {obj.atividade ? (
                              <div>
                                {obj.atividade.titulo.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.atividade.titulo}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.atividade.titulo}
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
                                        {obj.atividade.titulo.slice(0, 15)}...
                                      </Card.Text>
                                    </OverlayTrigger>
                                  </Row>
                                )}
                              </div>
                            ) : (
                              <div>
                                {obj.deducao.titulo.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.deducao.titulo}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.deducao.titulo}
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
                                        {obj.deducao.titulo.slice(0, 15)}...
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
                              Observação
                            </Row>
                            {obj.observacao ? (
                              <div>
                                {obj.observacao.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.observacao}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.observacao}
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
                                        {obj.observacao.slice(0, 15)}...
                                      </Card.Text>
                                    </OverlayTrigger>
                                  </Row>
                                )}
                              </div>
                            ) : (
                              <Row>-</Row>
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
                              Horas
                            </Row>
                            {obj.horas ? (
                              <Row style={{ textAlign: "left" }}>
                                {obj.horas}
                              </Row>
                            ) : (
                              <Row style={{ textAlign: "left" }}>-</Row>
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
                              Concluída
                            </Row>
                            <Row>
                              <Form.Check
                                className="p-0"
                                style={{ textAlign: "left" }}
                                type="checkbox"
                                checked={obj.concluida}
                                onChange={(e) =>
                                  handleConcluidaStatus(e, obj._id)
                                }
                              ></Form.Check>
                            </Row>
                          </Col>

                          <Col className="d-flex justify-content-center align-items-end">
                            <TarefaDetail tarefaData={obj} />
                          </Col>
                          <Col className="d-flex justify-content-center align-items-end">
                            <TarefaEdit
                              tarefaData={obj}
                              reload={reload}
                              setReload={setReload}
                            />
                          </Col>
                          <Col className="d-flex justify-content-center align-items-end">
                            <TarefaDelete
                              tarefaData={obj}
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

export default Tarefas;
