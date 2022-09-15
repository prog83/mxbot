import axios from 'http/axios';

import { Translit } from 'types';

export const apiTranslit = (text: string) =>
  axios.post<Translit>(`${process.env.PROVISION_API}/translit`, {
    fam: text,
    name: '',
    patr: '',
  });
