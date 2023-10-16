import React from 'react';
import { useDisclosure } from "@nextui-org/react";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';

import EditEventModal from './EditEventModal';

export default function AppSpeedDial() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const actions = [
        { icon: <FavoriteIcon />, name: 'favourites' },
        { icon: <AddIcon />, name: 'Add', onClick: () => onOpen() },
    ];

    return (
        <>
        <EditEventModal
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
        />
        <div className={isOpen ? "hidden" : ""}>
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{
                position: 'fixed',
                bottom: { xs: 25, sm: 50 },
                right: { xs: 25, sm: 50 },
            }}
            icon={<SpeedDialIcon />}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.onClick}
                    tooltipOpen
                />
            ))}
        </SpeedDial>
        </div>
        </>
    );
}