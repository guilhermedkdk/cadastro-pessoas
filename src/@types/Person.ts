export interface Person {
  name: string;
  cpf: string;
  birthDate: string;
  email: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
