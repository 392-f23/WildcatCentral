import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PetsIcon from '@mui/icons-material/Pets';
import SearchBar from "./SearchBar";

import { signInWithGoogle, signOut, useAuthState } from '../utilities/firebase';
import { useProfile } from '../utilities/profile';
import { Logout } from "@mui/icons-material";

import { Navigate, useNavigate } from "react-router-dom";
import useEventStore from "../stores/eventStore";

const pages = [{
  name: "School Org",
  link: "/"
},
{
  name: "Individual Events",
  link: "/individual-events"
},
{
  name: "Map View",
  link: "/map-view"
},
{
  name: "Favorite Events",
  link: "/favorites",
  needAuth: true
}];

function Banner() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [profile, profileLoading, profileError] = useProfile();

  const setSearchQuery = useEventStore(state => state.setSearchQuery);
  const [user] = useAuthState();
  const setUser = useEventStore(state => state.setUser);
  const setFavoriteEvents = useEventStore(state => state.setFavoriteEvents);

  const navigate = useNavigate();

  const login = () => {
    signInWithGoogle();
    setAnchorElUser(null);
  };

  const logout = () => {
    signOut();
    setFavoriteEvents([]);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    setUser(user);
  }, [user]);

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <PetsIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer", // This line makes the cursor change to a hand (pointer) when hovering over the element
              '&:hover': {
                color: "rgba(240, 222, 255)"
              }
            }}
          >
            Wildcat Central
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(event) => setAnchorElNav(event.currentTarget)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) =>
                (!page.needAuth || user) && (
                  <MenuItem key={`nav-m-${page.name}`} onClick={handleCloseNavMenu}>
                    <Button variant="text" onClick={() => navigate(page.link)}>
                      {page.name}
                    </Button>
                  </MenuItem>
                )
              )}
            </Menu>
          </Box>
          <PetsIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          {/* <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Central
          </Typography> */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              if (page.needAuth && !user) {
                return null;
              }
              return (<Button
                key={`nav-${page.name}`}
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={e => navigate(page.link)}
              >
                {page.name}
              </Button>)
            })}
          </Box>
          <SearchBar
            handleSearch={setSearchQuery}
            className="p-2"
          />
          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={(event) => setAnchorElUser(event.currentTarget)}
                  sx={{ p: 0 }}>
                  <Avatar alt={user.displayName} src={user.photoURL} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {profile?.isAdmin && (
                  <MenuItem key="nav-admin-text">
                    <p className="font-semibold text-red-500">
                      Welcome back, Admin
                    </p>
                  </MenuItem>
                )}
                <MenuItem key="nav-username" onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <Avatar alt={user.displayName} src={user.photoURL} />
                  </ListItemIcon>
                  <Box sx={{ marginLeft: 1 }}>
                    <Typography>{user.displayName}</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem key="nav-signout" onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Sign Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="contrast" variant="contained" onClick={login}>
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Banner;
