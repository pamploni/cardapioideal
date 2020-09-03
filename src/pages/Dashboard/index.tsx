import React, {
  useCallback,
  useRef,
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import {
  FiArrowLeft,
  FiArrowRight,
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

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      marginTop: 100,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      marginTop: 100,
    },
    drawerPaper: {
      width: drawerWidth,
      marginTop: 100,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  }),
);

const Dashboard: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <Header>
        <img src={logoImg} alt="Kanboo" />
        <div id="user-content">
          <img
            id="user-avatar"
            src="https://i.pravatar.cc/150?img=5"
            alt="Kanboo"
          />
          <div id="user-data">
            <span id="user-name">Nome do usuário</span>
            <span id="user-email">e-mail do usuário</span>
          </div>
        </div>
      </Header>
      <div>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                Meus Condomínios
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
          >
            <div className={classes.toolbar} />
            <Divider />
            <List>
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map(
                (text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ),
              )}
            </List>
            <Divider />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Drawer>

          <main className={classes.content}>
            <div className={classes.toolbar} />

            <Container>
              <Content>
                <AnimationContainer>
                  <p>Teste</p>
                </AnimationContainer>
              </Content>
            </Container>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
