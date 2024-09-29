import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { Grid2 } from '@mui/material';

const getLoginButtonText = (status: 'authenticated' | 'loading' | 'unauthenticated', session: Session) => {
  let loginButtonText = 'Logout';
  if (status === 'loading') {
    loginButtonText = 'Validating session ...';
  }
  if (!session) {
    loginButtonText = 'Login';
  }

  return loginButtonText;
};

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;

  const { data: session, status } = useSession();

  const loginButtonText = getLoginButtonText(status, session);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <CalendarTodayIcon />
          </IconButton>
          <Grid2 container spacing={2} alignItems="center" flexGrow={1}>
            <Typography variant="h6" component="div">
              Schedule Pal
            </Typography>
            {session && (
              <>
                <Link href="/" component={NextLink} data-active={isActive('/')} color="inherit" underline="hover">
                  Appointments
                </Link>
                <Link
                  href="/create"
                  component={NextLink}
                  data-active={isActive('/create')}
                  color="inherit"
                  underline="hover"
                >
                  Add +
                </Link>
              </>
            )}
          </Grid2>
          {session && (
            <Grid2 container spacing={2} alignItems="center">
              <Typography variant="body2">{session.user.name}</Typography>
              <Button color="inherit" variant="outlined" onClick={() => signOut()}>
                <Typography>{loginButtonText}</Typography>
              </Button>
            </Grid2>
          )}
          {!session && (
            <NextLink href="/api/auth/signin">
              <Button color="inherit" variant="outlined" data-active={isActive('/signup')}>
                {loginButtonText}
              </Button>
            </NextLink>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
