import { useState } from "react";
import { Button, Modal, Row, Col, Container } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import SpinnerImage from "./SpinnerImage";

const DeducaoDelete = ({ deducaoData, reload, setReload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function deleteAtividade() {
    try {
      setIsLoading(true);
      await api.delete(`/deducao/delete/${deducaoData._id}`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      toast.success(`Dedução ${deducaoData.titulo} excluída com sucesso.`, {
        duration: 7000,
      });
      handleClose();
      setReload(!reload);
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
  }

  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  return (
    <div>
      <Button size="sm" className="my-0" variant="danger" onClick={handleShow}>
        <i className="bi bi-trash3"></i> Excluir
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{`Deletar ${deducaoData.titulo}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {isLoading ? (
              <SpinnerImage />
            ) : (
              <Row>
                Deseja realmente excluir a atividade? Essa operação é
                irreversível.
              </Row>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row>
              <Col className="col-md-6 text-center">
                <Button
                  variant="danger"
                  type="submit"
                  onClick={deleteAtividade}
                >
                  <i className="bi bi-trash3"></i> CONFIRMAR
                </Button>
              </Col>
              <Col className="col-md-6 text-center">
                <Button variant="secondary" onClick={handleClose}>
                  <i className="bi bi-x-square"></i> Cancelar
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeducaoDelete;
