import styled from 'styled-components';
import Box from '@mui/material/Box';

export const PageContainer = styled(Box)`
    background: #f2f2f2;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const PhaseContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10;
    background: white;
    min-width: 400px;
    height: 100%;
`;
export const PhaseBox = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;
export const Phase = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;