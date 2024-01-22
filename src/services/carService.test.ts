import { CarModel } from '../models/car';
import { CarService } from './carService';

jest.mock('../models/car');

describe('Car Service Tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getAllCars should return an array of cars', async () => {
    const mockCars = [{ brand: 'Toyota', name: 'Camry', year: 2022, price: 25000 }];
    (CarModel.find as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockCars));

    const result = await CarService.getAllCars();

    expect(result).toEqual(mockCars);
    expect(CarModel.find).toHaveBeenCalled();
  });

  test('addCar should add a new car and return the added car', async () => {
    const carData = { brand: 'Ford', name: 'Mustang', year: 2022, price: 50000 };
    const mockSavedCar = { _id: 'mockId', __v: 0, ...carData };
    const saveMock = jest.fn().mockResolvedValueOnce(mockSavedCar);
    jest.spyOn(CarModel.prototype, 'save').mockImplementationOnce(saveMock);
  
    const result = await CarService.addCar(carData);
  
    expect(result).toEqual(mockSavedCar);
    expect(saveMock).toHaveBeenCalled();
  });

  test('updateCar should update and return the updated car', async () => {
    const carId = 'mockId';
    const updatedCarData = { brand: 'Chevrolet', name: 'Camaro', year: 2022, price: 45000 };
    const mockUpdatedCar = { _id: carId, ...updatedCarData };
    (CarModel.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockUpdatedCar));

    const result = await CarService.updateCar(carId, updatedCarData);

    expect(result).toEqual(mockUpdatedCar);
    expect(CarModel.findByIdAndUpdate).toHaveBeenCalledWith(carId, updatedCarData, { new: true });
  });

  test('deleteCar should return true if car is deleted', async () => {
    const carId = 'mockId';
    const mockDeletedCar = { _id: carId, brand: 'Toyota', name: 'Corolla', year: 2022, price: 20000 };
    (CarModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockDeletedCar));

    const result = await CarService.deleteCar(carId);

    expect(result).toBe(true);
    expect(CarModel.findByIdAndDelete).toHaveBeenCalledWith(carId);
  });

  test('deleteCar should return false if car is not found', async () => {
    const carId = 'nonexistentId';
    (CarModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => Promise.resolve(null));

    const result = await CarService.deleteCar(carId);

    expect(result).toBe(false);
    expect(CarModel.findByIdAndDelete).toHaveBeenCalledWith(carId);
  });

  test('getCarsByBrand should return an array of cars for a specific brand', async () => {
    const brand = 'Toyota';
    const mockCars = [
      { _id: '1', brand: 'Toyota', name: 'Camry', year: 2022, price: 25000 },
      { _id: '2', brand: 'Toyota', name: 'Corolla', year: 2022, price: 20000 },
    ];
    (CarModel.find as jest.Mock).mockReturnValueOnce(mockCars);

    const result = await CarService.getCarsByBrand(brand);

    expect(result).toEqual(mockCars);
    expect(CarModel.find).toHaveBeenCalledWith({ brand });
  });

  test('getCarsByBrand should return sorted array of cars for a specific brand', async () => {
    const brand = 'Toyota';
    const sortField = 'price';
    const sortOrder = 'asc';
    const mockCars = [
      { _id: '1', brand: 'Toyota', name: 'Camry', year: 2022, price: 25000 },
      { _id: '2', brand: 'Toyota', name: 'Corolla', year: 2022, price: 20000 },
    ];

    const mockQuery = {
      sort: jest.fn().mockReturnValueOnce(mockCars),
    };
    (CarModel.find as jest.Mock).mockImplementationOnce(() => mockQuery);
  
    const result = await CarService.getCarsByBrand(brand, sortField, sortOrder);

    expect(result).toEqual(mockCars);
    expect(CarModel.find).toHaveBeenCalledWith({ brand });
    expect(mockQuery.sort).toHaveBeenCalled();
    expect(mockQuery.sort).toHaveBeenCalledWith({ [sortField]: sortOrder });
  });
});
