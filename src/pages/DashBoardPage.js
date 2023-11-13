import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import DpsChart from '../charts/DpsChartPage';
import DeviceTypeChart from '../charts/DeviceTypeChartPage';
import LeaderBoardChart from '../charts/LeaderBoardChartPage';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function DashBoard(props) {
    const REALM_APP_ID = props.realm;
    return (
        <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
        >
          <Grid xs={2} sm={4} md={6} key="1">
            <Item>Lightsaber type<DeviceTypeChart realm={REALM_APP_ID} /></Item>
          </Grid>
          <Grid xs={2} sm={4} md={6} key="2">
            <Item>&nbsp;<LeaderBoardChart realm={REALM_APP_ID} /></Item>
          </Grid>
        </Grid>
        <Grid xs={2} sm={4} md={4} key="2">
          <Item><DpsChart realm={REALM_APP_ID} /></Item>
        </Grid>
      </Box>        

            

        
        
    );
}
