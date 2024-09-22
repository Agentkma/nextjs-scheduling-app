import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from 'next-auth/react';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { Session } from "next-auth";
import { Grid2, Stack } from "@mui/material";


{/* <style jsx>{`
  .bold {
    font-weight: bold;
  }

  a {
    text-decoration: none;
    color: #000;
    display: inline-block;
  }

  .left a[data-active="true"] {
    color: gray;
  }

  a + a {
    margin-left: 1rem;
  }


`}</style> */}

const getLoginButtonText = (status: "authenticated" | "loading" | "unauthenticated", session:Session) => { 
  
  let loginButtonText ='Logout'
  if (status === 'loading') {
    loginButtonText='Validating session ...'
  }
  if(!session){
    loginButtonText = 'Login'
  }

  return loginButtonText

 }

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();


const loginButtonText =getLoginButtonText(status, session)

  return (    
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <CalendarTodayIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Schedule Pal
        </Typography>
       {session &&  (
        <Grid2 container alignContent='space-between' spacing={2}>
          <Link href="/" component={NextLink} data-active={isActive("/")} >Appointments</Link>
          <Link href="/create" component={NextLink} data-active={isActive("/")} >Schedule Now</Link>
          <Link href="/drafts" component={NextLink} data-active={isActive("/drafts")} >Drafts</Link>
        </Grid2>)}
        {session && 
          <Stack> 
            <Typography variant="body2">{session.user.name}</Typography>
            <Button color="inherit" onClick={() => signOut()}>
            <Typography>{loginButtonText}</Typography>  
            </Button>
          </Stack>
        }
      {!session &&  <NextLink  href="/api/auth/signin"><Button  variant='outlined'color="inherit"data-active={isActive('/signup')}>{loginButtonText}</Button></NextLink>}
      </Toolbar>
    </AppBar>
  </Box>)
};

export default Header;
