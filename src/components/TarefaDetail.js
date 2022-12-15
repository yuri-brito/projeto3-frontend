import { useState } from "react";
import { Button, Modal, Row, Col, Container, Card } from "react-bootstrap";
import { parseISO, format } from "date-fns";
const TarefaDetail = ({ tarefaData }) => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  return (
    <div>
      <Button variant="primary" size="sm" onClick={handleShow}>
        <i className="bi bi-ticket-detailed"></i> Detalhar
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Tarefa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Container>
                <Row>
                  <Col className="col-3 mb-1">Criada em :</Col>
                  <Col className="col-6">
                    <b>
                      {format(
                        parseISO(tarefaData.createdAt),
                        "dd/MM/yyyy - H:mm:ss"
                      )}
                    </b>
                  </Col>
                </Row>
                <Row>
                  {!tarefaData.deducao ? (
                    <>
                      <Col className="col-3 mb-1">Atividade :</Col>
                      <Col className="col-6">
                        <b>{tarefaData.atividade.titulo}</b>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col className="col-3 mb-1">Dedução :</Col>
                      <Col className="col-6">
                        <b>{tarefaData.deducao.titulo}</b>
                      </Col>
                    </>
                  )}
                </Row>
                {!tarefaData.deducao ? (
                  <>
                    <Row>
                      <Col className="col-5 mb-1">Horas Estimadas :</Col>
                      <Col className="col-2">
                        <b>{tarefaData.atividade.horasEsperadas}h</b>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-5 mb-1">Horas trabalhadas :</Col>
                      <Col className="col-2">
                        <b>{tarefaData.horas}h</b>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Row>
                    <Col className="col-5 mb-1">Horas deduzidas :</Col>
                    <Col className="col-2">
                      <b>{tarefaData.horas}h</b>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col className="col-4 mb-1">Observações :</Col>
                  <Col className="col-8">
                    <b>{tarefaData.observacao}</b>
                  </Col>
                </Row>
                <Row>
                  {tarefaData.concluida ? (
                    <Col className="mb-1">
                      Tarefa Concluída{"  "}{" "}
                      <i
                        style={{ color: "green" }}
                        className="bi bi-check-circle-fill"
                      ></i>
                    </Col>
                  ) : (
                    <Col className="mb-1">
                      Tarefa não concluída{"  "}
                      <i
                        style={{ color: "red" }}
                        className="bi bi-x-circle-fill"
                      ></i>
                    </Col>
                  )}
                </Row>
                <Row>
                  {tarefaData.validada ? (
                    <Col className="mb-1">
                      Tarefa Validada{"  "}{" "}
                      <i
                        style={{ color: "green" }}
                        className="bi bi-check-circle-fill"
                      ></i>
                    </Col>
                  ) : (
                    <Col className="mb-1">
                      Tarefa não validada{"  "}
                      <i
                        style={{ color: "red" }}
                        className="bi bi-x-circle-fill"
                      ></i>
                    </Col>
                  )}
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row>
              <Col className=" text-center">
                <Button variant="secondary" onClick={handleClose}>
                  <i className="bi bi-arrow-return-left"></i> Voltar
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TarefaDetail;
