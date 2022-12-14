import { useState } from "react";
import { Button, Modal, Row, Col, Container } from "react-bootstrap";
import { toast } from "react-hot-toast";
import api from "../api/api";
import SpinnerImage from "./SpinnerImage";

const UsuarioDelete = ({ usuarioData, reload, setReload }) => {
  const [isLoading, setIsLoading] = useState(false);

  async function deleteSetor() {
    try {
      setIsLoading(true);
      await api.delete(`/user/delete/${usuarioData._id}`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      toast.success(`Usuário ${usuarioData.name} deletado com sucesso.`, {
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
          <Modal.Title>Deletar usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {isLoading ? (
              <SpinnerImage />
            ) : (
              <Row>
                Deseja realmente deletar o usuário? Essa operação é
                irreversível.
              </Row>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row>
              <Col className="col-md-6 text-center">
                <Button variant="danger" type="submit" onClick={deleteSetor}>
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

export default UsuarioDelete;
