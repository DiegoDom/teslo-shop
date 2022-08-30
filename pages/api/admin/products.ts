import { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data = { success: boolean; error: string; } | IProduct[] | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'PUT':
      return updateProduct(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false
      });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();

    const products = await Product.find()
      .sort({ createdAt: 'descending' })
      .lean();

    await db.disconnect();

    const updatedProducts = products.map(product => {
      product.images = product.images.map(image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
      });

      return product;
    });

    return res.status(200).json(updatedProducts);

    // todo: Tenemos que actualizar las imagenes
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({
      error: 'Lo sentimos ocurrio un error inesperado...',
      success: false
    });
  }
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = '', images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({
      error:
        'El producto que intenta actualizar no existe en la base de datos...',
      success: false
    });
  }

  if (images.length < 2) {
    return res.status(400).json({
      error: 'El producto require al menos 2 imagenes...',
      success: false
    });
  }

  //! TODO: posiblemente tendremos URL rotas en las imagenes
  try {
    await db.connect();

    const product = await Product.findById(_id);

    if (!product) {
      await db.disconnect();
      return res.status(400).json({
        error:
          'El producto que intenta actualizar no existe en la base de datos...',
        success: false
      });
    }

    // TODO: Eliminar las imagenes en Cloudinary
    // https://res.cloudinary.com/diegodominguez/image/upload/v1661831504/jpor4blec4uzsq0revo7.webp
    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        // ! Borrar de cloudinary
        const [fileID, ext] = image.substring(image.lastIndexOf('/') + 1).split('.');
        console.log({ image, fileID, ext });
        await cloudinary.uploader.destroy(fileID);
      }
    });

    await product.update(req.body, { new: true });
    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({
      error: 'Lo sentimos ocurrio un error inesperado...',
      success: false
    });
  }
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [], slug } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({
      error: 'El producto require al menos 2 imagenes...',
      success: false
    });
  }

  //! TODO: posiblemente tendremos URL rotas en las imagenes
  try {
    await db.connect();

    const productInDB = await Product.findOne({ slug }).lean();
    if (productInDB) {
      return res.status(400).json({
        error: `El slug ${slug} ya esta siendo utilizado por otro producto...`,
        success: false
      });
    }

    const product = new Product(req.body);
    await product.save();
    await db.disconnect();

    return res.status(201).json(product);
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({
      error: 'Lo sentimos ocurrio un error inesperado...',
      success: false
    });
  }

};

