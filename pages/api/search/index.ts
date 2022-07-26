import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { success: boolean; error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  res.status(400).json({ success: false, error: 'Debe especificar el argumento de busqueda...' })
}