import { Product } from '../models';
import { db } from './';
import { IProduct } from '../interfaces';

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  try {
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();

    if (!product) {
      return null;
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return null;
  }
};

interface ProductSlug {
  slug: string;
}
export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  try {
    await db.connect();
    const slugs = await Product.find().select('slug -_id').lean();
    await db.disconnect();

    return slugs;
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return [];
  }
};

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  term = term.toString().toLocaleLowerCase();

  try {
    await db.connect();

    const products = await Product.find({
      $text: { $search: term },
    })
      .select('title images price inStock slug -_id')
      .lean()
      .sort({ createdAt: 'ascending' });

    await db.disconnect();

    return products;
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    return [];
  }
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    await db.connect();
    const products = await Product.find()
      .lean()
      .sort({ createdAt: 'descending' });
    await db.disconnect();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return [];
  }
};
