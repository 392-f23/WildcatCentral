import React from 'react';
import { useNavigate } from 'react-router-dom';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';

const AppSpeedDial = () => {
    const navigate = useNavigate();

    const actions = [
        { icon: <FavoriteIcon />, name: 'Favorites', action: () => navigate('/favorites'), testId: 'favorites-button' },
        { icon: <AddIcon />, name: 'New Event', action: () => navigate('/newevent'), testId: 'newevent-button' }
    ];

    return (
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.action}
                    data-testid={action.testId}
                />
            ))}
        </SpeedDial>
    );
};

export default AppSpeedDial;
