import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
  const secret = process.env.JWT_SECRET_SEED;

  if (!secret) {
    throw new Error('No hay semilla de JWT - Revisar variables de entorno');
  }

  return jwt.sign(
    {
      _id,
      email,
    },
    secret,
    {
      expiresIn: '1d',
    }
  );
};

export const isValidToken = (token: string): Promise<string> => {
  const secret = process.env.JWT_SECRET_SEED;

  if (!secret) {
    throw new Error('No hay semilla de JWT - Revisar variables de entorno');
  }

  if (token.length <= 10) {
    return Promise.reject('JWT no es válido');
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, secret, (err, payload) => {
        if (err) return reject('JWT no es válido');

        const { _id } = payload as { _id: string };

        resolve(_id);
      });
    } catch (error) {
      reject('JWT no es válido');
    }
  });
};
