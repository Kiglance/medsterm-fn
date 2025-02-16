/* eslint-disable jsx-a11y/anchor-is-valid */
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import axiosInstance from '../axios/axios.instance';
import CloseXButton from '../components/CloseXButton';
import HomeNavBar from '../components/HomeNavBar';
import LoadingButton from '../components/LoadingButton';
import { toAdminLogin, toPatientLogin } from '../redux/reducers/step.reducer';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required()
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const step = useSelector((state) => state.step.login_step);

  const nav = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: step === 1 ? 'admin_1@ms.com' : 'timhalland@med.com',
      password: step === 1 ? 'Admin1@ms' : 'Admin2@ms'
    }
  });

  const url = step === 0 ? `/users/client/login` : `/users/doctor/login`;

  // Redirect to dashboard if already logged in
  const userData = JSON.parse(localStorage.getItem('userLoginData'));
  if (userData?.token) {
    return <Navigate to="/dashboard" />;
  }

  const handleBack = () => {
    nav('/');
  };

  const onSubmit = async ({ email, password }) => {
    try {
      setLoading(true);
      const response = await axiosInstance
        .post(url, {
          email,
          password
        })
        .finally(() => {
          setLoading(false);
        });

      if (response.status === 201) {
        localStorage.setItem(
          'userLoginData',
          JSON.stringify(response?.data?.data)
        );
      }

      nav('/dashboard');

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <HomeNavBar>
      <Box className="flex items-center justify-center w-full h-full">
        <Box className="h-max w-full overflow-auto p-8">
          <Container
            component="main"
            maxWidth="xs"
            sx={{
              border: '1px solid #797979',
              borderRadius: '10px',
              position: 'relative'
            }}
            className="max-w-[380px] p-6"
          >
            <CloseXButton onClick={handleBack} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
              className="flex flex-col items-center py-10"
            >
              <Typography component="h1" variant="h6" fontWeight="700">
                Enter MedStem
              </Typography>
              {step === 0 ? (
                <Typography variant="subtitle1">
                  You don&apos;t have an account?{' '}
                  <Box
                    component="span"
                    className="text-primary font-bold cursor-pointer"
                    onClick={() => {
                      nav('/signup');
                    }}
                  >
                    Register
                  </Box>
                </Typography>
              ) : (
                <Box className="w-full h-[28px]" />
              )}
              <Box className="w-full flex flex-row items-center justify-evenly mt-2 border-b border-[#6A6F75]">
                <Typography
                  className={` ${
                    step === 0 && 'bg-slate-100'
                  } cursor-pointer text-center w-1/2 font-semibold text-[#6A6F75]`}
                  onClick={() => {
                    dispatch(toPatientLogin());
                    setValue('email', 'timhalland@med.com');
                    setValue('password', 'Admin2@ms');
                  }}
                >
                  Patient
                </Typography>
                <Typography
                  className={` ${
                    step === 1 && 'bg-slate-100'
                  } cursor-pointer text-center w-1/2 font-semibold text-[#6A6F75]`}
                  onClick={() => {
                    dispatch(toAdminLogin());
                    setValue('email', 'admin_1@ms.com');
                    setValue('password', 'Admin1@ms');
                  }}
                >
                  Admin
                </Typography>
              </Box>
              <Box
                component="form"
                sx={{ mt: 1 }}
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="email"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      size="small"
                      required
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      size="small"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
                <Grid container>
                  <Grid item xs>
                    <Link
                      onClick={() => {
                        navigate('/forgot-password');
                      }}
                      sx={{
                        cursor: 'pointer'
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
                <LoadingButton
                  type="submit"
                  fullWidth
                  loading={loading}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  className="bg-[#1A4CFF] capitalize text-white"
                >
                  Enter
                </LoadingButton>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </HomeNavBar>
  );
};

export default Login;
