/* eslint-disable no-nested-ternary */
import React, {
  useCallback,
  useRef,
  ChangeEvent,
  useEffect,
  useState,
} from 'react';

import QRCode from 'qrcode.react';
import ReactLoading from 'react-loading';

import { format, formatISO, formatISO9075, parse } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useHistory, useParams } from 'react-router-dom';
import { FiCamera, FiUser, FiEye } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import { cpfMask } from '../../utils/formatValue';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo2.png';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Content,
  AvatarInput,
  AnimationContainer,
  Header,
} from './styles';

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
  natureza: string;
  building_id: number;
  apto_id: number;
  status: string;
  created_at: Date; // 2020-08-20T09:44:00.422677-03:00,
  updated_at: Date; // 2020-08-20T09:44:00.422677-03:00,
  apto: string;
  building: string;
}

interface VisitaData {
  id: number;
  uuid: string;
  natureza: string;
  apto_id: number;
  nome: string;
  cpf: string;
  fornecedor_id: number;
  avatar: string;
  hour: Date; // 2020-08-22T10:55:34.447Z,
  status: string;
  user_id: number;
  created_at: Date; // 020-08-22T10:55:54.884Z,
  updated_at: Date; // 2020-08-22T10:55:54.884Z,
  morador_id: number;
  moradordata: Morador[];
}

const VisitForm: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { visita_uid } = useParams();

  const { user, updateUser } = useAuth();

  const [cpf, setCpf] = useState('');
  const [visitNome, setVisitNome] = useState('');
  const [avatar, setAvatar] = useState(
    'https://api.adorable.io/avatars/80/pamploni',
  );

  const [visitaData, setVisitaData] = useState<VisitaData>({} as VisitaData);

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeCpf = (e: React.FormEvent<HTMLInputElement>) => {
    setCpf(cpfMask(e.currentTarget.value));
    console.log(cpf);
  };

  const handleChangeNome = (e: React.FormEvent<HTMLInputElement>) => {
    setVisitNome(e.currentTarget.value);
    console.log(visitNome);
  };

  useEffect(() => {
    // buscar os dados da visita
    // se status for agendado, então gerar qrcode
    // caso negativo, abrir formulario para preencher dados
    api.get<VisitaData>(`visitas/${visita_uid}`).then(resp => {
      setVisitaData(resp.data);
      console.log(resp.data);
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: object) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          cpf: Yup.string().required('cpf obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        addToast({
          type: 'success',
          title: 'Cadastro realizado',
          description: 'Abra o link na portaria, no dia da visita',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na Cadastro',
          description: 'Ocorreu um erro ao tentar realizar um novo cadastro.',
        });
      }
    },
    [addToast, history],
  );

  const handleAvatarchange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setIsLoading(true);
        const data = new FormData();
        data.append('avatar', e.target.files[0]);

        api.patch('/uploads', data).then(response => {
          // updateUser(response.data);

          setAvatar(response.data.recebido);
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
          setIsLoading(false);
        });
      }
    },
    [addToast],
  );

  const handleSalvar = () => {
    api
      .patch('/visitas', {
        nome: visitNome,
        cpf,
        avatar,
        visita_id: visitaData.id,
      })
      .then(resp => {
        addToast({
          type: 'success',
          title: 'Cadastro realizado',
          description: 'Abra o link na portaria, no dia da visita',
        });

        history.go(0);
      });
  };

  return (
    <>
      {isLoading && (
        <div
          style={{
            zIndex: 100,
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000040',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
              height: '20%',
              justifyContent: 'flex-Start',
              alignItems: 'center',
              backgroundColor: '#221f3e',
              borderRadius: 20,
              paddingBottom: 20,
              paddingTop: 20,
            }}
          >
            <div style={{ width: 70, height: 70 }}>
              <ReactLoading
                type="spin"
                color="#c15111"
                height="90%"
                width="90%"
                delay={80}
              />
            </div>
            <span
              style={{
                marginTop: 20,
                fontFamily: 'Roboto',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Fazendo upload da imagem...
            </span>
          </div>
        </div>
      )}
      <Header>
        <img src={logoImg} alt="Kanboo" />
        <span>
          Olá, Visitante! Um pedido de agendamento foi programado para você.
          Preencha os campos abaixo, e não esqueça de colocar a sua foto
          (clicando na imagem da câmera.)
        </span>
      </Header>
      <Container>
        <Content>
          {visitaData.status === 'aberto' ? (
            <>
              <div className="footer">
                <div>
                  <span>
                    <strong>Unidade: </strong>
                    <span style={{ color: '#c15111', marginLeft: 8 }}>
                      {visitaData.moradordata
                        ? visitaData.moradordata[0].apto
                        : ''}
                    </span>
                  </span>
                </div>
                <div>
                  <span>
                    <strong>Solicitante: </strong>
                    <span style={{ color: '#c15111', marginLeft: 8 }}>
                      {visitaData.moradordata
                        ? visitaData.moradordata[0].nome
                        : ''}
                    </span>
                  </span>
                </div>

                <div>
                  <span>
                    <strong>Local.: </strong>
                    <span style={{ color: '#c15111', marginLeft: 8 }}>
                      {visitaData.moradordata
                        ? visitaData.moradordata[0].building
                        : ''}
                    </span>
                  </span>
                </div>
                <div>
                  <span>
                    <strong>Agendamento: </strong>
                    <span style={{ color: '#c15111', marginLeft: 8 }}>
                      {visitaData.hour
                        ? format(
                            new Date(visitaData.hour),
                            'dd/MM/yyyy HH:mm',
                            {
                              locale: ptBR,
                            },
                          )
                        : 'teste'}
                    </span>
                  </span>
                </div>
              </div>
              <AnimationContainer>
                <Form ref={formRef} onSubmit={handleSubmit}>
                  <AvatarInput>
                    <img src={avatar} alt="avatar" />
                    <label htmlFor="avatar">
                      <FiCamera />

                      <input
                        type="file"
                        id="avatar"
                        onChange={handleAvatarchange}
                      />
                    </label>
                  </AvatarInput>

                  <h1>Digite os dados do visitante</h1>

                  <Input
                    name="name"
                    icon={FiUser}
                    placeholder="Nome"
                    value={visitNome}
                    onChange={handleChangeNome}
                  />
                  <Input
                    name="cpf"
                    icon={FiEye}
                    type="text"
                    placeholder="cpf"
                    onChange={handleChangeCpf}
                    value={cpf}
                  />

                  <Button type="button" onClick={handleSalvar}>
                    Registrar
                  </Button>
                </Form>
              </AnimationContainer>
            </>
          ) : visitaData.uuid ? (
            <>
              <div className="footer">
                <div>
                  <span>
                    <strong>Local:</strong>
                  </span>
                  <span style={{ color: '#c15111' }}>
                    {` ${visitaData.moradordata[0].building}`}
                  </span>
                </div>
                <div>
                  <span>
                    <strong>Unidade:</strong>
                  </span>
                  <span style={{ color: '#ff1125' }}>
                    {` ${visitaData.moradordata[0].apto}`}
                  </span>
                </div>

                <div>
                  <span>
                    <strong>Visitante:</strong>
                  </span>
                  <span style={{ color: '#c15111' }}>
                    {` ${visitaData.nome}`}
                  </span>
                </div>
                <div>
                  <span>
                    <strong>CPF:</strong>
                  </span>
                  <span style={{ color: '#c15111' }}>
                    {` ${visitaData.cpf}`}
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '95%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <QRCode
                  value={visitaData.uuid}
                  style={{ width: 240, height: 240 }}
                />
              </div>
            </>
          ) : null}
        </Content>
      </Container>
    </>
  );
};

export default VisitForm;
