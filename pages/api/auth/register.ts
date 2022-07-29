import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt, validations } from '../../../utils';

type Data =
  | { success: boolean; error: string }
  | {
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res);
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false,
      });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const {
      email = '',
      password = '',
      name = '',
    } = req.body as { email: string; password: string; name: string };

    if (password.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe contener al menos 6 caracteres',
        success: false,
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        error: 'La nombre debe contener al menos 2 caracteres',
        success: false,
      });
    }

    // TODO: Validar EMAIL
    if (!validations.isValidEmail(email)) {
      return res.status(400).json({
        error: 'El correo electrónico proporcionado no es válido',
        success: false,
      });
    }

    await db.connect();
    const user = await User.findOne({ email }).lean();
    await db.disconnect();

    if (user) {
      return res.status(400).json({
        error: 'El correo electronico ingresado ya fue tomado',
        success: false,
      });
    }

    const newUser = new User({
      email: email.toLocaleLowerCase(),
      password: bcrypt.hashSync(password),
      role: 'client',
      name,
    });

    await newUser.save({ validateBeforeSave: true });

    await db.disconnect();

    const { role, _id } = newUser;

    const token = jwt.signToken(_id, email);

    res.status(200).json({
      token,
      user: {
        email,
        role,
        name,
      },
    });
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      error: 'Lo sentimos ocurrio un error inesperado en el servidor',
      success: false,
    });
  }
};
