import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import MultiChart from './charts/MultiChartPage';
import PieChart from './charts/PieChartPage';
import HorizontalBarChart from './charts/HorizontalBarChartPage';
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
        <><Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid xs={6}>
                    <Item><MultiChart realm={REALM_APP_ID} /></Item>
                </Grid>
                <Grid xs={6}>
                    <Item><HorizontalBarChart realm={REALM_APP_ID} /></Item>
                </Grid>
            </Grid>

        </Box><Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    <Grid xs={6}>
                        <Item><PieChart realm={REALM_APP_ID} /></Item>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
