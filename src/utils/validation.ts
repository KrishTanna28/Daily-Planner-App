const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type TaskFormValues = {
  title: string;
  description: string;
  dueTime: string;
};

export type FormErrors<T extends Record<string, string>> = Partial<Record<keyof T, string>>;

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value.trim());

export const isValidTime = (value: string) => {
  if (!value.trim()) {
    return true;
  }

  return TIME_REGEX.test(value.trim());
};

export const hasValidationErrors = <T extends Record<string, string>>(errors: FormErrors<T>) =>
  Object.values(errors).some((value) => Boolean(value));

export function validateRegisterForm(values: RegisterFormValues): FormErrors<RegisterFormValues> {
  const errors: FormErrors<RegisterFormValues> = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function validateLoginForm(values: LoginFormValues): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

export function validateTaskForm(values: TaskFormValues): FormErrors<TaskFormValues> {
  const errors: FormErrors<TaskFormValues> = {};

  if (!values.title.trim()) {
    errors.title = 'Task title is required.';
  }

  if (values.dueTime.trim() && !isValidTime(values.dueTime)) {
    errors.dueTime = 'Use HH:mm format.';
  }

  return errors;
}
