import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppLogo } from '../../components/ui/AppLogo';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUserThunk } from '../../redux/slices/authSlice';
import { colors } from '../../theme/colors';
import { AuthStackParamList } from '../../types';
import { FormErrors, LoginFormValues, hasValidationErrors, validateLoginForm } from '../../utils/validation';
import { loginScreenStyles as styles } from './LoginScreen.styles';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type LoginTouchedFields = Partial<Record<keyof LoginFormValues, boolean>>;

const initialFormValues: LoginFormValues = {
  email: '',
  password: '',
};

export function LoginScreen({ navigation }: LoginScreenProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const [formValues, setFormValues] = useState<LoginFormValues>(initialFormValues);
  const [touchedFields, setTouchedFields] = useState<LoginTouchedFields>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validationErrors = validateLoginForm(formValues);
  const isFormValid = !hasValidationErrors(validationErrors);
  const visibleErrors: FormErrors<LoginFormValues> = {
    email: touchedFields.email || wasSubmitted ? validationErrors.email : undefined,
    password: touchedFields.password || wasSubmitted ? validationErrors.password : undefined,
  };

  const updateField = (field: keyof LoginFormValues, value: string) => {
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
      await dispatch(loginUserThunk(formValues)).unwrap();
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Unable to login right now.');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <AppLogo subtitle="Sign in to manage your day." />
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
            placeholder="Enter your password"
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

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <View style={styles.buttonGroup}>
          <CustomButton disabled={!isFormValid} loading={isLoading} onPress={handleSubmit} title="Login" />
        </View>

        <View style={styles.helperRow}>
          <Pressable style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.helperText}>Don't have an account? <Text style={styles.linkText}>Register</Text></Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
