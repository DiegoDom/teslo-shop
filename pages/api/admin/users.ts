import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'

import { db } from '../../../database'
import { User } from '../../../models'

import { IUser } from '../../../interfaces'

type Data = IUser | IUser[] | { success: boolean; error: string }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res)
    case 'PUT':
      return updateUser(req, res)
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false,
      })
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect()

    const users = await User.find()
      .select('-password')
      .lean()
      .sort({ createdAt: 'ascending' })

    await db.disconnect()

    return res.status(200).json(users)
  } catch (error) {
    await db.disconnect()
    console.log(error)
    return res.status(500).json({
      error: 'Lo sentimos ocurrio un error inesperado...',
      success: false,
    })
  }
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { userId = '', role = '' } = req.body

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        error:
          'El usuario que intenta actualizar no existe en la base de datos...',
        success: false,
      })
    }

    const validRoles = ['admin', 'client']

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: `El rol que intenta asignar no es válido... ${validRoles}`,
        success: false,
      })
    }

    await db.connect()

    const user = await User.findById(userId)

    if (!user) {
      await db.disconnect()
      return res.status(400).json({
        error:
          'El usuario que intenta actualizar no existe en la base de datos...',
        success: false,
      })
    }

    user.role = role
    user.save({ validateBeforeSave: true })

    await db.disconnect()

    return res.status(200).json(user)
  } catch (error) {
    await db.disconnect()
    console.log(error)
    return res.status(500).json({
      error: 'Lo sentimos ocurrio un error inesperado...',
      success: false,
    })
  }
}
