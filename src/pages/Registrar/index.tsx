import React, {
  useCallback,
  ChangeEvent,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';

import {
  FiArrowLeft,
  FiLock,
  FiMail,
  FiUser,
  FiCamera,
  FiEye,
} from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import Input from '../../components/Input';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import logoImg from '../../assets/logo2.png';

import Button from '../../components/Button';

import {
  Container,
  Content,
  AnimationContainer,
  Header,
  AvatarInput,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Registrar: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const [avatar, setAvatar] = useState(
    'https://api.adorable.io/avatars/80/pamploni',
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

  const handleSubmit = useCallback(
    async (data: object) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite e-mail válido.'),
          password: Yup.string().min(6, 'No mínimo 6 digitos.'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação de senha tem que ser igual a senha.',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        addToast({
          type: 'success',
          title: 'Cadastro realizado',
          description: 'Você já pode realizar seu logon',
        });

        await api.post('/users', data);

        history.push('/');
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

  return (
    <>
      <Header>
        <img src={logoImg} alt="Kanboo" />
        <span>
          Seja bem vindo a Plataforma Kanboo. Para começar, faça seu registro
          usando o formulário abaixo
        </span>
      </Header>
      <Container>
        <Content>
          <AnimationContainer>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1> Faça seu Cadastro</h1>

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

              <Input name="name" icon={FiUser} placeholder="Nome" />
              <Input name="email" icon={FiMail} placeholder="E-mail" />
              <Input
                name="password"
                icon={FiLock}
                type="password"
                placeholder="Senha"
              />
              <Input
                name="password_confirmation"
                icon={FiLock}
                type="password"
                placeholder="Confirmação de senha"
              />

              <Button type="button" onClick={() => {}}>
                Registrar
              </Button>
            </Form>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default Registrar;
