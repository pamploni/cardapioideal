import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  ChangeEvent,
} from 'react';
import { StaticContext } from 'react-router';
import { useHistory, useLocation } from 'react-router-dom';

import { WhatsappShareButton } from 'react-share';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Modal from '@material-ui/core/Modal';

import TextField from '@material-ui/core/TextField';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo2.png';

import { Container, Content, AnimationContainer, Header } from './styles';

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

interface ParamState {
  aptoData: AptoData;
  moradorId: number;
  moradorNome: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const Agendamento: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const location = useLocation<ParamState>();

  const [selectedNature, setSelectedNature] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [linkUuid, setLinkUuid] = useState('');

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    api
      .post('visitas', {
        apto_id: location.state.aptoData.id,
        morador_id: location.state.moradorId,
        hour: selectedDate,
        natureza: selectedNature ? 'visita' : 'servico',
      })
      .then(resp => {
        setLinkUuid(resp.data.uuid);
        setOpen(true);
      })
      .catch(err => {
        addToast({
          type: 'error',
          title: 'Erro na Cadastro',
          description: `Ocorreu um erro ao tentar realizar o agendamento.`,
        });
      });
  };

  const handleClose = () => {
    history.push(`/condon-menu/${location.state.aptoData.uuid}`);
    setOpen(false);
  };

  useEffect(() => {
    console.log(location.state);
  }, [location]);

  const handleDateChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSelectedDate(new Date(event.target.value));
    console.log(event.target.value);
  };

  const handleToZap = () => {
    history.push('https://api.whatsapp.com/send?text=');
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          backgroundColor: '#eed11110',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '90%',
            height: '40%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderColor: '#06039a',
            borderWidth: 20,
          }}
        >
          <CheckCircleOutlineIcon
            style={{ color: '#00b200', width: 80, height: 80, marginTop: 16 }}
          />
          <span style={{ color: '#06039a', marginTop: 16, fontSize: 20 }}>
            Dados salvos com sucesso!
          </span>

          <WhatsappShareButton
            id="btws"
            url={`http://app.kanbuu.com.br/visit-form/${linkUuid}`}
            style={{
              backgroundColor: '#06039a',
              color: '#fff',
              width: 160,
              height: 50,
              borderRadius: 5,
              marginTop: 24,
              display: 'flex',
              justifyContent: 'center',

              flexDirection: 'row',
            }}
          >
            <WhatsAppIcon style={{ marginRight: 16 }} />

            <span style={{ marginTop: 8 }}>Enviar link</span>
          </WhatsappShareButton>
        </div>
      </Modal>

      <Header>
        <img src={logoImg} alt="Kanboo" />
        <span>
          Olá, Sr(a)
{' '}
          <strong style={{ color: '#ff8800' }}>
            {location.state.moradorNome}
          </strong>
          . Use este formulário para Agendar uma visita.
        </span>
      </Header>
      <Container>
        <Content>
          <div className="footer">
            <div>
              <span>
                <strong>Local:</strong>
              </span>
              <span style={{ color: '#c15111' }}>
                {` ${location.state.aptoData.building}`}
              </span>
            </div>
            <div>
              <span>
                <strong>Unidade:</strong>
              </span>
              <span style={{ color: '#ff1125' }}>
                {` ${location.state.aptoData.number}`}
              </span>
            </div>
          </div>
          <AnimationContainer>
            <Form ref={formRef} onSubmit={() => {}}>
              <h1>Informe os dados do Agendamento</h1>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '90%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{ width: 80, display: 'flex', flexDirection: 'row' }}
                >
                  <input
                    type="checkbox"
                    name="visita"
                    checked={selectedNature}
                    onChange={() => setSelectedNature(true)}
                  />
                  <span>Visita</span>
                </div>

                <div
                  style={{ width: 80, display: 'flex', flexDirection: 'row' }}
                >
                  <input
                    type="checkbox"
                    name="servico"
                    checked={!selectedNature}
                    onChange={() => setSelectedNature(false)}
                  />
                  <span>Serviço</span>
                </div>
              </div>

              <TextField
                id="datetime-local"
                label="Data/Hora"
                type="datetime-local"
                defaultValue={format(selectedDate, "yyyy-MM-dd'T'HH:mm", {
                  locale: ptBR,
                })}
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ marginTop: 32, marginBottom: 32 }}
                onChange={handleDateChange}
              />

              <div id="whats">
                <button
                  type="button"
                  onClick={handleOpen}
                  style={{
                    backgroundColor: '#06039a',
                    color: '#fff',
                    width: 160,
                    height: 45,
                    borderRadius: 10,
                  }}
                >
                  Registrar
                </button>
              </div>
            </Form>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default Agendamento;
