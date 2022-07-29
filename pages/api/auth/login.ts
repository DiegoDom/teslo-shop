import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';

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
      return loginUser(req, res);
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false,
      });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { email = '', password = '' } = req.body;

    await db.connect();

    const user = await User.findOne({ email }).lean();
    await db.disconnect();

    if (!user) {
      return res.status(400).json({
        error: 'Correo o contraseña no válidos...',
        success: false,
      });
    }

    if (!bcrypt.compareSync(password, user.password!)) {
      return res.status(400).json({
        error: 'Correo o contraseña no válidos...',
        success: false,
      });
    }

    const { role, name, _id } = user;

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
