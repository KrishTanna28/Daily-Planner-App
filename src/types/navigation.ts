export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
  AddTask: undefined;
  EditTask: {
    taskId: string;
  };
};
