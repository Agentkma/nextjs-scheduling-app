import React from "react";
import NextLink from "next/link";

import { useRouter } from "next/router";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';


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


const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;


  return (    <Box sx={{ flexGrow: 1 }}>
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
        <Link href="/" component={NextLink} data-active={isActive("/")} >Appointments</Link>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  </Box>)
};

export default Header;
