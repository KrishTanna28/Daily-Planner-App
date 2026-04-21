import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUserThunk } from '../../redux/slices/authSlice';
import { AuthStackParamList } from '../../types';
import { FormErrors, LoginFormValues, hasValidationErrors, validateLoginForm } from '../../utils/validation';
import { loginScreenStyles as styles } from './LoginScreen.styles';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const initialFormValues: LoginFormValues = {
  email: '',
  password: '',
};

export function LoginScreen({ navigation }: LoginScreenProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const [formValues, setFormValues] = useState<LoginFormValues>(initialFormValues);
  const [errors, setErrors] = useState<FormErrors<LoginFormValues>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (field: keyof LoginFormValues, value: string) => {
    setFormValues((previousState) => ({
      ...previousState,
      [field]: value,
    }));

    setErrors((previousState) => ({
      ...previousState,
      [field]: undefined,
    }));

    setSubmitError(null);
  };

  const handleSubmit = async () => {
    const validationErrors = validateLoginForm(formValues);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    try {
      await dispatch(loginUserThunk(formValues)).unwrap();
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Unable to login right now.');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Daily Planner</Text>
        <Text style={styles.subtitle}>Sign in to manage your day with confidence.</Text>

        <View style={styles.fieldGroup}>
          <CustomInput
            autoCapitalize="none"
            autoCorrect={false}
            errorText={errors.email}
            keyboardType="email-address"
            label="Email"
            onChangeText={(value) => updateField('email', value)}
            placeholder="you@example.com"
            value={formValues.email}
          />
        </View>

        <View style={styles.fieldGroup}>
          <CustomInput
            autoCapitalize="none"
            autoCorrect={false}
            errorText={errors.password}
            label="Password"
            onChangeText={(value) => updateField('password', value)}
            placeholder="Enter your password"
            secureTextEntry
            value={formValues.password}
          />
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <View style={styles.buttonGroup}>
          <CustomButton loading={isLoading} onPress={handleSubmit} title="Login" />
        </View>

        <View style={styles.helperRow}>
          <Pressable style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Create an account</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
