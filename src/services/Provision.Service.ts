import { apiTranslit } from 'api';

export default class ProvisionService {
  static async translit(text: string) {
    const { data } = await apiTranslit(text);

    return data.fam;
  }
}
