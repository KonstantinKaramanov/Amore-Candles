import { createClient } from "contentful";

const client = createClient({
  space: "xwylc92nxbor",
  accessToken: "J1EVqyVWHG_8GBJAixQERvcaValwywAhTZ4NZjcH_1U",
});

export const fetchProducts = async () => {
  const response = await client.getEntries({
    content_type: "product",
  });

  // Map the raw Contentful entries to clean objects
  return response.items.map((item) => ({
    id: item.sys.id,
    name: item.fields.name,
    price: parseFloat(item.fields.price),
    image: item.fields.image?.fields?.file?.url || "",
    description: item.fields.description || "",
    // aroma: item.fields.aromaSelection || "", // Single-select dropdown value
  }));
};
