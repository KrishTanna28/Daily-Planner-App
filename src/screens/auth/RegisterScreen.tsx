import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { registerUserThunk } from '../../redux/slices/authSlice';
import { AuthStackParamList } from '../../types';
import {
  FormErrors,
  RegisterFormValues,
  hasValidationErrors,
  validateRegisterForm,
} from '../../utils/validation';
import { registerScreenStyles as styles } from './RegisterScreen.styles';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const initialFormValues: RegisterFormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const [formValues, setFormValues] = useState<RegisterFormValues>(initialFormValues);
  const [errors, setErrors] = useState<FormErrors<RegisterFormValues>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (field: keyof RegisterFormValues, value: string) => {
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
    const validationErrors = validateRegisterForm(formValues);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    try {
      await dispatch(
        registerUserThunk({
          fullName: formValues.fullName,
          email: formValues.email,
          password: formValues.password,
        }),
      ).unwrap();

      navigation.replace('Login');
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Unable to register right now.');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register once and plan your tasks every day.</Text>

        <View style={styles.fieldGroup}>
          <CustomInput
            autoCapitalize="words"
            autoCorrect={false}
            errorText={errors.fullName}
            label="Full Name"
            onChangeText={(value) => updateField('fullName', value)}
            placeholder="Your full name"
            value={formValues.fullName}
          />
        </View>

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
            placeholder="Minimum 6 characters"
            secureTextEntry
            value={formValues.password}
          />
        </View>

        <View style={styles.fieldGroup}>
          <CustomInput
            autoCapitalize="none"
            autoCorrect={false}
            errorText={errors.confirmPassword}
            label="Confirm Password"
            onChangeText={(value) => updateField('confirmPassword', value)}
            placeholder="Re-enter password"
            secureTextEntry
            value={formValues.confirmPassword}
          />
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <View style={styles.buttonGroup}>
          <CustomButton loading={isLoading} onPress={handleSubmit} title="Register" />
        </View>

        <View style={styles.helperRow}>
          <Pressable style={styles.linkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Back to login</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
