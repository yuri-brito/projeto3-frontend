import { Container } from "react-bootstrap";

const Home = (props) => {
  return (
    <Container className="mt-3 mb-auto d-flex justify-content-start text-justify">
      <p className="text-justify  text-break " style={{ textAlign: "justify" }}>
        A ferramenta SISPRO está sendo construída para tornar-se o repositório
        dos tarefas dos servidores no Ministério da Economia. Seu objetivo, além
        de preservar, é permitir a gestão e a publicidade desses tarefas. Em sua
        versão inicial a ferramenta foi customizada apenas para o cadastro das
        tarefas, atividades e deduções, possibilitando mensurar produtividade no
        Programa de Gestão. <br></br>
        <br></br>
        Por intermédio da aba “tarefas” localizada nesta tela, acima e à
        esquerda, será possível inserir o tipo de tarefa desejada, consultar,
        editar e excluir as listas das tarefas cadastradas e, a partir destas,
        cadastrar novas.
        <br></br>A utilização do SISPRO considera que: O usuário pode visualizar
        e editar os dados de todas as suas tarefas. O usuário pode (somente)
        visualizar os dados dos indicadores das outras unidades organizacionais.
        <br></br>
        Os gestores podem visualizar as atividades de todos os usuários do
        setor, além de criar novas atividades ou deduções.
        <br></br>
        Os administradores de sistema podem criar novos setores, alterar dados e
        perfis de usuários.
      </p>
    </Container>
  );
};

export default Home;
