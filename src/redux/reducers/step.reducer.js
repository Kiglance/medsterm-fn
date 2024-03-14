import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile_step: 0,
  admin_patient_step: 0,
  appointment_step: 0,
  login_step: 1
};

const stepSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {
    toPersonalInfo: (state) => {
      state.profile_step = 0;
    },
    toContactInfo: (state) => {
      state.profile_step = 1;
    },
    toMedicalHistory: (state) => {
      state.profile_step = 2;
    },

    toExpectedAppointments: (state) => {
      state.appointment_step = 0;
    },
    toPreviousAppointments: (state) => {
      state.appointment_step = 1;
    },
    toAppointmentDetails: (state) => {
      state.appointment_step = 2;
    },

    toAdminPatientPersonalDetails: (state) => {
      state.admin_patient_step = 0;
    },
    toAdminPatientExpectedAppointments: (state) => {
      state.admin_patient_step = 1;
    },
    toAdminPatientPreviousAppointments: (state) => {
      state.admin_patient_step = 2;
    },
    toDoctorPatientMedicalHistory: (state) => {
      state.admin_patient_step = 3;
    },
    toAdminPatientMedicalHistory: (state) => {
      state.admin_patient_step = 4;
    },

    toPatientLogin: (state) => {
      state.login_step = 0;
    },
    toAdminLogin: (state) => {
      state.login_step = 1;
    }
  }
});

export const {
  toPersonalInfo,
  toContactInfo,
  toMedicalHistory,
  toExpectedAppointments,
  toPreviousAppointments,
  toAppointmentDetails,
  toPatientLogin,
  toAdminLogin,
  toAdminPatientExpectedAppointments,
  toAdminPatientPersonalDetails,
  toAdminPatientPreviousAppointments,
  toAdminPatientMedicalHistory,
  toDoctorPatientMedicalHistory
} = stepSlice.actions;

export default stepSlice.reducer;
