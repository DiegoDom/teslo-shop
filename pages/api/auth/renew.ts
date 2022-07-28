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
    case 'GET':
      return checkJWT(req, res);
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false,
      });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { token = '' } = req.cookies;

    let userID = '';

    try {
      userID = await jwt.isValidToken(token);
    } catch (error: any) {
      res.status(401).json({
        error: 'Este usuario no esta autorizado',
        success: false,
      });
    }

    await db.connect();
    const user = await User.findById(userID).lean();
    await db.disconnect();

    if (!user) {
      return res.status(400).json({
        error: 'El usuario no existe en el sistema...',
        success: false,
      });
    }

    const { role, name, _id, email } = user;

    res.status(200).json({
      token: jwt.signToken(_id, email),
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
      error:
        error.errors.status.message ||
        'Lo sentimos ocurrio un error inesperado en el servidor',
      success: false,
    });
  }
};
