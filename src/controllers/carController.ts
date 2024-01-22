import { Request, Response } from 'express';
import { CarService } from '../services/carService';

export class CarController {
  static async getAllCars(req: Request, res: Response): Promise<void> {
    try {
      const cars = await CarService.getAllCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addCar(req: Request, res: Response): Promise<void> {
    try {
      const carData = req.body;
      const car = await CarService.addCar(carData);
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCar(req: Request, res: Response): Promise<void> {
    try {
      const carId = req.params.id;
      const updatedCarData = req.body;
      const updatedCar = await CarService.updateCar(carId, updatedCarData);

      if (updatedCar) {
        res.json(updatedCar);
      } else {
        res.status(404).json({ message: 'Car not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteCar(req: Request, res: Response): Promise<void> {
    try {
      const carId = req.params.id;
      const isDeleted = await CarService.deleteCar(carId);

      if (isDeleted) {
        res.json({ message: 'Car deleted successfully' });
      } else {
        res.status(404).json({ message: 'Car not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCarsByBrand(req: Request, res: Response): Promise<void> {
    try {
      const brand = req.params.brand;
      const sortField = req.query.sortField as string | undefined;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' | undefined;

      const cars = await CarService.getCarsByBrand(brand, sortField, sortOrder);
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}