import orderDetailService from '../../services/orderDetail.service';
import OrderDetailRepository from '../../repositories/orderDetail.repository';
import { OrderDetailInput } from '../../dtos/orderDetail.dto';
import { OrderDetail } from '../../models/entity/orderDetail.model';

jest.mock('../../repositories/orderDetail.repository');

describe('OrderDetailService - Reglas de negocio (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crea un order detail correctamente', async () => {
    const input: OrderDetailInput = {
      order_id: 1,
      product_id: 2,
      quantity: 3,
      unit_price: 5000,
    };

    const fakeOrderDetail = {
      ...input,
      order_detail_id: 1,
      subtotal: 15000,
    } as OrderDetail;

    (OrderDetailRepository.create as jest.Mock).mockResolvedValue(fakeOrderDetail);

    const created = await orderDetailService.create(input);

    expect(OrderDetailRepository.create).toHaveBeenCalledWith(
      input,
      null
    );
    expect(created.order_detail_id).toBe(1);
    expect(created.subtotal).toBe(15000);
  });

  it('obtiene todos los order details', async () => {
    const fakeList = [{ order_detail_id: 1 }, { order_detail_id: 2 }] as OrderDetail[];
    (OrderDetailRepository.getAll as jest.Mock).mockResolvedValue(fakeList);

    const all = await orderDetailService.getAll();

    expect(OrderDetailRepository.getAll).toHaveBeenCalledWith(null);
    expect(all.length).toBe(2);
  });

  it('obtiene order details por orderId', async () => {
    const fakeList = [{ order_detail_id: 1, order_id: 1 }] as OrderDetail[];
    (OrderDetailRepository.getByOrderId as jest.Mock).mockResolvedValue(fakeList);

    const result = await orderDetailService.getByOrderId(1);

    expect(OrderDetailRepository.getByOrderId).toHaveBeenCalledWith(
      1,
      null
    );
    expect(result[0]!.order_id).toBe(1);
  });

  it('obtiene order details por productId', async () => {
    const fakeList = [{ order_detail_id: 1, product_id: 2 }] as OrderDetail[];
    (OrderDetailRepository.getByProductId as jest.Mock).mockResolvedValue(fakeList);

    const result = await orderDetailService.getByProductId(2);

    expect(OrderDetailRepository.getByProductId).toHaveBeenCalledWith(
      2,
      null
    );
    expect(result[0]!.product_id).toBe(2);
  });

  it('actualiza un order detail correctamente', async () => {
    const updatedData: Partial<OrderDetailInput> = { quantity: 5 };
    const fakeUpdated = { order_detail_id: 1, quantity: 5 } as OrderDetail;

    (OrderDetailRepository.update as jest.Mock).mockResolvedValue(fakeUpdated);

    const updated = await orderDetailService.update(1, updatedData);

    expect(OrderDetailRepository.update).toHaveBeenCalledWith(
      1,
      updatedData,
      null
    );
    expect(updated!.quantity).toBe(5);
  });

  it('elimina un order detail correctamente', async () => {
    (OrderDetailRepository.delete as jest.Mock).mockResolvedValue(true);

    const deleted = await orderDetailService.delete(1);

    expect(OrderDetailRepository.delete).toHaveBeenCalledWith(
      1,
      null
    );
    expect(deleted).toBe(true);
  });
});
