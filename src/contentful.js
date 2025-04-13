import {createClient} from 
"contentful";

const client = createClient({

space: "xwylc92nxbor",

accessToken: "J1EVqyVWHG_8GBJAixQERvcaValwywAhTZ4NZjcH_1U",
});

export const fetchProducts = async()
=>
const response = await client.


getEntries({
content_type: "product",
});

return response.items;

};