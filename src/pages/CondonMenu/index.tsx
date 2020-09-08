import React, { useCallback, ChangeEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Form } from '@unform/web';

import Select from '@material-ui/core/Select';
import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import logoImg from '../../assets/logo2.png';

import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Header } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

interface Morador {
  id: number;
  uuid: string;
  nome: string;
  avatar: string;
}

interface AptoData {
  id: number;
  uuid: string;
  number: string;
  block: string;
  building_id: number;
  building: string;
  situation: string;
  moradores: Morador[];
}

const CondonMenu: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();

  const { apto } = useParams();

  const { user, updateUser } = useAuth();

  const [avatar, setAvatar] = useState(
    'https://api.adorable.io/avatars/80/pamploni',
  );
  const [aptoData, setAptoData] = useState<AptoData>({} as AptoData);
  const [moradorId, setMoradorId] = useState(0);
  const [moradorNome, setMoradorNome] = useState('');

  /* async function lerDadosApto(): Promise<void> {
    await api.get(`aptos/${apto}`).then(resp => {
      setAptoData(resp.data);
      // console.log(resp.data);
      console.log(resp.data);
    });
  } */

  useEffect(() => {
    api.get<AptoData>(`aptosweb/${apto}`).then(resp => {
      setAptoData(resp.data);
      // console.log(resp.data);
      console.log(resp.data);
    });
  }, []);

  const handleGoToVisitForm = (): void => {
    // verificar se o morador foi escolhido
    if (!moradorNome) {
      addToast({
        type: 'error',
        title: 'Identificação',
        description:
          'Identifique qual morador estará realizando o agendamento.',
      });
    } else {
      history.push(`/condon-agend/${apto}`, {
        aptoData,
        moradorId,
        moradorNome,
      });
    }
  };

  const handleChangeMorador = (e: ChangeEvent<{ value: unknown }>): void => {
    // console.log(e.target.value);
    setMoradorId(e.target.value as number);

    const moradorData = aptoData.moradores;

    const index = moradorData.findIndex(
      item => item.id == (e.target.value as number),
    );

    // console.log(moradorData[index].nome);

    setMoradorNome(moradorData[index].nome);
  };

  return (
    <>
      <Header>
        <img src={logoImg} alt="Kanboo" />
        <span>
          Olá, senhor Condômino. Identifique-se e utilize umas das opções
          abaixo!
        </span>
      </Header>
      <Container>
        <Content>
          <div
            className="footer"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
          >
            <span>
              <strong>Local.:</strong>
            </span>
            <span style={{ color: '#c15111', marginLeft: 8 }}>
              {` ${aptoData.building}`}
            </span>
          </div>
          <div
            className="footer"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
          >
            <div>
              <span>
                <strong>Unidade:</strong>
              </span>
              <span style={{ color: '#ff1125', marginLeft: 8 }}>
                {` ${aptoData.number}`}
              </span>
            </div>
          </div>
          <AnimationContainer>
            <Form onSubmit={() => {}}>
              <h1>Escolha uma das opções</h1>

              <Select
                native
                value={moradorId}
                inputProps={{
                  name: 'Morador',
                  id: 'age-native-simple',
                }}
                onChange={handleChangeMorador}
              >
                <option aria-label="None" value="" />
                {aptoData.moradores &&
                  aptoData.moradores.map(morad => (
                    <option key={morad.id} value={morad.id}>
                      {morad.nome}
                    </option>
                  ))}
              </Select>

              <Button type="button" onClick={handleGoToVisitForm}>
                Agendar Visita/Serviços
              </Button>
              <Button type="button">Visualizar Agendamentos</Button>
            </Form>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default CondonMenu;
