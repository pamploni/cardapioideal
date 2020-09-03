import React, {
  useCallback,
  useRef,
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiLock,
  FiCamera,
  FiUser,
  FiEye,
  FiMail,
} from 'react-icons/fi';
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

interface SignInFormData {
  email: string;
  password: string;
}

interface UserData {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  type: string;
  function_id: string;
  building_id: string;
}

interface AccessData {
  token: string;
  user: string;
}

const signIn = async (dados: SignInFormData): Promise<AccessData> => {
  const response = await api.get(`/users/${dados.email}/${dados.password}`);

  const { user } = response.data;
  const token = user.uuid;
  localStorage.setItem('@KanBoo:token', token);
  localStorage.setItem('@Kanboo:user', JSON.stringify(user));

  // api.defaults.headers.authorization = `Bearer ${token}`;
  return { token, user };
};

const Menu: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { apto } = useParams();

  const { user, updateUser } = useAuth();

  const [cpf, setCpf] = useState('');
  const [avatar, setAvatar] = useState(
    'https://api.adorable.io/avatars/80/pamploni',
  );

  const handleChangeCpf = (e: ChangeEvent<HTMLInputElement>) => {
    setCpf(cpfMask(e.currentTarget.value));
  };

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite e-mail válido.'),
          password: Yup.string().required('Senha obrigatória.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({ email: data.email, password: data.password }).then(
          resp => {
            console.log(resp);

            addToast({
              type: 'success',
              title: 'Login realizado',
              description: 'Login realizado com sucesso',
            });

            history.push('dashboard');
          },
        );

        // history.push('/');
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
        const data = new FormData();
        data.append('avatar', e.target.files[0]);

        api.patch('/uploads', data).then(response => {
          // updateUser(response.data);

          setAvatar(response.data.recebido);
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });
      }
    },
    [addToast],
  );

  return (
    <>
      <Header>
        <img src={logoImg} alt="Kanboo" />
        <span>
          Olá, senhor Condômino. Utilize suas credenciais para acessar a
          plataforma
        </span>
      </Header>
      <Container>
        <Content>
          <AnimationContainer>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Digite dados de acesso</h1>

              <Input
                type="email"
                name="email"
                icon={FiMail}
                placeholder="email"
              />
              <Input
                name="password"
                icon={FiLock}
                type="password"
                placeholder="Senha"
              />
              <Button type="submit">Acessar</Button>
            </Form>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default Menu;
