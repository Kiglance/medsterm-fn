import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  data: [],
  error: ''
};

export const getDoctorList = createAsyncThunk(
  'users/fetchDoctors',
  async () => {
    return axios
      .get('http://localhost:3030/api/v1/users/doctors')
      .then((res) => {
        return res.data;
      });
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDoctorList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDoctorList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = '';
    });
    builder.addCase(getDoctorList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  }
});

export default doctorSlice.reducer;
