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
import OrderDetailRepository from '../repositories/orderDetail.repository';
import { OrderDetail } from '../models/entity/orderDetail.model';
import { OrderDetailInput } from '../dtos/orderDetail.dto';

class OrderDetailService {
  async getAll(): Promise<OrderDetail[]> {
    return await OrderDetailRepository.getAll();
  }

  async getById(id: number): Promise<OrderDetail | null> {
    return await OrderDetailRepository.getById(id);
  }

  async getByProductId(productId: number): Promise<OrderDetail[]> {
    return await OrderDetailRepository.getByProductId(productId);
  }

  async getByOrderId(orderId: number): Promise<OrderDetail[]> {
    return await OrderDetailRepository.getByOrderId(orderId);
  }

  async create(data: OrderDetailInput): Promise<OrderDetail> {
    return await OrderDetailRepository.create(data);
  }

  async update(id: number, data: Partial<OrderDetailInput>): Promise<OrderDetail | null> {
    return await OrderDetailRepository.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return await OrderDetailRepository.delete(id);
  }
}

export default new OrderDetailService();
