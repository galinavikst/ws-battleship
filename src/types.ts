interface IRegIncomingData {
  name: string;
  password: string;
}

interface IRegOutcomingData {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}

export interface IRegIncoming {
  id: number;
  type: string;
  data: IRegIncomingData;
}

export interface IRegOucoming {
  type: string;
  data: IRegOutcomingData;
  id: number;
}
