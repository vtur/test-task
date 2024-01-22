import { model, Schema, Document, Model } from 'mongoose';

export interface Car {
  brand: string;
  name: string;
  year: number;
  price: number;
}

const carSchema: Schema<Car> = new Schema<Car>({
  brand: { type: String, index: true },
  name: { type: String, required: true, index: true },
  year: { type: Number, index: true },
  price: { type: Number, index: true },
});//brand index for search, others for faster sorting

export const CarModel: Model<Car & Document> = model<Car & Document>('Car', carSchema);