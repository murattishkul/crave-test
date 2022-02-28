import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {PageContainer, PhaseContainer, PhaseBox, Phase} from './components';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {ReactComponent as CompletedSVG} from './assets/completed.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Task {
    label: string;
    value: boolean;
    phase: number;
    id: number;
}

function App() {

    const INITIAL_DATA:Array<Task> = useMemo(() => [
        {label: 'Setup virtual office', value: false, phase: 0, id: 0},
        {label: 'Set mission & vision', value: false, phase: 0, id: 1},
        {label: 'Select business name', value: false, phase: 0, id: 2},
        {label: 'Buy domains', value: false, phase: 0, id: 3},
        {label: 'Create roadmap', value: false, phase: 1, id: 0},
        {label: 'Competitor analysis', value: false, phase: 1, id: 1},
        {label: 'Release marketing website', value: false, phase: 2, id: 0},
        {label: 'Release MVP', value: false, phase: 2, id: 1},
    ],[]);

    const [data, setData] = useState<Array<Task>>(INITIAL_DATA);

    useEffect( () => {
        if (localStorage.getItem('data')) {
            let localData = JSON.parse(localStorage.getItem('data')!);
            setData(localData);
        } else {
            localStorage.setItem('data', JSON.stringify(INITIAL_DATA));
        }
    }, [INITIAL_DATA])

    const displayFact = useCallback(async () => {
        const res = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const data = await res.json();
        toast.success(`🦄 ${data.text}!`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    },[]);

    const handleChange = (phase: number, id: number, value: boolean) => {
        if (data) {
            let newData = data.map(task => {
                if (task.id === id && task.phase === phase) {
                    task.value = !value;
                    return task;
                }
                return task;
            })
            setData(newData);
        localStorage.setItem('data', JSON.stringify(newData));
        }
    }

    const isDisabled = useCallback((phase: number): boolean => {
        let tasks = data?.filter(task => task.phase < phase);
        return !tasks?.reduce((acc: boolean, curr: Task) => acc && curr.value, true);
    },[data])

    const phaseCompleted = useCallback((phase: number):boolean => {
        return !isDisabled(phase)  && data.filter(task => task.phase === phase).reduce( (acc: boolean, curr: Task) => acc && curr.value, true )
    }, [data, isDisabled])

    useEffect( () => {
        const allPhasesCompleted = () => phaseCompleted(0) && phaseCompleted(1) &&phaseCompleted(2);
        if(allPhasesCompleted()){
            displayFact().then();
        }
    },[displayFact, phaseCompleted])

  return (
      <PageContainer>
          <PhaseContainer>

              <Typography variant="h4" gutterBottom component="div" sx={{marginBottom: '30px', marginTop: '100px'}}>
                  My startup progress
              </Typography>

              <FormGroup>
                  {[0,1,2].map( phase =>
                      <PhaseBox key={`phase-${phase}`}>
                          <Phase>
                              <Typography variant="h5" gutterBottom component={"div"} sx={{height: 40,lineHeight: 2,
                                  marginBottom: 0}}>
                                  Foundation
                              </Typography>
                              { phaseCompleted(phase) && <CompletedSVG /> }
                          </Phase>
                          {data?.filter(task => task.phase === phase)
                              .map( ({label, id, phase, value}:Task ) =>
                                  <FormControlLabel
                                    key={`key-${phase}-${id}`}
                                    control={ <Checkbox onChange={() => handleChange(phase, id, value)} /> }
                                    label={label}
                                    disabled={isDisabled(phase)}
                                    checked={value}
                                  />
                              )}
                      </PhaseBox>
                  )}
              </FormGroup>
          </PhaseContainer>
          <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
              />
      </PageContainer>
  );
}

export default App;
