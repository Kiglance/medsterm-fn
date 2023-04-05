import {
  Box,
  Button,
  capitalize,
  MenuItem,
  Select,
  Stack,
  styled,
  Typography
} from '@mui/material';
import {
  addHours,
  endOfWeek,
  format,
  getWeek,
  isBefore,
  startOfWeek,
  subHours,
  subMinutes,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DoctorAnalyticsGraphs from '../components/Analytics/DoctorAnalyticsGraphs';
import PatientAnalyticsGraphs from '../components/Analytics/PatientAnalyticsGraphs';
import SelectDateRangeMenu from '../components/Analytics/SelectDateRangeMenu';
import { getAllAppointments } from '../redux/reducers/appointment.reducer';
import { getDepartmentList } from '../redux/reducers/department.reducer';

import { getDoctorList, getOneDoctor } from '../redux/reducers/doctor.reducer';
import { getPatientList } from '../redux/reducers/patient.reducer';

const formatDoctorName = (doctor) => {
  if (doctor) {
    const { last_name } = doctor;
    return `Dr. ${capitalize(last_name)}`;
  }
};

const StyledSelect = styled((props) => (
  <Select
    MenuProps={{
      PaperProps: {
        elevation: 0,
        sx: {
          borderRadius: '10px',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          backgroundColor: '#E7E7E7'
        }
      }
    }}
    size="small"
    {...props}
  />
))(() => ({
  overflow: 'hidden',
  '&.Mui-focused:has( .MuiSelect-iconOpen)': {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  '& .MuiInputBase-input': {
    backgroundColor: '#E7E7E7'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiSelect-select': {
    borderRadius: 0
  }
}));

function Analytics() {
  const dispatch = useDispatch();
  const [selectedToggler, setSelectedToggler] = useState(true);
  const selectedDoctorRef = useRef(null);
  const [selectedDoctor, setSelectedDoctor] = useState('All Doctors');
  const [selectedPeriodValue, setSelectedPeriodValue] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('This week');
  const [clickedDoctor, setClickedDoctor] = useState(null);
  const selectPeriodRef = useRef();
  const [selectPeriodOpen, setSelectPeriodOpen] = useState(false);
  const patients = useSelector((state) => state.patient?.data?.data);
  const allDoctors = useSelector((state) => state.doctor?.data?.data);
  const oneDoctor = useSelector((state) => state.doctor?.single_data?.data);
  const departments = useSelector((state) => state.department?.data?.data);
  const appointments = useSelector(
    (state) => state.appointment?.entities?.undefined?.appointments
  );
  const loginData = useSelector((state) => state.user?.loginData);

  const toggleToggler = () => {
    setSelectedToggler((value) => !value);
  };

  const newPatients = useMemo(
    () =>
      selectedToggler &&
      patients?.filter((patient) => {
        return isBefore(subWeeks(new Date(), 1), new Date(patient?.createdAt));
      }),
    [patients, selectedToggler]
  );
  const newDoctors = useMemo(
    () =>
      !selectedToggler &&
      allDoctors?.filter((doctor) =>
        isBefore(subWeeks(new Date(), 1), new Date(doctor?.createdAt))
      ),
    [allDoctors, selectedToggler]
  );

  // useEffect(() => {
  //   if (allDoctors) {
  //     setSelectedDoctor(All Doctors);
  //   }
  // }, [allDoctors]);
  useEffect(() => {
    selectedDoctorRef.current = _.find(allDoctors, {
      last_name: selectedDoctor
    });
  }, [selectedDoctor, allDoctors]);
  useEffect(() => {
    switch (selectedPeriod) {
      case 'This week':
        setSelectedPeriodValue([
          startOfWeek(new Date(), { weekStartsOn: 1 }),
          endOfWeek(new Date(), { weekStartsOn: 1 })
        ]);
        break;
      case 'Last month':
        setSelectedPeriodValue([subMonths(new Date(), 1), new Date()]);
        break;
      case 'Last 3 month':
        setSelectedPeriodValue([subMonths(new Date(), 3), new Date()]);
        break;
      case 'Last year':
        setSelectedPeriodValue([subYears(new Date(), 1), new Date()]);
        break;
      default:
        if (selectedPeriod.includes('-')) {
          const dates = selectedPeriod.split(' - ');
          setSelectedPeriodValue([new Date(dates[0]), new Date(dates[1])]);
        }
    }
  }, [selectedPeriod]);
  useEffect(() => {
    dispatch(getDoctorList());
    dispatch(getPatientList());
    dispatch(getDepartmentList());
    dispatch(getAllAppointments());
  }, []);

  const isAdmin = loginData?.Role?.role === 'admin';

  const doctors = clickedDoctor ? [oneDoctor] : allDoctors;

  return (
    <>
      <Box className="w-full max-w-[1200px] h-full mx-auto p-10 sm:p-3">
        <Typography variant="h6" sx={{ mb: '20px' }} noWrap>
          Analytics
        </Typography>

        {/* Analytics selectors */}
        {isAdmin && (
          <Stack direction="row" className="gap-3 flex-wrap w-full">
            <Box
              component={Button}
              role="button"
              onClick={toggleToggler}
              className="text-dark bg-[#E7E7E7] rounded-xl"
            >
              <Typography>Patients</Typography>
              <Box
                sx={{
                  backgroundColor: selectedToggler ? '#000' : 'transparent'
                }}
                className="ml-2 w-[16px] h-[16px] rounded-full border-dark border"
              />
            </Box>

            {!allDoctors || allDoctors.length < 0 ? (
              <MenuItem value="">No Doctors</MenuItem>
            ) : (
              <StyledSelect
                className="max-w-[200px] w-full"
                value={selectedDoctor || ''}
                onChange={(e) => {
                  setSelectedDoctor(e.target.value);
                }}
              >
                <MenuItem
                  value="All Doctors"
                  onClick={() => {
                    setClickedDoctor(null);
                  }}
                >
                  All Doctors
                </MenuItem>
                {allDoctors.map((doctor) => (
                  <MenuItem
                    key={doctor.doctor_id}
                    value={doctor.last_name}
                    onClick={() => {
                      setClickedDoctor(doctor.doctor_id);
                      dispatch(getOneDoctor(doctor.doctor_id));
                    }}
                  >
                    {formatDoctorName(doctor)}
                  </MenuItem>
                ))}
              </StyledSelect>
            )}
            <StyledSelect
              className="max-w-[250px] w-full"
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
              }}
            >
              <MenuItem value="This week">This week</MenuItem>
              <MenuItem value="Last month">Last month</MenuItem>
              <MenuItem value="Last 3 month">Last 3 month</MenuItem>
              <MenuItem value="Last year">Last year</MenuItem>
              {selectedPeriod.includes('-') && (
                <MenuItem value={selectedPeriod}>{selectedPeriod}</MenuItem>
              )}
              <MenuItem
                ref={selectPeriodRef}
                value=""
                onClickCapture={(e) => {
                  e.stopPropagation();
                  setSelectPeriodOpen(true);
                }}
              >
                Select period
              </MenuItem>
            </StyledSelect>
          </Stack>
        )}

        {/* Analytics sample data cards */}
        <Stack direction="row" className="w-full gap-3 mt-3" flexWrap="wrap">
          <Stack
            direction="column"
            className="p-4 gap-1 bg-[#EDF0F2] w-full max-w-[175px] h-[119px] rounded-xl"
          >
            <Typography className="text-[18px]">
              New {selectedToggler ? 'Patients' : 'Doctors'}
            </Typography>
            <Typography className="text.dark text-[40px] font-semibold leading-none">
              {selectedToggler
                ? newPatients?.length || 0
                : newDoctors?.length || 0}
            </Typography>
          </Stack>
          <Stack
            direction="column"
            className="p-4 gap-1 bg-[#EDF0F2] w-full max-w-[175px] h-[119px] rounded-xl"
          >
            <Typography className="text-[18px]">
              Total {selectedToggler ? 'Patients' : 'Doctors'}
            </Typography>
            <Typography className="text.dark text-[40px] font-semibold leading-none">
              {selectedToggler
                ? patients?.length || 0
                : allDoctors?.length || 0}
            </Typography>
          </Stack>
        </Stack>

        {/* Analytics Graphs */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 3,
            maxWidth: '1900px',
            width: '100%',
            marginX: 'auto',
            height: 'max-content',
            mt: 2,
            pb: 5
          }}
        >
          {selectedToggler ? (
            <PatientAnalyticsGraphs
              isAdmin={isAdmin}
              patients={patients}
              doctors={allDoctors}
              // departments={departments}
              appointments={appointments}
              range={selectedPeriodValue}
            />
          ) : (
            <DoctorAnalyticsGraphs
              clickedDoctor={clickedDoctor}
              doctors={doctors}
              departments={departments}
              appointments={appointments}
              range={selectedPeriodValue}
            />
          )}
        </Box>
      </Box>
      <SelectDateRangeMenu
        {...{
          selectPeriodOpen,
          selectPeriodRef,
          setSelectPeriodOpen,
          setSelectedPeriod
        }}
      />
    </>
  );
}

export default Analytics;
