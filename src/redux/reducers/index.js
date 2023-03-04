import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import infoReducer from './info.reducer';
import doctorReducer from './doctor.reducer';
import departmentReducer from './department.reducer';
import patientReducer from './patient.reducer';
import stepReducer from './step.reducer';

const allReducers = combineReducers({
  user: userReducer,
  info: infoReducer,
  doctor: doctorReducer,
  patient: patientReducer,
  department: departmentReducer,
  step: stepReducer
});

export default allReducers;
