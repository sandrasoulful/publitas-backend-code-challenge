/*
- test cases:
- sends an array with id, title, description for each product when there are multiple products
- sends an array with id, title, description for a single product
- processes a valid feed with few products (>5MB), calls the External Service once
- processes a valid feed with large number of products (>=5MB), calls the External Service multiple times in chunks
- processes the feed that contains no <item> elements and does not call the External Service
- processes an empty feed and does not call the External Service
- throws an error when the XML is malformed and does not call the External Service
- excludes products without id or title and sends the rest of products to the External Service
- if a product's description is missing, log a warning but include the product in the batch for the External Service
 */
