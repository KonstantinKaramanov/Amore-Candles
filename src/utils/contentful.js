// src/contentful.js
import { createClient } from "contentful";

const client = createClient({
  space: "xwylc92nxbor",
  accessToken: "J1EVqyVWHG_8GBJAixQERvcaValwywAhTZ4NZjcH_1U",
});

export async function fetchProducts() {
  const entries = await client.getEntries({ content_type: "product" });
  return entries.items.map((item) => {
    const imgs = Array.isArray(item.fields.image)
      ? item.fields.image
      : item.fields.image
      ? [item.fields.image]
      : [];
    return {
      id: item.sys.id,
      name: item.fields.name,
      description: item.fields.description,
      price: item.fields.price,
      featured: item.fields.featured || false, // add this field in Contentful
      images: imgs.map((i) => "https:" + i.fields.file.url),
    };
  });
}
