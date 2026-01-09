// // src/services/orderDetail.service.ts
// import MockOrderDetail from '../models/implementations/mock/mockOrderDetail';
// import { OrderDetail } from '../models/entity/orderDetail.entity';
// import { OrderDetailInput } from '../dtos/orderDetail.dto';

// class OrderDetailService {
//   async getAll(): Promise<OrderDetail[]> {
//     return MockOrderDetail.getAll();
//   }

//   async getById(id: number): Promise<OrderDetail> {
//     return MockOrderDetail.getById(id);
//   }

//   async getByProductId(productId: number): Promise<OrderDetail[]> {
//     return MockOrderDetail.getByProductId(productId);
//   }

//   async getByOrderId(orderId: number): Promise<OrderDetail[]> {
//     return MockOrderDetail.getByOrderId(orderId);
//   }

//   async create(data: OrderDetailInput): Promise<OrderDetail> {
//     return MockOrderDetail.create(data);
//   }

//   async delete(id: number): Promise<void> {
//     return MockOrderDetail.delete(id);
//   }
// }

// export default new OrderDetailService();


// src/services/orderDetail.service.ts
// import OrderDetailRepository from '../repositories/orderDetail.repository';
// import { OrderDetail } from '../models/entity/orderDetail.model';
// import { OrderDetailInput } from '../dtos/orderDetail.dto';

// class OrderDetailService {
//   async getAll(): Promise<OrderDetail[]> {
//     return await OrderDetailRepository.getAll();
//   }

//   async getById(id: number): Promise<OrderDetail | null> {
//     return await OrderDetailRepository.getById(id);
//   }

//   async getByProductId(productId: number): Promise<OrderDetail[]> {
//     return await OrderDetailRepository.getByProductId(productId);
//   }

//   async getByOrderId(orderId: number): Promise<OrderDetail[]> {
//     return await OrderDetailRepository.getByOrderId(orderId);
//   }

//   async create(data: OrderDetailInput): Promise<OrderDetail> {
//     return await OrderDetailRepository.create(data);
//   }

//   async update(id: number, data: Partial<OrderDetailInput>): Promise<OrderDetail | null> {
//     return await OrderDetailRepository.update(id, data);
//   }

//   async delete(id: number): Promise<boolean> {
//     return await OrderDetailRepository.delete(id);
//   }
// }

// export default new OrderDetailService();

// src/services/orderDetail.service.ts
import { Transaction } from 'sequelize';
import OrderDetailRepository from '../repositories/orderDetail.repository';
import { OrderDetail } from '../models/entity/orderDetail.model';
import { OrderDetailInput } from '../dtos/orderDetail.dto';

class OrderDetailService {
  async getAll(transaction?: Transaction): Promise<OrderDetail[]> {
    return OrderDetailRepository.getAll(transaction ?? null);
  }

  async getById(id: number, transaction?: Transaction): Promise<OrderDetail | null> {
    return OrderDetailRepository.getById(id, transaction ?? null);
  }

  async getByProductId(productId: number, transaction?: Transaction): Promise<OrderDetail[]> {
    return OrderDetailRepository.getByProductId(productId, transaction ?? null);
  }

  async getByOrderId(orderId: number, transaction?: Transaction): Promise<OrderDetail[]> {
    return OrderDetailRepository.getByOrderId(orderId, transaction ?? null);
  }

  async create(data: OrderDetailInput, transaction?: Transaction): Promise<OrderDetail> {
    return OrderDetailRepository.create(data, transaction ?? null);
  }

  async update(
    id: number,
    data: Partial<OrderDetailInput>,
    transaction?: Transaction
  ): Promise<OrderDetail | null> {
    return OrderDetailRepository.update(id, data, transaction ?? null);
  }

  async delete(id: number, transaction?: Transaction): Promise<boolean> {
    return OrderDetailRepository.delete(id, transaction ?? null);
  }
}

export default new OrderDetailService();
