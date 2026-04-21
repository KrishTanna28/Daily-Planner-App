import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppLogo } from '../../components/ui/AppLogo';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { Snackbar } from '../../components/ui/Snackbar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { registerUserThunk } from '../../redux/slices/authSlice';
import { colors } from '../../theme/colors';
import { AuthStackParamList } from '../../types';
import {
  FormErrors,
  RegisterFormValues,
  hasValidationErrors,
  validateRegisterForm,
} from '../../utils/validation';
import { registerScreenStyles as styles } from './RegisterScreen.styles';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;
type RegisterTouchedFields = Partial<Record<keyof RegisterFormValues, boolean>>;

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
  const [touchedFields, setTouchedFields] = useState<RegisterTouchedFields>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validationErrors = validateRegisterForm(formValues);
  const isFormValid = !hasValidationErrors(validationErrors);
  const visibleErrors: FormErrors<RegisterFormValues> = {
    fullName: touchedFields.fullName || wasSubmitted ? validationErrors.fullName : undefined,
    email: touchedFields.email || wasSubmitted ? validationErrors.email : undefined,
    password: touchedFields.password || wasSubmitted ? validationErrors.password : undefined,
    confirmPassword:
      touchedFields.confirmPassword || wasSubmitted ? validationErrors.confirmPassword : undefined,
  };

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const updateField = (field: keyof RegisterFormValues, value: string) => {
    setFormValues((previousState) => ({
      ...previousState,
      [field]: value,
    }));

    setTouchedFields((previousState) => ({
      ...previousState,
      [field]: true,
    }));

    setSubmitError(null);
  };

  const handleSubmit = async () => {
    setWasSubmitted(true);

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

      setIsSuccessVisible(true);
      successTimerRef.current = setTimeout(() => {
        navigation.replace('Login');
      }, 900);
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Unable to register right now.');
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrap}>
          <AppLogo subtitle="Create an account and start planning." />
        </View>

        <View style={styles.fieldGroup}>
          <CustomInput
            autoCapitalize="words"
            autoCorrect={false}
            errorText={visibleErrors.fullName}
            label="Full Name"
            leftIcon={<Ionicons color={colors.textSecondary} name="person-outline" size={20} />}
            onChangeText={(value) => updateField('fullName', value)}
            placeholder="Your full name"
            value={formValues.fullName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <CustomInput
            autoCapitalize="none"
            autoCorrect={false}
            errorText={visibleErrors.email}
            keyboardType="email-address"
            label="Email"
            leftIcon={<Ionicons color={colors.textSecondary} name="mail-outline" size={20} />}
            onChangeText={(value) => updateField('email', value)}
            placeholder="you@example.com"
            value={formValues.email}
          />
        </View>

        <View style={styles.fieldGroup}>
          <CustomInput
            autoCapitalize="none"
            autoCorrect={false}
            errorText={visibleErrors.password}
            label="Password"
            leftIcon={<Ionicons color={colors.textSecondary} name="lock-closed-outline" size={20} />}
            onChangeText={(value) => updateField('password', value)}
            placeholder="Minimum 6 characters"
            rightAccessory={
              <Pressable
                accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setIsPasswordVisible((previousValue) => !previousValue)}
              >
                <Ionicons
                  color={colors.textSecondary}
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                />
              </Pressable>
            }
            secureTextEntry={!isPasswordVisible}
            value={formValues.password}
          />
        </View>

        <View style={styles.fieldGroup}>
          <CustomInput
            autoCapitalize="none"
            autoCorrect={false}
            errorText={visibleErrors.confirmPassword}
            label="Confirm Password"
            leftIcon={<Ionicons color={colors.textSecondary} name="shield-checkmark-outline" size={20} />}
            onChangeText={(value) => updateField('confirmPassword', value)}
            placeholder="Re-enter password"
            rightAccessory={
              <Pressable
                accessibilityLabel={isConfirmPasswordVisible ? 'Hide password' : 'Show password'}
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setIsConfirmPasswordVisible((previousValue) => !previousValue)}
              >
                <Ionicons
                  color={colors.textSecondary}
                  name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                />
              </Pressable>
            }
            secureTextEntry={!isConfirmPasswordVisible}
            value={formValues.confirmPassword}
          />
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <View style={styles.buttonGroup}>
          <CustomButton
            disabled={!isFormValid || isSuccessVisible}
            loading={isLoading}
            onPress={handleSubmit}
            title="Register"
          />
        </View>

        <View style={styles.helperRow}>
          <Pressable style={styles.linkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.helperText}>Already have an account? <Text style={styles.linkText}>Login</Text></Text>
          </Pressable>
        </View>

      </ScrollView>
      <Snackbar message="Registration successful. Please login." visible={isSuccessVisible} />
    </ScreenContainer>
  );
}
