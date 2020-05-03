import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [inputError, SetInputError] = useState('');
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    try {
      console.log('Apertou o enviar');
      Promise.all(
        uploadedFiles.map(async fileToUpload => {
          const data = new FormData();
          data.append('file', fileToUpload.file);

          await api.post('/transactions/import', data);
        }),
      ).then(element => {
        setUploadedFiles([]);
      });
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    files.map(fileToUpload => {
      // const { name, type, size } = fileToUpload;

      if (fileToUpload.type !== 'text/csv') {
        SetInputError('Permitido apenas arquivos CSV');
      } else {
        SetInputError('');

        console.log(fileToUpload);

        const upFile = {
          file: fileToUpload,
          name: fileToUpload.name,
          readableSize: fileToUpload.size.toString(),
        };

        setUploadedFiles([...uploadedFiles, upFile]);
      }
    });
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            {inputError && (
              <p>
                <img src={alert} alt="Alert" />
                inputError
              </p>
            )}
            <button onClick={() => handleUpload()} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
