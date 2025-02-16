## Database (MySQL)

### Tables:

- Users (id, name, email, password, address, role, created_at)
- Products (id, name, price, description, stock, category_id, iamges,created_at)
- Product_images (id, product_id, path)
- Categories (id, name, created_at)
- Cart (id, user_id, product_id, quantity, created_at)
- Orders (id, user_id, total_amount, status, created_at)

#### Summary of Relationships

- A user can have multiple orders and reviews.
- A category has multiple products.
- A product can be part of multiple orders and carts.
- An order has multiple order items, a payment, and a shipping address.
