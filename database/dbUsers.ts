import bcrypt from 'bcryptjs';

import { User } from '../models';
import { db } from './';

export const checkUserEmailPassword = async (email: string, password: string) => {
  await db.connect();
  const user = await User.findOne({ email }).lean();
  await db.disconnect();

  if (!user) {
    return null;
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }

  const { _id, name, role } = user;

  return {
    _id,
    email: email.toLocaleLowerCase(),
    name,
    role,
  };
};

// Está función crea o verifica el usuario de OAuth
export const OAuthToDBUser = async (OAuthEmail: string, OAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: OAuthEmail }).lean();

  if (user) {
    await db.disconnect();
    const { _id, email, name, role } = user;
    return {
      _id,
      email,
      name,
      role,
    };
  }

  try {
    const newUser = new User({
      email: OAuthEmail,
      name: OAuthName,
      password: '@',
      role: 'client',
    });
    await newUser.save({ validateBeforeSave: true });
    await db.disconnect();

    const { _id, email, name, role } = newUser;

    return { _id, email, name, role };
  } catch (error) {
    return null;
  }
};
