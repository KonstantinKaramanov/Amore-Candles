import { createClient } from "contentful";

const client = createClient({
  space: "your-space-id",    // Replace with your space ID
  accessToken: "your-access-token"  // Replace with your access token
});

export const fetchProducts = async () => {
  const response = await client.getEntries({
    content_type: "product",  // This should match your content type name
  });
  return response.items;
};
