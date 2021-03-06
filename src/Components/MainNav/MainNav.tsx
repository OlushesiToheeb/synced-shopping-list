import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Location } from 'history';
import {
  makeStyles,
  createStyles,
  Divider,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import { List as ListIcon, Category as CategoryIcon } from '@material-ui/icons';
import { version } from '../../../package.json';
import { ReactComponent as NavIllustration } from '../../Assets/nav.svg';
import { useAuth } from '../../Hooks/useAuth';
import { useToggleMainNav } from '../../Hooks/useToggleMainNav';
import { login, logout } from '../../Services/auth';

const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      display: 'grid',
      gridTemplateRows: 'auto auto 1fr auto',
    },
    navItemText: {
      '&:first-letter': {
        textTransform: 'uppercase',
      },
    },
    illustration: {
      width: '100%',
      height: 'auto',
    },
    subHeader: {
      padding: theme.spacing(0, 0, 1, 0),
    },
    helloSection: {
      padding: theme.spacing(1, 1, 0),
      lineHeight: 1,
      display: 'flex',
      gap: `${theme.spacing(1)}px`,
    },
  })
);

const routes = [
  {
    text: 'List',
    path: '/',
    icon: <ListIcon />,
  },
  {
    text: 'Categories',
    path: 'categories',
    icon: <CategoryIcon />,
  },
];

function shouldMainNavBeOpen(location: Location) {
  return new URLSearchParams(location.search).has('menu');
}

export const MainNav: FC = () => {
  const classes = useStyles();
  const currentUser = useAuth();
  const history = useHistory();
  const toggleMainNav = useToggleMainNav();
  const [isOpen, setIsOpen] = useState(shouldMainNavBeOpen(history.location));

  useEffect(() => {
    history.listen((newLocation) => {
      setIsOpen(shouldMainNavBeOpen(newLocation));
    });
  }, [history]);

  return (
    <>
      <SwipeableDrawer
        classes={{
          root: classes.drawer,
          paper: classes.drawerPaper,
        }}
        anchor='left'
        open={isOpen}
        onClose={toggleMainNav}
        onOpen={toggleMainNav}
        swipeAreaWidth={5}
      >
        <div className={classes.subHeader}>
          <NavIllustration className={classes.illustration} />
          {currentUser ? (
            <HelloSection
              text={`Hi ${currentUser.displayName} `}
              actionText='Logout'
              action={logout}
            />
          ) : (
            <HelloSection
              text={`Hi stranger `}
              actionText='Login'
              action={login}
            />
          )}
        </div>
        <Divider />
        <List>
          {routes.map(({ icon, text, path }) => (
            <ListItem
              key={text}
              button
              component={Link}
              to={path}
              onClick={toggleMainNav}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                classes={{ primary: classes.navItemText }}
                primary={text}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant='caption' align='center'>
          {version}
        </Typography>
      </SwipeableDrawer>
    </>
  );
};

type HelloSectionProps = {
  text: string;
  actionText: string;
  action(): void;
};

const HelloSection: FC<HelloSectionProps> = ({ text, actionText, action }) => {
  const classes = useStyles();

  return (
    <div className={classes.helloSection}>
      <Typography component='span'>{text}</Typography>
      <MuiLink component='button' variant='body2' onClick={action}>
        {actionText}
      </MuiLink>
    </div>
  );
};
