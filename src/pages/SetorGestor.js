import api from "../api/api.js";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Select from "react-select";
import {
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  NavLink,
  Row,
} from "react-bootstrap";
import SpinnerImage from "../components/SpinnerImage.js";
import { Link, useParams } from "react-router-dom";

function SetorGestor() {
  const [isLoading, setIsLoading] = useState(true);
  const [setorData, setSetorData] = useState({});
  const userData = JSON.parse(window.localStorage.getItem("loggedUser"));

  //resolver essa captura - retornando undefined
  const { setorId } = useParams();
  console.log(setorId);

  //api dos dados do setor
  async function fetchingDadosSetor() {
    try {
      const response = await api.get(`/setor/${userData.user.setor._id}`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setSetorData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
            marginTop: 10,
            marginBottom: 30,
            boxShadow:
              "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
          }}
        >
          <Card.Header>
            <h4>
              {setorData.nome} - {setorData.sigla}
            </h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                {setorData.usuarios.map((obj, index) => {
                  return (
                    <ListGroup.Item
                      action
                      variant="light"
                      style={{ width: "92vw", marginBottom: "10px" }}
                      key={index}
                    >
                      <Row>
                        <Col>{obj.name}</Col>
                        <Col>{obj.email}</Col>
                        <Col>{obj.role}</Col>
                        {userData.user.role === "admin" && (
                          <Col>
                            {obj.active === true ? (
                              <input
                                type="checkbox"
                                name="userStatus"
                                checked
                                onClick={(e) =>
                                  handleUserStatus(e.target.value, obj._id)
                                }
                              />
                            ) : (
                              <input type="checkbox" name="userStatus" />
                            )}
                          </Col>
                        )}
                        <Col>ProgressBar1</Col>
                        <Col>ProgressBar2</Col>
                        <Col>
                          <Button variant="primary">
                            <i className="bi bi-ticket-detailed"></i> Detalhar
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Container>
          </Card.Body>
          {userData.user.role === "admin" && (
            <Button variant="secondary">
              <NavLink href="/adminsetor">
                <i className="bi bi-arrow-return-left"></i> Voltar
              </NavLink>
            </Button>
          )}
        </Card>
      )}
      ;
    </>
  );
}

export default SetorGestor;
