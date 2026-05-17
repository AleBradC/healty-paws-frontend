import { describe, it, expect } from 'vitest';
import {
  ownerCredentialsSchema,
  petSchema,
  registerOwnerFormSchema,
  registerDoctorFormSchema,
  serviceSchema,
} from './registration';

const validCreds = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'Aa1!aaaa',
  confirmPassword: 'Aa1!aaaa',
};

const validPet = {
  name: 'Rex',
  type: 'Dog',
  breed: 'Labrador',
  age: 3,
  weight: 12.5,
};

describe('ownerCredentialsSchema', () => {
  it('accepts a fully valid block', () => {
    expect(ownerCredentialsSchema.safeParse(validCreds).success).toBe(true);
  });

  it.each([
    ['empty name', { ...validCreds, name: '   ' }, 'name'],
    ['missing email', { ...validCreds, email: '' }, 'email'],
    ['malformed email', { ...validCreds, email: 'nope' }, 'email'],
    ['weak password', { ...validCreds, password: 'short' }, 'password'],
    ['empty confirm', { ...validCreds, confirmPassword: '' }, 'confirmPassword'],
  ])('rejects %s', (_label, payload, field) => {
    const result = ownerCredentialsSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === field)).toBe(true);
    }
  });

  it('rejects mismatched passwords on the confirmPassword path', () => {
    const result = ownerCredentialsSchema.safeParse({
      ...validCreds,
      confirmPassword: 'Aa1!bbbb',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (i) => i.path[0] === 'confirmPassword' && /match/i.test(i.message)
        )
      ).toBe(true);
    }
  });
});

describe('petSchema', () => {
  it('accepts a valid pet', () => {
    expect(petSchema.safeParse(validPet).success).toBe(true);
  });

  it('rejects empty pet name', () => {
    const result = petSchema.safeParse({ ...validPet, name: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects empty pet type', () => {
    const result = petSchema.safeParse({ ...validPet, type: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty pet breed', () => {
    const result = petSchema.safeParse({ ...validPet, breed: '' });
    expect(result.success).toBe(false);
  });

  it('rejects zero or negative age', () => {
    const zero = petSchema.safeParse({ ...validPet, age: 0 });
    const neg = petSchema.safeParse({ ...validPet, age: -1 });
    expect(zero.success).toBe(false);
    expect(neg.success).toBe(false);
  });

  it('rejects fractional age (must be integer)', () => {
    const result = petSchema.safeParse({ ...validPet, age: 3.5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => /whole number/i.test(i.message))
      ).toBe(true);
    }
  });

  it('rejects NaN age with the friendly required message', () => {
    const result = petSchema.safeParse({ ...validPet, age: Number.NaN });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => /required/i.test(i.message))
      ).toBe(true);
    }
  });

  it('accepts fractional weight', () => {
    const result = petSchema.safeParse({ ...validPet, weight: 4.25 });
    expect(result.success).toBe(true);
  });

  it('rejects zero weight', () => {
    const result = petSchema.safeParse({ ...validPet, weight: 0 });
    expect(result.success).toBe(false);
  });
});

describe('registerOwnerFormSchema', () => {
  it('accepts a valid owner registration', () => {
    expect(
      registerOwnerFormSchema.safeParse({ ...validCreds, pet: validPet }).success
    ).toBe(true);
  });

  it('rejects when nested pet is invalid', () => {
    const result = registerOwnerFormSchema.safeParse({
      ...validCreds,
      pet: { ...validPet, name: '' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects when passwords do not match', () => {
    const result = registerOwnerFormSchema.safeParse({
      ...validCreds,
      confirmPassword: 'Aa1!zzzz',
      pet: validPet,
    });
    expect(result.success).toBe(false);
  });
});

describe('serviceSchema', () => {
  it('accepts a service with positive price', () => {
    expect(serviceSchema.safeParse({ name: 'Vaccine', price: 50 }).success).toBe(
      true
    );
  });

  it('rejects empty name', () => {
    expect(serviceSchema.safeParse({ name: '', price: 50 }).success).toBe(false);
  });

  it('rejects non-positive price', () => {
    expect(serviceSchema.safeParse({ name: 'X', price: 0 }).success).toBe(false);
  });
});

describe('registerDoctorFormSchema', () => {
  const validDoctor = {
    ...validCreds,
    specialization: 'cardiology',
    clinicName: 'Healthy Paws',
    clinicAddress: '1 Pet Street',
    services: [{ name: 'Checkup', price: 30 }],
  };

  it('accepts a valid doctor registration', () => {
    expect(registerDoctorFormSchema.safeParse(validDoctor).success).toBe(true);
  });

  it('rejects missing specialization', () => {
    const result = registerDoctorFormSchema.safeParse({
      ...validDoctor,
      specialization: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty clinic name', () => {
    const result = registerDoctorFormSchema.safeParse({
      ...validDoctor,
      clinicName: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty clinic address', () => {
    const result = registerDoctorFormSchema.safeParse({
      ...validDoctor,
      clinicAddress: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when services list is empty', () => {
    const result = registerDoctorFormSchema.safeParse({
      ...validDoctor,
      services: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords on the confirmPassword path', () => {
    const result = registerDoctorFormSchema.safeParse({
      ...validDoctor,
      confirmPassword: 'Aa1!zzzz',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === 'confirmPassword')
      ).toBe(true);
    }
  });
});
