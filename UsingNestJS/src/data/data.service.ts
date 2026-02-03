import { Injectable, OnModuleInit } from '@nestjs/common';
import { Category }                 from '../models/category.model';
import { Product }                  from '../models/product.model';
import { Order }                    from '../models/order.model';
import { OrderItem }                from '../models/order-item.model';

@Injectable()
export class DataService implements OnModuleInit {
  // -----------------------------------------------------------
  // In-memory collections (mirrors the four SQL tables)
  // -----------------------------------------------------------
  private categories: Category[]  = [];
  private products:   Product[]   = [];
  private orders:     Order[]     = [];
  private orderItems: OrderItem[] = [];

  /** Auto-increment counters */
  private catId  = 0;
  private prodId = 0;
  private ordId  = 0;
  private oiId   = 0;

  // -----------------------------------------------------------
  // Lifecycle hook — seeds data exactly once on startup
  // -----------------------------------------------------------
  onModuleInit(): void {
    this.seed();
  }

  // ===== CATEGORIES =====
  findAllCategories(): Category[]             { return this.categories; }
  findCategoryById(id: number): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  // ===== PRODUCTS =====
  findAllProducts(): Product[]                { return this.products; }
  findProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(name: string, price: number, categoryId: number): Product {
    const product: Product = { id: ++this.prodId, name, price, categoryId };
    this.products.push(product);
    return product;
  }

  // ===== ORDERS =====
  findAllOrders(): Order[]                    { return this.orders; }
  findOrderById(id: number): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  createOrder(customerName: string, productIds: number[]): Order {
    const order: Order = { id: ++this.ordId, customerName };
    this.orders.push(order);

    for (const productId of productIds) {
      this.orderItems.push({
        id:        ++this.oiId,
        orderId:   order.id,
        productId,
        quantity:  1,
      });
    }
    return order;
  }

  // ===== ORDER ITEMS =====
  findOrderItemsByOrderId(orderId: number): OrderItem[] {
    return this.orderItems.filter(oi => oi.orderId === orderId);
  }

  // ===================================================================
  //  Seeding default records in the in-memory collections.
  // ===================================================================
  private seed(): void {
    // ---- Categories ----
    const stationery  = this.addCat('Stationery');
    const electronics = this.addCat('Electronics');
    const groceries   = this.addCat('Groceries');
    const books       = this.addCat('Books');

    // ---- Products ----
    this.addProduct('Gel Pen',            10.00, stationery.id);
    this.addProduct('Notebook',           45.00, stationery.id);
    this.addProduct('Wireless Mouse',    599.00, electronics.id);
    this.addProduct('USB Keyboard',      799.00, electronics.id);
    this.addProduct('Organic Rice 1kg',   89.00, groceries.id);
    this.addProduct('Olive Oil 500ml',   349.00, groceries.id);
    this.addProduct('C# in Depth (Book)',1150.00, books.id);
    this.addProduct('Clean Code (Book)', 980.00, books.id);

    // ---- Orders  (Alice Johnson = order 1, Dinesh Kumar = order 2, Emily Carter = order 3) ----
    const alice  = this.addOrder('Alice Johnson');
    const dinesh = this.addOrder('Dinesh Kumar');
    const emily  = this.addOrder('Emily Carter');

    // ---- OrderItems  — mirrors every INSERT in the SQL ----
    this.addOI(alice.id,   1, 3);   // Gel Pen        × 3
    this.addOI(alice.id,   2, 1);   // Notebook       × 1
    this.addOI(dinesh.id,  3, 1);   // Wireless Mouse × 1
    this.addOI(dinesh.id,  4, 1);   // USB Keyboard   × 1
    this.addOI(emily.id,   5, 2);   // Organic Rice   × 2
    this.addOI(emily.id,   8, 1);   // Clean Code     × 1
  }

  // --- tiny private helpers used only during seed ---
  private addCat(name: string): Category {
    const c: Category = { id: ++this.catId, name };
    this.categories.push(c);
    return c;
  }
  private addOrder(customerName: string): Order {
    const o: Order = { id: ++this.ordId, customerName };
    this.orders.push(o);
    return o;
  }
  private addOI(orderId: number, productId: number, quantity: number): void {
    this.orderItems.push({ id: ++this.oiId, orderId, productId, quantity });
  }
}