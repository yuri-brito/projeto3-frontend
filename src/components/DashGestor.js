import { useEffect, useState } from "react";
import { Col, Container, Row, Form, ProgressBar } from "react-bootstrap";
import {
  parseISO,
  format,
  differenceInBusinessDays,
  getDay,
  getYear,
  getMonth,
  getDate,
} from "date-fns";
const DashGestor = ({
  setorData,
  datas,
  setDatas,
  metaPeriodo,
  setMetaPeriodo,
}) => {
  const [dados, setDados] = useState({ somaConcluidas: 0, somaValidadas: 0 });
  const [minDate, setMinDate] = useState(
    format(datas.dataInicial, "yyyy-MM-dd")
  );
  function handleChange(e) {
    if (e.target.name === "dataInicial") {
      setMinDate(e.target.value);
    }
    setDatas({
      ...datas,
      [e.target.name]: parseISO(e.target.value, "yyyy-MM-dd"),
    });
  }

  async function calculaMeta() {
    let somaCon = 0;
    let somaVal = 0;
    await setorData.usuarios.forEach((usuario) => {
      somaCon += usuario.tarefas
        .filter((tarefa) => {
          return (
            tarefa.concluida &&
            datas.dataInicial.getTime() <=
              new Date(
                getYear(parseISO(tarefa.createdAt)),
                getMonth(parseISO(tarefa.createdAt)),
                getDate(parseISO(tarefa.createdAt))
              ).getTime() &&
            new Date(
              getYear(parseISO(tarefa.createdAt)),
              getMonth(parseISO(tarefa.createdAt)),
              getDate(parseISO(tarefa.createdAt))
            ).getTime() <= datas.dataFinal.getTime()
          );
        })
        .reduce((acc, cur) => {
          return (acc += cur.horas);
        }, 0);
      somaVal += usuario.tarefas
        .filter(
          (tarefa) =>
            tarefa.validada &&
            datas.dataInicial.getTime() <=
              new Date(
                getYear(parseISO(tarefa.createdAt)),
                getMonth(parseISO(tarefa.createdAt)),
                getDate(parseISO(tarefa.createdAt))
              ).getTime() &&
            new Date(
              getYear(parseISO(tarefa.createdAt)),
              getMonth(parseISO(tarefa.createdAt)),
              getDate(parseISO(tarefa.createdAt))
            ).getTime() <= datas.dataFinal.getTime()
        )
        .reduce((acc, cur) => {
          return (acc += cur.horas);
        }, 0);
    });

    setDados({ somaConcluidas: somaCon, somaValidadas: somaVal });
    if ([1, 2, 3, 4, 5].includes(getDay(datas.dataFinal))) {
      setMetaPeriodo(
        differenceInBusinessDays(datas.dataFinal, datas.dataInicial) + 1
      );
    } else {
      setMetaPeriodo(
        differenceInBusinessDays(datas.dataFinal, datas.dataInicial)
      );
    }
  }
  useEffect(() => {
    calculaMeta();
  }, [datas]);

  return (
    <Container
      className="mb-3"
      style={{
        boxShadow:
          "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
        borderRadius: 6,
      }}
    >
      <Row>
        <Col className="col-3">
          <Row className="mt-2">
            <b>Per??odo</b>
          </Row>
          <Row>
            <Row className=" ms-3">Data inicial</Row>
            <Row className="ms-3 mb-2">
              <Form.Control
                className="w-75"
                size="sm"
                type="date"
                name="dataInicial"
                placeholder="Small text"
                defaultValue={format(datas.dataInicial, "yyyy-MM-dd")}
                onChange={handleChange}
              />
            </Row>
          </Row>
          <Row>
            <Row className="mt-1 ms-3">Data final</Row>
            <Row className="ms-3 mb-2">
              <Form.Control
                className="w-75"
                size="sm"
                min={minDate}
                type="date"
                name="dataFinal"
                placeholder="Small text"
                defaultValue={format(datas.dataFinal, "yyyy-MM-dd")}
                onChange={handleChange}
              />
            </Row>
          </Row>
        </Col>
        <Col className="col-3 justify-center">
          <Row className="mt-2 d-flex justify-content-center">
            <b>Meta do per??odo</b>
          </Row>
          <Row className="d-flex justify-content-center">
            {metaPeriodo * 8 * setorData.usuarios.length} horas
          </Row>
        </Col>
        <Col className="col-6  ">
          <Row className="mt-2 d-flex justify-content-center">
            <b>Progresso de tarefas conclu??das</b>
          </Row>
          <Row className="d-flex justify-content-center">
            {dados.somaConcluidas} horas
            <Row className="d-flex justify-content-center">
              <ProgressBar
                animated
                className="ms-3 me-3 p-0 w-50"
                now={Math.round(
                  (dados.somaConcluidas /
                    (metaPeriodo * 8 * setorData.usuarios.length)) *
                    100
                )}
                label={`${Math.round(
                  (dados.somaConcluidas /
                    (metaPeriodo * 8 * setorData.usuarios.length)) *
                    100
                )}%`}
              />
            </Row>
          </Row>
          <Row className="mt-3 d-flex justify-content-center">
            <b>Progresso de tarefas validadas</b>
          </Row>
          <Row className="d-flex justify-content-center">
            {dados.somaValidadas} horas
            <Row className="d-flex justify-content-center">
              <ProgressBar
                animated
                variant="success"
                className="ms-3 me-3 p-0 w-50"
                now={Math.round(
                  (dados.somaValidadas /
                    (metaPeriodo * 8 * setorData.usuarios.length)) *
                    100
                )}
                label={`${Math.round(
                  (dados.somaValidadas /
                    (metaPeriodo * 8 * setorData.usuarios.length)) *
                    100
                )}%`}
              />
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DashGestor;
