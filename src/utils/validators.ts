export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');

  if (cleanCPF.length !== 11) return false;

  const blockedCPFs = [
    '12345678909',
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ];
  if (blockedCPFs.includes(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  const firstDigit = digit >= 10 ? 0 : digit;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  const secondDigit = digit >= 10 ? 0 : digit;

  return (
    parseInt(cleanCPF.charAt(9)) === firstDigit &&
    parseInt(cleanCPF.charAt(10)) === secondDigit
  );
};

export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const validateAge = (
  birthDate: string
): { isValid: boolean; message?: string } => {
  if (!birthDate)
    return { isValid: false, message: 'Data de nascimento é obrigatória' };

  const age = calculateAge(birthDate);

  if (age < 16) {
    return { isValid: false, message: 'Idade mínima permitida é 16 anos' };
  }

  if (age > 100) {
    return { isValid: false, message: 'Idade máxima permitida é 100 anos' };
  }

  return { isValid: true };
};

export const formatCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d{3})/g, '$1-$2');
};
