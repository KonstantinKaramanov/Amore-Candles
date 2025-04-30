
// This file is responsible for fetching data from Contentful
import { createClient } from "contentful";


const client = createClient({
  space: "xwylc92nxbor",
  accessToken: "J1EVqyVWHG_8GBJAixQERvcaValwywAhTZ4NZjcH_1U",
});

// 🔁 Fetch all products
export async function fetchProducts() {
  const entries = await client.getEntries({ content_type: "product" });

  return entries.items.map((item) => {
    const imagesField = item.fields.image;

    const imagesArray = Array.isArray(imagesField)
      ? imagesField
      : imagesField
      ? [imagesField]
      : [];

    return {
      id: item.sys.id,
      name: item.fields.name,
      description: item.fields.description,
      price: item.fields.price,
      images: imagesArray.map((img) => "https:" + img.fields.file.url),
    };
  });
}

// 🔍 Fetch a single product by ID
export async function fetchProductById(id) {
  const entry = await client.getEntry(id);

  const imagesField = entry.fields.image;
  const imagesArray = Array.isArray(imagesField)
    ? imagesField
    : imagesField
    ? [imagesField]
    : [];

  return {
    id: entry.sys.id,
    name: entry.fields.name,
    description: entry.fields.description,
    price: entry.fields.price,
    images: imagesArray.map((img) => "https:" + img.fields.file.url),
  };
}
export async function fetchFeaturedProducts() {
  const entries = await client.getEntries({
    content_type: "product",
    "fields.featured": true,
  });

  return entries.items.map((item) => {
    const images = Array.isArray(item.fields.image)
      ? item.fields.image
      : [item.fields.image];

    return {
      id: item.sys.id,
      name: item.fields.name,
      description: item.fields.description,
      price: item.fields.price,
      images: images.map((img) => "https:" + img.fields.file.url),
    };
  });
}
