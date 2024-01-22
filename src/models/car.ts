import { model, Schema, Document, Model } from 'mongoose';

export interface Car {
  brand: string;
  name: string;
  year: number;
  price: number;
}

const carSchema: Schema = new Schema<Car>({
  brand: String,
  name: String,
  year: Number,
  price: Number,
});

export const CarModel: Model<Car & Document> = model<Car & Document>('Car', carSchema);