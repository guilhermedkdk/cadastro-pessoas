import React, { useEffect, useState } from 'react';
import { Trash2, UserPlus, Users } from 'lucide-react';
import type { Person, ViaCepResponse } from './@types/Person';
import {
  validateCPF,
  formatCPF,
  formatCEP,
  calculateAge,
  validateAge,
} from './utils/validators';
import './App.css';

function App() {
  const [formData, setFormData] = useState<Person>({
    name: '',
    cpf: '',
    birthDate: '',
    email: '',
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [people, setPeople] = useState<Person[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Person, string>>>(
    {}
  );

  useEffect(() => {
    const cleanCEP = formData.cep.replace(/\D/g, '');

    if (cleanCEP.length === 8) {
      fetchAddress(formData.cep);
    } else if (cleanCEP.length < 8) {
      setFormData((prev) => ({
        ...prev,
        street: '',
        neighborhood: '',
        city: '',
        state: '',
      }));
    }
  }, [formData.cep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value.slice(0, 14));
    } else if (name === 'cep') {
      formattedValue = formatCEP(value.slice(0, 9));
    } else if (name === 'name') {
      formattedValue = value
        .slice(0, 150)
        .replace(/[^a-záàâãéèêíïóôõöúçñ ]/gi, '');
    } else if (name === 'email') {
      formattedValue = value.slice(0, 200);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDelete = (indexToDelete: number) => {
    setPeople((previousPeople) => {
      return previousPeople.filter((person, currentIndex) => {
        return currentIndex !== indexToDelete;
      });
    });
  };

  const fetchAddress = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCEP}/json/`
      );
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setErrors((prev) => ({ ...prev, cep: 'CEP não encontrado' }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, cep: 'Erro ao buscar CEP' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Person, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    const ageValidation = validateAge(formData.birthDate);
    if (!ageValidation.isValid) {
      newErrors.birthDate = ageValidation.message;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'E-mail inválido';
    }

    if (formData.cep.replace(/\D/g, '').length !== 8) {
      newErrors.cep = 'CEP inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setPeople((prev) => [...prev, formData]);
      setFormData({
        name: '',
        cpf: '',
        birthDate: '',
        email: '',
        cep: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-lg bg-white p-6 drop-shadow-lg">
          <div className="mb-6 flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Cadastro de Pessoas
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-1 border-gray-300 p-1.5 outline-none focus:border-indigo-500 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-1 border-gray-300 p-1.5 outline-none focus:border-indigo-500 ${
                    errors.cpf ? 'border-red-500' : ''
                  }`}
                />
                {errors.cpf && (
                  <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-1 border-gray-300 p-1.5 outline-none focus:border-indigo-500 ${
                    errors.birthDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-1 border-gray-300 p-1.5 outline-none focus:border-indigo-500 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-1 border-gray-300 p-1.5 outline-none focus:border-indigo-500 ${
                    errors.cep ? 'border-red-500' : ''
                  }`}
                />
                {errors.cep && (
                  <p className="mt-1 text-sm text-red-600">{errors.cep}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Logradouro
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-1.5 shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-1.5 shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-1.5 shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-1.5 shadow-sm outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>

        {people.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Pessoas Cadastradas
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-48 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="w-48 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      E-mail
                    </th>
                    <th className="w-20 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Idade
                    </th>
                    <th className="w-32 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      CPF
                    </th>
                    <th className="w-24 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      CEP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Endereço
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div
                          className="max-w-[12rem] truncate"
                          title={person.name}
                        >
                          {person.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div
                          className="max-w-[12rem] truncate"
                          title={person.email}
                        >
                          {person.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {calculateAge(person.birthDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {person.cpf}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {person.cep}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div
                          className="max-w-[24rem] truncate"
                          title={`${person.street}, ${person.neighborhood}, ${person.city} - ${person.state}`}
                        >
                          {`${person.street}, ${person.neighborhood}, ${person.city} - ${person.state}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <button
                          className="cursor-pointer text-red-500 hover:text-red-800 focus:outline-none"
                          title="Excluir"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
