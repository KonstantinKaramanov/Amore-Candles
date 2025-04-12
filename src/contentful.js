import { createClient } from "contentful";

const client = createClient({
  space: "xwylc92nxbor",    // Replace with your space ID
  accessToken: "J1EVqyVWHG_8GBJAixQERvcaValwywAhTZ4NZjcH_1U"  // Replace with your access token
});

export const fetchProducts = async () => {
  const response = await client.getEntries({
    content_type: "product",  // This should match your content type name
  });
  return response.items;
};
