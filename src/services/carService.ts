import { CarModel, Car } from '../models/car';

type SortOrder = 'asc' | 'desc';

export class CarService {
  static async getAllCars(): Promise<Car[]> {
    return CarModel.find();
  }

  static async addCar(carData: Car): Promise<Car> {
    const car = new CarModel(carData);
    return car.save();
  }

  static async updateCar(carId: string, updatedCarData: Partial<Car>): Promise<Car | null> {
    return CarModel.findByIdAndUpdate(carId, updatedCarData, { new: true });
  }

  static async deleteCar(carId: string): Promise<boolean> {
    return !!await CarModel.findByIdAndDelete(carId);
  }

  static async getCarsByBrand(brand: string, sortField?: string, sortOrder?: SortOrder): Promise<Car[]> {
    let query = CarModel.find({ brand });

    if (sortField) {
      const sortOptions: Record<string, 'asc' | 'desc'> = {};
      sortOptions[sortField] = sortOrder || 'asc';
      query = query.sort(sortOptions);
    }

    return await query;
  }
}