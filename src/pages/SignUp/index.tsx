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
import { FiCamera, FiUser, FiEye, FiPhone, FiMail } from 'react-icons/fi';
import { FaIdCard } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import { cpfMask, foneMask } from '../../utils/formatValue';

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
  fone: string;
  cpf: string;
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

interface AptoData {
  id: number;
  uuid: string;
  number: string;
  block: string;
  building_id: number;
  situation: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  building: string;
  moradores: Morador[];
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { apto_uid } = useParams();

  const { user, updateUser } = useAuth();

  const [Cpf, setCpf] = useState('');
  const [Nome, setNome] = useState('');
  const [Email, setEmail] = useState('');
  const [Fone, setFone] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('https://api.adorable.io/avatars/80/22');

  const [aptoData, setAptoData] = useState<AptoData>();

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeCpf = (e: React.FormEvent<HTMLInputElement>) => {
    setCpf(cpfMask(e.currentTarget.value));
  };

  const handleChangeFone = (e: React.FormEvent<HTMLInputElement>) => {
    setFone(foneMask(e.currentTarget.value));
  };

  const handleChangeNome = (e: React.FormEvent<HTMLInputElement>) => {
    setNome(e.currentTarget.value);
  };

  const handleChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handleChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };
  const handleChangeConfirmPassword = (
    e: React.FormEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.currentTarget.value);
  };

  useEffect(() => {
    // buscar os dados da visita
    // se status for agendado, então gerar qrcode
    // caso negativo, abrir formulario para preencher dados
    api.get<AptoData>(`aptosweb/${apto_uid}`).then(resp => {
      setAptoData(resp.data);
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
      .patch('/aptomoradores', {
        nome: Nome,
        cpf: Cpf,
        phone: Fone,
        email: Email,
        avatar,
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
        <span
          style={{
            textAlign: 'justify',
            maxWidth: 700,
            fontFamily: 'Roboto',
            fontSize: 12,
          }}
        >
          {`Olá Sr. `}
          <strong style={{ color: '#ff7000', fontWeight: 'bold' }}>
            Pamploni
          </strong>
          ,
          <br />
          <br />
          {'Você foi pré-cadastrado como responsável principal da unidade '}
          <strong style={{ color: '#ff7000', fontWeight: 'bold' }}>
            {aptoData ? aptoData.number : ''}
          </strong>
          {`, no `}
          <strong style={{ color: '#ff7000', fontWeight: 'bold' }}>
            {aptoData ? aptoData.building : ''}
          </strong>
          .
          <br />
          <br />
          Com isso, você terá todo o poder para gerenciar os outros moradores da
          unidade
          <strong style={{ color: '#ff7000', fontWeight: 'bold' }}>
            {aptoData ? aptoData.number : ''}
          </strong>
          {'que acessarão a plataforma Kambuu.\n'}
          <br />
          <br />
          {'Para a segurança de todos os moradores do '}
          <strong style={{ color: '#ff7000', fontWeight: 'bold' }}>
            {aptoData ? aptoData.building : ''},
          </strong>
          {' uma primeira e única validação da foto e dados abaixo será necessária.\n' +
            'Não se preocupe: basta apresentar-se na portaria e eles cuidarão disso :)'}
        </span>
      </Header>
      <Container>
        <Content>
          <AnimationContainer>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <AvatarInput>
                <img src={avatar} alt="avatar" />
                <label htmlFor="avatar">
                  <div>
                    <FiCamera />
                  </div>

                  <input
                    type="file"
                    id="avatar"
                    onChange={handleAvatarchange}
                  />
                </label>
              </AvatarInput>

              <h1>Digite os dados do Responsável</h1>

              <Input
                name="name"
                icon={FiUser}
                placeholder="Nome"
                value={Nome}
                onChange={handleChangeNome}
              />
              <Input
                name="fone"
                icon={FiPhone}
                placeholder="Fone"
                value={Fone}
                onChange={handleChangeFone}
              />

              <Input
                name="cpf"
                icon={FaIdCard}
                type="text"
                placeholder="cpf"
                onChange={handleChangeCpf}
                value={Cpf}
              />

              <Input
                name="email"
                icon={FiMail}
                type="text"
                placeholder="Email"
                onChange={handleChangeEmail}
                value={Email}
              />

              <Input
                name="password"
                icon={FiEye}
                type="password"
                placeholder="Senha"
                onChange={handleChangePassword}
                value={Password}
              />
              <Input
                name="confirmPassword"
                icon={FiEye}
                type="password"
                placeholder="Confirmação de Senha"
                onChange={handleChangeConfirmPassword}
                value={ConfirmPassword}
              />

              <Button type="button" onClick={handleSalvar}>
                Registrar
              </Button>
            </Form>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default SignUp;
