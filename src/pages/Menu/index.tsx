import React, {
  useCallback,
  useRef,
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import {
  FiArrowLeft,
  FiLock,
  FiSearch,
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

import { cpfMask, formatValue } from '../../utils/formatValue';

import getValidationErrors from '../../utils/getValidationErrors';

import imgBck from '../../assets/imgBck.jpeg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Content,
  AvatarInput,
  AnimationContainer,
  Header,
} from './styles';

interface GrupoDTO {
  grupo: string;
}

interface ItemDTO {
  CARDAPIO_GRUPO: string;
  ID_CARDAPIO: number;
  CODIGO: string;
  DESCRICAO: string;
  PRECO: number;
  GRUPO: string;
  FOTO: string;
  ARQUIVO_WEB: string;
  DESCRICAO_PRATO: string;
}

interface ClienteDTO {
  id: number;
  natureza: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  status: string;
  imagem: string;
}

const Menu: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { cliente_cname } = useParams();

  const [busca, setBusca] = useState('');
  const [grupo, setGrupo] = useState<GrupoDTO[]>([]);
  const [itens, setItens] = useState<ItemDTO[]>([]);
  const [itensBusca, setItensBusca] = useState<ItemDTO[]>([]);

  const [cliente, setCliente] = useState<ClienteDTO>();

  const [selected, setSelected] = useState();

  useEffect(() => {
    if (!cliente) {
      api.get(`/clientes?cname=${cliente_cname}`).then(resp => {
        setCliente(resp.data[0]);
      });
    } else {
      api.get(`/menuideal?cliente_id=${cliente.id}`).then(resp => {
        // console.log(resp.data);
        const itensData: ItemDTO[] = resp.data[0].cardapio;

        const grupoSetData = new Set(
          itensData.map((it: ItemDTO) => it.CARDAPIO_GRUPO),
        );

        const grupoData: GrupoDTO[] = [];

        grupoSetData.forEach(ite => {
          grupoData.push({ grupo: ite.toLowerCase() });
        });
        setItens(
          itensData.sort((a, b) => {
            if (a.DESCRICAO < b.DESCRICAO) return -1;
            if (a.DESCRICAO > b.DESCRICAO) return 1;
            return 0;
          }),
        );
        setItensBusca(
          itensData.sort((a, b) => {
            if (a.DESCRICAO < b.DESCRICAO) return -1;
            if (a.DESCRICAO > b.DESCRICAO) return 1;
            return 0;
          }),
        );
        // console.log(grupoData);
        setGrupo(
          grupoData.sort((a, b) => {
            if (a.grupo < b.grupo) return -1;
            if (a.grupo > b.grupo) return 1;
            return 0;
          }),
        );
      });

      api.get('/cliente').then(resp => {
        setCliente(resp.data);
      });
    }
  }, [cliente]);

  const handleGrupoClick = (itemGrupo: string): void => {
    setItensBusca(
      itens
        .filter(item => item.CARDAPIO_GRUPO === itemGrupo.toUpperCase())
        .sort((a, b) => {
          if (a.DESCRICAO < b.DESCRICAO) return -1;
          if (a.DESCRICAO > b.DESCRICAO) return 1;
          return 0;
        }),
    );
  };

  const handlePesquisar = (e: ChangeEvent<HTMLInputElement>): void => {
    setBusca(e.target.value);
    console.log(e.target.value);
    setItensBusca(
      itens
        .filter(item => item.DESCRICAO.includes(e.target.value.toUpperCase()))
        .sort((a, b) => {
          if (a.DESCRICAO < b.DESCRICAO) return -1;
          if (a.DESCRICAO > b.DESCRICAO) return 1;
          return 0;
        }),
    );
  };

  return (
    <>
      <Header>
        <Form ref={formRef} onSubmit={() => {}}>
          <Input
            name="busca"
            icon={FiSearch}
            type="text"
            placeholder="pesquise pelo seu item aqui..."
            value={busca}
            onChange={handlePesquisar}
          />
        </Form>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            overflow: 'hidden',
            width: '95%',
            backgroundColor: '#1a57ca',
          }}
        >
          <GridList
            style={{
              flexWrap: 'nowrap',
              transform: 'translateZ(0)',
              width: '100%',
            }}
            cellHeight={40}
            spacing={1}
          >
            {grupo.map(item => (
              <GridListTile key={item.grupo} cols={0.6} rows={1}>
                <button
                  type="button"
                  onClick={() => handleGrupoClick(item.grupo)}
                  style={{
                    display: 'flex',
                    borderRadius: 20,
                    backgroundColor: '#f4f4f4',
                    height: 36,
                    paddingLeft: 4,
                    paddingRight: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 105,
                  }}
                >
                  <span
                    style={{
                      color: '#1a57ca',
                      fontFamily: 'Roboto',
                      fontSize: 14,
                      fontWeight: 700,
                      textAlign: 'center',
                      lineHeight: 1,
                      width: 88,
                    }}
                  >
                    <strong>{item.grupo}</strong>
                  </span>
                </button>
              </GridListTile>
            ))}
          </GridList>
        </div>
      </Header>
      <Container>
        <Content>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '95vw',
              height: '160px',
              marginTop: 10,
              marginLeft: 4,
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
            }}
          >
            <span
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: 600,
                color: '#fff',
                marginBottom: 4,
                marginLeft: 16,

                textAlign: 'left',
                verticalAlign: 'bottom',
                zIndex: 3,
              }}
            >
              {' '}
              {cliente ? cliente.nome_fantasia : 'Nome do Restaurante'}
            </span>
            <span
              style={{
                fontFamily: 'Roboto',
                fontSize: 13,
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#bbb',
                marginBottom: 16,
                marginLeft: 16,

                zIndex: 3,
                textAlign: 'left',
                verticalAlign: 'bottom',
              }}
            >
              {' '}
              {cliente ? cliente.natureza : 'Natureza'}
            </span>

            <div
              style={{
                position: 'absolute',
                width: '95vw',
                height: '160px',
                backgroundColor: '#000',
                opacity: 0.5,
                zIndex: 1,
              }}
            />
            <img
              src={imgBck}
              alt="empresa"
              style={{
                width: '95vw',
                height: '160px',
                objectFit: 'fill',
                position: 'absolute',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              width: '100%',
              paddingTop: 16,
            }}
          />
          <AnimationContainer>
            <GridList
              style={{
                display: 'flex',
                flexDirection: 'column',
                transform: 'translateZ(0)',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingLeft: 3,
                paddingRight: 3,
              }}
              cellHeight={110}
              spacing={2}
            >
              {itensBusca.map(item => (
                <GridListTile key={item.ID_CARDAPIO} cols={2} rows={1}>
                  <div
                    style={{
                      height: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100vw',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: 3,
                      paddingRight: 3,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '97%',
                        height: '100%',
                        boxShadow: '2px 2px 4px #999',
                        backgroundColor: '#f4f4f4',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          msFlexDirection: 'row',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          width: '97%',
                        }}
                      >
                        <h1
                          style={{
                            fontFamily: 'Roboto',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#000',
                            marginLeft: 10,
                            marginTop: 10,
                          }}
                        >
                          {item.CODIGO}
                          {' - '}
                          {item.DESCRICAO}
                        </h1>
                        <h2
                          style={{
                            fontFamily: 'Roboto',
                            fontSize: 12,
                            fontWeight: 500,
                            fontStyle: 'italic',
                            color: '#1a57ca',
                            marginLeft: 16,
                            marginTop: 4,
                            textAlign: 'right',
                          }}
                        >
                          (
{' '}
{item.CARDAPIO_GRUPO.toLowerCase()})
                        </h2>
                      </div>
                      <h2
                        style={{
                          fontFamily: 'Roboto',
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#999',
                          marginLeft: 32,
                          marginTop: 8,
                          width: '90%',
                        }}
                      >
                        {item.DESCRICAO_PRATO !== 'None'
                          ? item.DESCRICAO_PRATO
                          : `Item disponível na casa, para sua apreciação. Caso tenha
                        alguma dúvida, procure um de nossos garçons.`}
                      </h2>
                      <h1
                        style={{
                          fontFamily: 'Roboto',
                          fontSize: 17,
                          fontWeight: 700,
                          color: '#ff3000',

                          position: 'absolute',
                          bottom: 16,
                          right: 16,
                          width: '100%',
                          textAlign: 'right',
                        }}
                      >
                        {formatValue(item.PRECO)}
                      </h1>
                    </div>
                  </div>
                </GridListTile>
              ))}
            </GridList>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default Menu;
